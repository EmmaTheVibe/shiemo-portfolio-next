import { getJson, stripHtml, type RawJob, type Source } from "./types";

type Item = {
  title: string; companyName?: string; applicationLink?: string; guid?: string;
  excerpt?: string; description?: string; categories?: string[];
  locationRestrictions?: string[]; pubDate?: number | string;
};
type Res = { jobs: Item[] };

const QUERIES = ["frontend", "react", "vue", "svelte", "next.js", "typescript"];
const PAGES = 3; // 20 per page, newest first

export const himalayas: Source = {
  name: "himalayas",
  async fetch() {
    const urls = QUERIES.flatMap((q) =>
      Array.from({ length: PAGES }, (_, p) =>
        `https://himalayas.app/jobs/api/search?q=${encodeURIComponent(q)}&sort=recent&page=${p + 1}`,
      ),
    );
    const results = await Promise.allSettled(urls.map((u) => getJson<Res>(u)));
    const out: RawJob[] = [];
    let failed = 0;
    for (const r of results) {
      if (r.status === "rejected") { failed++; continue; }
      for (const j of r.value.jobs ?? []) {
        const link = j.applicationLink ?? j.guid;
        if (!link) continue;
        out.push({
          source: "himalayas",
          url: link,
          title: j.title,
          company: j.companyName,
          location: j.locationRestrictions?.length ? j.locationRestrictions.join(", ") : "Worldwide",
          remote: true,
          description: stripHtml(j.description ?? j.excerpt ?? ""),
          tags: j.categories ?? [],
          posted_at: j.pubDate ? new Date(Number(j.pubDate) * 1000 || j.pubDate).toISOString() : undefined,
        });
      }
    }
    if (failed === urls.length) throw new Error("all requests failed");
    return out;
  },
};
