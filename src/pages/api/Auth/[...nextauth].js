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
          scope: "openid profile email",
          access_type: "offline",
          prompt: "consent",
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
      if (account.provider === "google") {
        const existingUser = await User.findOne({ email: user.email });
        if (existingUser) {
          return true;
        } else {
          const newUser = new User({
            username: user.name,
            email: user.email,
            profileImage: user.image,
            dateJoined: new Date(),
            libraries: [],
          });
          await newUser.save();
          return true;
        }
      }
      return true;
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
      const existingAccount = await db.collection("accounts").findOne({
        provider: account.provider,
        providerAccountId: account.providerAccountId,
      });

      if (existingAccount) {
        account.id = existingAccount._id;
      }

      return true;
    },
  },
  pages: {
    signIn: "/Login",
  },
};

//changes made

export default NextAuth(authOptions);
