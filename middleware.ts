// Option 1 — Keep code exactly as-is, change the plan
// export { auth as middleware } from "@/auth";

// Option 2 — Keep the plan, change one line
// middleware.ts (NextAuth v5, tiny bundle for Vercel Edge)

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Adjust to the paths you actually want to protect
export const config = {
  matcher: ["/account/:path*", "/checkout/:path*"],
};

function hasNextAuthSession(req: NextRequest) {
  // NextAuth session cookie names:
  // - prod: __Secure-next-auth.session-token
  // - dev:  next-auth.session-token
  return (
    req.cookies.get("__Secure-next-auth.session-token") ??
    req.cookies.get("next-auth.session-token")
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1) Require auth on protected paths
  const requiresAuth = ["/account", "/checkout"].some((p) =>
    pathname.startsWith(p)
  );

  if (requiresAuth && !hasNextAuthSession(req)) {
    const url = new URL("/sign-in", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // 2) Ensure a cart cookie exists (your prior authorized() effect)
  if (!req.cookies.get("sessionCartId")) {
    const sessionCartId = crypto.randomUUID();
    const res = NextResponse.next();
    res.cookies.set("sessionCartId", sessionCartId, { path: "/" });
    return res;
  }

  return NextResponse.next();
}
