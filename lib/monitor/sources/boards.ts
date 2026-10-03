import { ASHBY, GREENHOUSE, LEVER } from "../companies";
import { getJson, stripHtml, type RawJob, type Source } from "./types";

const isRemote = (s?: string | null) => /remote|anywhere|worldwide/i.test(s ?? "");

async function greenhouse(slug: string): Promise<RawJob[]> {
  type Res = { jobs: { id: number; title: string; absolute_url: string; company_name?: string; location?: { name?: string }; content?: string; first_published?: string; updated_at?: string }[] };
  const data = await getJson<Res>(`https://boards-api.greenhouse.io/v1/boards/${slug}/jobs?content=true`);
  return data.jobs
    .map((j) => ({
      source: "greenhouse",
      external_id: String(j.id),
      url: j.absolute_url,
      title: j.title,
      company: j.company_name ?? slug,
      location: j.location?.name,
      remote: isRemote(j.location?.name),
      // content is HTML-escaped HTML
      description: stripHtml(stripHtml(j.content ?? "").replace(/&lt;/g, "<")),
      posted_at: j.first_published ?? j.updated_at,
    }));
}

async function lever(slug: string): Promise<RawJob[]> {
  type Item = { id: string; text: string; hostedUrl: string; workplaceType?: string; categories?: { location?: string }; descriptionPlain?: string; createdAt?: number };
  const data = await getJson<Item[]>(`https://api.lever.co/v0/postings/${slug}?mode=json`);
  return data
    .map((j) => ({
      source: "lever",
      external_id: j.id,
      url: j.hostedUrl,
      title: j.text,
      company: slug,
      location: j.categories?.location,
      remote: j.workplaceType === "remote" || isRemote(j.categories?.location),
      description: j.descriptionPlain,
      posted_at: j.createdAt ? new Date(j.createdAt).toISOString() : undefined,
    }));
}

async function ashby(slug: string): Promise<RawJob[]> {
  type Item = { id: string; title: string; jobUrl: string; location?: string; isRemote?: boolean | null; workplaceType?: string | null; descriptionPlain?: string; publishedAt?: string };
  const data = await getJson<{ jobs: Item[] }>(`https://api.ashbyhq.com/posting-api/job-board/${slug}`);
  return data.jobs
    .map((j) => ({
      source: "ashby",
      external_id: j.id,
      url: j.jobUrl,
      title: j.title,
      company: slug,
      location: j.location,
      remote: j.isRemote === true || j.workplaceType === "Remote" || isRemote(j.location),
      description: j.descriptionPlain,
      posted_at: j.publishedAt,
    }));
}

export const boards: Source = {
  name: "boards",
  async fetch() {
    const tasks = [
      ...GREENHOUSE.map((s) => ({ s: `greenhouse:${s}`, run: () => greenhouse(s) })),
      ...LEVER.map((s) => ({ s: `lever:${s}`, run: () => lever(s) })),
      ...ASHBY.map((s) => ({ s: `ashby:${s}`, run: () => ashby(s) })),
    ];
    const results = await Promise.allSettled(tasks.map((t) => t.run()));
    const jobs: RawJob[] = [];
    const failed: string[] = [];
    results.forEach((r, i) => {
      if (r.status === "fulfilled") jobs.push(...r.value);
      else failed.push(tasks[i].s);
    });
    return { jobs, warnings: failed.length ? [`${failed.length} board(s) failed: ${failed.join(", ")}`] : [] };
  },
};
