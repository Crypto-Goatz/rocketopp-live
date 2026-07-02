import { getSiteSetting } from "@/lib/auth/admin";
import { themeToTokens, fontHref, type HqTheme } from "@/lib/hq/theme";

// Injected into the root layout. Reads the saved AI HQ theme and overrides the
// shadcn design tokens site-wide. If nothing is saved (or anything errors) it
// renders nothing and the site keeps its built-in defaults — it can never break.
export default async function HqThemeStyle() {
  let theme: HqTheme | null = null;
  try {
    const v = await getSiteSetting("ai_hq_theme");
    if (v && typeof v === "object" && "colors" in v) theme = v as HqTheme;
  } catch { theme = null; }
  if (!theme) return null;

  const tokens = themeToTokens(theme);
  const vars = Object.entries(tokens).map(([k, v]) => `${k}:${v}`).join(";");
  const href = fontHref(theme);
  const hf = theme.headingFont === "system" ? "system-ui, sans-serif" : `'${theme.headingFont}', system-ui, sans-serif`;
  const bf = theme.bodyFont === "system" ? "system-ui, sans-serif" : `'${theme.bodyFont}', system-ui, sans-serif`;

  const css = `:root{${vars}}.dark{${vars}}
body{font-family:${bf} !important}
h1,h2,h3,h4,h5,h6{font-family:${hf} !important}`;

  return (
    <>
      {href ? <link href={href} rel="stylesheet" /> : null}
      <style id="ai-hq-theme" dangerouslySetInnerHTML={{ __html: css }} />
    </>
  );
}
