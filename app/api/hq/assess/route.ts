import { NextRequest, NextResponse } from "next/server";
import { getHqUser } from "@/lib/hq/gate";
import { TEMPLATES, templateById, DEFAULT_THEME, FONTS, type HqTheme, type FontKey } from "@/lib/hq/theme";

export const runtime = "nodejs";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

function signals(html: string) {
  const pick = (re: RegExp) => (html.match(re)?.[1] || "").trim();
  const all = (re: RegExp) => Array.from(html.matchAll(re)).map((m) => m[1].replace(/<[^>]+>/g, "").trim()).filter(Boolean);
  return {
    title: pick(/<title[^>]*>([^<]+)<\/title>/i),
    description: pick(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/i),
    h1: all(/<h1[^>]*>([\s\S]*?)<\/h1>/gi).slice(0, 4),
    h2: all(/<h2[^>]*>([\s\S]*?)<\/h2>/gi).slice(0, 10),
    colors: Array.from(new Set((html.match(/#[0-9a-fA-F]{6}\b/g) || []).map((c) => c.toLowerCase()))).slice(0, 20),
    forms: (html.match(/<form\b/gi) || []).length,
    buttons: (html.match(/<button\b|class=["'][^"']*btn/gi) || []).length,
  };
}

// AI HQ site assessment (Groq only). Reads any URL, learns brand/palette/fonts,
// flags conversion killers, proposes a template + ready-to-apply theme.
export async function POST(req: NextRequest) {
  const user = await getHqUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const url = (body.url || "https://rocketopp.com").toString().trim();
  if (!/^https?:\/\//.test(url)) return NextResponse.json({ error: "valid url required" }, { status: 400 });

  let html = "";
  try {
    const r = await fetch(url, { headers: { "User-Agent": "rocketopp-HQ/1.0" }, signal: AbortSignal.timeout(12000) });
    html = (await r.text()).slice(0, 200000);
  } catch { return NextResponse.json({ error: "Could not reach that site." }, { status: 502 }); }
  const sig = signals(html);

  const apiKey = process.env.GROQ_API_KEY;
  let report: Record<string, unknown> = {};
  if (apiKey) {
    const fontKeys = FONTS.join(", ");
    const system = `You are a senior conversion strategist and brand designer assessing a website.
Return JSON only:
{"brand":{"name":string,"industry":string,"voice":string},
"palette":{"background":hex,"foreground":hex,"card":hex,"cardForeground":hex,"primary":hex,"primaryForeground":hex,"secondary":hex,"secondaryForeground":hex,"muted":hex,"mutedForeground":hex,"accent":hex,"accentForeground":hex,"border":hex,"ring":hex},
"fonts":{"heading":one of [${fontKeys}],"body":one of [${fontKeys}]},
"recommendedTemplate":one of [${TEMPLATES.map(t=>t.id).join(", ")}],
"conversionKillers":[{"issue":string,"impact":"high"|"med"|"low","fix":string}],
"reusable":[string],"recommendations":[string]}
Be faithful to the brand's real colors. Output JSON only.`;
    try {
      const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: MODEL, temperature: 0.3, response_format: { type: "json_object" }, messages: [{ role: "system", content: system }, { role: "user", content: `URL: ${url}\nSignals: ${JSON.stringify(sig)}` }] }),
        signal: AbortSignal.timeout(20000),
      });
      report = JSON.parse((await res.json())?.choices?.[0]?.message?.content?.trim() || "{}");
    } catch { report = {}; }
  }

  const tpl = templateById((report.recommendedTemplate as string) || "rocket") || TEMPLATES[0];
  const pal = (report.palette as Partial<HqTheme["colors"]>) || {};
  const fk = (report.fonts as { heading?: FontKey; body?: FontKey }) || {};
  const suggestedTheme: HqTheme = {
    ...tpl.theme,
    colors: { ...tpl.theme.colors, ...pal },
    headingFont: FONTS.includes(fk.heading as FontKey) ? (fk.heading as FontKey) : tpl.theme.headingFont,
    bodyFont: FONTS.includes(fk.body as FontKey) ? (fk.body as FontKey) : tpl.theme.bodyFont,
  };

  return NextResponse.json({
    ok: true, url, signals: sig,
    report: Object.keys(report).length ? report : { note: "Heuristic-only (Groq unset)." },
    recommendedTemplate: tpl.id,
    suggestedTheme: Object.keys(report).length ? suggestedTheme : DEFAULT_THEME,
  });
}
