// fam-a.mjs — FAMILIA A · LUNES · "Nube": fondo claro, tarjetas blancas, marcos de foto redondeados, azul sobre blanco. Minimalista.
// Logos por plantilla (varían a propósito): s completo · g colibrí · t sin logo · q completo.
import { C, flag, flagsRow, arrowSvg, rateFmt, baseTxt, unitRate, conv, money, varPct, mark, pillInfo, bigFlags, orb, sticker, cta, hl, frame, photo, footer, bgNube, chart, statChips, tableCard, quote, chip } from "./common.mjs";

export const style = "pill";
const F = (x) => footer(x, { ink: C.azul, dim: C.gris, acc: C.vez, tip: false });

// A1 · Sorpresa: foto en marco redondeado + monto grande
export function s(x) {
  const c = x.cor;
  return `${bgNube}
  ${orb("left:-200px;top:1180px;width:620px;height:620px;background:rgba(91,140,255,.12)")}
  ${mark(x.second ? "iso" : "full", "light")}
  ${frame(x, { l: 70, t: 220, w: 940, h: 800, shape: "squircle", r: 90, bw: 14 })}
  ${sticker("¡Mira la tasa!", C.azul, "#fff", "right:46px;top:190px;transform:rotate(6deg)")}
  ${chip(x, C.vez, "#fff", "left:50%;top:965px;transform:translateX(-50%) rotate(-2deg)", 54)}
  <div class="abs" style="left:70px;right:70px;top:1130px;text-align:center">
    <div style="font-weight:600;font-size:42px;color:${C.gris}">Si envías <b class="m" style="color:${C.azul};font-weight:800">${money(c, c.amounts[0])}</b>, recibe</div>
    <div class="m" style="font-weight:900;font-size:134px;letter-spacing:-.03em;line-height:1.1;color:${C.vez};margin-top:4px">${conv(x, c.amounts[0])} ${c.unit}</div>
    <div style="margin-top:20px">${pillInfo(x)}</div>
  </div>
  <div class="abs" style="left:70px;right:70px;top:1490px;text-align:center">${cta("COTIZAR EN VEZMONEY.COM")}</div>
  ${F(x)}`;
}

// A2 · Gráfico de área (sin foto)
export function g(x) {
  const c = x.cor;
  return `${bgNube}
  ${orb("right:-220px;top:-160px;width:640px;height:640px;background:rgba(91,140,255,.14)")}
  ${mark("iso", "light")}
  <div class="abs" style="left:0;right:0;top:250px">${bigFlags(c, 130, "#fff", C.azul)}</div>
  <div class="abs" style="left:70px;right:70px;top:430px;text-align:center"><div class="m" style="font-weight:900;font-size:104px;line-height:1.02;letter-spacing:-.04em;color:${C.azul}">Así va<br><span style="color:${C.vez}">la tasa hoy</span></div></div>
  <div class="abs" style="left:56px;right:56px;top:760px;background:#fff;border-radius:44px;padding:30px 36px 24px;box-shadow:0 24px 60px rgba(0,22,80,.16)">
    <div style="font-weight:600;font-size:26px;color:${C.gris};margin-bottom:4px">Últimas 24 horas · variación de ${varPct(x)} %</div>
    ${chart(x, 920, 420, "area", { line: C.vez, area: C.cielo, ink: C.azul })}
    <div style="display:flex;justify-content:space-between;margin-top:6px;font-weight:600;font-size:25px;color:${C.gris}"><span>hace 24 h</span><span>ahora</span></div>
  </div>
  <div class="abs" style="left:56px;right:56px;top:1300px;display:flex;gap:18px">${statChips(x, { bg: "#fff", ink: C.azul, hiBg: C.azul, hiInk: "#fff" })}</div>
  <div class="abs" style="left:70px;right:70px;top:1490px;text-align:center">${cta("COTIZA EN VEZMONEY.COM")}</div>
  ${F(x)}`;
}

// A3 · Tabla de montos sobre foto a todo el ancho (sin logo)
export function t(x, copy = {}) {
  const c = x.cor;
  const l1 = copy.l1 ?? "Mira cuánto", l2 = copy.l2 ?? "recibe **tu gente**";
  return `${bgNube}
  ${photo(x, "left:0;top:0;width:1080px;height:1020px;clip-path:inset(0 0 0 0 round 0 0 90px 90px)")}
  <div class="abs" style="left:0;top:0;width:1080px;height:1020px;border-radius:0 0 90px 90px;background:linear-gradient(to bottom,rgba(0,28,112,.62) 0%,rgba(0,28,112,.12) 38%,rgba(0,28,112,.72) 100%)"></div>
  <div class="abs" style="top:150px;left:70px;right:70px;text-align:center">${pillInfo(x)}</div>
  <div class="abs" style="top:300px;left:70px;right:70px;text-align:center"><div class="m" style="font-weight:900;font-size:104px;line-height:1.04;color:#fff;letter-spacing:-.03em;text-shadow:0 4px 30px rgba(0,0,0,.35)">${l1}<br>${hl(l2, "#9FBBFF")}</div></div>
  <div class="abs" style="left:60px;right:60px;top:900px">${tableCard(x, { rowInk: C.azul, numInk: C.vez, border: "rgba(0,28,112,.12)" })}</div>
  <div class="abs" style="top:1290px;left:70px;right:70px;text-align:center;color:${C.azul}"><div style="font-weight:700;font-size:40px">${unitRate(c, x.cur)}</div></div>
  <div class="abs" style="top:1490px;left:70px;right:70px;text-align:center">${cta(copy.cta ?? "ENVIAR AHORA")}</div>
  ${F(x)}`;
}

// A4 · Cotizador clásico (sin foto)
export function q(x) {
  const c = x.cor;
  return `${bgNube}
  ${orb("left:-180px;top:-120px;width:560px;height:560px;background:rgba(91,140,255,.18)")}
  ${mark("full", "light")}
  <div class="abs" style="left:70px;right:70px;top:280px;text-align:center"><div class="m" style="font-weight:900;font-size:104px;line-height:1.02;letter-spacing:-.04em;color:${C.azul}">Cotiza<br><span style="color:${C.vez}">en segundos</span></div><div style="margin-top:30px">${pillInfo(x)}</div></div>
  ${quote(x, { bg: "#fff", ink: C.azul, boxBg: C.nube, boxInk: C.azul, numInk: C.vez, arrowBg: C.rosa, rateBg: C.azul, rateInk: "#fff", style: "left:56px;right:56px;top:690px" })}
  <div class="abs" style="left:70px;right:70px;top:1490px;text-align:center">${cta("ENVIAR EN VEZMONEY.COM")}</div>
  ${F(x)}`;
}
