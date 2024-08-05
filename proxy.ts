import { type NextRequest, NextResponse } from "next/server";

const MAINTENANCE_PATH = "/busyness";

export const config = {
  matcher: "/((?!api|_next|static|public|favicon.ico|%PUBLIC_URL%).*)",
};

export async function proxy(request: NextRequest) {
  const isDeniedAccess = process.env.MAINTENANCE_MODE === "true";
  const isAccessMaintenance = request.nextUrl.pathname === MAINTENANCE_PATH;

  request.nextUrl.pathname = isDeniedAccess
    ? MAINTENANCE_PATH
    : isAccessMaintenance
      ? "/"
      : request.nextUrl.pathname;

  if (isDeniedAccess) {
    return NextResponse.rewrite(request.nextUrl);
  }

  if (isAccessMaintenance) {
    return NextResponse.redirect(request.nextUrl);
  }

  const response = NextResponse.next();

  return response;
}
