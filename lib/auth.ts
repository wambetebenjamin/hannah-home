import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { cookies } from "next/headers";
import { consumeTicket, readTicket } from "./security";
import { hasOAuth, isDemo } from "./runtime";
import type { User } from "./types";

export const { handlers, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  providers: hasOAuth() ? [Google({
    clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    authorization: { params: { prompt: "select_account" } },
  })] : [],
  session: { strategy: "jwt", maxAge: 7 * 86400 },
  pages: { signIn: "/auth/signin", error: "/auth/signin" },
  callbacks: {
    async signIn({ profile, account }) {
      if (account?.provider !== "google" || !profile?.email || profile.email_verified !== true) return false;
      const jar = await cookies(); const token = jar.get("hh_oauth_permit")?.value;
      if (!token) return false;
      try {
        const permit = await consumeTicket(token, "oauth");
        return permit.email === profile.email.toLowerCase();
      } catch { return false; }
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/") && !url.startsWith("//")) return `${baseUrl}${url}`;
      try { if (new URL(url).origin === new URL(baseUrl).origin) return url; } catch { /* local only */ }
      return `${baseUrl}/my-bookings`;
    },
  },
});
export async function getUser(): Promise<User | null> {
  if (isDemo()) {
    const jar = await cookies();
    const demo = readTicket<{ email: string; name: string }>(jar.get("hh_demo_session")?.value, "demo_session");
    if (demo) return { email: demo.email, name: demo.name, demo: true };
  }
  if (!hasOAuth()) return null;
  const session = await auth();
  if (!session || "error" in session || !session.user?.email) return null;
  return { email: session.user.email.toLowerCase(), name: session.user.name || "Hannah Home customer" };
}
