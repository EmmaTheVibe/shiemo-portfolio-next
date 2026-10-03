import { getJson, stripHtml, type RawJob, type Source } from "./types";

type Item = {
  title: string; company_name?: string; url: string; remote?: boolean;
  tags?: string[]; location?: string; description?: string; created_at?: number;
};

const PAGES = 3;

export const arbeitnow: Source = {
  name: "arbeitnow",
  async fetch() {
    const out: RawJob[] = [];
    for (let page = 1; page <= PAGES; page++) {
      const data = await getJson<{ data: Item[] }>(`https://www.arbeitnow.com/api/job-board-api?page=${page}`);
      for (const j of data.data) {
        out.push({
          source: "arbeitnow",
          url: j.url,
          title: j.title,
          company: j.company_name,
          location: j.location,
          remote: j.remote === true,
          description: stripHtml(j.description ?? ""),
          tags: j.tags ?? [],
          posted_at: j.created_at ? new Date(j.created_at * 1000).toISOString() : undefined,
        });
      }
    }
    return out;
  },
};
