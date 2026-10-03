import { getJson, stripHtml, type Source } from "./types";

type Item = {
  url: string; title: string; company_name?: string; category_name?: string;
  tags?: string; location?: string; pub_date?: string; description?: string;
};

export const workingnomads: Source = {
  name: "workingnomads",
  async fetch() {
    const data = await getJson<Item[]>("https://www.workingnomads.com/api/exposed_jobs/");
    return data.map((j) => ({
      source: "workingnomads",
      url: j.url,
      title: j.title,
      company: j.company_name,
      location: j.location,
      remote: true,
      description: stripHtml(j.description ?? ""),
      tags: (j.tags ?? "").split(",").map((t) => t.trim()).filter(Boolean),
      posted_at: j.pub_date ? new Date(j.pub_date).toISOString() : undefined,
    }));
  },
};
