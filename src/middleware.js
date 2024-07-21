import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // If the user is not authenticated, redirect to the login page
    if (!req.nextauth.token) {
      const url = req.nextUrl.clone();
      url.pathname = "/Login";
      return NextResponse.redirect(url);
    }

    // Allow the request to proceed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Only allow access if there's a valid token
    },
  }
);

export const config = {
  matcher: [
    "/HomePage/:path*", // Protect all subroutes under HomePage
    "/libraries/:path*", // Protect all subroutes under libraries
    "/posts/:path*", // Protect all subroutes under posts
    "/profile/:path*", // Protect all subroutes under profile
    "/components/:path*", // Protect all subroutes under components
    "/api/:path*", // Protect all subroutes under API
  ],
};
