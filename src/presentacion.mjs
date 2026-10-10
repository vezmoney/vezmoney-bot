// presentacion.mjs — hojas de presentación por día (7 historias + feed) para revisar los diseños: node src/presentacion.mjs
import fs from "node:fs";
import { getSeries } from "./data.mjs";
import { hoursNote, tipFor, disclaimer } from "./info.mjs";
import { CORRIDORS } from "./common.mjs";
import { FAMILIES, FAMILY_FOR_WEEKDAY, AFTERNOON, wrapStory } from "./templates.mjs";
import { FEED_PLAN, buildFeed } from "./feed.mjs";
import { PHOTOS, FEED_PHOTOS } from "./photos.mjs";
import { renderPage, closeBrowser } from "./render.mjs";

const DAYS = { 1: ["LUNES", "Familia A · «Nube»", "Fondo claro, tarjetas blancas y marcos redondeados; azul sobre blanco.", "Feed 9:00 · Chile → Venezuela (tasa del momento + mini gráfico de 24 h)"],
  2: ["MARTES", "Familia B · «Azul profundo»", "Azul de marca con alas translúcidas y rutas punteadas; texto blanco.", "Feed 9:00 · Chile → Venezuela + Chile → Perú, Argentina, Ecuador, Colombia y EE. UU. en el mismo creativo"],
  3: ["MIÉRCOLES", "Familia C · «Cielo»", "Degradado azul cielo luminoso con círculos grandes y un toque turquesa.", "Feed 9:00 · Chile → Venezuela (tabla de montos)"],
  4: ["JUEVES", "Familia D · «Blanco editorial»", "Página blanca, tipografía grande y bloques azul profundo; boleto de envío.", "Feed 9:00 · Perú → Venezuela, Chile, Colombia, Argentina, Ecuador y EE. UU."],
  5: ["VIERNES", "Familia E · «Foto duotono»", "Foto a pantalla completa teñida de azul y tarjetas de vidrio.", "Feed 9:00 · Chile → Venezuela (cotizador)"],
  6: ["SÁBADO", "Familia F · «Lavanda»", "Fondo lavanda con formas lúdicas, toques turquesa y tarjetas apiladas.", "Feed 9:00 · Colombia → Venezuela, Chile, Perú, Argentina, Ecuador y EE. UU."] };
const series = {};
const get = async (p) => (series[p.key] ??= await getSeries(p.from, p.to));
fs.mkdirSync("pres", { recursive: true });
const only = process.argv[2];
for (const wd of [1, 2, 3, 4, 5, 6]) {
  if (only && String(wd) !== only) continue;
  const fam = FAMILY_FOR_WEEKDAY[wd], F = FAMILIES[fam], P = PHOTOS[fam];
  const ctx = async (code, photo, second = false) => { const cor = CORRIDORS[code], d = await get(cor); return { ...d, cor, set: fam, second, disc: false, photo: photo.file, pos: photo.pos, tip: tipFor(5, 0), note: hoursNote(wd, 10), disclaimer: disclaimer(d.hh) }; };
  const hrsPeCo = wd === 6 ? [13, 14] : [15, 16], [c1, c2] = AFTERNOON[wd];
  const items = [
    ["8:00 · Chile → Venezuela", "s", "CLVE", P.s[0], false], ["9:00 · Chile → Venezuela", "g", "CLVE", P.g[0], false], ["10:00 · Chile → Venezuela", "t", "CLVE", P.t[0], false], ["11:00 · Chile → Venezuela", "q", "CLVE", P.q[0], false],
    ["12:00 · Chile → Venezuela", "s", "CLVE", P.s[1], true], [`${hrsPeCo[0]}:00 · ${CORRIDORS[c1].label}`, "corridor", c1, P.corridor[c1][0], false], [`${hrsPeCo[1]}:00 · ${CORRIDORS[c2].label}`, "corridor", c2, P.corridor[c2][0], false],
  ];
  const files = [];
  for (const [i, [label, key, code, photo, second]] of items.entries()) {
    const out = `pres/${wd}_s${i}.jpg`;
    await renderPage(wrapStory(F[key](await ctx(code, photo, second))), { width: 1080, height: 1920, out });
    files.push([label, out]);
  }
  const fk = `f${wd}`, plan = FEED_PLAN[fk], d = await get(plan.main);
  const list = plan.others ? await Promise.all(plan.others.map(async (o) => ({ o, cur: (await get(o)).cur }))) : [];
  const fx = { ...d, cor: plan.main, list, photo: FEED_PHOTOS[fk].file, pos: FEED_PHOTOS[fk].pos, tip: "", note: hoursNote(wd, 10), disclaimer: disclaimer(d.hh) };
  await renderPage(buildFeed(fk, fx), { width: 1080, height: 1350, out: `pres/${wd}_feed.jpg` });
  const [dia, famName, desc, feedTxt] = DAYS[wd];
  const html = `<body style="margin:0;background:#eef1fb;font-family:Inter,Arial,sans-serif;color:#001C70"><div style="padding:34px 40px 40px;width:2380px">
    <div style="display:flex;align-items:baseline;gap:22px"><span style="font-weight:900;font-size:54px;letter-spacing:-.02em">${dia}</span><span style="font-weight:800;font-size:34px;color:#03258C">${famName}</span><span style="font-weight:500;font-size:26px;color:#5D6574">${desc}</span></div>
    <div style="font-weight:700;font-size:24px;color:#5D6574;margin:26px 0 12px">HISTORIAS DE TASA (7 al día · se repiten cada semana)</div>
    <div style="display:flex;gap:16px">${files.map(([l, o]) => `<div style="width:316px"><img src="${o}" style="width:316px;height:562px;display:block;border-radius:14px;box-shadow:0 8px 24px rgba(0,28,112,.22)"><div style="font-weight:700;font-size:20px;margin-top:8px;color:#001C70">${l}</div></div>`).join("")}</div>
    <div style="font-weight:700;font-size:24px;color:#5D6574;margin:28px 0 12px">POST DE FEED</div>
    <div style="display:flex;gap:30px;align-items:flex-start"><img src="pres/${wd}_feed.jpg" style="width:700px;height:875px;border-radius:14px;box-shadow:0 8px 24px rgba(0,28,112,.22)"><div style="font-weight:700;font-size:30px;line-height:1.35;max-width:760px">${feedTxt}</div></div>
  </div></body>`;
  await renderPage(html, { width: 2460, height: 1770, out: `pres/DIA_${wd}_${dia}.jpg` });
  console.log("ok", dia);
}
await closeBrowser();
