import { NextRequest, NextResponse } from "next/server";
import { ON3_BASE, isAllowed, mintSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/admin/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/auth/0n3/callback — finish "Sign in with 0n3".
 * Code + PKCE verifier → access token → /oauth/userinfo → email → allowlist → our session.
 * The 0n3 token is used once, here, and discarded. Failures land on /admin?error=… with no detail
 * that would help someone probing the gate.
 */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  const code = q.get("code"); const state = q.get("state");
  const c = req.cookies;
  const verifier = c.get("spa_oidc_v")?.value; const want = c.get("spa_oidc_s")?.value; const cid = c.get("spa_oidc_c")?.value; const next = c.get("spa_oidc_n")?.value || "/admin";
  const origin = `${req.nextUrl.protocol}//${req.headers.get("host")}`;
  const fail = (why: string) => { console.warn(`[admin-auth] 0n3 sign-in refused: ${why}`); const r = NextResponse.redirect(`${origin}/admin?error=signin`, 302); for (const k of ["spa_oidc_v", "spa_oidc_s", "spa_oidc_c", "spa_oidc_n"]) r.cookies.set(k, "", { path: "/api/admin/auth", maxAge: 0 }); return r; };
  if (!code || !state || !verifier || !want || !cid || state !== want) return fail("state/code mismatch");

  const tok = await fetch(`${ON3_BASE}/oauth/token`, {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: `${origin}/api/admin/auth/0n3/callback`, client_id: cid, code_verifier: verifier }),
    cache: "no-store",
  });
  const t = await tok.json().catch(() => ({}));
  if (!tok.ok || !t.access_token) return fail(`token exchange ${tok.status} ${t.error || ""}`);

  const who = await fetch(`${ON3_BASE}/oauth/userinfo`, { headers: { Authorization: `Bearer ${t.access_token}` }, cache: "no-store" });
  const u = await who.json().catch(() => ({}));
  const email = String(u.email || "").trim().toLowerCase();
  if (!who.ok || !email) return fail(`userinfo ${who.status}`);
  if (!isAllowed(email)) return fail(`email not on the allowlist`);

  const res = NextResponse.redirect(`${origin}${next.startsWith("/admin") ? next : "/admin"}`, 302);
  res.cookies.set(SESSION_COOKIE, mintSession({ email, name: u.name || "", via: "0n3" }), sessionCookieOptions);
  for (const k of ["spa_oidc_v", "spa_oidc_s", "spa_oidc_c", "spa_oidc_n"]) res.cookies.set(k, "", { path: "/api/admin/auth", maxAge: 0 });
  return res;
}
