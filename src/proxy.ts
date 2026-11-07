import { NextResponse, type NextRequest } from "next/server";

// Temporary: send everyone hitting the root straight into the OS.
export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL("/studio", request.url));
}

export const config = {
  matcher: "/",
};
