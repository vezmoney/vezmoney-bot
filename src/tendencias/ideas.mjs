// ideas.mjs — cada mañana: recolecta tendencias y noticias, le pide a Claude ideas (con sus dos piezas) y las manda a Telegram para la 1.ª aprobación.
//   node src/tendencias/ideas.mjs [--dry] [--n=4] [--manual="texto o link"]
//   --dry: no envía nada a Telegram, solo guarda y muestra.   --manual: una idea a partir de lo que mande el usuario por Telegram (/idea ...).
import fs from "node:fs";
import { recolectar } from "./fuentes.mjs";
import { claude, extraerJSON } from "./claude.mjs";
import { validar } from "./disenos.mjs";
import { videosEnTendencia, descargarVideo, plataformaDe } from "./fuentes-video.mjs";
import { spawnSync } from "node:child_process";

const args = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, ...v] = a.replace(/^--/, "").split("="); return [k, v.length ? v.join("=") : true]; }));
const cfg = JSON.parse(fs.readFileSync("tendencias/config.json", "utf8"));
const fotos = JSON.parse(fs.readFileSync("tendencias/fotos.json", "utf8"));
const fechas = JSON.parse(fs.readFileSync("tendencias/fechas-especiales.json", "utf8"));
const N = Number(args.n ?? cfg.ideasPorDia);
const ahora = new Date(), hoy = ahora.toLocaleDateString("sv-SE", { timeZone: cfg.zona });
const diasHasta = (f) => Math.round((Date.UTC(...f.split("-").map((x, i) => (i === 1 ? x - 1 : +x))) - Date.UTC(...hoy.split("-").map((x, i) => (i === 1 ? x - 1 : +x)))) / 86400000);

fs.mkdirSync("tendencias/ideas", { recursive: true });
const histFile = "tendencias/historial.json";
const historial = fs.existsSync(histFile) ? JSON.parse(fs.readFileSync(histFile, "utf8")) : [];

// ── señales ─────────────────────────────────────────────────────────────
let senales = [], fallos = [];
if (args.manual) {
  let extra = "";
  const url = String(args.manual).match(/https?:\/\/\S+/)?.[0];
  if (url) { try { const t = await (await fetch(url, { headers: { "user-agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(15000) })).text(); extra = [t.match(/<title[^>]*>([^<]*)/i)?.[1], t.match(/property="og:description" content="([^"]*)/i)?.[1]].filter(Boolean).join(" — "); } catch {} }
  senales = [{ tipo: "pedido_del_usuario", pais: "—", titulo: String(args.manual).slice(0, 600), contexto: extra ? [extra.slice(0, 400)] : [] }];
} else {
  ({ senales, fallos } = await recolectar(cfg));
}
// ── videos reales en tendencia: se bajan los mejores y se sacan 3 fotogramas para que Claude VEA lo que hay en el video ──
const TOKEN = process.env.APIFY_TOKEN;
async function prepararVideo(v, n) {
  const f = `out/tendencias/tmp/v${n}.mp4`;
  fs.mkdirSync("out/tendencias/tmp/frames", { recursive: true });
  const dl = await descargarVideo(v.url, TOKEN); fs.writeFileSync(f, dl.buffer); v.autor ||= dl.autor || ""; if (!v.vistas || v.vistas === "—") v.vistas = dl.vistas ?? "—";
  const dur = Number(spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], { encoding: "utf8" }).stdout) || v.duracion || 10;
  v.duracion = Math.round(dur); v.fotogramas = [];
  const sonda = spawnSync("ffmpeg", ["-version"], { encoding: "utf8" }); if (sonda.error) throw new Error("ffmpeg no está instalado en este equipo");
  for (const [k, t] of [0.15, 0.5, 0.85].entries()) { const out = `out/tendencias/tmp/frames/v${n}_${k + 1}.jpg`; spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-ss", String(Math.max(0, dur * t)), "-i", f, "-frames:v", "1", "-vf", "scale=360:-1", "-q:v", "4", out]); if (fs.existsSync(out)) v.fotogramas.push(out); }
  if (!v.fotogramas.length) throw new Error("no pude sacar fotogramas del video");
}
let videos = [];
if (TOKEN && cfg.videos) {
  try {
    const tt = args.manual ? String(args.manual).match(/https:\/\/\S*(?:tiktok|instagram)\.com\/\S+/)?.[0] : null;
    if (args.manual) { if (tt) videos = [{ tipo: "video", plataforma: plataformaDe(tt) ?? "TikTok", url: tt, autor: tt.match(/@([^/?]+)/)?.[1] ?? "", titulo: String(args.manual).slice(0, 160), vistas: "—", duracion: 0 }]; }
    else videos = await videosEnTendencia(cfg, TOKEN);
    for (const [n, v] of videos.slice(0, 4).entries()) { try { await prepararVideo(v, n + 1); } catch (e) { fallos.push(`video ${v.url}: ${e.message}`); } }
  } catch (e) { fallos.push("videos: " + e.message); }
}
console.log(`Videos candidatos: ${videos.length} (con fotogramas: ${videos.filter((v) => v.fotogramas?.length).length})`);
const proximas = fechas.fechas.filter((f) => { const d = diasHasta(f.fecha); return d >= 0 && d <= cfg.horizonteFechasDias; }).map((f) => ({ ...f, en_dias: diasHasta(f.fecha) }));

// ── prompt ──────────────────────────────────────────────────────────────
const linea = (s) => `- [${s.tipo}${s.pais ? " " + s.pais : ""}] ${s.titulo}${s.medio ? " (" + s.medio + ")" : ""}${s.trafico ? " · búsquedas " + s.trafico : ""}${s.contexto?.length ? " · contexto: " + s.contexto.join(" / ") : ""}${s.url ? " · " + s.url : ""}`;
const catalogo = Object.entries({ ...fotos.personas, ...fotos.lugares_y_cosas }).map(([k, v]) => `${k}: ${v}`).join("\n");
const prompt = `Hoy es ${hoy} (hora de Chile). Lee CLAUDE.md y sigue SUS reglas al pie de la letra.

${args.manual ? `Francisco (el usuario) te pasó por Telegram esto para convertirlo en contenido:\n${linea(senales[0])}\n\nPropón exactamente 1 idea basada en eso.${videos.length ? " Francisco ELIGIÓ ese video: la decisión es suya y ya está tomada. NO lo vetes ni lo cambies por otra cosa: úsalo SIEMPRE como REEL en la pieza_b, con el estilo y el audio que mejor calcen (mira los fotogramas antes). Si ves algo delicado o el video hace publicidad a un local o marca, déjalo anotado en «nota_revision» (y sensibilidad «media») para que él lo revise, minimiza la marca con inicio y duracion cuando puedas, pero igual arma el reel completo." : ""}` : `Estas son las señales de HOY (tendencias de búsqueda y noticias de las últimas ${cfg.ventanaNoticiasDias} días). Muchas NO sirven (son sensibles o irrelevantes): descártalas sin comentar.\n${senales.map(linea).join("\n")}\n\nFechas especiales próximas:\n${proximas.length ? proximas.map((f) => `- ${f.fecha} (en ${f.en_dias} días): ${f.nombre}${f.nota ? " — " + f.nota : ""}${f.cierre ? " · " + f.cierre : ""}`).join("\n") : "- ninguna en los próximos días"}\n\nRecurrente: fin de mes y quincena son días de pago, cuando más gente envía dinero a casa.\n\nPropón ${N} ideas, mezcladas (tendencia/cultura/humor, noticia útil, fecha especial si hay una cerca, y un evergreen si hace falta). Si hay menos señales buenas que ${N}, propón menos: nunca rellenes con ideas flojas o forzadas.`}

${videos.length ? `VIDEOS REALES EN TENDENCIA (TikTok e Instagram). Los que tienen "fotogramas" se bajaron: ABRE esos archivos con la herramienta Read ANTES de decidir y juzga por lo que VES, no por el título (a veces el título no coincide con el video).
${videos.map((v, n) => `- #${n + 1} [${v.plataforma}] @${v.autor} · ${v.vistas} vistas · ${v.duracion}s · ${v.fecha ?? "hoy"} · audio: ${v.audio_original === false ? `CANCIÓN COMERCIAL${v.cancion ? " («" + v.cancion + "»)" : ""}` : v.audio_original === true ? "sonido original del creador" : "desconocido"} · "${v.titulo}" · ${v.url}\n  fotogramas: ${(v.fotogramas || []).join(", ") || "(no disponibles: no lo uses)"}`).join("\n")}

Prioriza los videos que generen EMOCIÓN, sea positiva (ternura, orgullo, nostalgia, alegría, humor sano, gestos de comunidad) o fuerte/negativa (sorpresa, impacto, miedo, tristeza, indignación, un accidente): todas mueven y todas son válidas SIEMPRE QUE SE TRATEN BIEN. Puedes usar UN video como REEL en la pieza_b de una idea (máximo 3 ideas con reel hoy) si se conecta de forma natural con enviar dinero (humor cotidiano, vida de migrante, cultura, celebración, sorpresa, rapidez, seguridad, cuidar a los tuyos). Para emociones fuertes o negativas: tono sobrio y respetuoso, sin humor ni celebración, remate de cuidado, prevención o solidaridad (nunca vender aprovechando la desgracia), estilo «sutil» o «noticia», audio «original», «musica» emotivo o «silencio». LÍNEAS ROJAS: imágenes gráficas (sangre, heridas, cuerpos, muertes), víctimas o menores identificables en situación vulnerable, delitos atribuidos a una nacionalidad, xenofobia, política partidista, burla a personas o comunidades, desinformación. PUBLICIDAD GRATIS: no uses videos cuyo fin principal sea promocionar un local, marca, producto o servicio de terceros ni donde un negocio sea protagonista; si un negocio sale de pasada, evítalo con inicio y duracion o descarta el video. Si ninguno sirve, no uses ninguno. El reel: {"plantilla":"reel","video":{"url","autor","plataforma":"TikTok o Instagram","mensaje_permiso":"mensaje corto y amable para pedirle permiso al autor por DM"},"gancho","remate","inicio","duracion","audio":"original","caption","hashtags"}; el caption DEBE dar crédito («Video de @autor en TikTok» (o «en Instagram»)). ESTILO (plantilla de marca, elige la que mejor calce con el video): "clasico" (pantalla completa, texto arriba y remate al final), "marco" (video dentro de un marco azul de VezMoney: para videos con texto propio en pantalla), "meme" (texto de meme arriba y abajo: humor), "noticia" (barra de noticiero con «EN TENDENCIA»: noticias y datos), "sutil" (lo MENOS invasivo: encabezado chico y barra final delgada; úsalo cuando el video ya trae mucho texto propio o ese texto se puede publicar tal cual). AUDIO: "original" cuando el video tiene el sonido del creador (voz, risas, ambiente) —suele ser parte de la gracia o la emoción—; si el audio es una CANCIÓN COMERCIAL usa "musica" (pista propia de VezMoney con licencia, y agrega "musica": una de gancho_urbano, latino_alegre, positivo, emotivo o humor según el ánimo) o "silencio". Agrega "estilo" y "audio" al reel. El gancho va arriba del video y el remate al final; no repitas lo que el video ya dice en pantalla. La pieza_a de esa idea sigue siendo una imagen.\n\n` : ""}Ideas ya propuestas en los últimos días (NO las repitas ni uses el mismo ángulo):
${historial.slice(-30).map((h) => "- " + h).join("\n") || "- (ninguna)"}

Fotos disponibles para la plantilla "meme" (usa solo estos nombres de archivo):
${catalogo}

Responde SOLO con el JSON {"ideas":[...]} descrito en CLAUDE.md, sin texto adicional.`;

// ── Claude + validación (un reintento si algo no cumple) ────────────────
async function pedir(extra = "") {
  const conFotos = videos.some((v) => v.fotogramas?.length);
  const txt = claude(prompt + extra, { maxTurns: conFotos ? 14 : 3, tools: conFotos ? ["Read"] : [] });
  const { ideas } = extraerJSON(txt);
  const malas = [];
  for (const i of ideas) for (const L of ["pieza_a", "pieza_b"]) { const e = validar(i[L]); if (e.length) malas.push(`«${i.titulo}» ${L}: ${e.join("; ")}`); if (i[L]?.plantilla === "meme" && i[L].foto && !{ ...fotos.personas, ...fotos.lugares_y_cosas }[i[L].foto]) malas.push(`«${i.titulo}» ${L}: la foto ${i[L].foto} no existe en el catálogo`); }
  for (const i of ideas) { const p = i.pieza_b; if (p?.plantilla === "reel" && !videos.some((v) => v.url === p.video?.url)) malas.push(`«${i.titulo}» pieza_b: el video no está en la lista de candidatos`); if (i.pieza_a?.plantilla === "reel") malas.push(`«${i.titulo}» pieza_a: el reel va solo en la pieza_b`); if (p?.plantilla === "reel") { const v0 = videos.find((x) => x.url === p.video?.url); if (v0?.audio_original === false && (p.audio ?? "original") === "original") malas.push(`«${i.titulo}» pieza_b: el audio de ese video es una canción comercial; usa "musica" o "silencio"`); } }
  for (const i of ideas) { const p = i.pieza_b; if (p?.plantilla === "reel") { const v = videos.find((x) => x.url === p.video?.url); if (v) p.video = { ...p.video, vistas: v.vistas, duracion_original: v.duracion }; } }
  return { ideas, malas };
}
let { ideas, malas } = await pedir();
if (malas.length) { console.log("Corrigiendo:", malas); ({ ideas, malas } = await pedir(`\n\nTu respuesta anterior tuvo estos problemas, corrígelos todos y devuelve el JSON completo otra vez:\n${malas.join("\n")}`)); }
if (malas.length) { console.warn("Quedaron problemas, descarto esas ideas:", malas); ideas = ideas.filter((i) => ["pieza_a", "pieza_b"].every((L) => !validar(i[L]).length)); }

// ── guardar y enviar ────────────────────────────────────────────────────
const archivo = `tendencias/ideas/${hoy}${args.manual ? "-manual-" + Date.now().toString(36) : ""}.json`;
const existentes = !args.manual && fs.existsSync(archivo) ? JSON.parse(fs.readFileSync(archivo, "utf8")) : [];
const salida = ideas.map((i, n) => ({ id: `${hoy}-${args.manual ? "m" + Date.now().toString(36).slice(-4) : existentes.length + n + 1}`, fecha: hoy, ...i }));
fs.writeFileSync(archivo, JSON.stringify([...existentes, ...salida], null, 2));
fs.writeFileSync(histFile, JSON.stringify([...historial, ...salida.map((i) => `${i.titulo} — ${i.gancho_envio}`)].slice(-60), null, 2));
console.log(`Señales: ${senales.length} (fallos: ${fallos.length}) · ideas nuevas: ${salida.length} → ${archivo}`);
for (const i of salida) console.log(`\n[${i.id}] ${i.tipo} · ${i.titulo}\n  por qué: ${i.porque}\n  gancho: ${i.gancho_envio}\n  A (${i.pieza_a.plantilla}): ${JSON.stringify(i.pieza_a).slice(0, 220)}\n  B (${i.pieza_b.plantilla}): ${JSON.stringify(i.pieza_b).slice(0, 220)}`);

if (!args.dry && !args.manual && videos.length && process.env.WORKER_URL && process.env.ADMIN_KEY) {
  const lista = videos.map((v, n) => `${n + 1}. [${v.plataforma}] @${v.autor} · ${Number(v.vistas || 0).toLocaleString("es-CL")} vistas · ${v.duracion}s · ${v.fecha}\n   ${v.titulo.slice(0, 80)}\n   ${v.url}`).join("\n");
  const r = await fetch(process.env.WORKER_URL.replace(/\/$/, "") + "/admin/aviso", { method: "POST", headers: { "X-Admin-Key": process.env.ADMIN_KEY, "content-type": "application/json" }, body: JSON.stringify({ texto: `🎬 VIDEOS EN TENDENCIA de hoy (TikTok e Instagram)\n\n${lista}\n\nSi alguno te sirve, responde aquí con:\n/idea <enlace del video>\ny te armo la idea con el reel (gancho arriba, crédito al autor y remate de VezMoney).` }) });
  console.log("Aviso de videos", r.status);
}
if (!args.dry && process.env.WORKER_URL && process.env.ADMIN_KEY) {
  for (const i of salida) {
    const r = await fetch(process.env.WORKER_URL.replace(/\/$/, "") + "/admin/idea", { method: "POST", headers: { "X-Admin-Key": process.env.ADMIN_KEY, "content-type": "application/json" }, body: JSON.stringify({ id: i.id, idea: i }) });
    console.log("Telegram", i.id, r.status);
  }
} else console.log("\n(modo prueba: no se envió a Telegram)");
