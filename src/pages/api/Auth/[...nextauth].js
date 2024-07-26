import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../../lib/mongodbClient";
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
        await dbConnect();
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
            profileImage: user.profileImage,
          };
        } else {
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      await dbConnect();
      try {
        if (account.provider === "google") {
          let existingUser = await User.findOne({ email: user.email });
          if (existingUser) {
            // Update existing user with Google info if needed
            existingUser.profileImage = user.image || existingUser.profileImage;
            existingUser.username = user.name || existingUser.username;
            await existingUser.save();
          } else {
            // Create new user
            existingUser = new User({
              username: user.name,
              email: user.email,
              profileImage: user.image,
              dateJoined: new Date(),
              libraries: [],
            });
            await existingUser.save();
          }
          // Ensure user object has consistent properties
          user.id = existingUser._id;
          user.username = existingUser.username;
          user.profileImage = existingUser.profileImage;
        }
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.profileImage = user.profileImage;
      }
      if (trigger === "update" && session) {
        token.username = session.username;
        token.profileImage = session.profileImage;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.profileImage = token.profileImage;
      return session;
    },
    async linkAccount({ user, account, profile }) {
      try {
        await dbConnect();
        const existingAccount = await User.findOne({
          "accounts.provider": account.provider,
          "accounts.providerAccountId": account.providerAccountId,
        });

        if (existingAccount) {
          // Account already linked, no action needed
          return true;
        }

        // Link the account
        await User.findByIdAndUpdate(user.id, {
          $push: { accounts: account },
        });

        return true;
      } catch (error) {
        console.error("Error in linkAccount callback:", error);
        return false;
      }
    },
  },
  pages: {
    signIn: "/Login",
  },
};

export default NextAuth(authOptions);
