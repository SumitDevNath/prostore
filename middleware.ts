// middleware.ts
import { NextResponse, type NextRequest } from "next/server";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

function hasNextAuthSession(req: NextRequest) {
  return (
    req.cookies.get("__Secure-next-auth.session-token") ??
    req.cookies.get("next-auth.session-token")
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Add the routes you want to protect:
  const protectedPaths = [
    "/shipping-address",
    "/payment-method",
    "/place-order",
    "/profile",
    "/account",
    "/checkout",
    "/admin",
  ];

  if (
    protectedPaths.some((p) => pathname.startsWith(p)) &&
    !hasNextAuthSession(req)
  ) {
    const url = new URL("/sign-in", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Ensure cart cookie exists
  if (!req.cookies.get("sessionCartId")) {
    const sessionCartId = crypto.randomUUID();
    const res = NextResponse.next();
    res.cookies.set("sessionCartId", sessionCartId, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production", // <-- don't force secure on http localhost
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  }

  return NextResponse.next();
}
