// juegos.mjs — los 6 JUEGOS DIARIOS (lunes a sábado): 10 historias + 1 feed cada uno, que se repiten cada semana.
//   8 h grafico/hero · 9 · 10 · 11 · 12 · 13 · 14 → Chile→Venezuela (mezcla de la línea nueva del día y diseños anteriores aprobados)
//   15 h Chile→Perú · 16 h Chile→Colombia · 17 h corredor completo · feed a las 10:00 con la línea del día.
// Reglas: a las 9 y a las 11 no hay fotos de personas; una sola foto por pieza; la tasa nunca se redondea.
import { CORRIDORS, pair } from "./common.mjs";
import { getSeries } from "./data.mjs";
import { FAMILIES, wrapStory } from "./templates.mjs";
import { PHOTOS } from "./photos.mjs";
import { hoursNote, tipFor, disclaimer } from "./info.mjs";
import { PHOTOS_DEST } from "./skins/fotos.mjs";
import { loadCtx } from "./skins/_k.mjs";
import { bolsa } from "./skins/bolsa.mjs";
import { recibo } from "./skins/recibo.mjs";
import { reaccion } from "./skins/reaccion.mjs";
import { postal } from "./skins/postal.mjs";
import { pizarra } from "./skins/pizarra.mjs";
import { collage } from "./skins/collage.mjs";

// Diseños anteriores APROBADOS por el usuario (se excluyeron a_g, b_g, c_clar, c_clec, c_g, c_t, d_clpe, d_clus, f_g, f_s, f_s2)
// y la familia que acompaña a cada línea nueva por afinidad de color.
export const DIAS = {
  1: { nombre: "Lunes", skin: bolsa, fam: "E", viejos: { 10: "s", 12: "g", 14: "q" }, feed: { tipo: "uno" } },
  2: { nombre: "Martes", skin: recibo, fam: "B", viejos: { 10: "s", 12: "q", 14: "t" }, feed: { tipo: "tres" } },
  3: { nombre: "Miércoles", skin: reaccion, fam: "C", viejos: { 10: "s", 12: "q", 14: "s2" }, feed: { tipo: "uno" } },
  4: { nombre: "Jueves", skin: postal, fam: "F", viejos: { 12: "q", 14: "t" }, extra10: "hero2", feed: { tipo: "peru" } },
  5: { nombre: "Viernes", skin: pizarra, fam: "D", viejos: { 10: "s", 12: "g", 14: "t" }, feed: { tipo: "uno" } },
  6: { nombre: "Sábado", skin: collage, fam: "A", viejos: { 10: "s", 12: "q", 14: "t" }, feed: { tipo: "col" } },
};
export const HORAS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

function viejo(fam, key, x, hour, weekday) {
  const second = key === "s2", k = second ? "s" : key, p = PHOTOS[fam][k][second ? 1 : 0];
  const xx = { ...x, set: fam, second, disc: false, photo: p.file, pos: p.pos, tip: tipFor(5, 0), note: hoursNote(weekday, hour), disclaimer: disclaimer(x.hh) };
  return wrapStory(FAMILIES[fam][k](xx));
}

// datos del feed del día: principal y "otros" (si el día los lleva)
export async function feedData(dia, ctx) {
  const t = DIAS[dia].feed.tipo, get = async (a, b) => { const c = pair(a, b); return { ...(await getSeries(c.from, c.to)), cor: c }; };
  if (t === "uno") return { d: ctx.x, otros: null };
  if (t === "tres") return { d: ctx.x, otros: ["CLPE", "CLAR", "CLEC", "CLCO", "CLUS"].map((k) => ctx.all[k]) };
  const o = t === "peru" ? "PE" : "CO";
  const main = await get(o, "VE");
  const otros = []; for (const to of ["CL", ...(o === "PE" ? ["CO"] : ["PE"]), "AR", "EC", "US"]) otros.push(await get(o, to));
  return { d: main, otros };
}

// devuelve [{hora, id, html, alto}] de un día, más el feed
export async function armarDia(dia, ctx) {
  const D = DIAS[dia], sk = D.skin, W = dia, foto = { PE: PHOTOS_DEST.PE[(dia - 1) % 6], CO: PHOTOS_DEST.CO[(dia - 1) % 6] };
  const nuevos = { 8: ["hero", () => sk.hero(ctx.x)], 9: ["grafico", () => sk.grafico(ctx.x)], 11: ["calc", () => sk.calc(ctx.x)], 13: ["montos", () => sk.montos(ctx.x)], 15: ["corrPE", () => sk.corr(ctx.pe, foto.PE)], 16: ["corrCO", () => sk.corr(ctx.co, foto.CO)], 17: ["todos", () => sk.todos(ctx)] };
  const out = [];
  for (const h of HORAS) {
    if (nuevos[h]) out.push({ hora: h, id: nuevos[h][0], origen: "nuevo", html: nuevos[h][1](), alto: 1920 });
    else if (D.viejos[h]) out.push({ hora: h, id: `${D.fam}_${D.viejos[h]}`, origen: "anterior", html: viejo(D.fam, D.viejos[h], ctx.x, h, W), alto: 1920 });
    else out.push({ hora: h, id: D.extra10 ?? "hero2", origen: "nuevo", html: sk[D.extra10 ?? "hero2"](ctx.x), alto: 1920 });
  }
  const fd = await feedData(dia, ctx);
  out.push({ hora: 10, id: "feed", origen: "nuevo", html: sk.feed(fd.d, fd.otros), alto: 1350, esFeed: true });
  return out;
}
export { loadCtx };
