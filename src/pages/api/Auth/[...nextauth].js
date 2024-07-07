// src/pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
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
            profileImage: user.profileImage, // Include profile image
          };
        } else {
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true, // Enable account linking
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      await dbConnect(); // Ensure mongoose connection

      if (account.provider === "google") {
        const existingUser = await User.findOne({ email: user.email });

        if (existingUser) {
          // User already exists, no need to create a new one
          return true; // Allow sign-in
        } else {
          // Create a new user if they do not exist
          const newUser = new User({
            username: user.name,
            email: user.email,
            profileImage: user.image,
            dateJoined: new Date(),
            libraries: [],
          });
          await newUser.save();
          return true; // Allow sign-in
        }
      }

      return true; // Allow sign-in for other providers
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username; // Add username to token
        token.profileImage = user.profileImage; // Add profile image to token
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username; // Add username to session
        session.user.profileImage = token.profileImage; // Add profile image to session
      }
      return session;
    },
  },
  pages: {
    signIn: "/Login", // Specify a custom sign-in page
  },
};

export default NextAuth(authOptions);
