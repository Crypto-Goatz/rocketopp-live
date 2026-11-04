import { NextRequest, NextResponse } from "next/server";
import { ON3_BASE, pkcePair, randomState } from "@/lib/admin/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/auth/0n3/start — begin "Sign in with 0n3" (OpenID Connect, PKCE).
 *
 * The client is a PUBLIC PKCE client registered on 0n3 (ON3_OIDC_CLIENT_ID). If
 * the id is missing we register one dynamically (RFC 7591, which 0n3 supports)
 * and log the id BY NAME so it can be pinned in the environment.
 */
let registered: string | null = null;
async function clientId(redirect: string): Promise<string> {
  if (process.env.ON3_OIDC_CLIENT_ID) return process.env.ON3_OIDC_CLIENT_ID;
  if (registered) return registered;
  const r = await fetch(`${ON3_BASE}/oauth/register`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_name: "RocketOpp — admin", redirect_uris: [redirect], token_endpoint_auth_method: "none", grant_types: ["authorization_code", "refresh_token"], response_types: ["code"], scope: "openid email profile" }),
    cache: "no-store",
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.client_id) throw new Error(`0n3 registration failed: ${j.error_description || j.error || r.status}`);
  registered = String(j.client_id);
  console.warn(`[admin-auth] registered 0n3 OIDC client dynamically — set ON3_OIDC_CLIENT_ID=${registered} to pin it`);
  return registered;
}

export async function GET(req: NextRequest) {
  const origin = `${req.nextUrl.protocol}//${req.headers.get("host")}`;
  const redirect = `${origin}/api/admin/auth/0n3/callback`;
  const next = req.nextUrl.searchParams.get("next") || "/admin";
  let cid: string;
  try { cid = await clientId(redirect); } catch (e) { return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 502 }); }
  const { verifier, challenge } = pkcePair();
  const state = randomState();
  const u = new URL(`${ON3_BASE}/oauth/authorize`);
  u.searchParams.set("response_type", "code");
  u.searchParams.set("client_id", cid);
  u.searchParams.set("redirect_uri", redirect);
  u.searchParams.set("scope", "openid email profile");
  u.searchParams.set("state", state);
  u.searchParams.set("code_challenge", challenge);
  u.searchParams.set("code_challenge_method", "S256");
  const res = NextResponse.redirect(u.toString(), 302);
  const opts = { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/api/admin/auth", maxAge: 600 };
  res.cookies.set("spa_oidc_v", verifier, opts);
  res.cookies.set("spa_oidc_s", state, opts);
  res.cookies.set("spa_oidc_c", cid, opts);
  res.cookies.set("spa_oidc_n", next.startsWith("/admin") ? next : "/admin", opts);
  return res;
}
