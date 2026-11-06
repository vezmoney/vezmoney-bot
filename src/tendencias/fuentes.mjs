// fuentes.mjs — recolecta las señales del día: búsquedas en tendencia (Google Trends) y noticias recientes (Google News) por país.
// Todo viene de RSS públicos, sin claves. Cada señal: { tipo, pais, titulo, medio, fecha, url, trafico }.
const UA = { "user-agent": "Mozilla/5.0 (compatible; vezmoney-bot/1.0; +https://vezmoney.com)" };
const CEID = { CL: "CL:es-419", PE: "PE:es-419", CO: "CO:es-419", VE: "VE:es-419" };

const decode = (s = "") => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/<[^>]+>/g, "").trim();
const tag = (b, t) => { const m = b.match(new RegExp("<" + t + "[^>]*>([\\s\\S]*?)</" + t + ">")); return m ? decode(m[1].replace(/^<!\[CDATA\[|\]\]>$/g, "")) : ""; };
const items = (xml) => xml.split("<item>").slice(1).map((x) => x.split("</item>")[0]);

async function get(url, intentos = 3) {
  let err;
  for (let i = 1; i <= intentos; i++) {
    try { const r = await fetch(url, { headers: UA, signal: AbortSignal.timeout(20000) }); if (!r.ok) throw new Error("HTTP " + r.status); return await r.text(); }
    catch (e) { err = e; await new Promise((ok) => setTimeout(ok, 1200 * i)); }
  }
  throw err;
}

export async function tendenciasGoogle(geo) {
  const xml = await get(`https://trends.google.com/trending/rss?geo=${geo}`);
  return items(xml).map((i) => ({ tipo: "busqueda_en_tendencia", pais: geo, titulo: tag(i, "title"), trafico: tag(i, "ht:approx_traffic"), fecha: tag(i, "pubDate"),
    contexto: [...i.matchAll(/<ht:news_item_title>([\s\S]*?)<\/ht:news_item_title>/g)].slice(0, 2).map((m) => decode(m[1].replace(/^<!\[CDATA\[|\]\]>$/g, ""))) })).filter((s) => s.titulo);
}

export async function noticias({ q, gl }, dias = 2) {
  const xml = await get(`https://news.google.com/rss/search?q=${encodeURIComponent(`${q} when:${dias}d`)}&hl=es-419&gl=${gl}&ceid=${CEID[gl] ?? "CL:es-419"}`);
  return items(xml).slice(0, 6).map((i) => ({ tipo: "noticia", pais: gl, consulta: q, titulo: tag(i, "title"), medio: tag(i, "source"), fecha: tag(i, "pubDate"), url: tag(i, "link") })).filter((s) => s.titulo);
}

// junta todo; una fuente caída no detiene a las demás
export async function recolectar(cfg) {
  const out = [], fallos = [];
  await Promise.all([
    ...cfg.geosTendencias.map(async (g) => { try { out.push(...(await tendenciasGoogle(g)).slice(0, 15)); } catch (e) { fallos.push(`trends ${g}: ${e.message}`); } }),
    ...cfg.consultasNoticias.map(async (c) => { try { out.push(...(await noticias(c, cfg.ventanaNoticiasDias))); } catch (e) { fallos.push(`noticias "${c.q}": ${e.message}`); } }),
  ]);
  const vistos = new Set();
  const unicas = out.filter((s) => { const k = s.titulo.toLowerCase().slice(0, 60); if (vistos.has(k)) return false; vistos.add(k); return true; });
  return { senales: unicas, fallos };
}
