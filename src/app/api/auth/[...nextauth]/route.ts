// ============================================================================
// Auth.js Route Handler — catches all /api/auth/* requests
// This is the NextAuth entry point (replaces your custom login/logout/session routes)
// ============================================================================

import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
