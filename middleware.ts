/* 
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PROTECTED = [
  "/shipping-address",
  "/payment-method",
  "/place-order",
  "/profile",
  "/account",
  "/checkout",
  "/admin",
];

// Exclude assets, next-auth API, and the auth pages themselves
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth|sign-in|sign-up).*)",
  ],
};

function hasNextAuthSession(req: NextRequest) {
  return (
    req.cookies.get("__Secure-next-auth.session-token") ??
    req.cookies.get("next-auth.session-token")
  );
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  
  // 1) Gate protected paths
  if (
    PROTECTED.some((p) => pathname.startsWith(p)) &&
    !hasNextAuthSession(req)
  ) {
    const signIn = new URL("/sign-in", req.url);

    // Use a RELATIVE path as callbackUrl to avoid cross-origin loops
    // Preserve current query string if you like:
    const relative = `${pathname}${search || ""}`;
    signIn.searchParams.set("callbackUrl", relative);

    return NextResponse.redirect(signIn);
  }
  
  // 2) Ensure cart cookie
  if (!req.cookies.get("sessionCartId")) {
    const res = NextResponse.next();
    res.cookies.set("sessionCartId", crypto.randomUUID(), {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  }

  return NextResponse.next();
}
*/

import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export const { auth: middleware } = NextAuth(authConfig);
