import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db/supabase";
import { notifyFormSubmission } from "@/lib/crm/notify";

export const runtime = "nodejs";

// Public lead capture from Nova-built contact blocks.
export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  if (b?.email) {
    await supabaseAdmin.from("hq_leads").insert({
      page_id: b.pageId || null, name: b.name || null, email: b.email, message: b.message || null,
    });
    // Push to the CRM too, so HQ page leads land in the same pipeline as every
    // other form instead of only in a table nobody watches. Awaited but never
    // allowed to throw — a CRM hiccup must not drop the lead we already stored.
    try {
      await notifyFormSubmission({
        email: b.email,
        fullName: b.name || undefined,
        message: b.message || undefined,
        source: "rocketopp-hq-lead",
        formName: b.pageId ? `HQ Contact Block (page ${b.pageId})` : "HQ Contact Block",
      });
    } catch (err) {
      console.error("[HQ Lead] CRM notify failed:", err);
    }
  }
  return NextResponse.json({ ok: true });
}
