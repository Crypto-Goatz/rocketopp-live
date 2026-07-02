import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/db/supabase";
import { BlockRegistry } from "@/components/hq/blocks/BlockRegistry";
import type { Block } from "@/lib/hq/blocks";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data } = await supabaseAdmin.from("hq_pages").select("title").eq("slug", slug).maybeSingle();
  return { title: data?.title || "RocketOpp" };
}

// Public render of a Nova-built page. Inherits the site's design tokens (themed
// by AI HQ automatically), rendered with the shadcn block library.
export default async function ManagedPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: page } = await supabaseAdmin
    .from("hq_pages").select("id, title, blocks, status").eq("slug", slug).maybeSingle();
  if (!page) notFound();
  return (
    <main className="bg-background text-foreground">
      <BlockRegistry blocks={(page.blocks as Block[]) || []} pageId={page.id} />
    </main>
  );
}
