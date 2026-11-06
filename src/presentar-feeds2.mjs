// presentar-feeds2.mjs — compara el feed actual de cada día con la propuesta con foto (feed2)
//   node src/presentar-feeds2.mjs  → juegos/prop/*.jpg y juegos/PROPUESTA_FEEDS.jpg
import fs from "node:fs";
import { renderPage, closeBrowser } from "./render.mjs";
import { DIAS, loadCtx, feedData } from "./juegos.mjs";
const ctx = await loadCtx();
fs.mkdirSync("juegos/prop", { recursive: true });
const cols = [];
for (const dia of [2, 3, 4, 5, 6]) {
  const D = DIAS[dia], fd = await feedData(dia, ctx);
  const a = `juegos/prop/feed_${dia}_actual.jpg`, b = `juegos/prop/feed_${dia}_propuesta.jpg`;
  await renderPage(D.skin.feed(fd.d, fd.otros), { width: 1080, height: 1350, out: a });
  await renderPage(D.skin.feed2(fd.d, fd.otros), { width: 1080, height: 1350, out: b });
  cols.push({ nombre: D.nombre, a, b });
}
const img = (s, t) => `<div style="text-align:center"><img src="${s}" style="width:340px;height:425px;border-radius:10px;box-shadow:0 6px 16px rgba(0,16,80,.3);display:block"><div style="font:700 18px Inter;color:#001C70;margin-top:6px">${t}</div></div>`;
const html = `<link rel="stylesheet" href="kit.css"><body style="margin:0;background:#EEF1FB;font-family:Inter;padding:24px 28px"><div style="font:900 40px Inter;color:#001C70;margin-bottom:12px">FEEDS · ACTUAL (arriba) vs. PROPUESTA CON FOTO (abajo)</div>
<div style="display:grid;grid-template-columns:repeat(5,340px);gap:16px 22px">${cols.map((c) => img(c.a, c.nombre + " · actual")).join("")}${cols.map((c) => img(c.b, c.nombre + " · propuesta")).join("")}</div></body>`;
await renderPage(html, { width: 1900, height: 1000, out: "juegos/PROPUESTA_FEEDS.jpg" });
await closeBrowser();
console.log("ok");
