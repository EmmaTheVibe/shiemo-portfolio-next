import { getJson, stripHtml, type Source } from "./types";

type Item = {
  id?: string; url?: string; position?: string; company?: string;
  location?: string; tags?: string[]; description?: string; date?: string;
};

// RemoteOK's terms require linking back to the job URL, which we store as-is.
export const remoteok: Source = {
  name: "remoteok",
  async fetch() {
    const data = await getJson<Item[]>("https://remoteok.com/api");
    return data
      .filter((j) => j.position && j.url)
      .map((j) => ({
        source: "remoteok",
        external_id: j.id,
        url: j.url!,
        title: j.position!,
        company: j.company,
        location: j.location || undefined,
        remote: true,
        description: j.description ? stripHtml(j.description) : undefined,
        tags: j.tags ?? [],
        posted_at: j.date,
      }));
  },
};
