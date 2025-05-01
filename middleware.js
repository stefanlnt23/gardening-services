import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// This function will be executed before the middleware
function middleware(req) {
  const path = req.nextUrl.pathname;
  
  // Only run this logic for admin routes
  if (path.startsWith('/admin')) {
    const token = req.nextauth.token;
    
    // If user is not an admin, redirect to home page
    if (!token?.isAdmin) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
  
  return NextResponse.next();
}

// Enhance the middleware with authentication
export default withAuth(middleware, {
  callbacks: {
    // The authorized callback is called before middleware
    authorized: ({ token }) => !!token
  }
});

// Specify which routes to protect
export const config = {
  matcher: [
    // Match all admin routes
    "/admin/:path*"
  ]
};
