import { getJson, stripHtml, type RawJob, type Source } from "./types";

type Search = { hits: { objectID: string; title: string }[] };
type Item = {
  children?: { id: number; text?: string | null; created_at: string; author?: string }[];
};

// Top-level comments of the latest "Ask HN: Who is hiring?" thread.
// Comments are free text, so the first line is used as the title.
export const hn: Source = {
  name: "hn",
  async fetch() {
    const search = await getJson<Search>(
      "https://hn.algolia.com/api/v1/search_by_date?tags=story,author_whoishiring&hitsPerPage=5",
    );
    const thread = search.hits.find((h) => /who is hiring/i.test(h.title));
    if (!thread) return [];

    const item = await getJson<Item>(`https://hn.algolia.com/api/v1/items/${thread.objectID}`);
    const out: RawJob[] = [];
    for (const c of item.children ?? []) {
      if (!c.text) continue;
      const text = stripHtml(c.text);
      const headline = stripHtml(c.text.split("<p>")[0]);
      // Posts start "Company | Role | Location | ...": keep the first three parts.
      const head = headline.split("|").map((p) => p.trim());
      const first = head.slice(0, 3).join(" | ").slice(0, 160);
      out.push({
        source: "hn",
        external_id: String(c.id),
        url: `https://news.ycombinator.com/item?id=${c.id}`,
        title: first || "HN job post",
        company: head[0]?.slice(0, 80) || undefined,
        remote: /remote/i.test(text),
        description: text,
        posted_at: c.created_at,
      });
    }
    return out;
  },
};
