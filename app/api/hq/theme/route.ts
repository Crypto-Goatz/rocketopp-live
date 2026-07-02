import { NextRequest, NextResponse } from "next/server";
import { getHqUser } from "@/lib/hq/gate";
import { saveHqTheme } from "@/lib/hq/store";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const user = await getHqUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const b = await req.json().catch(() => ({}));
  if (!b?.theme?.colors) return NextResponse.json({ error: "theme required" }, { status: 400 });

  try {
    await saveHqTheme(b.theme, user.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
