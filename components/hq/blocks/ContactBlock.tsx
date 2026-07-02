"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactBlock({ p, pageId }: { p: Record<string, unknown>; pageId?: string }) {
  const s = (k: string) => (p[k] as string) || "";
  const [f, setF] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await fetch("/api/hq/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, pageId }) }).catch(() => {});
      setSent(true);
    } finally { setBusy(false); }
  }

  return (
    <section className="mx-auto max-w-xl px-6 py-20">
      <h2 className="text-center text-3xl font-semibold text-foreground">{s("heading") || "Get in touch"}</h2>
      {s("subhead") ? <p className="mt-2 text-center text-muted-foreground">{s("subhead")}</p> : null}
      {sent ? (
        <p className="mt-8 rounded-lg border bg-card p-8 text-center text-muted-foreground">Thanks — we&apos;ll be in touch shortly.</p>
      ) : (
        <form onSubmit={submit} className="mt-8 space-y-3">
          <Input required placeholder="Your name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          <Input required type="email" placeholder="Email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
          <Textarea rows={4} placeholder="How can we help?" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} />
          <Button type="submit" disabled={busy} className="w-full">{busy ? "Sending…" : (s("buttonLabel") || "Send message")}</Button>
        </form>
      )}
    </section>
  );
}
