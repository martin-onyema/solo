// ============================================================================
// Updated Proxy/Middleware for Auth.js
// Protects admin routes and write API routes using Auth.js session
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Routes that require admin authentication (page routes)
const PROTECTED_PAGE_ROUTES = ["/admin"];

// API routes that require admin authentication for WRITE operations
// GET requests on these routes should be PUBLIC (for the website to work)
const PROTECTED_WRITE_API_ROUTES = [
  "/api/properties",
  "/api/inquiries",
  "/api/stats",
  "/api/upload",
];

export default async function handleProxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method.toUpperCase();

  // Always allow Auth.js internal routes (NextAuth handles its own auth)
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Check if this is a protected page route
  const isProtectedPage = PROTECTED_PAGE_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Check if this is a protected API WRITE operation
  const isProtectedApiWrite =
    method !== "GET" &&
    PROTECTED_WRITE_API_ROUTES.some((route) => pathname.startsWith(route));

  if (!isProtectedPage && !isProtectedApiWrite) {
    return NextResponse.next();
  }

  // Verify Auth.js session
  // Note: In middleware, we can't use the full auth() function.
  // We check for the session cookie instead.
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value;

  if (!sessionToken) {
    if (isProtectedApiWrite) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Let the page handle it client-side (shows login form)
    return NextResponse.next();
  }

  // Session token exists — allow through.
  // Full token validation happens in the API routes via auth()
  return NextResponse.next();
}

export { handleProxy as proxy };

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/properties/:path*",
    "/api/inquiries/:path*",
    "/api/stats/:path*",
    "/api/auth/:path*",
    "/api/upload/:path*",
  ],
};
