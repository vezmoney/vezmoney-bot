// fam-a.mjs — FAMILIA A · LUNES · "Nube": fondo claro, tarjetas blancas, marcos de foto redondeados, azul sobre blanco.
import { C, f, flag, flagsRow, arrowSvg, rateFmt, baseTxt, unitRate, conv, money, varPct, logoC, dot, photo, orb, kicker, sticker, badgeHTML, cta, hl, frame, bottom, bgNube, chart, statChips, tableCard, quote, chip } from "./common.mjs";

const B = (x) => bottom(x, { ink: C.azul, dim: C.gris, acc: C.vez, tip: false });

// A1 · Sorpresa: foto en marco redondeado + sticker + amount grande
export function s(x) {
  const c = x.cor;
  return `${bgNube}
  ${orb("left:-200px;top:1100px;width:620px;height:620px;background:rgba(91,140,255,.12)")}
  ${logoC(64, "left:50%;top:104px;transform:translateX(-50%)")}
  ${frame(x, { l: 70, t: 220, w: 940, h: 760, shape: "squircle", r: 90, bw: 14 })}
  ${sticker("¡Mira la tasa!", C.azul, "#fff", "right:46px;top:190px;transform:rotate(6deg)")}
  ${chip(x, C.vez, "#fff", "left:50%;top:925px;transform:translateX(-50%) rotate(-2deg)", 54)}
  <div class="abs" style="left:70px;right:70px;top:1075px;text-align:center">
    <div style="margin-bottom:12px">${flagsRow(c, 64, "#fff", C.azul)}</div>
    ${kicker(`${dot()}Tasa de las ${x.hh} · ${c.label}`, C.vez)}
    <div style="font-weight:600;font-size:40px;margin-top:18px;color:${C.gris}">Si envías <b class="m" style="color:${C.azul};font-weight:800">${money(c, c.amounts[0])}</b>, tu contacto recibe</div>
    <div class="m" style="font-weight:900;font-size:122px;letter-spacing:-.03em;line-height:1.1;color:${C.vez};margin-top:4px">${conv(x, c.amounts[0])} ${c.unit}</div>
    <div style="margin-top:12px">${badgeHTML(x.badge, "rgba(91,140,255,.16)", C.vez, C.cielo)}</div>
  </div>
  <div class="abs" style="left:70px;right:70px;top:1450px;text-align:center">${cta("COTIZAR EN VEZMONEY.COM")}</div>
  ${B(x)}`;
}

// A2 · Gráfico de área + foto circular
export function g(x) {
  const c = x.cor;
  return `${bgNube}
  ${logoC(64, "left:70px;top:100px")}
  ${frame(x, { l: 690, t: 190, w: 320, h: 320, shape: "circle", bw: 10 })}
  <div class="abs" style="left:70px;top:270px;width:600px">
    <div style="display:flex;align-items:center;gap:16px">${flagsRow(c, 52, "#fff", C.azul)}</div>
    <div style="margin-top:12px">${kicker(`Tasa de las ${x.hh}`, C.vez)}</div>
    <div class="m" style="font-weight:900;font-size:92px;line-height:1.02;letter-spacing:-.03em;margin-top:18px;color:${C.azul}">Así va<br><span style="color:${C.vez}">la tasa hoy</span></div>
  </div>
  <div class="abs" style="left:56px;right:56px;top:610px;background:#fff;border-radius:44px;padding:30px 36px 24px;box-shadow:0 24px 60px rgba(0,22,80,.16)">
    <div style="font-weight:600;font-size:26px;color:${C.gris};margin-bottom:4px">${c.label} · últimas 24 horas · variación de ${varPct(x)} %</div>
    ${chart(x, 920, 380, "area", { line: C.vez, area: C.cielo, ink: C.azul })}
    <div style="display:flex;justify-content:space-between;margin-top:6px;font-weight:600;font-size:25px;color:${C.gris}"><span>hace 24 h</span><span>ahora</span></div>
  </div>
  <div class="abs" style="left:56px;right:56px;top:1160px;display:flex;gap:18px">${statChips(x, { bg: "#fff", ink: C.azul, hiBg: C.azul, hiInk: "#fff" })}</div>
  <div class="abs" style="left:70px;right:70px;top:1310px;text-align:center;color:${C.azul}">
    ${x.badge ? badgeHTML(x.badge, "rgba(91,140,255,.16)", C.vez, C.cielo) : `<div style="font-weight:600;font-size:38px">Hoy <b class="m">${money(c, c.amounts[0])}</b> → <b class="m" style="color:${C.vez}">${conv(x, c.amounts[0])} ${c.unit}</b></div>`}
  </div>
  <div class="abs" style="left:70px;right:70px;top:1425px;text-align:center">${cta("COTIZA EN VEZMONEY.COM")}</div>
  ${B(x)}`;
}

// A3 · Tabla de montos sobre foto a todo el ancho
export function t(x, copy = {}) {
  const c = x.cor;
  const l1 = copy.l1 ?? "Mira cuánto", l2 = copy.l2 ?? "recibe **tu gente**";
  return `${bgNube}
  ${photo(x, "left:0;top:0;width:1080px;height:1000px;clip-path:inset(0 0 0 0 round 0 0 90px 90px)")}
  <div class="abs" style="left:0;top:0;width:1080px;height:1000px;border-radius:0 0 90px 90px;background:linear-gradient(to bottom,rgba(0,28,112,.62) 0%,rgba(0,28,112,.12) 38%,rgba(0,28,112,.72) 100%)"></div>
  ${logoC(64, "left:50%;top:104px;transform:translateX(-50%)").replace("principal_horizontal", "reversa_horizontal")}
  <div class="abs" style="top:230px;left:70px;right:70px;text-align:center"><span style="display:inline-flex;align-items:center;gap:16px;background:#fff;color:${C.azul};border-radius:999px;padding:10px 28px 10px 14px"><span>${flagsRow(c, 48, "#fff", C.azul)}</span><span class="m" style="font-weight:800;font-size:26px">Tasa de las ${x.hh} · ${c.label}</span></span></div>
  <div class="abs" style="top:360px;left:70px;right:70px;text-align:center"><div class="m" style="font-weight:900;font-size:96px;line-height:1.04;color:#fff;letter-spacing:-.03em">${l1}<br>${hl(l2, "#9FBBFF")}</div></div>
  <div class="abs" style="left:60px;right:60px;top:890px">${tableCard(x, { rowInk: C.azul, numInk: C.vez, border: "rgba(0,28,112,.12)" })}</div>
  <div class="abs" style="top:1255px;left:70px;right:70px;text-align:center;color:${C.azul}">
    <div style="font-weight:700;font-size:40px">${unitRate(c, x.cur)}</div>
    <div style="margin-top:12px">${badgeHTML(x.badge, "rgba(91,140,255,.16)", C.vez, C.cielo, "font-size:26px")}</div>
  </div>
  <div class="abs" style="top:1450px;left:70px;right:70px;text-align:center">${cta(copy.cta ?? "ENVIAR AHORA")}</div>
  ${bottom({ ...x, tip: copy.tip ?? x.tip }, { ink: C.azul, dim: C.gris, acc: C.vez, tip: !!copy.tip })}`;
}

// A4 · Cotizador clásico bajo foto circular
export function q(x) {
  const c = x.cor;
  return `${bgNube}
  ${orb("left:-180px;top:-120px;width:560px;height:560px;background:rgba(91,140,255,.18)")}
  ${logoC(64, "left:50%;top:104px;transform:translateX(-50%)")}
  ${frame(x, { l: 310, t: 210, w: 460, h: 460, shape: "circle", bw: 14, border: "#fff" })}
  ${sticker("¡Cotiza hoy!", C.azul, "#fff", "right:70px;top:240px;transform:rotate(7deg)", 40)}
  <div class="abs" style="left:70px;right:70px;top:705px;text-align:center">${kicker(`${dot()}Tasa de las ${x.hh} · ${c.label}`, C.vez)}</div>
  ${quote(x, { bg: "#fff", ink: C.azul, boxBg: C.nube, boxInk: C.azul, numInk: C.vez, arrowBg: C.rosa, rateBg: C.azul, rateInk: "#fff", style: "left:56px;right:56px;top:760px" })}
  <div class="abs" style="left:70px;right:70px;top:1375px;text-align:center">${badgeHTML(x.badge, "rgba(91,140,255,.16)", C.vez, C.cielo)}</div>
  <div class="abs" style="left:70px;right:70px;top:1470px;text-align:center">${cta("ENVIAR EN VEZMONEY.COM")}</div>
  ${B(x)}`;
}
