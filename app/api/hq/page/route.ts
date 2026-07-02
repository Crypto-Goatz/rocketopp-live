import { NextRequest, NextResponse } from "next/server";
import { getHqUser } from "@/lib/hq/gate";
import { supabaseAdmin } from "@/lib/db/supabase";

export const runtime = "nodejs";

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48) || "page";

// Create or update a managed page (gated).
export async function POST(req: NextRequest) {
  const user = await getHqUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const b = await req.json().catch(() => ({}));
  const action = b.action as string;

  if (action === "create") {
    const title = (b.title || "Untitled").toString();
    let slug = slugify(b.slug || title);
    // ensure unique slug
    const { data: existing } = await supabaseAdmin.from("hq_pages").select("slug").eq("slug", slug).maybeSingle();
    if (existing) slug = `${slug}-${Math.floor(Date.now() / 1000) % 10000}`;
    const { data, error } = await supabaseAdmin.from("hq_pages")
      .insert({ title, slug, blocks: b.blocks || [], status: "draft", created_by: user.id })
      .select("id, slug, title, blocks, status").single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, page: data });
  }

  // save (blocks / status / title)
  const id = b.id as string;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (b.blocks) patch.blocks = b.blocks;
  if (b.title) patch.title = b.title;
  if (b.status) patch.status = b.status;
  if (b.seo) patch.seo = b.seo;
  const { error } = await supabaseAdmin.from("hq_pages").update(patch).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
