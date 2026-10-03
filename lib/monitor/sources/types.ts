export type RawJob = {
  source: string;
  external_id?: string;
  url: string;
  title: string;
  company?: string;
  location?: string;
  remote?: boolean;
  description?: string;
  tags?: string[];
  posted_at?: string;
};

export type SourceResult = RawJob[] | { jobs: RawJob[]; warnings: string[] };
export type Source = { name: string; fetch: () => Promise<SourceResult> };

// One retry on network errors and 5xx/429, with the underlying cause in the message
// ("fetch failed" alone says nothing).
export async function getJson<T>(url: string, timeoutMs = 30_000): Promise<T> {
  let lastError = "";
  for (let attempt = 0; attempt < 2; attempt++) {
    if (attempt) await new Promise((r) => setTimeout(r, 1500));
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "shiemo-portfolio-monitor (personal job search)" },
        signal: AbortSignal.timeout(timeoutMs),
        cache: "no-store",
      });
      if (res.ok) return (await res.json()) as T;
      lastError = `${new URL(url).host} -> ${res.status}`;
      if (res.status < 500 && res.status !== 429) break;
    } catch (e) {
      const cause = (e as { cause?: { code?: string; message?: string } }).cause;
      lastError = `${new URL(url).host}: ${cause?.code ?? cause?.message ?? (e as Error).message}`;
    }
  }
  throw new Error(lastError);
}

export function stripHtml(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/\s+/g, " ")
    .trim();
}
