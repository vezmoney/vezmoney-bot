// ideas.mjs — cada mañana: recolecta tendencias y noticias, le pide a Claude ideas (con sus dos piezas) y las manda a Telegram para la 1.ª aprobación.
//   node src/tendencias/ideas.mjs [--dry] [--n=4] [--manual="texto o link"]
//   --dry: no envía nada a Telegram, solo guarda y muestra.   --manual: una idea a partir de lo que mande el usuario por Telegram (/idea ...).
import fs from "node:fs";
import { recolectar } from "./fuentes.mjs";
import { claude, extraerJSON } from "./claude.mjs";
import { validar } from "./disenos.mjs";

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
const proximas = fechas.fechas.filter((f) => { const d = diasHasta(f.fecha); return d >= 0 && d <= cfg.horizonteFechasDias; }).map((f) => ({ ...f, en_dias: diasHasta(f.fecha) }));

// ── prompt ──────────────────────────────────────────────────────────────
const linea = (s) => `- [${s.tipo}${s.pais ? " " + s.pais : ""}] ${s.titulo}${s.medio ? " (" + s.medio + ")" : ""}${s.trafico ? " · búsquedas " + s.trafico : ""}${s.contexto?.length ? " · contexto: " + s.contexto.join(" / ") : ""}${s.url ? " · " + s.url : ""}`;
const catalogo = Object.entries({ ...fotos.personas, ...fotos.lugares_y_cosas }).map(([k, v]) => `${k}: ${v}`).join("\n");
const prompt = `Hoy es ${hoy} (hora de Chile). Lee CLAUDE.md y sigue SUS reglas al pie de la letra.

${args.manual ? `Francisco (el usuario) te pasó por Telegram esto para convertirlo en contenido:\n${linea(senales[0])}\n\nPropón exactamente 1 idea basada en eso.` : `Estas son las señales de HOY (tendencias de búsqueda y noticias de las últimas ${cfg.ventanaNoticiasDias} días). Muchas NO sirven (son sensibles o irrelevantes): descártalas sin comentar.\n${senales.map(linea).join("\n")}\n\nFechas especiales próximas:\n${proximas.length ? proximas.map((f) => `- ${f.fecha} (en ${f.en_dias} días): ${f.nombre}${f.nota ? " — " + f.nota : ""}${f.cierre ? " · " + f.cierre : ""}`).join("\n") : "- ninguna en los próximos días"}\n\nRecurrente: fin de mes y quincena son días de pago, cuando más gente envía dinero a casa.\n\nPropón ${N} ideas, mezcladas (tendencia/cultura/humor, noticia útil, fecha especial si hay una cerca, y un evergreen si hace falta). Si hay menos señales buenas que ${N}, propón menos: nunca rellenes con ideas flojas o forzadas.`}

Ideas ya propuestas en los últimos días (NO las repitas ni uses el mismo ángulo):
${historial.slice(-30).map((h) => "- " + h).join("\n") || "- (ninguna)"}

Fotos disponibles para la plantilla "meme" (usa solo estos nombres de archivo):
${catalogo}

Responde SOLO con el JSON {"ideas":[...]} descrito en CLAUDE.md, sin texto adicional.`;

// ── Claude + validación (un reintento si algo no cumple) ────────────────
async function pedir(extra = "") {
  const txt = claude(prompt + extra, { maxTurns: 3 });
  const { ideas } = extraerJSON(txt);
  const malas = [];
  for (const i of ideas) for (const L of ["pieza_a", "pieza_b"]) { const e = validar(i[L]); if (e.length) malas.push(`«${i.titulo}» ${L}: ${e.join("; ")}`); if (i[L]?.plantilla === "meme" && i[L].foto && !{ ...fotos.personas, ...fotos.lugares_y_cosas }[i[L].foto]) malas.push(`«${i.titulo}» ${L}: la foto ${i[L].foto} no existe en el catálogo`); }
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

if (!args.dry && process.env.WORKER_URL && process.env.ADMIN_KEY) {
  for (const i of salida) {
    const r = await fetch(process.env.WORKER_URL.replace(/\/$/, "") + "/admin/idea", { method: "POST", headers: { "X-Admin-Key": process.env.ADMIN_KEY, "content-type": "application/json" }, body: JSON.stringify({ id: i.id, idea: i }) });
    console.log("Telegram", i.id, r.status);
  }
} else console.log("\n(modo prueba: no se envió a Telegram)");
