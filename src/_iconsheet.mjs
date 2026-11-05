import { ico } from "./icons3d.mjs";
import { renderPage, closeBrowser } from "./render.mjs";
const items = [ico.coin(220), ico.coin(220,{tone:"oro"}), ico.coin(220,{tone:"azul",sym:"Bs"}), ico.bill(220), ico.bill(220,{tone:"oro",sym:"$"}), ico.plane(220), ico.globe(220), ico.phone(220), ico.bars(220), ico.ticket(220), ico.spark(220), ico.pin(220), ico.shield(220), ico.coin(220,{tone:"rosa"}), ico.bill(220,{tone:"turq"}), ico.plane(220,{tone:"oro"})];
const html = `<body style="margin:0;background:#EEF1FB;font-family:Inter"><div style="display:grid;grid-template-columns:repeat(8,240px);gap:10px;padding:20px">${items.map((s) => `<div style="background:#fff;border-radius:20px;padding:10px">${s}</div>`).join("")}</div></body>`;
await renderPage(html, { width: 2060, height: 560, out: "sheets/iconos3d.jpg" });
await closeBrowser();
