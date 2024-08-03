import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../../lib/mongodbClient";
import User from "../../../../models/User";
import dbConnect from "../../../../lib/dbConnect";
import { compare } from "bcryptjs";

// Configuration options for NextAuth
export const authOptions = {
  // Authentication providers configuration
  providers: [
    // Credentials provider allows for username/password authentication
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
      // Function to authorize user credentials
      authorize: async (credentials) => {
        await dbConnect(); // Ensure connection to database
        // Search for user by either username or email
        const user = await User.findOne({
          $or: [
            { username: credentials?.username },
            { email: credentials?.username },
          ],
        });
        // If user is found and password matches
        if (user && (await compare(credentials?.password, user.password))) {
          // Return user object with relevant details
          return {
            id: user.id,
            name: user.username,
            email: user.email,
            username: user.username,
            profileImage: user.profileImage,
          };
        } else {
          // Return null if authentication fails
          return null;
        }
      },
    }),
    // Google provider for OAuth authentication
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID, // Google client ID from environment variables
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Google client secret from environment variables
      allowDangerousEmailAccountLinking: true, // Allow linking Google accounts with existing emails
      authorization: {
        params: {
          scope: "openid profile email", // Request access to profile and email
          access_type: "offline", // Request offline access to get refresh tokens
          prompt: "consent", // Prompt user for consent to ensure refresh tokens
        },
      },
    }),
  ],
  // Adapter to use MongoDB for managing sessions and user data
  adapter: MongoDBAdapter(clientPromise),

  // Session management configuration
  session: {
    strategy: "jwt", // Use JSON Web Tokens for session management
    maxAge: 30 * 24 * 60 * 60, // Set session expiry to 30 days
    cookie: {
      name: "next-auth.session-token", // Name of the session cookie
      path: "/", // Path for which the cookie is valid
      sameSite: "lax", // Security setting for cookies to prevent CSRF
      httpOnly: true, // Cookie cannot be accessed via JavaScript
      secure: process.env.NODE_ENV === "production", // Use secure cookies only in production
    },
  },

  // Callbacks to handle custom logic during various authentication phases
  callbacks: {
    // Function called when a user signs in
    async signIn({ user, account, profile }) {
      await dbConnect(); // Ensure connection to database
      if (account.provider === "google") {
        // For Google sign-ins, check if the user already exists
        const existingUser = await User.findOne({ email: user.email });
        if (existingUser) {
          // User exists, allow sign-in
          return true;
        } else {
          // Create a new user if not already existing
          const newUser = new User({
            username: user.name, // Use name from Google profile
            email: user.email, // Use email from Google profile
            profileImage: user.image, // Use image from Google profile
            dateJoined: new Date(), // Set the current date as join date
            libraries: [], // Initialize empty libraries array
          });
          await newUser.save(); // Save new user to database
          return true;
        }
      }
      return true; // Allow sign-in for other providers
    },

    // Function called when generating or updating a JWT token
    async jwt({ token, user, trigger, session }) {
      if (user) {
        // If a user is present, set user properties in token
        token.id = user.id;
        token.username = user.username;
        token.profileImage = user.profileImage;
      }
      if (trigger === "update" && session) {
        // Update token with new session properties if session is updated
        token.username = session.username;
        token.profileImage = session.profileImage;
      }
      return token; // Return updated token
    },

    // Function called when creating or updating a session
    async session({ session, token }) {
      // Add token properties to session object
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.profileImage = token.profileImage;
      return session; // Return updated session
    },

    // Function called when linking accounts to a user
    async linkAccount({ user, account, profile }) {
      // Check if the account already exists in the database
      const existingAccount = await db.collection("accounts").findOne({
        provider: account.provider,
        providerAccountId: account.providerAccountId,
      });

      if (existingAccount) {
        // If account exists, update the account ID
        account.id = existingAccount._id;
      }

      return true; // Allow account linking
    },
  },

  // Custom sign-in page URL
  pages: {
    signIn: "/Login", // Path to the custom sign-in page
  },
};

// Export the NextAuth configuration
export default NextAuth(authOptions);
