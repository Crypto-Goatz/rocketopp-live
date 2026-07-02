import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db/supabase";

export const runtime = "nodejs";

// Public lead capture from Nova-built contact blocks.
export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  if (b?.email) {
    await supabaseAdmin.from("hq_leads").insert({
      page_id: b.pageId || null, name: b.name || null, email: b.email, message: b.message || null,
    });
  }
  return NextResponse.json({ ok: true });
}
