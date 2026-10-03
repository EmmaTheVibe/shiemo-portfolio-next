import { getJson, stripHtml, type RawJob, type Source } from "./types";

// Sources that need a free signup. Each returns [] quietly when its key isn't set.
// Written from the providers' documented response shapes; not yet exercised
// against a live key, so a failure will surface in the run errors.

type AdzunaRes = { results?: { id: string; title: string; company?: { display_name?: string }; location?: { display_name?: string }; description?: string; redirect_url: string; created?: string }[] };

export const adzuna: Source = {
  name: "adzuna",
  async fetch() {
    const id = process.env.ADZUNA_APP_ID;
    const key = process.env.ADZUNA_APP_KEY;
    if (!id || !key) return [];
    const out: RawJob[] = [];
    for (const country of ["gb", "us", "ca", "au"]) {
      const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${id}&app_key=${key}&results_per_page=50&what=${encodeURIComponent("remote frontend react")}&content-type=application/json`;
      const data = await getJson<AdzunaRes>(url);
      for (const j of data.results ?? []) {
        out.push({
          source: "adzuna",
          external_id: j.id,
          url: j.redirect_url,
          title: j.title,
          company: j.company?.display_name,
          location: j.location?.display_name,
          remote: /remote/i.test(`${j.title} ${j.description ?? ""}`),
          description: stripHtml(j.description ?? ""),
          posted_at: j.created,
        });
      }
    }
    return out;
  },
};

type FindworkRes = { results?: { id: string; role: string; company_name?: string; location?: string; remote?: boolean; url: string; text?: string; keywords?: string[]; date_posted?: string }[] };

export const findwork: Source = {
  name: "findwork",
  async fetch() {
    const token = process.env.FINDWORK_API_KEY;
    if (!token) return [];
    const out: RawJob[] = [];
    for (const q of ["react", "vue", "frontend", "svelte"]) {
      const res = await fetch(`https://findwork.dev/api/jobs/?search=${q}&remote=true`, {
        headers: { Authorization: `Token ${token}` },
        signal: AbortSignal.timeout(15_000),
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`findwork -> ${res.status}`);
      const data = (await res.json()) as FindworkRes;
      for (const j of data.results ?? []) {
        out.push({
          source: "findwork",
          external_id: String(j.id),
          url: j.url,
          title: j.role,
          company: j.company_name,
          location: j.location,
          remote: j.remote === true,
          description: stripHtml(j.text ?? ""),
          tags: j.keywords ?? [],
          posted_at: j.date_posted,
        });
      }
    }
    return out;
  },
};

type JoobleRes = { jobs?: { id?: number | string; title: string; location?: string; snippet?: string; link: string; company?: string; updated?: string }[] };

export const jooble: Source = {
  name: "jooble",
  async fetch() {
    const key = process.env.JOOBLE_API_KEY;
    if (!key) return [];
    const out: RawJob[] = [];
    for (const keywords of ["remote frontend developer react", "remote vue developer", "remote next.js developer"]) {
      const res = await fetch(`https://jooble.org/api/${key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords, location: "" }),
        signal: AbortSignal.timeout(15_000),
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`jooble -> ${res.status}`);
      const data = (await res.json()) as JoobleRes;
      for (const j of data.jobs ?? []) {
        out.push({
          source: "jooble",
          external_id: j.id ? String(j.id) : undefined,
          url: j.link,
          title: j.title,
          company: j.company,
          location: j.location,
          remote: /remote/i.test(`${j.title} ${j.location ?? ""} ${j.snippet ?? ""}`),
          description: stripHtml(j.snippet ?? ""),
          posted_at: j.updated,
        });
      }
    }
    return out;
  },
};
