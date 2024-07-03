// src/pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../../lib/mongodbClient"; // Use the new file for MongoDB client
import User from "../../../../models/User";
import dbConnect from "../../../../lib/dbConnect";
import { compare } from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Username or Email",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        await dbConnect(); // Ensure mongoose connection
        const user = await User.findOne({
          $or: [
            { username: credentials?.username },
            { email: credentials?.username },
          ],
        });
        if (user && (await compare(credentials?.password, user.password))) {
          return {
            id: user.id,
            name: user.username,
            email: user.email,
            username: user.username,
          };
        } else {
          return null;
        }
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.username = user.username; // Add username to token
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username; // Add username to session
      }
      return session;
    },
  },
  pages: {
    signIn: "/Login", // Specify a custom sign-in page
  },
};

export default NextAuth(authOptions);
