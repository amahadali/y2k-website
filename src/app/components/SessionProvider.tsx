// src/components/SessionProvider.tsx
"use client";

import { SessionProvider as Provider } from "next-auth/react";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  session: any;
}

const SessionProvider: React.FC<Props> = ({ children, session }) => {
  return <Provider session={session}>{children}</Provider>;
};

export default SessionProvider;
