import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  const protectedPaths = [
    "/shipping-address",
    "/payment-method",
    "/place-order",
    "/profile",
    "/account",
    "/checkout",
    "/admin",
  ];

  if (!req.auth && protectedPaths.some((p) => pathname.startsWith(p))) {
    const signIn = new URL("/sign-in", req.url);
    signIn.searchParams.set("callbackUrl", req.nextUrl.href);
    return NextResponse.redirect(signIn);
  }

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
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};

/*
import NextAuth from 'next-auth';
import { authConfig } from './auth';

export const { auth: middleware } = NextAuth(authConfig);
*/
