import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { checkRateLimit } from "@/lib/rate-limit"

export const authOptions = {
  adapter: PrismaAdapter(prisma as any),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          status: "user",
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        type: { label: "Type", type: "text" },
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text" }
      },
      async authorize(credentials, req) {
        const rateLimitResponse = checkRateLimit(req, "login", 5, 15 * 60 * 1000);
        if (!rateLimitResponse.success) {
          throw new Error(`Too many attempts. Please try again after ${Math.ceil((rateLimitResponse.retryAfter || 0) / 60)} minutes.`);
        }

        if (!credentials?.email) throw new Error("Email is required");

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) throw new Error("No user found");

        if (credentials.type === "otp") {
          if (!credentials.otp) throw new Error("OTP is required");
          const tokenRecord = await prisma.verificationToken.findFirst({
            where: { email: credentials.email, token: credentials.otp }
          });

          if (!tokenRecord) throw new Error("Invalid OTP");
          if (tokenRecord.expires < new Date()) throw new Error("OTP expired");

          await prisma.user.update({
            where: { email: credentials.email },
            data: { emailVerified: new Date() }
          });

          await prisma.verificationToken.delete({
            where: { id: tokenRecord.id }
          });

          return user;

        } else {
          if (!credentials.password) throw new Error("Password is required");
          if (!user.password) throw new Error("Please log in with Google");
          if (!user.emailVerified) throw new Error("Please verify your email first");

          const isValidPassword = await bcrypt.compare(credentials.password, user.password);
          if (!isValidPassword) throw new Error("Invalid password");

          return user;
        }
      }
    })
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.status = (user as any).status;
        token.phoneNumber = (user as any).phoneNumber;
        token.username = (user as any).username;
        token.country = (user as any).country;
      }

      if (trigger === "update" && session) {
        if (session.username) token.username = session.username;
        if (session.phoneNumber) token.phoneNumber = session.phoneNumber;
        if (session.country) token.country = session.country;
      }

      if (token.email && (!token.username || !token.status)) {
        const dbUser = await prisma.user.findUnique({ where: { email: token.email } });
        if (dbUser) {
          token.status = dbUser.status;
          token.phoneNumber = dbUser.phoneNumber;
          token.username = dbUser.username;
          token.country = dbUser.country;
        }
      }

      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        (session.user as any).status = token.status as string;
        (session.user as any).phoneNumber = token.phoneNumber as string;
        (session.user as any).username = token.username as string;
        (session.user as any).country = token.country as string;
      }
      return session;
    },
    async redirect({ baseUrl }: any) {
      return `${baseUrl}/`
    },
  },
};
