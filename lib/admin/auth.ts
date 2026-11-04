import { createHmac, createHash, timingSafeEqual, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

/**
 * /admin gate — WHO is asking, not WHAT passcode they typed.
 *
 * Two doors, one session:
 *   1. Sign in with 0n3 (OpenID Connect) — the estate's one identity, joined on
 *      EMAIL (Rule 0-SSO). Mike's 0n3 account is mike@rocketopp.com.
 *   2. A CRM custom-menu link that carries a signed per-person key, so the
 *      dashboard opens inside the CRM she already lives in with no second login.
 *      The link is only visible to her CRM user, and every session it opens is
 *      stamped with her email.
 *
 * Either door ends in the same signed, httpOnly cookie. Nothing from the CRM
 * or 0n3 (no token, no context) is ever stored in the browser — only our own
 * HMAC-signed session.
 *
 * The allowlist is the gate. Decrypting a context or completing an OIDC flow
 * proves identity; ADMIN_EMAILS decides who is let in.
 */

export const SESSION_COOKIE = "spa_admin_session";
const SESSION_TTL_S = 60 * 60 * 24 * 30; // 30 days

export type AdminSession = { email: string; name: string; via: "0n3" | "crm-link"; iat: number; exp: number };

const DEFAULT_ALLOW = ["mike@rocketopp.com"];

export function allowedEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS || "";
  const list = raw.split(/[,\s]+/).map((s) => s.trim().toLowerCase()).filter(Boolean);
  return list.length ? list : DEFAULT_ALLOW;
}
export function isAllowed(email: string | null | undefined): boolean {
  if (!email) return false;
  return allowedEmails().includes(String(email).trim().toLowerCase());
}

/** The signing secret. ADMIN_SESSION_SECRET is the real one; the fallback keeps the gate working before it is set, and is logged by NAME so it gets fixed. */
function secret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (s && s.length >= 16) return s;
  const fb = process.env.SESSION_SECRET || process.env.CRON_SECRET;
  if (fb) { console.warn("[admin-auth] ADMIN_SESSION_SECRET is not set — signing with a fallback secret (SESSION_SECRET / CRON_SECRET)"); return `fallback:${fb}`; }
  throw new Error("[admin-auth] no signing secret (set ADMIN_SESSION_SECRET)");
}

function b64u(buf: Buffer | string): string { return Buffer.from(buf).toString("base64url"); }
function unb64u(s: string): Buffer { return Buffer.from(s, "base64url"); }
function sign(payload: string, key = secret()): string { return b64u(createHmac("sha256", key).update(payload).digest()); }
function safeEq(a: string, b: string): boolean { const x = Buffer.from(a), y = Buffer.from(b); return x.length === y.length && timingSafeEqual(x, y); }

/** Mint a session token for an allowed person. */
export function mintSession(input: { email: string; name?: string; via: AdminSession["via"] }): string {
  const now = Math.floor(Date.now() / 1000);
  const s: AdminSession = { email: input.email.trim().toLowerCase(), name: input.name || "", via: input.via, iat: now, exp: now + SESSION_TTL_S };
  const body = b64u(JSON.stringify(s));
  return `${body}.${sign(body)}`;
}
export function verifySession(token: string | null | undefined): AdminSession | null {
  if (!token || !token.includes(".")) return null;
  const [body, sig] = token.split(".", 2);
  try {
    if (!safeEq(sign(body), sig)) return null;
    const s = JSON.parse(unb64u(body).toString("utf8")) as AdminSession;
    if (!s?.email || !s.exp || s.exp < Math.floor(Date.now() / 1000)) return null;
    if (!isAllowed(s.email)) return null; // allowlist is re-checked on every request, so removing an email logs them out
    return s;
  } catch { return null; }
}

/** The current session from the request cookie (server components, route handlers). */
export async function readSession(): Promise<AdminSession | null> {
  try { return verifySession((await cookies()).get(SESSION_COOKIE)?.value); } catch { return null; }
}
export function readSessionFromRequest(req: NextRequest): AdminSession | null {
  return verifySession(req.cookies.get(SESSION_COOKIE)?.value);
}
export const sessionCookieOptions = { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/", maxAge: SESSION_TTL_S };

/* ───────────── CRM custom-menu link keys ─────────────
 * A link key is HMAC(email) under ADMIN_LINK_SECRET (or the session secret).
 * It identifies a PERSON, never a shared passcode; it is placed in that person's
 * CRM custom menu link and nowhere else. Rotating ADMIN_LINK_SECRET invalidates
 * every link at once. */
function linkSecret(): string { return process.env.ADMIN_LINK_SECRET || `link:${secret()}`; }
export function mintLinkKey(email: string): string {
  const e = email.trim().toLowerCase();
  return `${b64u(e)}.${sign(`link|${e}`, linkSecret())}`;
}
export function verifyLinkKey(key: string | null | undefined): string | null {
  if (!key || !key.includes(".")) return null;
  const [body, sig] = key.split(".", 2);
  try {
    const e = unb64u(body).toString("utf8").trim().toLowerCase();
    if (!safeEq(sign(`link|${e}`, linkSecret()), sig)) return null;
    return isAllowed(e) ? e : null;
  } catch { return null; }
}

/* ───────────── OIDC (Sign in with 0n3) helpers ───────────── */
export const ON3_BASE = (process.env.ON3_URL || "https://0n3.app").replace(/\/$/, "");
export function pkcePair(): { verifier: string; challenge: string } {
  const verifier = b64u(randomBytes(32));
  const challenge = b64u(createHash("sha256").update(verifier).digest());
  return { verifier, challenge };
}
export function randomState(): string { return b64u(randomBytes(16)); }
