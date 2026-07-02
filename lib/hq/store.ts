import { getSiteSetting, setSiteSetting } from "@/lib/auth/admin";
import { DEFAULT_THEME, type HqTheme } from "./theme";

const KEY = "ai_hq_theme";

export async function getHqTheme(): Promise<HqTheme> {
  try {
    const v = await getSiteSetting(KEY);
    if (v && typeof v === "object" && "colors" in v) return v as HqTheme;
  } catch { /* fall through to default */ }
  return DEFAULT_THEME;
}

export async function saveHqTheme(theme: HqTheme, adminId: string) {
  await setSiteSetting(KEY, theme, adminId, "AI HQ global theme", "design");
}
