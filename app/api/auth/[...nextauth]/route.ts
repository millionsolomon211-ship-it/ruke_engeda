import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma" // This is the 'bridge' file we made earlier

const handler = NextAuth({
  // Use the Prisma adapter to save users to your DB automatically
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      // These fetch from your .env file
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt", // Use JWT for sessions
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // After login, send them to the dashboard/user folder
      return `${baseUrl}/dashboard/user`
    },
  },
})

export { handler as GET, handler as POST }
