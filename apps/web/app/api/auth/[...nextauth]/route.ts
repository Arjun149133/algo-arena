import { prisma } from "@repo/db/client";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") {
        return false;
      }

      if (user.email === undefined || user.email === null) {
        return false;
      }

      if (user.name === undefined || user.name === null) {
        return false;
      }

      const existingUser = await prisma.user.findUnique({
        where: {
          email: user.email,
        },
      });

      if (existingUser) {
        return true;
      }

      await prisma.user.create({
        data: {
          email: user.email,
          username: user.name,
        },
      });

      return true;
    },
    async session({ session }) {
      return session;
    },
  },
  // pages: {
  //   signIn: "/auth/signin",
  // },
});

export { handler as GET, handler as POST };
