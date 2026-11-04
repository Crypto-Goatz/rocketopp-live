import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const origin = `${req.nextUrl.protocol}//${req.headers.get("host")}`;
  const res = NextResponse.redirect(`${origin}/admin`, 302);
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
