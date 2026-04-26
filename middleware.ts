import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || process.env.VITE_NEXTAUTH_SECRET || "fallback" });
  const { pathname } = req.nextUrl;

  const isAuthRoute = pathname.startsWith("/auth");
  const isDashboardRoute = pathname.startsWith("/dashboard");

  if (!token && isDashboardRoute) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // If user is authenticated...
  if (token) {
    const isProfileIncomplete = !token.phoneNumber || !token.username;

    // Prevent redirect loop if already on user_info
    if (isProfileIncomplete && pathname !== "/auth/user_info" && isDashboardRoute) {
      return NextResponse.redirect(new URL("/auth/user_info", req.url));
    }

    if (!isProfileIncomplete && pathname === "/auth/user_info") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Unnecessary to view login/signup if authenticated
    if (isAuthRoute && pathname !== "/auth/user_info") {
       return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
