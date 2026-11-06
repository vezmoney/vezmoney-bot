// _k.mjs — piezas comunes de las líneas de diseño (páginas, banderas, números exactos, montos truncados)
import { C, f, flag, arrowSvg, rateFmt, baseTxt, flagsRow, CORRIDORS } from "../common.mjs";
import { getSeries } from "../data.mjs";
export { C, f, flag, arrowSvg, rateFmt, baseTxt, flagsRow };
export const page = (inner, bg = "#fff") => `<!doctype html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=1080,height=1920"><link rel="stylesheet" href="kit.css"></head><body class="story"><div id="root" style="background:${bg}">${inner}</div></body></html>`;
export const pageFeed = (inner, bg = "#fff") => `<!doctype html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=1080,height=1350"><link rel="stylesheet" href="kit.css"></head><body class="feed"><div id="root" style="background:${bg}">${inner}</div></body></html>`;
export const A = (style, inner = "") => `<div class="abs" style="${style}">${inner}</div>`;
export const ph = (file, pos, style) => `<img src="assets/photos/${file}" style="position:absolute;object-fit:cover;object-position:${pos};${style}">`;
export const ic = (name, size, style = "", keep = false) => !keep ? "" : `<img src="assets/icons3d/${name}.png" style="display:block;width:${size}px;height:${size}px;filter:drop-shadow(0 14px 18px rgba(0,16,80,.28));${style}">`;
export const logo = (v, h, style) => `<img src="assets/logos/${v}.png" style="position:absolute;height:${h}px;${style}">`;
// la tasa NUNCA se redondea: se muestra tal cual la entrega la API (mínimo 3 decimales)
export const rt = (c, v) => rateFmt(c, v);
// el monto que recibe se trunca a 2 decimales (nunca se promete de más)
export const conv = (d, n) => f(Math.floor(n * d.cur * 100 + 1e-9) / 100, 2);
export const money = (c, n) => `${f(n)} ${c.fromUnit}`;
export const btn = (t, { bg = C.azul, color = "#fff", size = 34, arrow = C.rosa, font = "Inter" } = {}) => `<span style="display:inline-flex;align-items:center;gap:16px;background:${bg};color:${color};font-family:${font};font-weight:800;font-size:${size}px;padding:${Math.round(size * 0.44)}px ${Math.round(size * 0.6)}px ${Math.round(size * 0.44)}px ${Math.round(size * 1.0)}px;border-radius:999px;white-space:nowrap">${t}<span style="width:${Math.round(size * 1.45)}px;height:${Math.round(size * 1.45)}px;border-radius:50%;background:${arrow};color:#fff;display:inline-flex;align-items:center;justify-content:center">${arrowSvg(Math.round(size * 0.8))}</span></span>`;
export const pair = (c, size = 56, ring = "#fff", color = "currentColor") => `<span style="display:inline-flex;align-items:center;gap:12px">${flag(c.fromFlag, size, ring)}<span style="color:${color}">${arrowSvg(Math.round(size * 0.6))}</span>${flag(c.toFlag, size, ring)}</span>`;
export const chg = (d) => { const r = d.rates, p = ((d.cur - r[0]) / r[0]) * 100; return { p, up: p >= 0, txt: f(Math.abs(p), 2) }; };
// tamaño de fuente que hace caber un texto en maxW (ratio = ancho del carácter / tamaño de fuente)
export const fit = (txt, maxW, ratio, max) => Math.min(max, Math.floor(maxW / (String(txt).length * ratio)));
// datos reales del momento para un juego: Chile→Venezuela, Perú, Colombia y los 8 corredores del "corredor completo"
export async function loadCtx() {
  const get = async (k) => ({ ...(await getSeries(CORRIDORS[k].from, CORRIDORS[k].to)), cor: CORRIDORS[k] });
  const keys = ["CLVE", "CLPE", "CLCO", "CLAR", "CLEC", "CLUS", "PEVE", "COVE"];
  const all = {};
  for (const k of keys) all[k] = await get(k);
  return { x: all.CLVE, pe: all.CLPE, co: all.CLCO, all, keys };
}
// gráficas de las últimas 24 h: curva suave por los puntos REALES (no se altera ningún valor).
// El eje deja más aire debajo de la línea (bottom) para que la gráfica viva en la parte alta del recuadro.
export function trend(d, W, H, { top = 0.12, bottom = 0.6 } = {}) {
  const r = d.rates, hi = Math.max(...r), lo = Math.min(...r), rg = hi - lo || 0.001, y0 = lo - rg * bottom, y1 = hi + rg * top;
  const X = (i) => (i / (r.length - 1)) * W, Y = (v) => H - ((v - y0) / (y1 - y0)) * H, pts = r.map((v, i) => [X(i), Y(v)]), n = (v) => v.toFixed(1), k = 0.16;
  let path = `M${n(pts[0][0])} ${n(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) { const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2; path += ` C${n(p1[0] + (p2[0] - p0[0]) * k)} ${n(p1[1] + (p2[1] - p0[1]) * k)} ${n(p2[0] - (p3[0] - p1[0]) * k)} ${n(p2[1] - (p3[1] - p1[1]) * k)} ${n(p2[0])} ${n(p2[1])}`; }
  const last = pts[pts.length - 1];
  return { r, hi, lo, X, Y, path, area: `${path} L${W} ${H} L0 ${H} Z`, cx: last[0], cy: last[1], yHi: Y(hi) };
}
