// presentar-mes.mjs — feeds del mes: ajustes de la semana 1 y los 18 diseños de las semanas 2 a 4
//   node src/presentar-mes.mjs [semana]  → juegos/mes/*.jpg y láminas juegos/MES_*.jpg
import fs from "node:fs";
import { renderPage, closeBrowser } from "./render.mjs";
import { DIAS, loadCtx, feedData } from "./juegos.mjs";
import { FEEDS_MES } from "./skins/feeds-mes.mjs";
const solo = process.argv[2] ? Number(process.argv[2]) : 0;
const ctx = await loadCtx();
fs.mkdirSync("juegos/mes", { recursive: true });
const NOM = { 1: "Lunes", 2: "Martes", 3: "Miércoles", 4: "Jueves", 5: "Viernes", 6: "Sábado" };
const hoja = async (titulo, items, cols, out, w = 520) => {
  const h = Math.round(w * 1.25);
  const html = `<link rel="stylesheet" href="kit.css"><body style="margin:0;background:#EEF1FB;font-family:Inter;padding:24px 28px"><div style="font:900 40px Inter;color:#001C70;margin-bottom:14px">${titulo}</div><div style="display:grid;grid-template-columns:repeat(${cols},${w}px);gap:18px 22px">${items.map((i) => `<div><img src="${i.file}" style="width:${w}px;height:${h}px;border-radius:10px;box-shadow:0 6px 16px rgba(0,16,80,.3);display:block"><div style="font:700 20px Inter;color:#001C70;margin-top:6px">${i.t}</div></div>`).join("")}</div></body>`;
  const rows = Math.ceil(items.length / cols);
  await renderPage(html, { width: cols * (w + 22) + 60, height: rows * (h + 56) + 110, out });
};
if (!solo || solo === 1) {
  const items = [];
  for (const dia of [2, 3, 5, 6]) {
    const D = DIAS[dia], fd = await feedData(dia, ctx), file = `juegos/mes/s1_${dia}.jpg`;
    await renderPage(D.skin.feed2(fd.d, fd.otros), { width: 1080, height: 1350, out: file });
    items.push({ file, t: `${NOM[dia]} · semana 1 (ajustado)` });
  }
  await hoja("SEMANA 1 · AJUSTES A LOS FEEDS", items, 4, "juegos/MES_S1_ajustes.jpg", 440);
}
for (const sem of [2, 3, 4]) {
  if (solo && solo !== sem) continue;
  const items = [];
  for (const x of FEEDS_MES.filter((z) => z.sem === sem)) {
    const fd = await feedData(x.dia, ctx), file = `juegos/mes/${x.id}.jpg`;
    await renderPage(x.render(fd.d, fd.otros), { width: 1080, height: 1350, out: file });
    items.push({ file, t: `${NOM[x.dia]} · ${x.nombre}` });
  }
  await hoja(`SEMANA ${sem} · FEEDS PROPUESTOS`, items, 3, `juegos/MES_S${sem}.jpg`);
}
await closeBrowser();
console.log("ok");
