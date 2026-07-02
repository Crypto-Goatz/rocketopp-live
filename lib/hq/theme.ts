// AI HQ theme engine for rocketopp.com.
// The site is already shadcn-token driven (HSL triplets in globals.css). The HQ
// stores a hex-based theme (easy pickers) and converts to the shadcn token format
// on injection, so one save restyles the ENTIRE site instantly — no deploy.

export type HqTheme = {
  colors: {
    background: string; foreground: string;
    card: string; cardForeground: string;
    primary: string; primaryForeground: string;
    secondary: string; secondaryForeground: string;
    muted: string; mutedForeground: string;
    accent: string; accentForeground: string;
    border: string; ring: string;
  };
  radius: number;          // rem
  headingFont: FontKey;
  bodyFont: FontKey;
};

export type FontKey = "Inter" | "Sora" | "Poppins" | "DM Sans" | "Space Grotesk" | "Manrope" | "Fraunces" | "Playfair Display" | "system";

export const FONTS: FontKey[] = ["Inter", "Sora", "Poppins", "DM Sans", "Space Grotesk", "Manrope", "Fraunces", "Playfair Display", "system"];

// hex (#rrggbb) → shadcn "H S% L%" triplet
export function hexToHsl(hex: string): string {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  if ([r, g, b].some((v) => Number.isNaN(v))) return "0 0% 0%";
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let hue = 0, sat = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    sat = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) hue = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) hue = (b - r) / d + 2;
    else hue = (r - g) / d + 4;
    hue /= 6;
  }
  return `${Math.round(hue * 360)} ${Math.round(sat * 100)}% ${Math.round(l * 100)}%`;
}

export function themeToTokens(t: HqTheme): Record<string, string> {
  const c = t.colors;
  return {
    "--background": hexToHsl(c.background),
    "--foreground": hexToHsl(c.foreground),
    "--card": hexToHsl(c.card),
    "--card-foreground": hexToHsl(c.cardForeground),
    "--popover": hexToHsl(c.card),
    "--popover-foreground": hexToHsl(c.cardForeground),
    "--primary": hexToHsl(c.primary),
    "--primary-foreground": hexToHsl(c.primaryForeground),
    "--secondary": hexToHsl(c.secondary),
    "--secondary-foreground": hexToHsl(c.secondaryForeground),
    "--muted": hexToHsl(c.muted),
    "--muted-foreground": hexToHsl(c.mutedForeground),
    "--accent": hexToHsl(c.accent),
    "--accent-foreground": hexToHsl(c.accentForeground),
    "--border": hexToHsl(c.border),
    "--input": hexToHsl(c.border),
    "--ring": hexToHsl(c.ring),
    "--radius": `${t.radius}rem`,
  };
}

export function fontHref(t: HqTheme): string | null {
  const fams = Array.from(new Set([t.headingFont, t.bodyFont])).filter((f) => f !== "system");
  if (!fams.length) return null;
  const q = fams.map((f) => `family=${f.replace(/ /g, "+")}:wght@400;500;600;700;800`).join("&");
  return `https://fonts.googleapis.com/css2?${q}&display=swap`;
}

// Current rocketopp brand — the live dark navy + orange — so the HQ editor
// starts from reality (saving unchanged is visually a no-op).
export const DEFAULT_THEME: HqTheme = {
  colors: {
    background: "#101320", foreground: "#f2f2f2",
    card: "#141820", cardForeground: "#f2f2f2",
    primary: "#ff571a", primaryForeground: "#ffffff",
    secondary: "#21262d", secondaryForeground: "#f2f2f2",
    muted: "#21262d", mutedForeground: "#a6a6a6",
    accent: "#ff571a", accentForeground: "#ffffff",
    border: "#2c323c", ring: "#ff571a",
  },
  radius: 0.5, headingFont: "Inter", bodyFont: "Inter",
};

export type HqTemplate = { id: string; name: string; vibe: string; theme: HqTheme };

export const TEMPLATES: HqTemplate[] = [
  { id: "rocket", name: "Rocket", vibe: "Current brand — bright orange", theme: DEFAULT_THEME },
  {
    id: "midnight", name: "Midnight", vibe: "Dark, premium tech",
    theme: { ...DEFAULT_THEME, radius: 0.75, headingFont: "Sora", bodyFont: "Inter",
      colors: { background: "#0b0f1a", foreground: "#e5e7eb", card: "#111827", cardForeground: "#e5e7eb", primary: "#3b82f6", primaryForeground: "#ffffff", secondary: "#1f2937", secondaryForeground: "#e5e7eb", muted: "#1f2937", mutedForeground: "#9ca3af", accent: "#22d3ee", accentForeground: "#0b0f1a", border: "#1f2937", ring: "#3b82f6" } },
  },
  {
    id: "slate", name: "Slate", vibe: "Neutral, corporate",
    theme: { ...DEFAULT_THEME, radius: 0.375, headingFont: "Space Grotesk", bodyFont: "DM Sans",
      colors: { ...DEFAULT_THEME.colors, primary: "#0f172a", primaryForeground: "#ffffff", accent: "#0f172a", ring: "#0f172a", foreground: "#0f172a", mutedForeground: "#64748b" } },
  },
  {
    id: "emerald", name: "Emerald", vibe: "Fresh, growth",
    theme: { ...DEFAULT_THEME, radius: 1, headingFont: "Manrope", bodyFont: "Inter",
      colors: { ...DEFAULT_THEME.colors, primary: "#059669", primaryForeground: "#ffffff", accent: "#10b981", ring: "#059669" } },
  },
];

export const templateById = (id?: string | null) => TEMPLATES.find((t) => t.id === id) || null;
