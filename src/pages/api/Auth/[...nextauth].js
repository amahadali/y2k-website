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
    cookie: {
      name: "next-auth.session-token",
      path: "/",
      sameSite: "lax",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
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
        // Cache user information in the JWT
        token.id = user.id;
        token.name = user.name; // Include 'name' as it is used in session
        token.email = user.email;
        token.username = user.username;
        token.profileImage = user.profileImage;
      }
      if (trigger === "update" && session) {
        // Update token with the latest session info
        token.username = session.user.username;
        token.profileImage = session.user.profileImage;
      }
      return token;
    },
    async session({ session, token }) {
      // Populate session with data from the JWT
      session.user.id = token.id;
      session.user.name = token.name; // Ensure 'name' is included in session
      session.user.email = token.email;
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

export default NextAuth(authOptions);
