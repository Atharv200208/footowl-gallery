import { fetchJSON } from "./fetchJson";

export type ImageItem = {
  id: string;
  url: string;       // full-size
  thumbUrl: string;  // small for grid
  width?: number;
  height?: number;
  caption?: string;
  createdAt?: string;
};

const API_BASE = process.env.FOTOOWL_API_BASE ?? 'https://openapi.fotoowl.ai/open';
const EVENT_ID = process.env.FOTOOWL_API_EVENT_ID ?? '154770';
const API_KEY = process.env.FOTOOWL_API_KEY ?? '4030';

export async function fetchImages(
  {
    page = 0,
    pageSize = 40,
    orderBy = 2,
    orderAsc = true,
  }: {
    page?: number;
    pageSize?: number;
    orderBy?: number;
    orderAsc?: boolean;
  },
  signal?: AbortSignal
) {
  const qs = new URLSearchParams({
    event_id: EVENT_ID,
    page: String(page),
    page_size: String(pageSize),
    key: API_KEY,
    order_by: String(orderBy),
    order_asc: orderAsc ? "true" : "false",
  });

  const url = `${API_BASE}/event/image-list?${qs.toString()}`;
  const json = await fetchJSON<{ ok: boolean; data: { image_list: any[] } }>(
    url,
    { method: "GET", timeoutMs: 10000, retries: 3, signal }
  );

  const rawItems = json?.data?.image_list ?? [];
  const items: ImageItem[] = rawItems.map((r) => ({
    id: String(r.id),
    url: r.img_url ?? r.high_url ?? r.med_url,
    thumbUrl: r.thumbnail_url ?? r.med_url ?? r.img_url,
    width: r.width,
    height: r.height,
    caption: r.name,
    createdAt: r.create_time,
  }));

  return { items, page };
}