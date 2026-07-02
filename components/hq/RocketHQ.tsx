"use client";

import { useState } from "react";
import { TEMPLATES, themeToTokens, type HqTheme, type FontKey, FONTS } from "@/lib/hq/theme";

const COLOR_LABELS: [keyof HqTheme["colors"], string][] = [
  ["background", "Background"], ["foreground", "Body text"],
  ["card", "Card"], ["cardForeground", "Card text"],
  ["primary", "Primary"], ["primaryForeground", "Primary text"],
  ["secondary", "Secondary"], ["secondaryForeground", "Secondary text"],
  ["muted", "Muted"], ["mutedForeground", "Muted text"],
  ["accent", "Accent"], ["accentForeground", "Accent text"],
  ["border", "Border"], ["ring", "Focus ring"],
];

const panel: React.CSSProperties = { background: "#141824", border: "1px solid #232838", borderRadius: 14, padding: 16 };
const label: React.CSSProperties = { fontSize: 12, color: "#8b93a7", fontWeight: 600 };

export default function RocketHQ({ initialTheme }: { initialTheme: HqTheme }) {
  const [theme, setTheme] = useState<HqTheme>(initialTheme);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState("https://rocketopp.com");
  const [assessing, setAssessing] = useState(false);
  const [report, setReport] = useState<any>(null);

  const setColor = (k: keyof HqTheme["colors"], v: string) => { setTheme((t) => ({ ...t, colors: { ...t.colors, [k]: v } })); setSaved(false); };
  const set = <K extends keyof HqTheme>(k: K, v: HqTheme[K]) => { setTheme((t) => ({ ...t, [k]: v })); setSaved(false); };

  async function assess() {
    if (!/^https?:\/\//.test(url)) return;
    setAssessing(true); setReport(null);
    try {
      const j = await (await fetch("/api/hq/assess", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) })).json();
      setReport(j);
    } finally { setAssessing(false); }
  }
  function applyAssessment() { if (report?.suggestedTheme) { setTheme(report.suggestedTheme); setSaved(false); } }

  async function save() {
    setBusy(true);
    try {
      const j = await (await fetch("/api/hq/theme", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ theme }) })).json();
      if (j.ok) setSaved(true);
    } finally { setBusy(false); }
  }

  const previewVars = themeToTokens(theme) as React.CSSProperties;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 20 }}>
      {/* Controls */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Assess */}
        <div style={panel}>
          <p style={label}>Assess a site</p>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <input value={url} onChange={(e) => setUrl(e.target.value)} style={{ flex: 1, background: "#0b0d14", border: "1px solid #232838", borderRadius: 8, padding: "8px 10px", color: "#e5e7eb", fontSize: 12 }} />
            <button onClick={assess} disabled={assessing} style={{ background: "#ff571a", color: "#fff", border: 0, borderRadius: 8, padding: "0 12px", fontSize: 12, fontWeight: 600 }}>{assessing ? "Reading…" : "Assess"}</button>
          </div>
          {report?.report ? (
            <div style={{ marginTop: 10, fontSize: 12, color: "#c3c9d6", display: "flex", flexDirection: "column", gap: 4 }}>
              {report.report.brand ? <p><b>{report.report.brand.name}</b> · {report.report.brand.industry}</p> : null}
              {(report.report.conversionKillers || []).slice(0, 3).map((k: any, i: number) => <p key={i}>⚠️ <b>{k.impact}</b>: {k.issue}</p>)}
              <button onClick={applyAssessment} style={{ marginTop: 4, alignSelf: "start", background: "#059669", color: "#fff", border: 0, borderRadius: 999, padding: "6px 12px", fontSize: 12, fontWeight: 600 }}>Apply learned theme →</button>
            </div>
          ) : null}
        </div>

        {/* Templates */}
        <div style={panel}>
          <p style={label}>Template</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
            {TEMPLATES.map((t) => (
              <button key={t.id} onClick={() => { setTheme(t.theme); setSaved(false); }} style={{ textAlign: "left", background: "#0b0d14", border: "1px solid #232838", borderRadius: 10, padding: 8, cursor: "pointer" }}>
                <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#e5e7eb" }}>{t.name}</span>
                <span style={{ fontSize: 11, color: "#8b93a7" }}>{t.vibe}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div style={panel}>
          <p style={label}>Colors</p>
          <div style={{ marginTop: 8 }}>
            {COLOR_LABELS.map(([k, lbl]) => (
              <div key={k} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 0" }}>
                <span style={{ fontSize: 12, color: "#c3c9d6" }}>{lbl}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input type="color" value={theme.colors[k]} onChange={(e) => setColor(k, e.target.value)} style={{ width: 30, height: 24, border: 0, background: "none", cursor: "pointer" }} />
                  <input value={theme.colors[k]} onChange={(e) => setColor(k, e.target.value)} style={{ width: 78, background: "#0b0d14", border: "1px solid #232838", borderRadius: 6, padding: "4px 6px", color: "#e5e7eb", fontSize: 11 }} />
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Type + radius */}
        <div style={panel}>
          <p style={label}>Typography & shape</p>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "#c3c9d6" }}>Heading font</span>
              <select value={theme.headingFont} onChange={(e) => set("headingFont", e.target.value as FontKey)} style={{ background: "#0b0d14", border: "1px solid #232838", borderRadius: 6, padding: "4px 6px", color: "#e5e7eb", fontSize: 12 }}>{FONTS.map((f) => <option key={f} value={f}>{f}</option>)}</select>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "#c3c9d6" }}>Body font</span>
              <select value={theme.bodyFont} onChange={(e) => set("bodyFont", e.target.value as FontKey)} style={{ background: "#0b0d14", border: "1px solid #232838", borderRadius: 6, padding: "4px 6px", color: "#e5e7eb", fontSize: 12 }}>{FONTS.map((f) => <option key={f} value={f}>{f}</option>)}</select>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 12, color: "#c3c9d6" }}>Corner radius</span>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="range" min={0} max={2} step={0.125} value={theme.radius} onChange={(e) => set("radius", Number(e.target.value))} />
                <span style={{ fontSize: 11, color: "#8b93a7", width: 42 }}>{theme.radius}rem</span>
              </span>
            </div>
          </div>
        </div>

        <button onClick={save} disabled={busy} style={{ background: saved ? "#059669" : "#ff571a", color: "#fff", border: 0, borderRadius: 999, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          {busy ? "Saving…" : saved ? "✓ Saved — live on rocketopp.com" : "Save & apply site-wide"}
        </button>
      </div>

      {/* Live preview */}
      <div style={{ position: "sticky", top: 20, height: "fit-content", border: "1px solid #232838", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ background: "#141824", padding: "8px 14px", fontSize: 12, color: "#8b93a7" }}>Live preview</div>
        <div style={{ ...previewVars, background: "hsl(var(--background))", color: "hsl(var(--foreground))", maxHeight: "72vh", overflowY: "auto", fontFamily: theme.bodyFont === "system" ? "system-ui" : theme.bodyFont }}>
          <div style={{ padding: "56px 40px", textAlign: "center" }}>
            <p style={{ fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase", color: "hsl(var(--muted-foreground))" }}>Preview</p>
            <h1 style={{ marginTop: 12, fontSize: 40, fontWeight: 800, color: "hsl(var(--foreground))", fontFamily: theme.headingFont === "system" ? "system-ui" : theme.headingFont }}>Enterprise AI. Startup speed.</h1>
            <p style={{ margin: "14px auto 0", maxWidth: 460, color: "hsl(var(--muted-foreground))" }}>Every control on the left restyles the entire site instantly.</p>
            <div style={{ marginTop: 22, display: "flex", gap: 10, justifyContent: "center" }}>
              <span style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))", borderRadius: `${theme.radius}rem`, padding: "10px 22px", fontSize: 14, fontWeight: 600 }}>Primary button</span>
              <span style={{ background: "hsl(var(--secondary))", color: "hsl(var(--secondary-foreground))", borderRadius: `${theme.radius}rem`, padding: "10px 22px", fontSize: 14, fontWeight: 600 }}>Secondary</span>
            </div>
          </div>
          <div style={{ padding: "0 40px 48px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            {["Websites", "AI Systems", "CRM"].map((t) => (
              <div key={t} style={{ background: "hsl(var(--card))", color: "hsl(var(--card-foreground))", border: "1px solid hsl(var(--border))", borderRadius: `${theme.radius}rem`, padding: 20 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, fontFamily: theme.headingFont === "system" ? "system-ui" : theme.headingFont }}>{t}</h3>
                <p style={{ marginTop: 8, fontSize: 13, color: "hsl(var(--muted-foreground))" }}>A themed card following your global tokens.</p>
                <span style={{ display: "inline-block", marginTop: 12, color: "hsl(var(--accent))", fontSize: 13, fontWeight: 600 }}>Learn more →</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
