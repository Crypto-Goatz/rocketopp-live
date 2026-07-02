"use client";

import { useState } from "react";
import { BLOCK_LIBRARY, BLOCK_GROUPS, type Block, type HqPage } from "@/lib/hq/blocks";
import { BlockRegistry } from "@/components/hq/blocks/BlockRegistry";

type Msg = { role: "user" | "nova"; text: string; spec?: string };
const uid = () => "b" + Math.floor(Date.now() % 100000).toString(36) + Math.floor(Math.random() * 900 + 100);

const pane: React.CSSProperties = { background: "#141824", border: "1px solid #232838", borderRadius: 14 };
const inp: React.CSSProperties = { background: "#0b0d14", border: "1px solid #232838", borderRadius: 8, padding: "6px 8px", color: "#e5e7eb", fontSize: 12, width: "100%" };
const btn = (bg = "#ff571a"): React.CSSProperties => ({ background: bg, color: "#fff", border: 0, borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" });

type Style = { bg?: string; color?: string; paddingY?: string; align?: string; maxWidth?: string; radius?: string };

export default function NovaBuilder({ initialPages }: { initialPages: HqPage[] }) {
  const [pages, setPages] = useState<HqPage[]>(initialPages);
  const [active, setActive] = useState<HqPage | null>(initialPages[0] || null);
  const [blocks, setBlocks] = useState<Block[]>(initialPages[0]?.blocks || []);
  const [messages, setMessages] = useState<Msg[]>([{ role: "nova", text: "Hi, I'm Nova. Describe what to build — sections, layouts, or a custom app. I'll build it, or hand you a spec for Claude if it's beyond a single block." }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<"nova" | "blocks">("nova");

  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editJson, setEditJson] = useState("");
  const [editStyle, setEditStyle] = useState<Style>({});
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [setTitle, setSetTitle] = useState(""); const [setSeo, setSetSeo] = useState("");

  function selectPage(p: HqPage) { setActive(p); setBlocks(p.blocks || []); setEditIdx(null); setMessages([{ role: "nova", text: `Editing “${p.title}”. What should I change?` }]); }

  async function persist(next: Block[]) {
    setBlocks(next);
    if (active) await fetch("/api/hq/page", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: active.id, blocks: next }) }).catch(() => {});
  }

  async function createPage() {
    const title = prompt("Page title?", "New landing page"); if (!title) return;
    const j = await (await fetch("/api/hq/page", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "create", title }) })).json();
    if (j.page) { setPages((p) => [j.page, ...p]); selectPage(j.page); }
  }

  function addBlock(type: string) {
    const meta = BLOCK_LIBRARY.find((b) => b.type === type); if (!meta || !active) return;
    persist([...blocks, { id: uid(), type, props: JSON.parse(JSON.stringify(meta.sample)) }]);
  }
  function remove(i: number) { if (editIdx === i) setEditIdx(null); persist(blocks.filter((_, k) => k !== i)); }

  // drag + drop reorder
  function onDrop(target: number) {
    if (dragIdx === null || dragIdx === target) return;
    const next = [...blocks]; const [m] = next.splice(dragIdx, 1); next.splice(target, 0, m);
    setDragIdx(null); persist(next);
  }

  // per-block edit
  function openEdit(i: number) {
    const b = blocks[i]; const { style, ...rest } = (b.props || {}) as Record<string, unknown>;
    setEditIdx(i); setEditStyle((style as Style) || {}); setEditJson(JSON.stringify(rest, null, 2));
  }
  function saveEdit() {
    if (editIdx === null) return;
    let props: Record<string, unknown>;
    try { props = JSON.parse(editJson || "{}"); } catch { alert("Content JSON is invalid — please fix."); return; }
    if (Object.keys(editStyle).length) props.style = editStyle;
    const next = blocks.map((b, k) => (k === editIdx ? { ...b, props } : b));
    setEditIdx(null); persist(next);
  }

  async function send() {
    const text = input.trim(); if (!text || !active || busy) return;
    setInput(""); setMessages((m) => [...m, { role: "user", text }]); setBusy(true);
    try {
      const j = await (await fetch("/api/hq/nova", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pageId: active.id, message: text }) })).json();
      if (Array.isArray(j.blocks)) setBlocks(j.blocks);
      setMessages((m) => [...m, { role: "nova", text: j.reply || "Done.", spec: j.spec }]);
    } catch { setMessages((m) => [...m, { role: "nova", text: "Something went wrong — try again." }]); }
    finally { setBusy(false); }
  }

  function downloadSpec(spec: string) {
    const blob = new Blob([spec], { type: "text/markdown" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `nova-build-spec-${Date.now()}.md`; a.click();
  }

  function insertCustom() {
    if (!active) return;
    const url = prompt("Paste an app/widget URL to embed, or leave blank to paste raw HTML:");
    if (url === null) return;
    if (url.trim()) { persist([...blocks, { id: uid(), type: "embed", props: { url: url.trim(), height: 480, title: "Embedded app" } }]); return; }
    const html = prompt("Paste HTML (e.g. a component Claude generated):");
    if (html && html.trim()) persist([...blocks, { id: uid(), type: "html", props: { html: html.trim() } }]);
  }

  async function publish() {
    if (!active) return;
    await fetch("/api/hq/page", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: active.id, status: "published" }) });
    setActive({ ...active, status: "published" });
    setPages((ps) => ps.map((p) => (p.id === active.id ? { ...p, status: "published" } : p)));
  }

  function openSettings() { if (!active) return; setSetTitle(active.title); setSetSeo(((active as any).seo?.description) || ""); setSettingsOpen(true); }
  async function saveSettings() {
    if (!active) return;
    await fetch("/api/hq/page", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: active.id, title: setTitle, seo: { description: setSeo } }) });
    setActive({ ...active, title: setTitle }); setPages((ps) => ps.map((p) => (p.id === active.id ? { ...p, title: setTitle } : p))); setSettingsOpen(false);
  }

  const styleSel = (k: keyof Style, opts: [string, string][]) => (
    <select value={editStyle[k] || ""} onChange={(e) => setEditStyle((s) => ({ ...s, [k]: e.target.value || undefined }))} style={{ ...inp, width: "auto" }}>
      <option value="">default</option>{opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "300px 380px 1fr", gap: 16 }}>
      {/* Pages */}
      <div style={{ ...pane, padding: 14, height: "fit-content" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#8b93a7" }}>Design queue</span>
          <button onClick={createPage} style={btn()}>+ New</button>
        </div>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
          {pages.length === 0 ? <p style={{ fontSize: 12, color: "#8b93a7" }}>No pages yet.</p> : null}
          {pages.map((p) => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 6, background: active?.id === p.id ? "#1f2740" : "transparent", border: "1px solid #232838", borderRadius: 8, padding: "6px 8px" }}>
              <button onClick={() => selectPage(p)} style={{ flex: 1, textAlign: "left", background: "transparent", border: 0, cursor: "pointer" }}>
                <span style={{ display: "block", fontSize: 13, color: "#e5e7eb" }}>{p.title}</span>
                <span style={{ fontSize: 11, color: "#8b93a7" }}>/p/{p.slug} · {p.status}</span>
              </button>
              <button title="Page & global settings" onClick={() => { selectPage(p); setTimeout(openSettings, 0); }} style={{ background: "transparent", border: 0, color: "#8b93a7", cursor: "pointer", fontSize: 15 }}>⚙</button>
            </div>
          ))}
        </div>
        <a href="/hq" style={{ display: "block", marginTop: 12, fontSize: 12, color: "#8b93a7" }}>⚙ Global design settings →</a>
      </div>

      {/* Nova / palette / edit */}
      <div style={{ ...pane, display: "flex", flexDirection: "column", minHeight: 560 }}>
        <div style={{ display: "flex", gap: 6, padding: 12, borderBottom: "1px solid #232838" }}>
          {(["nova", "blocks"] as const).map((t) => (
            <button key={t} onClick={() => { setTab(t); setEditIdx(null); }} style={{ flex: 1, ...btn(tab === t ? "#ff571a" : "transparent"), color: tab === t ? "#fff" : "#8b93a7", textTransform: "capitalize" }}>{t === "nova" ? "Nova" : "Blocks"}</button>
          ))}
          <button onClick={insertCustom} title="Insert HTML or embed a URL" style={{ ...btn("transparent"), color: "#8b93a7" }}>+ Code</button>
        </div>

        {editIdx !== null ? (
          <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#e5e7eb", textTransform: "capitalize" }}>Edit: {blocks[editIdx]?.type}</span>
              <button onClick={() => setEditIdx(null)} style={{ ...btn("transparent"), color: "#8b93a7" }}>✕ close</button>
            </div>
            <p style={{ fontSize: 11, color: "#8b93a7", marginBottom: 6 }}>Style</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
              <label style={{ fontSize: 11, color: "#c3c9d6" }}>Background<br /><input type="color" value={editStyle.bg || "#101320"} onChange={(e) => setEditStyle((s) => ({ ...s, bg: e.target.value }))} /></label>
              <label style={{ fontSize: 11, color: "#c3c9d6" }}>Text color<br /><input type="color" value={editStyle.color || "#f2f2f2"} onChange={(e) => setEditStyle((s) => ({ ...s, color: e.target.value }))} /></label>
              <label style={{ fontSize: 11, color: "#c3c9d6" }}>Padding{styleSel("paddingY", [["none", "None"], ["sm", "Small"], ["md", "Default"], ["lg", "Large"], ["xl", "XL"]])}</label>
              <label style={{ fontSize: 11, color: "#c3c9d6" }}>Align{styleSel("align", [["left", "Left"], ["center", "Center"], ["right", "Right"]])}</label>
              <label style={{ fontSize: 11, color: "#c3c9d6" }}>Max width{styleSel("maxWidth", [["sm", "Narrow"], ["md", "Medium"], ["lg", "Wide"], ["full", "Full"]])}</label>
              <label style={{ fontSize: 11, color: "#c3c9d6" }}>Radius{styleSel("radius", [["none", "None"], ["md", "Medium"], ["lg", "Large"], ["xl", "XL"]])}</label>
            </div>
            <p style={{ fontSize: 11, color: "#8b93a7", marginBottom: 6 }}>Content (JSON)</p>
            <textarea value={editJson} onChange={(e) => setEditJson(e.target.value)} rows={12} style={{ ...inp, fontFamily: "monospace", fontSize: 11 }} />
            <button onClick={saveEdit} style={{ ...btn(), marginTop: 10, width: "100%" }}>Save block</button>
          </div>
        ) : tab === "nova" ? (
          <>
            <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              {messages.map((m, i) => (
                <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "90%" }}>
                  <div style={{ background: m.role === "user" ? "#ff571a" : "#0b0d14", color: m.role === "user" ? "#fff" : "#e5e7eb", borderRadius: 12, padding: "8px 12px", fontSize: 13 }}>{m.text}</div>
                  {m.spec ? <button onClick={() => downloadSpec(m.spec!)} style={{ ...btn("#059669"), marginTop: 6 }}>⬇ Download build spec for Claude (.md)</button> : null}
                </div>
              ))}
              {busy ? <div style={{ color: "#8b93a7", fontSize: 12 }}>Nova is working…</div> : null}
            </div>
            <div style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px solid #232838" }}>
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Describe a change or a custom app…" style={inp} />
              <button onClick={send} disabled={busy} style={btn()}>Send</button>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
            {BLOCK_GROUPS.map((g) => (
              <div key={g} style={{ marginBottom: 14 }}>
                <p style={{ fontSize: 11, color: "#8b93a7", fontWeight: 600, marginBottom: 6 }}>{g}</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {BLOCK_LIBRARY.filter((b) => b.group === g).map((b) => (
                    <button key={b.type} onClick={() => addBlock(b.type)} title={b.description} style={{ textAlign: "left", background: "#0b0d14", border: "1px solid #232838", borderRadius: 8, padding: 8, cursor: "pointer" }}>
                      <span style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#e5e7eb" }}>{b.name}</span>
                      <span style={{ fontSize: 10, color: "#8b93a7" }}>+ add</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview + outline */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {active ? (
          <div style={{ ...pane, padding: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "#8b93a7" }}>Preview · <a href={`/p/${active.slug}`} target="_blank" style={{ color: "#ff571a" }}>/p/{active.slug} ↗</a></span>
            <span style={{ display: "flex", gap: 8 }}>
              <button onClick={openSettings} style={{ ...btn("transparent"), color: "#8b93a7" }}>⚙ Settings</button>
              <button onClick={publish} style={btn(active.status === "published" ? "#059669" : "#ff571a")}>{active.status === "published" ? "✓ Published" : "Publish"}</button>
            </span>
          </div>
        ) : null}

        {active && blocks.length > 0 ? (
          <div style={{ ...pane, padding: 10 }}>
            <p style={{ fontSize: 11, color: "#8b93a7", marginBottom: 6 }}>Modules · drag to reorder</p>
            {blocks.map((b, i) => (
              <div key={b.id} draggable onDragStart={() => setDragIdx(i)} onDragOver={(e) => e.preventDefault()} onDrop={() => onDrop(i)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 8px", marginBottom: 4, background: dragIdx === i ? "#1f2740" : "#0b0d14", border: "1px solid #232838", borderRadius: 8, cursor: "grab" }}>
                <span style={{ fontSize: 12, color: "#c3c9d6", textTransform: "capitalize" }}>⠿ {b.type}</span>
                <span style={{ display: "flex", gap: 4 }}>
                  <button onClick={() => openEdit(i)} title="Edit styles & content" style={{ ...btn("transparent"), color: "#8b93a7", padding: "0 6px" }}>✎</button>
                  <button onClick={() => remove(i)} title="Remove" style={{ ...btn("transparent"), color: "#ef4444", padding: "0 6px" }}>✕</button>
                </span>
              </div>
            ))}
          </div>
        ) : null}

        <div style={{ border: "1px solid #232838", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ background: "#141824", padding: "8px 14px", fontSize: 12, color: "#8b93a7" }}>Live preview</div>
          <div className="bg-background text-foreground" style={{ maxHeight: "72vh", overflowY: "auto" }}>
            {blocks.length ? <BlockRegistry blocks={blocks} pageId={active?.id} /> : <p style={{ padding: 40, textAlign: "center", color: "#8b93a7", fontSize: 13 }}>Empty page. Ask Nova, or add blocks.</p>}
          </div>
        </div>
      </div>

      {/* Page settings modal */}
      {settingsOpen && active ? (
        <div onClick={() => setSettingsOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ ...pane, padding: 20, width: 420 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Page settings</h3>
            <label style={{ fontSize: 12, color: "#8b93a7" }}>Title<input value={setTitle} onChange={(e) => setSetTitle(e.target.value)} style={{ ...inp, marginTop: 4 }} /></label>
            <label style={{ fontSize: 12, color: "#8b93a7", display: "block", marginTop: 10 }}>SEO description<textarea value={setSeo} onChange={(e) => setSetSeo(e.target.value)} rows={3} style={{ ...inp, marginTop: 4 }} /></label>
            <p style={{ fontSize: 11, color: "#8b93a7", marginTop: 10 }}>Slug: /p/{active.slug} · <a href="/hq" style={{ color: "#ff571a" }}>Global design settings →</a></p>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
              <button onClick={() => setSettingsOpen(false)} style={{ ...btn("transparent"), color: "#8b93a7" }}>Cancel</button>
              <button onClick={saveSettings} style={btn()}>Save</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
