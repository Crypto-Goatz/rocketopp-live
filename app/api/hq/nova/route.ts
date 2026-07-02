import { NextRequest, NextResponse } from "next/server";
import { getHqUser } from "@/lib/hq/gate";
import { supabaseAdmin } from "@/lib/db/supabase";
import { BLOCK_SCHEMA, type Block } from "@/lib/hq/blocks";

export const runtime = "nodejs";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

// Nova — describe a change, the page's block model updates. Groq only.
export async function POST(req: NextRequest) {
  const user = await getHqUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const pageId = (body.pageId as string) || "";
  const message = (body.message || "").toString().trim();
  if (!pageId || !message) return NextResponse.json({ error: "pageId + message required" }, { status: 400 });

  const { data: page } = await supabaseAdmin.from("hq_pages").select("id, blocks").eq("id", pageId).maybeSingle();
  if (!page) return NextResponse.json({ error: "page not found" }, { status: 404 });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "GROQ_API_KEY unset" }, { status: 500 });

  const system = `You are Nova, a website builder. You edit a page's content model — an ordered array of shadcn blocks.
${BLOCK_SCHEMA}
You are given the CURRENT blocks and an INSTRUCTION. Return JSON:
{"blocks":[ ... full updated array ... ], "reply":"one short friendly sentence describing what you changed"}.
Rules: change only what's asked; keep other blocks/fields identical; preserve ids (new blocks get a short new id); you may add/remove/reorder blocks using ONLY the allowed types. Output JSON only.`;
  const userMsg = `CURRENT blocks:\n${JSON.stringify(page.blocks)}\n\nINSTRUCTION:\n${message}`;

  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: MODEL, temperature: 0.2, response_format: { type: "json_object" }, messages: [{ role: "system", content: system }, { role: "user", content: userMsg }] }),
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) throw new Error(`groq ${res.status}`);
    const parsed = JSON.parse((await res.json())?.choices?.[0]?.message?.content?.trim() || "{}");

    // Nova judged it can't build this inline → hand back a spec for Claude.
    if (parsed.cantBuild && typeof parsed.spec === "string") {
      return NextResponse.json({
        ok: false,
        reply: parsed.reply || "That's beyond a single block — I've written a build spec you can hand to Claude, then insert the result with “+ Code”.",
        spec: parsed.spec,
        blocks: page.blocks,
      });
    }

    const blocks = parsed.blocks as Block[];
    if (!Array.isArray(blocks) || !blocks.length) {
      return NextResponse.json({ ok: false, reply: "I couldn't apply that safely — try rephrasing.", blocks: page.blocks });
    }
    await supabaseAdmin.from("hq_pages").update({ blocks, updated_at: new Date().toISOString() }).eq("id", pageId);
    return NextResponse.json({ ok: true, reply: typeof parsed.reply === "string" ? parsed.reply : "Done — I updated the page.", blocks });
  } catch {
    return NextResponse.json({ ok: false, reply: "Something went wrong applying that change.", blocks: page.blocks }, { status: 200 });
  }
}
