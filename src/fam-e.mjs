// fam-e.mjs — FAMILIA E · VIERNES · "Foto duotono": foto a pantalla completa teñida de azul y tarjetas de vidrio. Minimalista.
// Logos por plantilla: s colibrí · g sin logo · t completo · q completo. Solo la de las 9:00 (g) pierde la foto.
import { C, flag, flagsRow, arrowSvg, rateFmt, baseTxt, unitRate, conv, money, varPct, mark, pillInfo, bigFlags, photo, orb, sticker, cta, hl, frame, footer, bgAzul, wing, chart, statChips, tablePills } from "./common.mjs";

export const style = "pill";
const glass = (a = 0.14) => `background:rgba(255,255,255,${a});border:2px solid rgba(255,255,255,.38);backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px)`;
const glassPill = { bg: "rgba(255,255,255,.16)", color: "#fff", border: "2px solid rgba(255,255,255,.45)" };
const F = (x) => footer(x, { ink: "#fff", dim: "rgba(255,255,255,.82)", acc: "#DCE6FF", tip: false });
const full = (x, { top = -250, h = 2170, grad = "linear-gradient(to bottom,rgba(0,28,112,.62) 0%,rgba(3,37,140,.28) 38%,rgba(0,22,90,.86) 100%)" } = {}) =>
  `${photo(x, `left:0;top:${top}px;width:1080px;height:${h}px;`)}<div class="abs" style="inset:0;background:${grad}"></div>`;

// E1 · Foto completa + tarjeta de vidrio con la tasa
export function s(x) {
  const c = x.cor;
  return `${full(x)}
  ${mark(x.second ? "none" : "iso", "dark")}
  ${sticker("¡Oportunidad!", C.turq, C.azul, "right:50px;top:250px;transform:rotate(6deg)", 42)}
  <div class="abs" style="left:56px;right:56px;top:880px;${glass(0.14)};border-radius:56px;padding:48px 44px 44px;text-align:center;color:#fff;box-shadow:0 30px 80px rgba(0,0,0,.3)">
    <div style="display:flex;justify-content:center;align-items:center;gap:18px">${flagsRow(c, 70, "#fff", "#fff")}<span class="m" style="font-weight:800;font-size:28px;color:#DCE6FF">Tasa de las ${x.hh}</span></div>
    <div class="m" style="font-weight:700;font-size:48px;margin-top:26px">${baseTxt(c)} ${c.fromUnit} =</div>
    <div class="m" style="font-weight:900;font-size:154px;letter-spacing:-.05em;line-height:1;margin-top:2px">${rateFmt(c, x.cur)} <span style="color:#9FBBFF;font-size:98px">${c.unit}</span></div>
    <div style="font-weight:600;font-size:38px;margin-top:26px">Con <b class="m">${money(c, c.amounts[0])}</b> recibe <b class="m" style="color:#9FBBFF">${conv(x, c.amounts[0])} ${c.unit}</b></div>
  </div>
  <div class="abs" style="left:70px;right:70px;top:1490px;text-align:center">${cta("COTIZAR AHORA", "#fff", C.azul)}</div>
  ${F(x)}`;
}

// E2 · Lollipop de 24 h sobre vidrio (sin foto, sin logo)
export function g(x) {
  const c = x.cor;
  return `${bgAzul}${wing("right:-260px;top:-200px;width:820px;height:820px")}${wing("left:-300px;bottom:220px;width:760px;height:760px", "c")}
  <div class="abs" style="left:0;right:0;top:170px">${bigFlags(c, 130, "#fff", "#fff")}</div>
  <div class="abs" style="left:70px;right:70px;top:350px;text-align:center;color:#fff"><div class="m" style="font-weight:900;font-size:108px;line-height:1.02;letter-spacing:-.04em">La tasa<br>en <span style="color:#9FBBFF">24 horas</span></div></div>
  <div class="abs" style="left:56px;right:56px;top:710px;${glass(0.12)};border-radius:44px;padding:30px 36px 24px;color:#fff">
    <div style="font-weight:600;font-size:26px;opacity:.9;margin-bottom:4px">Variación de ${varPct(x)} % en el día</div>
    ${chart(x, 920, 450, "lollipop", { line: "#BFD0FF", grid: "rgba(255,255,255,.25)", ink: "#fff", now: C.rosa })}
    <div style="display:flex;justify-content:space-between;margin-top:6px;font-weight:600;font-size:25px;opacity:.9"><span>hace 24 h</span><span>ahora</span></div>
  </div>
  <div class="abs" style="left:56px;right:56px;top:1280px;display:flex;gap:18px">${statChips(x, { bg: "rgba(255,255,255,.16)", ink: "#fff", hiBg: "#fff", hiInk: C.azul, shadow: "none" })}</div>
  <div class="abs" style="left:70px;right:70px;top:1490px;text-align:center">${cta("COTIZA EN VEZMONEY.COM", "#fff", C.azul)}</div>
  ${F(x)}`;
}

// E3 · Tres pastillas con banderas sobre la foto
export function t(x, copy = {}) {
  const c = x.cor;
  const l1 = copy.l1 ?? "Cuánto llega", l2 = copy.l2 ?? "a **destino**";
  return `${full(x, { top: -150, h: 2000, grad: "linear-gradient(to bottom,rgba(0,28,112,.55) 0%,rgba(3,37,140,.05) 34%,rgba(0,22,90,.7) 58%,rgba(0,18,80,.96) 100%)" })}
  ${mark("full", "dark")}
  <div class="abs" style="top:225px;left:70px;right:70px;text-align:center"><span style="display:inline-block">${pillInfo(x, glassPill)}</span></div>
  <div class="abs" style="top:340px;left:70px;right:70px;text-align:center"><div class="m" style="font-weight:900;font-size:104px;line-height:1.02;letter-spacing:-.04em;color:#fff;text-shadow:0 4px 30px rgba(0,0,0,.45)">${l1}<br>${hl(l2, "#CFE0FF")}</div></div>
  <div class="abs" style="left:46px;right:46px;top:960px">${tablePills(x, { bg: "#fff", ink: C.azul, numInk: C.vez })}</div>
  <div class="abs" style="top:1390px;left:70px;right:70px;text-align:center;color:#fff"><div style="font-weight:700;font-size:40px">${unitRate(c, x.cur)}</div></div>
  <div class="abs" style="top:1500px;left:70px;right:70px;text-align:center">${cta(copy.cta ?? "ENVIAR AHORA", "#fff", C.azul)}</div>
  ${F(x)}`;
}

// E4 · Cotizador de vidrio flotando sobre la foto (conserva la foto)
export function q(x) {
  const c = x.cor, m = c.amounts[2];
  const row = (fl, txt, col) => `<div style="display:flex;align-items:center;gap:20px;background:#fff;border-radius:30px;padding:20px 28px">${fl}<span class="m" style="font-weight:900;font-size:58px;color:${col};white-space:nowrap">${txt}</span></div>`;
  return `${full(x, { grad: "linear-gradient(to bottom,rgba(0,28,112,.5) 0%,rgba(3,37,140,.15) 30%,rgba(0,22,90,.82) 62%,rgba(0,18,80,.97) 100%)" })}
  ${mark("full", "dark")}
  ${sticker("Cotiza hoy", "#fff", C.azul, "left:50px;top:300px;transform:rotate(-5deg)", 40)}
  <div class="abs" style="left:56px;right:56px;top:790px;${glass(0.16)};border-radius:56px;padding:42px 44px 38px;color:#fff;box-shadow:0 30px 80px rgba(0,0,0,.35)">
    <div style="font-weight:600;font-size:28px;opacity:.9;margin-bottom:10px">Tú envías</div>
    ${row(flag(c.fromFlag, 72), money(c, m), C.azul)}
    <div style="display:flex;justify-content:center;margin:-16px 0 -16px"><span style="position:relative;z-index:2;width:76px;height:76px;border-radius:50%;background:${C.rosa};color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 20px rgba(0,0,0,.3);transform:rotate(90deg)">${arrowSvg(42)}</span></div>
    <div style="font-weight:600;font-size:28px;opacity:.9;margin-bottom:10px">Tu contacto recibe</div>
    ${row(flag(c.toFlag, 72), `${conv(x, m)} ${c.unit}`, C.vez)}
    <div class="m" style="margin-top:28px;text-align:center;background:rgba(255,255,255,.18);border:2px solid rgba(255,255,255,.5);font-weight:800;font-size:38px;padding:16px;border-radius:999px">${unitRate(c, x.cur)}</div>
  </div>
  <div class="abs" style="left:70px;right:70px;top:1490px;text-align:center">${cta("ENVIAR EN VEZMONEY.COM", "#fff", C.azul)}</div>
  ${F(x)}`;
}
