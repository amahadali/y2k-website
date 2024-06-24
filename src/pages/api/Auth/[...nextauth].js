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
          return { id: user.id, name: user.username, email: user.email };
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
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin", // Specify a custom sign-in page
    error: "/auth/error", // Specify a custom error page
  },
};

export default NextAuth(authOptions);
