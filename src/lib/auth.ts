// ============================================================================
// Auth.js (NextAuth) Configuration
// Uses PrismaAdapter + Credentials Provider (username/password for admin)
// JWT strategy for serverless compatibility (Vercel)
// ============================================================================

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const username = credentials.username as string;
        const password = credentials.password as string;

        // Find user by username
        const user = await db.user.findUnique({
          where: { username },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        // Return user object (must include id)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          username: user.username,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours
  },
  pages: {
    signIn: "/admin",
    error: "/admin",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add user info to JWT on first sign in
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
        token.username = (user as { username?: string }).username;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose user info from JWT to session
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { username?: string }).username =
          token.username as string;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
});

// ============================================================================
// Helper: check if the current user is an admin
// ============================================================================

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }
  const role = (session.user as { role?: string }).role;
  if (role !== "admin") {
    return null;
  }
  return session;
}
