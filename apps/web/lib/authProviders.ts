import { prisma } from "@repo/db/client";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { Provider } from "next-auth/providers/index";
import bcyrpt from "bcrypt";

const providers: Provider[] = [
  Google({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  }),
  Credentials({
    name: "Credentials",

    credentials: {
      username: {
        label: "Username",
        type: "text",
        placeholder: "coolcoder123",
      },
      email: { label: "Email", type: "email", placeholder: "smith@gmail.com" },
      password: {
        label: "Password",
        type: "password",
        placeholder: "password",
      },
    },

    async authorize(credentials, req) {
      try {
        const { username, email, password } = credentials as {
          username: string;
          email: string;
          password: string;
        };

        if (!email || !password) {
          throw new Error("Please fill all fields");
        }

        const existingUser = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });

        if (existingUser) {
          if (existingUser.password === null) {
            throw new Error("Please use Google to sign in");
          }

          const matchPasswrod = await bcyrpt.compare(
            password,
            existingUser.password!
          );

          if (!matchPasswrod) {
            throw new Error("Invalid credentials");
          }

          return existingUser;
        }

        if (!username || !email || !password) {
          throw new Error("Please fill all fields");
        }

        const hashedPassword = await bcyrpt.hash(password, 10);
        const newUser = await prisma.user.create({
          data: {
            username: username,
            email: email,
            password: hashedPassword,
          },
        });

        return newUser;
      } catch (error) {
        console.error("Error in authorize", error);
        return null;
      }
    },
  }),
];

export const providerMap = providers.map((provider) => {
  return {
    id: provider.id,
    name: provider.name,
    type: provider.type,
  };
});

export const handlers = NextAuth({
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
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
      } else {
        return true;
      }
    },
    async session({ session }) {
      return session;
    },
  },
  pages: {
    signIn: "/auth/signup",
  },
});
