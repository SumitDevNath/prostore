// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const config = {
  // run on everything except Next static assets and favicon
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

  // 1) auth-gate only for these paths
  const requiresAuth = ["/account", "/checkout"].some((p) =>
    pathname.startsWith(p)
  );
  if (requiresAuth && !hasNextAuthSession(req)) {
    const url = new URL("/sign-in", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // 2) ensure cart cookie exists for everyone, including Server Action POSTs
  if (!req.cookies.get("sessionCartId")) {
    const sessionCartId = crypto.randomUUID();
    const res = NextResponse.next();
    res.cookies.set("sessionCartId", sessionCartId, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true, // leave true in production; in local dev it's okay too
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return res;
  }

  return NextResponse.next();
}
