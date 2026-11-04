import { NextRequest, NextResponse } from "next/server";
import { verifyLinkKey, mintSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/admin/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/auth/link?k=<key>&next=/admin/… — the CRM custom-menu door.
 * The key names ONE allowed person (HMAC under ADMIN_LINK_SECRET). It opens a
 * session for that person and redirects into /admin. A wrong or revoked key
 * gets the same answer as no key at all.
 */
export async function GET(req: NextRequest) {
  const origin = `${req.nextUrl.protocol}//${req.headers.get("host")}`;
  const email = verifyLinkKey(req.nextUrl.searchParams.get("k"));
  const next = req.nextUrl.searchParams.get("next") || "/admin";
  if (!email) return NextResponse.redirect(`${origin}/admin?error=link`, 302);
  const res = NextResponse.redirect(`${origin}${next.startsWith("/admin") ? next : "/admin"}`, 302);
  res.cookies.set(SESSION_COOKIE, mintSession({ email, via: "crm-link" }), sessionCookieOptions);
  return res;
}
