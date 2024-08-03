"use client";

import { SessionProvider as Provider } from "next-auth/react";
import { ReactNode } from "react";

// Define the Props interface for TypeScript
interface Props {
  children: ReactNode; // Children elements to be wrapped by the provider
  session: any; // Session object for authentication context
}

// SessionProvider component definition
const SessionProvider: React.FC<Props> = ({ children, session }) => {
  // Wrap children components with the NextAuth session provider
  return <Provider session={session}>{children}</Provider>;
};

export default SessionProvider;
