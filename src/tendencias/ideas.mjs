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

Prioriza los videos que generen EMOCIÓN, sea positiva (ternura, orgullo, nostalgia, alegría, humor sano, gestos de comunidad) o fuerte/negativa (sorpresa, impacto, miedo, tristeza, indignación, un accidente): todas mueven y todas son válidas SIEMPRE QUE SE TRATEN BIEN. Puedes usar un video como REEL en la pieza_a o en la pieza_b (cada video se usa una sola vez; la idea puede llevar dos videos distintos) si se conecta de forma natural con enviar dinero (humor cotidiano, vida de migrante, cultura, celebración, sorpresa, rapidez, seguridad, cuidar a los tuyos). Para emociones fuertes o negativas: tono sobrio y respetuoso, sin humor ni celebración, remate de cuidado, prevención o solidaridad (nunca vender aprovechando la desgracia), estilo «sutil» o «noticia», audio «original», «musica» emotivo o «silencio». LÍNEAS ROJAS: imágenes gráficas (sangre, heridas, cuerpos, muertes), víctimas o menores identificables en situación vulnerable, delitos atribuidos a una nacionalidad, xenofobia, política partidista, burla a personas o comunidades, desinformación. PUBLICIDAD GRATIS: no uses videos cuyo fin principal sea promocionar un local, marca, producto o servicio de terceros ni donde un negocio sea protagonista; si un negocio sale de pasada, evítalo con inicio y duracion o descarta el video. RIESGO DE DERECHOS (decisión de Francisco): prefiere videos de CREADORES PEQUEÑOS o personas comunes. Clasifica cada video real en video.fuente_tipo: "creador" (persona o cuenta pequeña que grabó el video), "agregadora" (cuenta que solo reposta videos de otros, p. ej. cuentas de «virales» o de noticias de la comunidad), "medio" (canal de televisión, periódico o medio de comunicación: se ve su logo o barra) u "oficial" (gobierno o institución pública). Los videos de "medio" y de "agregadora" son los que más reclaman: NO los uses como reel; si la idea es buena, rehazla como video propio (tutorial o animado) con palabras nuestras. En las noticias, comprueba la FECHA de lo que se dice: nunca presentes como de hoy algo que es antiguo (busca la declaración original y cita su fecha). Si ninguno sirve, no uses ninguno. El reel: {"plantilla":"reel","video":{"url","autor","plataforma":"TikTok o Instagram","fuente_tipo":"creador|agregadora|medio|oficial","mensaje_aviso":"DM corto y cálido que AVISA al autor (no pide permiso): que nos gustó mucho su contenido, que lo vamos a publicar mencionándolo (@autor), que esperamos que no le moleste y que si le molesta nos avise y bajamos la publicación"},"gancho","remate","inicio","duracion","audio":"original","caption","hashtags"}; el caption DEBE dar crédito («Video de @autor en TikTok» (o «en Instagram»)). ESTILO (plantilla de marca, elige la que mejor calce con el video): "clasico" (pantalla completa, texto arriba y remate al final), "marco" (video dentro de un marco azul de VezMoney: para videos con texto propio en pantalla), "meme" (texto de meme arriba y abajo: humor), "noticia" (barra de noticiero con «EN TENDENCIA»: noticias y datos), "arriba" (gancho, crédito y cierre en una franja superior y el video completo debajo con fondo difuminado, sin tapar nada abajo: úsalo cuando el video trae subtítulos o texto propio en la parte baja, noticias con rótulos, etc.), "sutil" (lo MENOS invasivo: encabezado chico y barra final delgada; úsalo cuando el video ya trae mucho texto propio o ese texto se puede publicar tal cual). AUDIO: "original" cuando el video tiene el sonido del creador (voz, risas, ambiente) —suele ser parte de la gracia o la emoción—; si el audio es una CANCIÓN COMERCIAL usa "musica" (pista propia de VezMoney con licencia, y agrega "musica": una de gancho_urbano, latino_alegre, positivo, emotivo, humor o gaita (gaita zuliana: Zulia, la Chinita y la temporada de gaitas, sept–dic) según el ánimo) o "silencio". Agrega "estilo" y "audio" al reel. El gancho va arriba del video y el remate al final; no repitas lo que el video ya dice en pantalla. ESTRATEGIA (decisión de Francisco): SIEMPRE VIDEO. La pieza_a (publicación normal de la cuenta) y la pieza_b (reel de prueba para llegar a gente nueva) de cada idea deben ser videos, y CUALQUIERA de las dos puede ser de cualquiera de estos tres tipos, en este ORDEN DE PREFERENCIA: (1) REEL con un video real de la lista; (2) TUTORIAL dinámico propio (plantilla "tutorial"); (3) video ANIMADO con clips de stock (plantilla "animado"). El video real no tiene que ir siempre en la B: úsalo en la pieza donde calce mejor (también en la publicación normal) y la otra puede ser un tutorial o un animado. Imágenes fijas (meme, titular, pregunta, dato, versus) y carruseles solo en casos excepcionales: máximo 1 de cada 5 piezas. Evita los diseños que se ven «de inteligencia artificial» (tarjetas con degradados, fondos planos, formas decorativas): lo que se ve debe ser imagen real y movimiento.
TUTORIAL (video dinámico propio: foto real de fondo, teléfono con capturas reales del cotizador, toques, pasos que aparecen uno a uno y cierre con botón). Dos tipos: {"plantilla":"tutorial","tipo":"cotizar","destino":"Perú|Colombia|Venezuela|Argentina|Ecuador|Estados Unidos","titulo":"gancho ≤ 60, ej. ¿Tu familia está en Perú?","remate":"titular del cierre ≤ 60, ej. Cotiza Chile → Perú","musica","caption","hashtags"} (muestra cómo cotizar Chile → destino con el cotizador real; no repitas el mismo destino en la misma semana) y {"plantilla":"tutorial","tipo":"pasos","titulo":"≤ 60","pasos":["2 a 4 pasos o consejos, cada uno ≤ 70 caracteres"],"fondo":"nombre de archivo del catálogo de fotos","remate":"≤ 60","nota":"letra chica opcional ≤ 140","musica","caption","hashtags"} (lista de pasos con texto propio sobre una foto). Sin emojis dentro de los textos.
TUTORIAL INFORMATIVO A PARTIR DE UN VIDEO EN TENDENCIA: cuando un video de la lista sea INFORMATIVO (visas, trámites, requisitos, migración, noticias útiles para migrantes) y tenga vistas, NO lo republiques con su crédito: toma la INFORMACIÓN (no sus palabras, su guion ni sus imágenes) y conviértela en un tutorial propio, con nuestra marca y hablándole a la comunidad, SIN mencionar ni dar crédito a esa cuenta (no copiamos su video ni su texto: solo la información, dicha con palabras nuestras). Reglas obligatorias para temas migratorios o legales: (a) VERIFICA los datos con las herramientas de búsqueda en fuentes OFICIALES (Servicio Nacional de Migraciones y Extranjería de Chile, PDI, Migraciones del Perú, Migración Colombia, etc.) y usa solo lo que confirmes; si no puedes confirmarlo, NO hagas el tutorial; (b) agrega "tema":"migratorio", "fuente_oficial":"URL https oficial que confirma los datos" y una "nota" que diga que es información referencial y que se confirma siempre en el sitio oficial; (c) sin promesas ni asesoría legal (nada de «te aprueban» ni «garantizado»), solo información; (d) plazos, montos y requisitos tal como figuran en la fuente oficial; (e) el giro hacia VezMoney va solo en el remate, sin forzarlo; (f) pon "sensibilidad":"media" y en "nota_revision" lo que Francisco debe comprobar antes de aprobar. Para videos de humor, emoción o cultura, en cambio, sigue usando el reel con crédito.
REGLA DE ORO DE LA VERDAD VISUAL (video animado): si un texto nombra un lugar, una persona, un equipo, un evento o una obra CONCRETOS (Viña del Mar, la Vinotinto, Tomás Rincón, un teleférico, una artista), lo que se ve DEBE ser eso y no un clip genérico: en la "busqueda" de esa escena pon "commons:<nombre concreto>" (busca fotos REALES con licencia abierta en Wikimedia Commons, p. ej. "commons:Teleférico Bicentenario Santiago" o "commons:Tomás Rincón"; el crédito se agrega solo); si dudas de que exista esa foto, no nombres lo concreto: escribe el texto en términos generales. Nunca pongas un nombre propio sobre un clip de stock que no lo muestra. Las escenas genéricas siguen usando consultas en inglés para clips de stock.
Si el tema de un video real no calza, no lo fuerces: crea un tutorial o un animado.\n\n` : ""}Ideas ya propuestas en los últimos días (NO las repitas ni uses el mismo ángulo):
${historial.slice(-30).map((h) => "- " + h).join("\n") || "- (ninguna)"}

Fotos disponibles para la plantilla "meme" (solo para casos excepcionales de imagen fija; usa solo estos nombres de archivo):
${catalogo}

Si la idea tiene un día ideal de publicación (un meme de «viernes», una fecha especial como el Black Friday o un feriado), agrega "publicar_el": "AAAA-MM-DD" a la idea; si no, no pongas nada y se publica en el próximo horario libre.
Responde SOLO con el JSON {"ideas":[...]} descrito en CLAUDE.md, sin texto adicional.`;

// ── Claude + validación (un reintento si algo no cumple) ────────────────
async function pedir(extra = "") {
  const conFotos = videos.some((v) => v.fotogramas?.length);
  const txt = claude(prompt + extra, { maxTurns: 24, timeoutMin: 20, tools: ["Read", "WebSearch", "WebFetch"] });
  const { ideas } = extraerJSON(txt);
  const malas = [];
  for (const i of ideas) for (const L of ["pieza_a", "pieza_b"]) { const e = validar(i[L]); if (e.length) malas.push(`«${i.titulo}» ${L}: ${e.join("; ")}`); if (i[L]?.plantilla === "meme" && i[L].foto && !{ ...fotos.personas, ...fotos.lugares_y_cosas }[i[L].foto]) malas.push(`«${i.titulo}» ${L}: la foto ${i[L].foto} no existe en el catálogo`); }
  for (const i of ideas) { const p = i.pieza_b; if (p?.plantilla === "reel" && !videos.some((v) => v.url === p.video?.url)) malas.push(`«${i.titulo}» pieza_b: el video no está en la lista de candidatos`); const pa = i.pieza_a; if (pa?.plantilla === "reel" && !videos.some((v) => v.url === pa.video?.url)) malas.push(`«${i.titulo}» pieza_a: el video no está en la lista de candidatos`); if (pa?.plantilla === "reel" && p?.plantilla === "reel" && pa.video?.url === p.video?.url) malas.push(`«${i.titulo}»: la pieza_a y la pieza_b usan el mismo video`); if (pa?.plantilla === "reel") { const v1 = videos.find((x) => x.url === pa.video?.url); if (v1?.audio_original === false && (pa.audio ?? "original") === "original") malas.push(`«${i.titulo}» pieza_a: el audio de ese video es una canción comercial; usa "musica" o "silencio"`); if (v1) pa.video = { ...pa.video, vistas: v1.vistas, duracion_original: v1.duracion }; } if (p?.plantilla === "reel") { const v0 = videos.find((x) => x.url === p.video?.url); if (v0?.audio_original === false && (p.audio ?? "original") === "original") malas.push(`«${i.titulo}» pieza_b: el audio de ese video es una canción comercial; usa "musica" o "silencio"`); } }
  for (const i of ideas) { const p = i.pieza_b; if (p?.plantilla === "reel") { const v = videos.find((x) => x.url === p.video?.url); if (v) p.video = { ...p.video, vistas: v.vistas, duracion_original: v.duracion }; } }
  const TIPOS = ["creador", "agregadora", "medio", "oficial"];
  for (const i of ideas) for (const L of ["pieza_a", "pieza_b"]) { const p = i[L]; if (p?.plantilla !== "reel") continue; const t = p.video?.fuente_tipo; if (!TIPOS.includes(t)) malas.push(`«${i.titulo}» ${L}: falta video.fuente_tipo (creador, agregadora, medio u oficial)`); else if (!args.manual && (t === "medio" || t === "agregadora")) malas.push(`«${i.titulo}» ${L}: el video es de ${t} (riesgo alto de reclamo); usa un video de un creador pequeño o rehazlo como tutorial/animado propio`); }
  const ESTATICAS = new Set(["meme", "titular", "pregunta", "dato", "versus"]), piezas = ideas.flatMap((i) => [i.pieza_a, i.pieza_b]), est = piezas.filter((p) => ESTATICAS.has(p?.plantilla)).length, tope = Math.floor(piezas.length / 5);
  if (est > tope) malas.push(`Hay ${est} piezas de imagen fija y el tope es ${tope} (1 de cada 5): conviértelas en video (reel con video real de la lista o animado).`);
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
