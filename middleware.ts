// middleware.ts
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

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};

function hasNextAuthSession(req: NextRequest) {
  return (
    req.cookies.get("__Secure-next-auth.session-token") ??
    req.cookies.get("next-auth.session-token")
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    PROTECTED.some((p) => pathname.startsWith(p)) &&
    !hasNextAuthSession(req)
  ) {
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
}
