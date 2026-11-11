// disenar.mjs — de una idea aprobada genera sus dos piezas (A y B): guarda el JSON de cada pieza, renderiza la imagen y deja un manifiesto para enviarlas a Telegram.
//   node src/tendencias/disenar.mjs <idaId> [--archivo=tendencias/ideas/2026-11-06.json]
//   node src/tendencias/disenar.mjs --pieza=<ideaId>-A      (vuelve a renderizar una pieza ya guardada, p. ej. tras una corrección)
import fs from "node:fs";
import path from "node:path";
import { renderPage, closeBrowser } from "../render.mjs";
import { html, validar } from "./disenos.mjs";
import { crearReel } from "./reel.mjs";
import { crearAnimado } from "./animado.mjs";
import { crearTutorial } from "./tutorial.mjs";

const args = Object.fromEntries(process.argv.slice(2).filter((a) => a.startsWith("--")).map((a) => { const [k, ...v] = a.replace(/^--/, "").split("="); return [k, v.length ? v.join("=") : true]; }));
const pos = process.argv.slice(2).filter((a) => !a.startsWith("--"));
fs.mkdirSync("tendencias/piezas", { recursive: true });
fs.mkdirSync("out/tendencias", { recursive: true });

function buscarIdea(id) {
  const archivos = args.archivo ? [args.archivo] : fs.readdirSync("tendencias/ideas").filter((f) => f.endsWith(".json")).map((f) => path.join("tendencias/ideas", f));
  for (const f of archivos) { const i = JSON.parse(fs.readFileSync(f, "utf8")).find((x) => x.id === id); if (i) return i; }
  throw new Error("No encuentro la idea " + id);
}

async function renderPieza(id) {
  const pieza = JSON.parse(fs.readFileSync(`tendencias/piezas/${id}.json`, "utf8"));
  const errs = validar(pieza);
  if (errs.length) throw new Error(`La pieza ${id} no cumple: ${errs.join("; ")}`);
  if (pieza.plantilla === "reel") { const r = await crearReel(pieza, id, { token: process.env.APIFY_TOKEN }); console.log(`Reel ${id}: ${r.segundos}s, ${r.mb} MB`); return { id, archivo: r.archivo, video: r.archivo, miniatura: r.miniatura, pieza }; }
  if (pieza.plantilla === "tutorial") { const r = await crearTutorial(pieza, id); console.log(`Tutorial ${id}: ${r.segundos}s, ${r.mb} MB${r.tasa ? ", tasa mostrada " + r.tasa : ""}`); return { id, archivo: r.archivo, video: r.archivo, miniatura: r.miniatura, pieza }; }
  if (pieza.plantilla === "animado") { const r = await crearAnimado(pieza, id); console.log(`Video animado ${id}: ${r.segundos}s, ${r.mb} MB, clips: ${r.clips.join(", ")}`); const cred = r.creditos?.length ? "\n\n📷 " + [...new Set(r.creditos)].join(" · ") : ""; return { id, archivo: r.archivo, video: r.archivo, miniatura: r.miniatura, pieza: cred ? { ...pieza, caption: pieza.caption + cred } : pieza }; }
  const version = Date.now().toString(36); // el nombre cambia con cada versión (evita la caché de GitHub y de Telegram)
  const archivo = `out/tendencias/${id}_${version}.jpg`;
  await renderPage(html(pieza), { width: 1080, height: 1350, out: archivo });
  return { id, archivo, pieza };
}

const hechas = [];
if (args.pieza) hechas.push(await renderPieza(args.pieza));
else {
  const idea = buscarIdea(pos[0]);
  for (const L of ["A", "B"]) {
    const id = `${idea.id}-${L}`;
    fs.writeFileSync(`tendencias/piezas/${id}.json`, JSON.stringify({ ...idea[`pieza_${L.toLowerCase()}`], ...(idea.publicar_el ? { fecha_publicacion: idea.publicar_el } : {}), _idea: idea.id, _letra: L, _titulo: idea.titulo }, null, 2));
    hechas.push(await renderPieza(id));
  }
}
await closeBrowser();
// manifiesto: lo lee enviar.mjs después de que el flujo suba las imágenes a GitHub
fs.writeFileSync("out/tendencias/_manifiesto.json", JSON.stringify(hechas.map(({ id, archivo, pieza, video, miniatura }) => ({ id, archivo, video, miniatura, fecha: pieza.fecha_publicacion, idea: pieza._idea, letra: pieza._letra, titulo: pieza._titulo, caption: pieza.caption, hashtags: pieza.hashtags })), null, 2));
console.log("Listo:", hechas.map((h) => h.archivo).join(", "));
