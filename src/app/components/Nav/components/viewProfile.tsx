// components/ViewProfile.tsx
import React from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const ViewProfile: React.FC = () => {
  const { data: session } = useSession();

  if (!session?.user?.username) {
    return null; // Return null if there's no user or username
  }

  return (
    <div className="mt-6 text-center">
      <Link href={`/profile/${session.user.username}`}>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          View Profile
        </button>
      </Link>
    </div>
  );
};

export default ViewProfile;
