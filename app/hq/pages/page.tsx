import { redirect } from "next/navigation";
import { getHqUser } from "@/lib/hq/gate";
import { supabaseAdmin } from "@/lib/db/supabase";
import NovaBuilder from "@/components/hq/NovaBuilder";
import type { HqPage } from "@/lib/hq/blocks";

export const dynamic = "force-dynamic";
export const metadata = { title: "AI HQ · Nova", robots: { index: false } };

export default async function HQPagesPage() {
  const user = await getHqUser();
  if (!user) redirect("/login?next=/hq/pages");
  const { data } = await supabaseAdmin
    .from("hq_pages").select("id, slug, title, blocks, status").order("updated_at", { ascending: false });

  return (
    <div style={{ minHeight: "100dvh", background: "#0b0d14", color: "#e5e7eb" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "28px 20px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700 }}>Nova <span style={{ fontSize: 12, color: "#8b93a7", fontWeight: 400 }}>· build & edit pages by describing them</span></h1>
            <p style={{ marginTop: 4, fontSize: 13, color: "#8b93a7" }}>Signed in as {user.email}. Pages render at /p/&lt;slug&gt; with the site&apos;s live theme.</p>
          </div>
          <nav style={{ display: "flex", gap: 14, fontSize: 13 }}>
            <a href="/hq" style={{ color: "#8b93a7" }}>Design</a>
            <a href="/hq/pages" style={{ color: "#ff571a", fontWeight: 600 }}>Nova</a>
            <a href="/" style={{ color: "#8b93a7" }}>← Site</a>
          </nav>
        </div>
        <div style={{ marginTop: 22 }}>
          <NovaBuilder initialPages={(data as HqPage[]) || []} />
        </div>
      </div>
    </div>
  );
}
