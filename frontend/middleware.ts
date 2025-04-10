import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth-token");
  const path = request.nextUrl.pathname;

  // Define protected routes
  const protectedRoutes = ["/dashboard"];

  // Define authentication routes
  const authRoutes = ["/login", "/register"];

  // Check if the route is protected and user is not authenticated
  if (protectedRoutes.some((route) => path.startsWith(route)) && !authToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Check if the route is an auth route and user is already authenticated
  if (authRoutes.some((route) => path.startsWith(route)) && authToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
