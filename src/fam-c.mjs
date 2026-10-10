// fam-c.mjs — FAMILIA C · MIÉRCOLES · "Cielo": degradado azul cielo luminoso, círculos grandes, toques turquesa, tarjetas blancas. Minimalista.
// Logos por plantilla: s sin logo · g completo · t colibrí · q completo.
import { C, flag, flagsRow, arrowSvg, rateFmt, baseTxt, unitRate, conv, money, varPct, mark, pillInfo, bigFlags, photo, orb, sticker, cta, hl, frame, footer, bgCielo, chart, statChips, tableLadder } from "./common.mjs";

export const style = "pill";
const bgC = `${bgCielo}${orb("right:-260px;top:-220px;width:760px;height:760px;background:rgba(255,255,255,.14)")}${orb("left:-300px;bottom:260px;width:760px;height:760px;background:rgba(255,255,255,.1)")}`;
const F = (x) => footer(x, { ink: "#fff", dim: "rgba(255,255,255,.82)", acc: "#DCE6FF", tip: false });
const glassPill = { bg: "rgba(255,255,255,.16)", color: "#fff", border: "2px solid rgba(255,255,255,.45)" };

// C1 · Sorpresa a pantalla completa, texto a la izquierda (sin logo)
export function s(x) {
  const c = x.cor;
  return `${photo(x, "left:0;top:-250px;width:1080px;height:2170px")}
  <div class="abs" style="inset:0;background:linear-gradient(to bottom,rgba(3,37,140,.5) 0%,rgba(3,37,140,0) 24%,rgba(0,28,112,.05) 40%,rgba(0,28,112,.9) 66%,rgba(0,20,80,.98) 100%)"></div>
  ${mark(x.second ? "iso" : "none", "dark")}
  ${sticker("¡Buenas noticias!", "#fff", C.azul, "left:56px;top:160px;transform:rotate(-5deg)", 42)}
  <div class="abs" style="left:70px;right:70px;top:960px;color:#fff">
    <div style="display:flex;align-items:center;gap:18px">${flagsRow(c, 64, "#fff", "#fff")}<span class="m" style="font-weight:800;font-size:28px;color:#BFD0FF">Tasa de las ${x.hh}</span></div>
    <div class="m" style="font-weight:700;font-size:50px;margin-top:26px">${baseTxt(c)} ${c.fromUnit} =</div>
    <div class="m" style="font-weight:900;font-size:156px;letter-spacing:-.04em;line-height:1;margin-top:2px">${rateFmt(c, x.cur)} <span style="color:#9FBBFF">${c.unit}</span></div>
    <div style="font-weight:600;font-size:38px;margin-top:26px">Con <b class="m">${money(c, c.amounts[0])}</b> recibe <b class="m" style="color:#9FBBFF">${conv(x, c.amounts[0])} ${c.unit}</b></div>
  </div>
  <div class="abs" style="left:70px;top:1490px">${cta("COTIZAR AHORA", "#fff", C.azul)}</div>
  ${F(x)}`;
}

// C2 · Puntos de 24 h sobre tarjeta blanca (sin foto)
export function g(x) {
  const c = x.cor;
  return `${bgC}
  ${mark("full", "dark")}
  <div class="abs" style="left:0;right:0;top:250px">${bigFlags(c, 130, "#fff", "#fff")}</div>
  <div class="abs" style="left:70px;right:70px;top:430px;text-align:center;color:#fff"><div class="m" style="font-weight:900;font-size:104px;line-height:1.02;letter-spacing:-.04em">¿Cómo va<br>la <span style="color:#CFE0FF">tasa</span>?</div></div>
  <div class="abs" style="left:56px;right:56px;top:760px;background:#fff;border-radius:44px;padding:30px 36px 24px;box-shadow:0 24px 60px rgba(0,22,80,.3)">
    <div style="font-weight:600;font-size:26px;color:${C.gris};margin-bottom:4px">Últimas 24 horas · variación de ${varPct(x)} %</div>
    ${chart(x, 920, 420, "dots", { line: C.vez, ink: C.azul })}
    <div style="display:flex;justify-content:space-between;margin-top:6px;font-weight:600;font-size:25px;color:${C.gris}"><span>hace 24 h</span><span>ahora</span></div>
  </div>
  <div class="abs" style="left:56px;right:56px;top:1300px;display:flex;gap:18px">${statChips(x, { bg: "#fff", ink: C.azul, hiBg: C.azul, hiInk: "#fff", shadow: "0 10px 26px rgba(0,22,80,.25)" })}</div>
  <div class="abs" style="left:70px;right:70px;top:1490px;text-align:center">${cta("COTIZA EN VEZMONEY.COM", "#fff", C.azul)}</div>
  ${F(x)}`;
}

// C3 · Escalera de montos con foto cortada en diagonal
export function t(x, copy = {}) {
  const c = x.cor;
  const l1 = copy.l1 ?? "Elige tu monto", l2 = copy.l2 ?? "y mira **cuánto llega**";
  return `${bgC}
  ${photo(x, "left:0;top:0;width:1080px;height:980px;clip-path:polygon(0 0,100% 0,100% 82%,0 100%)")}
  <div class="abs" style="left:0;top:0;width:1080px;height:980px;clip-path:polygon(0 0,100% 0,100% 82%,0 100%);background:linear-gradient(to bottom,rgba(3,37,140,.6),rgba(3,37,140,.1) 40%,rgba(0,28,112,.7))"></div>
  <div class="abs" style="left:0;top:0;width:1080px;height:1000px"><svg width="1080" height="1000"><polygon points="0,980 1080,804 1080,832 0,1008" fill="${C.turq}"/></svg></div>
  ${mark("iso", "dark", "left:70px;top:104px")}
  <div class="abs" style="top:230px;left:70px">${pillInfo(x)}</div>
  <div class="abs" style="top:340px;left:70px;right:70px"><div class="m" style="font-weight:900;font-size:98px;line-height:1.04;color:#fff;letter-spacing:-.03em;text-shadow:0 4px 24px rgba(0,0,0,.4)">${l1}<br>${hl(l2, "#CFE0FF")}</div></div>
  <div class="abs" style="left:60px;right:60px;top:960px;background:#fff;border-radius:44px;padding:14px 44px 18px;box-shadow:0 24px 60px rgba(0,22,80,.35)">${tableLadder(x)}</div>
  <div class="abs" style="top:1420px;left:70px;right:70px;text-align:center;color:#fff"><div style="font-weight:700;font-size:40px">${unitRate(c, x.cur)}</div></div>
  <div class="abs" style="top:1510px;left:70px;right:70px;text-align:center">${cta(copy.cta ?? "ENVIAR AHORA", "#fff", C.azul)}</div>
  ${F(x)}`;
}

// C4 · Cotizador como conversación (sin foto)
export function q(x) {
  const c = x.cor, m = c.amounts[1];
  const bubble = (side, label, fl, txt, bg, ink, numInk) => `<div style="display:flex;justify-content:${side === "l" ? "flex-start" : "flex-end"}"><div style="background:${bg};color:${ink};border-radius:${side === "l" ? "48px 48px 48px 12px" : "48px 48px 12px 48px"};padding:30px 40px 32px;box-shadow:0 18px 44px rgba(0,22,80,.28);min-width:640px;max-width:900px"><div style="font-weight:600;font-size:30px;opacity:.8;margin-bottom:14px">${label}</div><div style="display:flex;align-items:center;gap:22px">${fl}<span class="m" style="font-weight:900;font-size:68px;color:${numInk};white-space:nowrap">${txt}</span></div></div></div>`;
  return `${bgC}
  ${mark("full", "dark")}
  <div class="abs" style="left:70px;right:70px;top:260px;text-align:center;color:#fff"><div class="m" style="font-weight:900;font-size:100px;line-height:1.02;letter-spacing:-.04em">Así llega<br><span style="color:#CFE0FF">tu dinero</span></div><div style="margin-top:30px;display:flex;justify-content:center">${pillInfo(x, glassPill)}</div></div>
  <div class="abs" style="left:60px;right:60px;top:690px">
    ${bubble("l", "Tú envías", flag(c.fromFlag, 82), money(c, m), "#fff", C.azul, C.azul)}
    <div style="height:38px"></div>
    ${bubble("r", "Tu contacto recibe", flag(c.toFlag, 82), `${conv(x, m)} ${c.unit}`, C.azul, "#fff", "#fff")}
  </div>
  <div class="abs" style="left:70px;right:70px;top:1290px;text-align:center"><span class="m" style="display:inline-block;background:rgba(255,255,255,.18);border:2px solid rgba(255,255,255,.5);color:#fff;font-weight:800;font-size:40px;padding:16px 40px;border-radius:999px">${unitRate(c, x.cur)}</span></div>
  <div class="abs" style="left:70px;right:70px;top:1490px;text-align:center">${cta("ENVIAR EN VEZMONEY.COM", "#fff", C.azul)}</div>
  ${F(x)}`;
}
