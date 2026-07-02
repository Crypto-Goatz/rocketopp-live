"use client";

import { useState } from "react";
import { BLOCK_LIBRARY, BLOCK_GROUPS, type Block, type HqPage } from "@/lib/hq/blocks";
import { BlockRegistry } from "@/components/hq/blocks/BlockRegistry";

type Msg = { role: "user" | "nova"; text: string };
const uid = () => "b" + Math.floor(Date.now() % 100000).toString(36);

const pane: React.CSSProperties = { background: "#141824", border: "1px solid #232838", borderRadius: 14 };

export default function NovaBuilder({ initialPages }: { initialPages: HqPage[] }) {
  const [pages, setPages] = useState<HqPage[]>(initialPages);
  const [active, setActive] = useState<HqPage | null>(initialPages[0] || null);
  const [blocks, setBlocks] = useState<Block[]>(initialPages[0]?.blocks || []);
  const [messages, setMessages] = useState<Msg[]>([{ role: "nova", text: "Hi, I'm Nova. Tell me what to build — e.g. \"add a hero, a 3-feature grid, and a pricing section\", or \"change the headline to 'AI systems that ship'.\"" }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<"nova" | "blocks">("nova");

  function selectPage(p: HqPage) { setActive(p); setBlocks(p.blocks || []); setMessages([{ role: "nova", text: `Editing “${p.title}”. What should I change?` }]); }

  async function persist(next: Block[]) {
    setBlocks(next);
    if (!active) return;
    await fetch("/api/hq/page", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: active.id, blocks: next }) }).catch(() => {});
  }

  async function createPage() {
    const title = prompt("Page title?", "New landing page");
    if (!title) return;
    const j = await (await fetch("/api/hq/page", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "create", title }) })).json();
    if (j.page) { setPages((p) => [j.page, ...p]); selectPage(j.page); }
  }

  function addBlock(type: string) {
    const meta = BLOCK_LIBRARY.find((b) => b.type === type);
    if (!meta || !active) return;
    persist([...blocks, { id: uid(), type, props: JSON.parse(JSON.stringify(meta.sample)) }]);
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir; if (j < 0 || j >= blocks.length) return;
    const next = [...blocks]; [next[i], next[j]] = [next[j], next[i]]; persist(next);
  }
  function remove(i: number) { persist(blocks.filter((_, k) => k !== i)); }

  async function send() {
    const text = input.trim(); if (!text || !active || busy) return;
    setInput(""); setMessages((m) => [...m, { role: "user", text }]); setBusy(true);
    try {
      const j = await (await fetch("/api/hq/nova", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pageId: active.id, message: text }) })).json();
      if (Array.isArray(j.blocks)) setBlocks(j.blocks);
      setMessages((m) => [...m, { role: "nova", text: j.reply || "Done." }]);
    } catch { setMessages((m) => [...m, { role: "nova", text: "Something went wrong — try again." }]); }
    finally { setBusy(false); }
  }

  async function publish() {
    if (!active) return;
    await fetch("/api/hq/page", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: active.id, status: "published" }) });
    setActive({ ...active, status: "published" });
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "300px 380px 1fr", gap: 16 }}>
      {/* Pages list */}
      <div style={{ ...pane, padding: 14, height: "fit-content" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#8b93a7" }}>Pages</span>
          <button onClick={createPage} style={{ background: "#ff571a", color: "#fff", border: 0, borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>+ New</button>
        </div>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
          {pages.length === 0 ? <p style={{ fontSize: 12, color: "#8b93a7" }}>No pages yet. Create one to start.</p> : null}
          {pages.map((p) => (
            <button key={p.id} onClick={() => selectPage(p)} style={{ textAlign: "left", background: active?.id === p.id ? "#1f2740" : "transparent", border: "1px solid #232838", borderRadius: 8, padding: "8px 10px", cursor: "pointer" }}>
              <span style={{ display: "block", fontSize: 13, color: "#e5e7eb" }}>{p.title}</span>
              <span style={{ fontSize: 11, color: "#8b93a7" }}>/p/{p.slug} · {p.status}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Nova + blocks */}
      <div style={{ ...pane, display: "flex", flexDirection: "column", minHeight: 520 }}>
        <div style={{ display: "flex", gap: 6, padding: 12, borderBottom: "1px solid #232838" }}>
          {(["nova", "blocks"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, background: tab === t ? "#ff571a" : "transparent", color: tab === t ? "#fff" : "#8b93a7", border: 0, borderRadius: 8, padding: "6px 0", fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>{t === "nova" ? "Nova" : "Block library"}</button>
          ))}
        </div>

        {!active ? (
          <p style={{ padding: 20, fontSize: 13, color: "#8b93a7" }}>Select or create a page to begin.</p>
        ) : tab === "nova" ? (
          <>
            <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              {messages.map((m, i) => (
                <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "88%", background: m.role === "user" ? "#ff571a" : "#0b0d14", color: m.role === "user" ? "#fff" : "#e5e7eb", borderRadius: 12, padding: "8px 12px", fontSize: 13 }}>{m.text}</div>
              ))}
              {busy ? <div style={{ alignSelf: "flex-start", color: "#8b93a7", fontSize: 12 }}>Nova is working…</div> : null}
            </div>
            <div style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px solid #232838" }}>
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Describe a change…" style={{ flex: 1, background: "#0b0d14", border: "1px solid #232838", borderRadius: 8, padding: "8px 10px", color: "#e5e7eb", fontSize: 13 }} />
              <button onClick={send} disabled={busy} style={{ background: "#ff571a", color: "#fff", border: 0, borderRadius: 8, padding: "0 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Send</button>
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
            <button onClick={publish} style={{ background: active.status === "published" ? "#059669" : "#ff571a", color: "#fff", border: 0, borderRadius: 999, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{active.status === "published" ? "✓ Published" : "Publish"}</button>
          </div>
        ) : null}

        {/* Outline (reorder/remove) */}
        {active && blocks.length > 0 ? (
          <div style={{ ...pane, padding: 10 }}>
            {blocks.map((b, i) => (
              <div key={b.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 6px", fontSize: 12, color: "#c3c9d6" }}>
                <span style={{ textTransform: "capitalize" }}>{b.type}</span>
                <span style={{ display: "flex", gap: 4 }}>
                  <button onClick={() => move(i, -1)} style={{ background: "transparent", border: "1px solid #232838", borderRadius: 6, color: "#8b93a7", cursor: "pointer", padding: "0 6px" }}>↑</button>
                  <button onClick={() => move(i, 1)} style={{ background: "transparent", border: "1px solid #232838", borderRadius: 6, color: "#8b93a7", cursor: "pointer", padding: "0 6px" }}>↓</button>
                  <button onClick={() => remove(i)} style={{ background: "transparent", border: "1px solid #232838", borderRadius: 6, color: "#ef4444", cursor: "pointer", padding: "0 6px" }}>✕</button>
                </span>
              </div>
            ))}
          </div>
        ) : null}

        <div style={{ border: "1px solid #232838", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ background: "#141824", padding: "8px 14px", fontSize: 12, color: "#8b93a7" }}>Live preview</div>
          <div className="bg-background text-foreground" style={{ maxHeight: "72vh", overflowY: "auto" }}>
            {blocks.length ? <BlockRegistry blocks={blocks} pageId={active?.id} /> : <p style={{ padding: 40, textAlign: "center", color: "#8b93a7", fontSize: 13 }}>Empty page. Ask Nova to build something, or add blocks from the library.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
