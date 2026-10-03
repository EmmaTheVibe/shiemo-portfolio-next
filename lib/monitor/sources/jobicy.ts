import { getJson, stripHtml, type RawJob, type Source } from "./types";

type Item = {
  id: number | string; url: string; jobTitle: string; companyName?: string;
  jobGeo?: string; jobDescription?: string; jobExcerpt?: string; pubDate?: string;
};

const TAGS = ["react", "vue", "svelte", "nextjs", "frontend", "typescript"];

// Jobicy's terms: credit Jobicy and link to the original posting. The source
// column shows "jobicy" and every row links to the original job URL.
export const jobicy: Source = {
  name: "jobicy",
  async fetch() {
    const results = await Promise.allSettled(
      TAGS.map((t) => getJson<{ jobs?: Item[] }>(`https://jobicy.com/api/v2/remote-jobs?count=50&tag=${t}`)),
    );
    const out: RawJob[] = [];
    let failed = 0;
    for (const r of results) {
      if (r.status === "rejected") { failed++; continue; }
      for (const j of r.value.jobs ?? []) {
        out.push({
          source: "jobicy",
          external_id: String(j.id),
          url: j.url,
          title: j.jobTitle,
          company: j.companyName,
          location: j.jobGeo,
          remote: true,
          description: stripHtml(j.jobDescription ?? j.jobExcerpt ?? ""),
          posted_at: j.pubDate,
        });
      }
    }
    if (failed === TAGS.length) throw new Error("all tag requests failed");
    return out;
  },
};
