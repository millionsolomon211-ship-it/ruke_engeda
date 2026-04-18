import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma" // This is the 'bridge' file we made earlier
import bcrypt from "bcryptjs"
import { checkRateLimit } from "@/lib/rate-limit"

const handler = NextAuth({
  // Use the Prisma adapter to save users to your DB automatically
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      // These fetch from your .env file
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          status: "user", // defaults
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        type: { label: "Type", type: "text" }, // "login" or "otp"
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text" }
      },
      async authorize(credentials, req) {
        // Apply rate limit on NextAuth login attempts
        const rateLimitResponse = checkRateLimit(req, "login", 5, 15 * 60 * 1000); // 5 tries per 15 min
        if (!rateLimitResponse.success) {
          throw new Error(`Too many attempts. Please try again after ${Math.ceil((rateLimitResponse.retryAfter || 0) / 60)} minutes.`);
        }

        if (!credentials?.email) throw new Error("Email is required");

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) throw new Error("No user found");

        if (credentials.type === "otp") {
          // Verify OTP flow
          if (!credentials.otp) throw new Error("OTP is required");
          const tokenRecord = await prisma.verificationToken.findFirst({
            where: { email: credentials.email, token: credentials.otp }
          });
          
          if (!tokenRecord) throw new Error("Invalid OTP");
          if (tokenRecord.expires < new Date()) throw new Error("OTP expired");

          // Update user as verified
          await prisma.user.update({
            where: { email: credentials.email },
            data: { emailVerified: new Date() }
          });

          // Delete token
          await prisma.verificationToken.delete({
            where: { id: tokenRecord.id }
          });

          return user;

        } else {
          // Login flow
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
    strategy: "jwt", // Use JWT for sessions
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        // user object is passed on initial login
        token.status = (user as any).status;
        token.phoneNumber = (user as any).phoneNumber;
        token.username = (user as any).username;
        token.country = (user as any).country;
      }
      
      // Handle session update
      if (trigger === "update" && session) {
        if (session.username) token.username = session.username;
        if (session.phoneNumber) token.phoneNumber = session.phoneNumber;
        if (session.country) token.country = session.country;
      }
      
      // Fetch fresh data if needed, but for performance we just rely on the token. 
      // If we want to ensure it's up to date:
      if (token.email && (!token.username || !token.status)) {
        const dbUser = await prisma.user.findUnique({ where: { email: token.email }});
        if (dbUser) {
          token.status = dbUser.status;
          token.phoneNumber = dbUser.phoneNumber;
          token.username = dbUser.username;
          token.country = dbUser.country;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).status = token.status as string;
        (session.user as any).phoneNumber = token.phoneNumber as string;
        (session.user as any).username = token.username as string;
        (session.user as any).country = token.country as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Middleware will handle specific redirect logic (e.g. to user_info or dashboard)
      return `${baseUrl}/dashboard`
    },
  },
})

export { handler as GET, handler as POST }
