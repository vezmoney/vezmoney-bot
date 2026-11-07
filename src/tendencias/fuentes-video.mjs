// fuentes-video.mjs — videos reales en tendencia (TikTok) y descarga, vía Apify (actor clockworks/tiktok-scraper).
// Necesita APIFY_TOKEN. Cada búsqueda de ~30 videos cuesta del orden de 10 centavos de dólar.
const ACTOR = "clockworks~tiktok-scraper";
const base = (t) => ({ headers: { Authorization: `Bearer ${t}`, "content-type": "application/json" } });

async function correr(token, input, timeoutS = 240) {
  const r = await fetch(`https://api.apify.com/v2/acts/${ACTOR}/run-sync-get-dataset-items?timeout=${timeoutS}`, { method: "POST", ...base(token), body: JSON.stringify(input), signal: AbortSignal.timeout((timeoutS + 30) * 1000) });
  const t = await r.text();
  if (!r.ok) throw new Error(`Apify HTTP ${r.status}: ${t.slice(0, 200)}`);
  const d = JSON.parse(t);
  if (!Array.isArray(d)) throw new Error("Apify devolvió algo inesperado: " + t.slice(0, 200));
  return d;
}

// busca videos recientes por hashtag y los ordena por vistas por hora (lo que está subiendo, no lo más viejo)
export async function videosEnTendencia(cfg, token) {
  const v = cfg.videos;
  const items = await correr(token, { hashtags: v.hashtags, resultsPerPage: v.porHashtag, shouldDownloadVideos: false, shouldDownloadCovers: false, shouldDownloadSubtitles: false, shouldDownloadSlideshowImages: false });
  const ahora = Date.now(), vistos = new Set();
  return items
    .filter((i) => i.webVideoUrl && !i.isAd && !i.isSponsored && !i.isSlideshow && i.videoMeta?.duration && i.videoMeta.duration <= v.maxDuracionS)
    .map((i) => ({ i, horas: Math.max(6, (ahora - new Date(i.createTimeISO).getTime()) / 3.6e6) }))
    .filter(({ horas }) => horas <= v.maxDias * 24)
    .map(({ i, horas }) => ({ tipo: "video_tiktok", pais: i.searchHashtag?.name ?? "", titulo: String(i.text || "").replace(/\s+/g, " ").trim().slice(0, 160), autor: i.authorMeta?.name, seguidores: i.authorMeta?.fans, vistas: i.playCount, likes: i.diggCount, duracion: Math.round(i.videoMeta.duration), fecha: i.createTimeISO?.slice(0, 10), url: i.webVideoUrl, hashtags: (i.hashtags || []).map((h) => h.name).slice(0, 6), puntaje: i.playCount / horas }))
    .filter((x) => x.vistas >= v.minVistas && (vistos.has(x.url) ? false : vistos.add(x.url)))
    .sort((a, b) => b.puntaje - a.puntaje)
    .slice(0, v.top);
}

// descarga un video concreto (queda en el almacén de Apify; devuelve el mp4 como Buffer)
export async function descargarVideo(url, token) {
  const d = await correr(token, { postURLs: [url], resultsPerPage: 1, shouldDownloadVideos: true, shouldDownloadCovers: false, shouldDownloadSubtitles: false, shouldDownloadSlideshowImages: false }, 200);
  const mp4 = d[0]?.mediaUrls?.[0];
  if (!mp4) throw new Error("Apify no entregó el archivo de video de " + url);
  const r = await fetch(mp4, { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(120000) });
  if (!r.ok) throw new Error(`No pude bajar el video (${r.status})`);
  return { buffer: Buffer.from(await r.arrayBuffer()), meta: d[0] };
}
