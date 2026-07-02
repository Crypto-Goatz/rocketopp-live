import type { Block } from "@/lib/hq/blocks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check } from "lucide-react";
import { Icon } from "./icon";
import ContactBlock from "./ContactBlock";

type P = Record<string, unknown>;
type Cta = { label?: string; href?: string };
const S = (p: P, k: string) => (p[k] as string) || "";
const cta = (c: unknown) => (c as Cta) || null;

type Style = { bg?: string; color?: string; paddingY?: string; align?: string; maxWidth?: string; radius?: string };
const PADY: Record<string, string> = { none: "0", sm: "24px", md: "0", lg: "80px", xl: "128px" };
const MAXW: Record<string, string> = { sm: "42rem", md: "56rem", lg: "72rem", full: "100%" };
const RAD: Record<string, string> = { none: "0", md: "12px", lg: "18px", xl: "28px" };

// Applies per-block style overrides to any block's output.
function Wrap({ style, children }: { style?: Style; children: React.ReactNode }) {
  if (!style || Object.keys(style).length === 0) return <>{children}</>;
  const css: React.CSSProperties = {};
  if (style.bg) css.background = style.bg;
  if (style.color) css.color = style.color;
  if (style.paddingY && PADY[style.paddingY] !== undefined && style.paddingY !== "md") { css.paddingTop = PADY[style.paddingY]; css.paddingBottom = PADY[style.paddingY]; }
  if (style.align) css.textAlign = style.align as React.CSSProperties["textAlign"];
  if (style.radius && RAD[style.radius]) { css.borderRadius = RAD[style.radius]; css.overflow = "hidden"; }
  const inner = style.maxWidth && MAXW[style.maxWidth]
    ? <div style={{ maxWidth: MAXW[style.maxWidth], marginInline: "auto" }}>{children}</div>
    : children;
  return <div style={css}>{inner}</div>;
}

function Hero({ p }: { p: P }) {
  const primary = cta(p.primaryCta), secondary = cta(p.secondaryCta);
  const center = (p.align ?? "center") !== "left";
  return (
    <section className={`mx-auto max-w-5xl px-6 py-24 ${center ? "text-center" : ""}`}>
      {S(p, "eyebrow") ? <Badge variant="secondary" className="mb-4">{S(p, "eyebrow")}</Badge> : null}
      <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-6xl">{S(p, "headline")}</h1>
      {S(p, "subhead") ? <p className={`mt-5 text-lg text-muted-foreground ${center ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>{S(p, "subhead")}</p> : null}
      {(primary || secondary) ? (
        <div className={`mt-8 flex gap-3 ${center ? "justify-center" : ""}`}>
          {primary?.label ? <Button asChild size="lg"><a href={primary.href || "#"}>{primary.label}</a></Button> : null}
          {secondary?.label ? <Button asChild size="lg" variant="outline"><a href={secondary.href || "#"}>{secondary.label}</a></Button> : null}
        </div>
      ) : null}
    </section>
  );
}

function Features({ p }: { p: P }) {
  const items = (p.items as { icon?: string; title: string; desc: string }[]) || [];
  const cols = (p.columns as number) || 3;
  const colClass = cols === 2 ? "lg:grid-cols-2" : cols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      {S(p, "title") ? <h2 className="mb-3 text-center text-3xl font-semibold text-foreground">{S(p, "title")}</h2> : null}
      {S(p, "subtitle") ? <p className="mx-auto mb-10 max-w-2xl text-center text-muted-foreground">{S(p, "subtitle")}</p> : <div className="mb-10" />}
      <div className={`grid gap-6 md:grid-cols-2 ${colClass}`}>
        {items.map((it, i) => (
          <Card key={i}><CardContent className="pt-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon name={it.icon} className="h-5 w-5" /></div>
            <h3 className="text-lg font-semibold text-foreground">{it.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{it.desc}</p>
          </CardContent></Card>
        ))}
      </div>
    </section>
  );
}

function Stats({ p }: { p: P }) {
  const items = (p.items as { value: string; label: string }[]) || [];
  return (
    <section className="border-y bg-muted/30 py-14">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
        {items.map((it, i) => (
          <div key={i} className="text-center">
            <div className="text-4xl font-bold text-primary">{it.value}</div>
            <div className="mt-1 text-sm text-muted-foreground">{it.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Steps({ p }: { p: P }) {
  const items = (p.items as { title: string; desc: string }[]) || [];
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      {S(p, "title") ? <h2 className="mb-10 text-center text-3xl font-semibold text-foreground">{S(p, "title")}</h2> : null}
      <div className="grid gap-8 md:grid-cols-3">
        {items.map((it, i) => (
          <div key={i}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">{i + 1}</div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">{it.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{it.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Pricing({ p }: { p: P }) {
  const tiers = (p.tiers as { name: string; price: string; period?: string; features?: string[]; cta?: Cta; highlight?: boolean }[]) || [];
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      {S(p, "title") ? <h2 className="mb-10 text-center text-3xl font-semibold text-foreground">{S(p, "title")}</h2> : null}
      <div className="grid gap-5 md:grid-cols-3">
        {tiers.map((t, i) => (
          <Card key={i} className={t.highlight ? "border-primary shadow-lg" : ""}>
            <CardContent className="pt-6">
              {t.highlight ? <Badge className="mb-2">Most popular</Badge> : null}
              <h3 className="text-lg font-semibold text-foreground">{t.name}</h3>
              <p className="mt-1 text-3xl font-bold text-foreground">{t.price}{t.period ? <span className="text-sm font-normal text-muted-foreground">/{t.period}</span> : null}</p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {(t.features || []).map((f) => <li key={f} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{f}</li>)}
              </ul>
              {t.cta?.label ? <Button asChild className="mt-6 w-full" variant={t.highlight ? "default" : "outline"}><a href={t.cta.href || "#"}>{t.cta.label}</a></Button> : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Testimonials({ p }: { p: P }) {
  const items = (p.items as { quote: string; author: string; role?: string }[]) || [];
  return (
    <section className="bg-muted/30 py-20">
      <div className="mx-auto max-w-6xl px-6">
        {S(p, "title") ? <h2 className="mb-10 text-center text-3xl font-semibold text-foreground">{S(p, "title")}</h2> : null}
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((it, i) => (
            <Card key={i}><CardContent className="pt-6">
              <p className="text-sm leading-relaxed text-foreground">“{it.quote}”</p>
              <p className="mt-4 text-sm font-semibold text-foreground">{it.author}{it.role ? <span className="font-normal text-muted-foreground"> · {it.role}</span> : null}</p>
            </CardContent></Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Logos({ p }: { p: P }) {
  const logos = (p.logos as { name: string }[]) || [];
  return (
    <section className="mx-auto max-w-5xl px-6 py-14">
      {S(p, "title") ? <p className="mb-6 text-center text-sm text-muted-foreground">{S(p, "title")}</p> : null}
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {logos.map((l, i) => <span key={i} className="text-xl font-semibold text-muted-foreground/70">{l.name}</span>)}
      </div>
    </section>
  );
}

function Faq({ p }: { p: P }) {
  const items = (p.items as { q: string; a: string }[]) || [];
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      {S(p, "title") ? <h2 className="mb-8 text-center text-3xl font-semibold text-foreground">{S(p, "title")}</h2> : null}
      <Accordion type="single" collapsible className="w-full">
        {items.map((it, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger className="text-left">{it.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{it.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

function CtaBlock({ p }: { p: P }) {
  const c = cta(p.cta), sec = cta(p.secondary);
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-4xl rounded-2xl bg-primary px-8 py-14 text-center text-primary-foreground">
        <h2 className="text-3xl font-semibold">{S(p, "headline")}</h2>
        {S(p, "subhead") ? <p className="mx-auto mt-3 max-w-xl opacity-90">{S(p, "subhead")}</p> : null}
        <div className="mt-7 flex justify-center gap-3">
          {c?.label ? <Button asChild size="lg" variant="secondary"><a href={c.href || "#"}>{c.label}</a></Button> : null}
          {sec?.label ? <Button asChild size="lg" variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"><a href={sec.href || "#"}>{sec.label}</a></Button> : null}
        </div>
      </div>
    </section>
  );
}

function RichText({ p }: { p: P }) {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      {S(p, "heading") ? <h2 className="text-2xl font-semibold text-foreground">{S(p, "heading")}</h2> : null}
      {S(p, "body") ? <p className="mt-4 leading-relaxed text-muted-foreground">{S(p, "body")}</p> : null}
    </section>
  );
}

function Gallery({ p }: { p: P }) {
  const images = (p.images as { src: string; caption?: string }[]) || [];
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      {S(p, "title") ? <h2 className="mb-10 text-center text-3xl font-semibold text-foreground">{S(p, "title")}</h2> : null}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {images.map((im, i) => <img key={i} src={im.src} alt={im.caption || ""} className="h-52 w-full rounded-lg object-cover" />)}
      </div>
    </section>
  );
}

function Team({ p }: { p: P }) {
  const members = (p.members as { name: string; role: string; avatar?: string }[]) || [];
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      {S(p, "title") ? <h2 className="mb-10 text-center text-3xl font-semibold text-foreground">{S(p, "title")}</h2> : null}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
        {members.map((m, i) => (
          <Card key={i}><CardContent className="flex flex-col items-center pt-6 text-center">
            <Avatar className="h-16 w-16">{m.avatar ? <AvatarImage src={m.avatar} alt={m.name} /> : null}<AvatarFallback>{m.name?.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
            <p className="mt-3 font-semibold text-foreground">{m.name}</p>
            <p className="text-sm text-muted-foreground">{m.role}</p>
          </CardContent></Card>
        ))}
      </div>
    </section>
  );
}

function TextBlock({ p }: { p: P }) {
  const align = (S(p, "align") || "left") as React.CSSProperties["textAlign"];
  return (
    <section className="mx-auto max-w-3xl px-6 py-12" style={{ textAlign: align }}>
      {S(p, "heading") ? <h2 className="text-2xl font-semibold text-foreground">{S(p, "heading")}</h2> : null}
      {S(p, "body") ? <p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">{S(p, "body")}</p> : null}
    </section>
  );
}

function ImageBlock({ p }: { p: P }) {
  if (!S(p, "src")) return null;
  return (
    <section className="mx-auto max-w-5xl px-6 py-10">
      <img src={S(p, "src")} alt={S(p, "alt")} className={`w-full object-cover ${p.rounded === false ? "" : "rounded-xl"}`} />
      {S(p, "caption") ? <p className="mt-2 text-center text-sm text-muted-foreground">{S(p, "caption")}</p> : null}
    </section>
  );
}

function Spacer({ p }: { p: P }) {
  const h: Record<string, string> = { sm: "24px", md: "48px", lg: "80px", xl: "128px" };
  return <div style={{ height: h[S(p, "size") || "md"] || "48px" }} />;
}

function Cell({ c }: { c: { kind: string; body?: string; src?: string; alt?: string; html?: string } }) {
  if (c.kind === "image" && c.src) return <img src={c.src} alt={c.alt || ""} className="w-full rounded-lg object-cover" />;
  if (c.kind === "html" && c.html) return <div dangerouslySetInnerHTML={{ __html: c.html }} />;
  return <div className="whitespace-pre-line text-muted-foreground">{c.body || ""}</div>;
}

function Columns({ p }: { p: P }) {
  const cells = (p.cells as { kind: string; body?: string; src?: string; alt?: string; html?: string }[]) || [];
  const cols = (p.cols as number) || 2;
  const colClass = cols === 2 ? "md:grid-cols-2" : cols === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className={`grid gap-6 ${colClass}`}>{cells.map((c, i) => <Cell key={i} c={c} />)}</div>
    </section>
  );
}

function Html({ p }: { p: P }) {
  return <section className="mx-auto max-w-6xl px-6 py-6" dangerouslySetInnerHTML={{ __html: S(p, "html") }} />;
}

function Embed({ p }: { p: P }) {
  if (!S(p, "url")) return null;
  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <iframe src={S(p, "url")} title={S(p, "title") || "Embedded app"} className="w-full rounded-xl border" style={{ height: (p.height as number) || 480 }} loading="lazy" />
    </section>
  );
}

const REGISTRY: Record<string, (args: { p: P }) => React.ReactNode> = {
  hero: Hero, features: Features, stats: Stats, steps: Steps, pricing: Pricing,
  testimonials: Testimonials, logos: Logos, faq: Faq, cta: CtaBlock,
  richtext: RichText, gallery: Gallery, team: Team,
  text: TextBlock, image: ImageBlock, columns: Columns, spacer: Spacer,
  html: Html, embed: Embed,
};

export function BlockRegistry({ blocks, pageId }: { blocks: Block[]; pageId?: string }) {
  return (
    <>
      {(blocks || []).map((b) => {
        const style = (b.props?.style as Style) || undefined;
        const node = b.type === "contact"
          ? <ContactBlock p={b.props || {}} pageId={pageId} />
          : REGISTRY[b.type] ? REGISTRY[b.type]({ p: b.props || {} }) : null;
        return node ? <Wrap key={b.id} style={style}>{node}</Wrap> : null;
      })}
    </>
  );
}
