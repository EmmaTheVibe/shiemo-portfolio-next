import { stripHtml, type RawJob, type Source } from "./types";

const FEEDS = [
  "https://weworkremotely.com/categories/remote-front-end-programming-jobs.rss",
  "https://weworkremotely.com/categories/remote-full-stack-programming-jobs.rss",
];

function tag(block: string, name: string) {
  const m = block.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`));
  return m ? m[1].replace(/^<!\[CDATA\[|\]\]>$/g, "").trim() : undefined;
}

export const weworkremotely: Source = {
  name: "weworkremotely",
  async fetch() {
    const out: RawJob[] = [];
    for (const feed of FEEDS) {
      const res = await fetch(feed, {
        headers: { "User-Agent": "shiemo-portfolio-monitor (personal job search)" },
        signal: AbortSignal.timeout(15_000),
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`${feed} -> ${res.status}`);
      const xml = await res.text();
      for (const item of xml.split("<item>").slice(1)) {
        const url = tag(item, "link");
        const raw = tag(item, "title");
        if (!url || !raw) continue;
        // Titles look like "Company: Job title"
        const i = raw.indexOf(":");
        const company = i > 0 ? raw.slice(0, i).trim() : undefined;
        const title = i > 0 ? raw.slice(i + 1).trim() : raw;
        const pub = tag(item, "pubDate");
        out.push({
          source: "weworkremotely",
          url,
          title,
          company,
          location: tag(item, "region"),
          remote: true,
          description: stripHtml(tag(item, "description") ?? ""),
          posted_at: pub ? new Date(pub).toISOString() : undefined,
        });
      }
    }
    return out;
  },
};
