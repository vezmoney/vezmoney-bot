// presentar-juegos.mjs — genera las 10 historias + el feed de cada día y una lámina por día para revisar
//   node src/presentar-juegos.mjs [dia]   → juegos/dia_N/HH_id.jpg y juegos/DIA_N_<nombre>.jpg
import fs from "node:fs";
import { renderPage, closeBrowser } from "./render.mjs";
import { DIAS, armarDia, loadCtx } from "./juegos.mjs";
const solo = process.argv[2] ? [Number(process.argv[2])] : [1, 2, 3, 4, 5, 6];
const ctx = await loadCtx();
for (const dia of solo) {
  const dir = `juegos/dia_${dia}`; fs.mkdirSync(dir, { recursive: true });
  const piezas = await armarDia(dia, ctx);
  for (const p of piezas) { p.file = `${dir}/${p.esFeed ? "feed" : String(p.hora).padStart(2, "0")}_${p.id}.jpg`; await renderPage(p.html, { width: 1080, height: p.alto, out: p.file }); }
  const hist = piezas.filter((p) => !p.esFeed), feed = piezas.find((p) => p.esFeed), D = DIAS[dia];
  const card = (p) => `<div style="width:230px"><img src="${p.file}" style="width:230px;height:409px;object-fit:cover;border-radius:10px;display:block;box-shadow:0 6px 16px rgba(0,16,80,.25)"><div style="font:600 17px Inter;color:#001C70;margin-top:6px">${String(p.hora).padStart(2, "0")}:00 · ${p.id}${p.origen === "anterior" ? " (anterior)" : ""}</div></div>`;
  const html = `<link rel="stylesheet" href="kit.css"><body style="margin:0;background:#EEF1FB;font-family:Inter"><div style="padding:28px 34px 10px"><span style="font:900 56px Inter;color:#001C70">${D.nombre.toUpperCase()}</span> <span style="font:600 26px Inter;color:#5D6574;margin-left:14px">Línea «${D.skin.nombre}» + familia ${D.fam} · 10 historias de tasa y feed de las 10:00</span></div>
  <div style="display:flex;gap:30px;padding:10px 34px 30px"><div style="display:grid;grid-template-columns:repeat(5,230px);gap:22px 18px">${hist.map(card).join("")}</div>
  <div><div style="font:800 24px Inter;color:#001C70;margin-bottom:8px">FEED · 10:00</div><img src="${feed.file}" style="width:520px;height:650px;object-fit:cover;border-radius:12px;box-shadow:0 8px 22px rgba(0,16,80,.3)"></div></div></body>`;
  await renderPage(html, { width: 1900, height: 1100, out: `juegos/DIA_${dia}_${D.nombre}.jpg` });
  console.log("ok", D.nombre);
}
await closeBrowser();
