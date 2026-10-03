import { getJson, stripHtml, type Source } from "./types";

type Res = {
  jobs: {
    id: number; url: string; title: string; company_name: string;
    tags: string[]; candidate_required_location: string;
    publication_date: string; description: string;
  }[];
};

export const remotive: Source = {
  name: "remotive",
  async fetch() {
    const data = await getJson<Res>("https://remotive.com/api/remote-jobs?category=software-dev&limit=200");
    return data.jobs.map((j) => ({
      source: "remotive",
      external_id: String(j.id),
      url: j.url,
      title: j.title,
      company: j.company_name,
      location: j.candidate_required_location,
      remote: true,
      description: stripHtml(j.description),
      tags: j.tags,
      posted_at: j.publication_date,
    }));
  },
};
