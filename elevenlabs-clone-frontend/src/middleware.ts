import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value ||
    request.cookies.get("next-auth.session-token")?.value;

  const path = request.nextUrl.pathname;

  if (path === "/") {
    return NextResponse.redirect(
      new URL("/app/speech-synthesis/text-to-speech", request.url),
    );
  }

  const isAuthRoute = path === "/app/sign-in" || path === "/app/sign-up";
  const isProtectedRoute = path.startsWith("/app/") && !isAuthRoute;

  if (sessionToken && isAuthRoute) {
    return NextResponse.redirect(
      new URL("/app/speech-synthesis/text-to-speech", request.url),
    );
  }

  if (!sessionToken && isProtectedRoute) {
    const signInUrl = new URL("/app/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/app/:path*"],
};
