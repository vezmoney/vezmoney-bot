// fuentes-video.mjs — videos reales en tendencia (TikTok e Instagram) y descarga, vía Apify. Necesita APIFY_TOKEN.
//   TikTok:    actor clockworks/tiktok-scraper (búsqueda por hashtag; recientes)
//   Instagram: actor apify/instagram-hashtag-scraper (reels por hashtag; Instagram solo entrega lo más popular) y
//              apify/instagram-scraper (para bajar un reel concreto o mirar cuentas que tú elijas)
// Cada búsqueda de ~30 videos cuesta del orden de 10 centavos de dólar.
const hdr = (t) => ({ Authorization: `Bearer ${t}`, "content-type": "application/json" });

export function plataformaDe(url) {
  try { const h = new URL(url).hostname; if (h === "tiktok.com" || h.endsWith(".tiktok.com")) return "TikTok"; if (h === "instagram.com" || h.endsWith(".instagram.com")) return "Instagram"; } catch {}
  return null;
}

async function correr(actor, token, input, timeoutS = 240) {
  const r = await fetch(`https://api.apify.com/v2/acts/${actor}/run-sync-get-dataset-items?timeout=${timeoutS}`, { method: "POST", headers: hdr(token), body: JSON.stringify(input), signal: AbortSignal.timeout((timeoutS + 30) * 1000) });
  const t = await r.text();
  if (!r.ok) throw new Error(`Apify ${actor} HTTP ${r.status}: ${t.slice(0, 200)}`);
  const d = JSON.parse(t);
  if (!Array.isArray(d)) throw new Error("Apify devolvió algo inesperado: " + t.slice(0, 200));
  return d;
}

const horasDesde = (iso) => Math.max(6, (Date.now() - new Date(iso).getTime()) / 3.6e6);

async function tiktok(cfg, token) {
  const v = cfg.videos;
  const items = await correr("clockworks~tiktok-scraper", token, { hashtags: v.hashtags, resultsPerPage: v.porHashtag, shouldDownloadVideos: false, shouldDownloadCovers: false, shouldDownloadSubtitles: false, shouldDownloadSlideshowImages: false });
  return items
    .filter((i) => i.webVideoUrl && !i.isAd && !i.isSponsored && !i.isSlideshow && i.videoMeta?.duration && i.videoMeta.duration <= v.maxDuracionS && horasDesde(i.createTimeISO) <= v.maxDias * 24)
    .map((i) => ({ tipo: "video", plataforma: "TikTok", pais: i.searchHashtag?.name ?? "", titulo: String(i.text || "").replace(/\s+/g, " ").trim().slice(0, 160), autor: i.authorMeta?.name, seguidores: i.authorMeta?.fans, vistas: i.playCount, duracion: Math.round(i.videoMeta.duration), fecha: i.createTimeISO?.slice(0, 10), url: i.webVideoUrl, puntaje: i.playCount / horasDesde(i.createTimeISO) }));
}

async function instagram(cfg, token) {
  const v = cfg.videos, ig = v.instagram;
  const porHashtag = await correr("apify~instagram-hashtag-scraper", token, { hashtags: ig.hashtags, resultsType: "reels", resultsLimit: ig.porHashtag });
  const porCuenta = ig.cuentas?.length ? await correr("apify~instagram-scraper", token, { directUrls: ig.cuentas.map((c) => `https://www.instagram.com/${c.replace(/^@/, "")}/`), resultsType: "posts", resultsLimit: 5, addParentData: false }) : [];
  return [...porHashtag, ...porCuenta]
    .filter((i) => i.url && i.videoUrl && i.timestamp && (i.videoDuration ?? 99) <= v.maxDuracionS && horasDesde(i.timestamp) <= ig.maxDias * 24)
    .map((i) => ({ tipo: "video", plataforma: "Instagram", pais: "", titulo: String(i.caption || "").replace(/\s+/g, " ").trim().slice(0, 160), autor: i.ownerUsername, seguidores: undefined, vistas: i.videoPlayCount ?? i.videoViewCount ?? i.igPlayCount ?? 0, duracion: Math.round(i.videoDuration ?? 0), fecha: i.timestamp.slice(0, 10), url: i.url, puntaje: (i.videoPlayCount ?? i.videoViewCount ?? 0) / horasDesde(i.timestamp) }));
}

// busca videos recientes y los ordena por vistas por hora (lo que está subiendo)
export async function videosEnTendencia(cfg, token) {
  const v = cfg.videos, listas = [];
  const [tt, ig] = await Promise.allSettled([tiktok(cfg, token), v.instagram ? instagram(cfg, token) : Promise.resolve([])]);
  if (tt.status === "fulfilled") listas.push(tt.value.filter((x) => x.vistas >= v.minVistas).sort((a, b) => b.puntaje - a.puntaje).slice(0, v.top));
  if (ig.status === "fulfilled") listas.push(ig.value.filter((x) => x.vistas >= v.minVistas).sort((a, b) => b.puntaje - a.puntaje).slice(0, v.instagram?.top ?? 4));
  if (!listas.length) throw new Error("ninguna fuente de videos respondió: " + [tt, ig].map((x) => x.reason?.message).filter(Boolean).join(" | "));
  const vistos = new Set();
  return listas.flat().filter((x) => (vistos.has(x.url) ? false : vistos.add(x.url)));
}

// descarga un video concreto; devuelve { buffer, autor, vistas }
export async function descargarVideo(url, token) {
  const plat = plataformaDe(url);
  if (plat === "Instagram") {
    const d = await correr("apify~instagram-scraper", token, { directUrls: [url], resultsType: "posts", resultsLimit: 1, addParentData: false }, 200);
    const mp4 = d[0]?.videoUrl; if (!mp4) throw new Error("Instagram no entregó el video de " + url);
    const r = await fetch(mp4, { signal: AbortSignal.timeout(120000) }); if (!r.ok) throw new Error(`No pude bajar el video (${r.status})`);
    return { buffer: Buffer.from(await r.arrayBuffer()), autor: d[0].ownerUsername, vistas: d[0].videoPlayCount ?? d[0].videoViewCount };
  }
  const d = await correr("clockworks~tiktok-scraper", token, { postURLs: [url], resultsPerPage: 1, shouldDownloadVideos: true, shouldDownloadCovers: false, shouldDownloadSubtitles: false, shouldDownloadSlideshowImages: false }, 200);
  const mp4 = d[0]?.mediaUrls?.[0]; if (!mp4) throw new Error("Apify no entregó el archivo de video de " + url);
  const r = await fetch(mp4, { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(120000) }); if (!r.ok) throw new Error(`No pude bajar el video (${r.status})`);
  return { buffer: Buffer.from(await r.arrayBuffer()), autor: d[0].authorMeta?.name, vistas: d[0].playCount };
}
