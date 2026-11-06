// muestra.mjs — valida y renderiza todas las ideas de un archivo y arma una lámina para revisarlas. No envía nada.
//   node src/tendencias/muestra.mjs tendencias/ideas/2026-11-06.json
import fs from "node:fs";
import { renderPage, closeBrowser } from "../render.mjs";
import { html, validar } from "./disenos.mjs";
const ideas = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
fs.mkdirSync("juegos/tendencias", { recursive: true });
const cards = [];
for (const i of ideas) for (const L of ["a", "b"]) {
  const p = i[`pieza_${L}`], e = validar(p);
  if (e.length) console.log(`✗ ${i.id} ${L.toUpperCase()}: ${e.join("; ")}`);
  const file = `juegos/tendencias/${i.id}-${L.toUpperCase()}.jpg`;
  await renderPage(html(p), { width: 1080, height: 1350, out: file });
  cards.push({ file, t: `${i.id} · ${L.toUpperCase()} · ${p.plantilla} — ${i.titulo.slice(0, 48)}` });
}
const w = 380, h = 475, cols = 5;
const doc = `<link rel="stylesheet" href="kit.css"><body style="margin:0;background:#EEF1FB;font-family:Inter;padding:20px"><div style="font:900 34px Inter;color:#001C70;margin-bottom:12px">IDEAS DEL ${ideas[0].fecha} · pieza A (publicación) y pieza B (alcance)</div><div style="display:grid;grid-template-columns:repeat(${cols},${w}px);gap:16px">${cards.map((c) => `<div><img src="${c.file}" style="width:${w}px;height:${h}px;border-radius:10px;box-shadow:0 6px 16px rgba(0,16,80,.3);display:block"><div style="font:600 15px Inter;color:#001C70;margin-top:4px;width:${w}px">${c.t}</div></div>`).join("")}</div></body>`;
await renderPage(doc, { width: cols * (w + 16) + 40, height: Math.ceil(cards.length / cols) * (h + 50) + 100, out: "juegos/IDEAS_MUESTRA.jpg" });
await closeBrowser();
console.log("ok");
