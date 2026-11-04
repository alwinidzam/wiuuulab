import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value ||
    request.cookies.get("next-auth.session-token")?.value;

  const path = request.nextUrl.pathname;

  // Pendaftaran dinonaktifkan untuk penggunaan pribadi
  if (path === "/app/sign-up") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Jika sudah login, akses ke root / atau /app/sign-in langsung dialihkan ke studio
  if (sessionToken && (path === "/" || path === "/app/sign-in")) {
    return NextResponse.redirect(
      new URL("/app/speech-synthesis/text-to-speech", request.url),
    );
  }

  // Jika belum login dan membuka rute studio /app/*, alihkan langsung ke halaman login (/)
  if (!sessionToken && path.startsWith("/app/") && path !== "/app/sign-in") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/app/:path*"],
};
