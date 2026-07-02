import { redirect } from "next/navigation";
import { getHqUser } from "@/lib/hq/gate";
import { getHqTheme } from "@/lib/hq/store";
import RocketHQ from "@/components/hq/RocketHQ";

export const dynamic = "force-dynamic";
export const metadata = { title: "AI HQ", robots: { index: false } };

export default async function HQPage() {
  const user = await getHqUser();
  if (!user) redirect("/login?next=/hq");
  const theme = await getHqTheme();

  return (
    <div style={{ minHeight: "100dvh", background: "#0b0d14", color: "#e5e7eb" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 20px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700 }}>AI HQ <span style={{ fontSize: 12, color: "#8b93a7", fontWeight: 400 }}>· rocketopp.com</span></h1>
            <p style={{ marginTop: 4, fontSize: 13, color: "#8b93a7" }}>Signed in as {user.email}. Control the entire site&apos;s design from here — every change applies site-wide instantly.</p>
          </div>
          <nav style={{ display: "flex", gap: 14, fontSize: 13 }}>
            <a href="/hq" style={{ color: "#ff571a", fontWeight: 600 }}>Design</a>
            <a href="/hq/pages" style={{ color: "#8b93a7" }}>Nova</a>
            <a href="/" style={{ color: "#8b93a7" }}>← Site</a>
          </nav>
        </div>
        <div style={{ marginTop: 22 }}>
          <RocketHQ initialTheme={theme} />
        </div>
      </div>
    </div>
  );
}
