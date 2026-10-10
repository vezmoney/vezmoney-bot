// fam-b.mjs — FAMILIA B · MARTES · "Azul profundo": fondo azul con alas translúcidas y rutas punteadas, texto blanco. Minimalista.
// Logos por plantilla: s colibrí · g completo · t completo · q sin logo.
import { C, flag, flagsRow, arrowSvg, rateFmt, baseTxt, unitRate, conv, money, varPct, mark, pillInfo, bigFlags, sticker, cta, hl, frame, footer, bgAzul, wing, route, chart, statChips, tableTiles, chip } from "./common.mjs";

export const style = "pill";
const bgB = `${bgAzul}${wing("right:-260px;top:-200px;width:820px;height:820px")}${wing("left:-300px;bottom:180px;width:760px;height:760px", "c")}${route("left:60px;top:700px;opacity:.9", { w: 960, h: 520, d: "M10 480 C 260 40, 640 560, 950 60" })}`;
const F = (x) => footer(x, { ink: "#fff", dim: "rgba(255,255,255,.78)", acc: "#BFD0FF", tip: false });
const glass = "background:rgba(255,255,255,.1);border:2px solid rgba(255,255,255,.28);backdrop-filter:blur(14px)";
const glassPill = { bg: "rgba(255,255,255,.14)", color: "#fff", border: "2px solid rgba(255,255,255,.4)" };

// B1 · Sorpresa: foto en arco centrada
export function s(x) {
  const c = x.cor;
  return `${bgB}
  ${mark(x.second ? "none" : "iso", "dark")}
  ${frame(x, { l: 130, t: 215, w: 820, h: 740, shape: "arch", r: 56, bw: 12 })}
  ${sticker("¡Mira la tasa!", C.rosa, "#fff", "left:44px;top:340px;transform:rotate(-7deg)", 40)}
  ${chip(x, "#fff", C.azul, "left:50%;top:905px;transform:translateX(-50%) rotate(2deg)", 52)}
  <div class="abs" style="left:70px;right:70px;top:1070px;text-align:center;color:#fff">
    <div style="font-weight:600;font-size:42px">Si envías <b class="m" style="font-weight:800">${money(c, c.amounts[0])}</b>, recibe</div>
    <div class="m" style="font-weight:900;font-size:134px;letter-spacing:-.03em;line-height:1.1;margin-top:4px">${conv(x, c.amounts[0])} ${c.unit}</div>
    <div style="margin-top:20px">${pillInfo(x, glassPill)}</div>
  </div>
  <div class="abs" style="left:70px;right:70px;top:1490px;text-align:center">${cta("COTIZAR AHORA", "#fff", C.azul)}</div>
  ${F(x)}`;
}

// B2 · Barras de 24 h sobre panel de vidrio (sin foto)
export function g(x) {
  const c = x.cor;
  return `${bgB}
  ${mark("full", "dark")}
  <div class="abs" style="left:0;right:0;top:250px">${bigFlags(c, 130, "#fff", "#fff")}</div>
  <div class="abs" style="left:70px;right:70px;top:430px;text-align:center;color:#fff"><div class="m" style="font-weight:900;font-size:104px;line-height:1.02;letter-spacing:-.04em">Así se<br>movió <span style="color:#9FBBFF">hoy</span></div></div>
  <div class="abs" style="left:56px;right:56px;top:760px;${glass};border-radius:44px;padding:30px 36px 24px">
    <div style="font-weight:600;font-size:26px;color:rgba(255,255,255,.85);margin-bottom:6px">Cada hora, últimas 24 h · variación de ${varPct(x)} %</div>
    ${chart(x, 920, 420, "bars", { line: "#9FBBFF", grid: "rgba(255,255,255,.2)", ink: "#fff", now: C.rosa, nowRing: "#fff" })}
    <div style="display:flex;justify-content:space-between;margin-top:6px;font-weight:600;font-size:25px;color:rgba(255,255,255,.85)"><span>hace 24 h</span><span>ahora</span></div>
  </div>
  <div class="abs" style="left:56px;right:56px;top:1300px;display:flex;gap:18px">${statChips(x, { bg: "rgba(255,255,255,.95)", ink: C.azul, hiBg: "#fff", hiInk: C.rosa, shadow: "0 10px 26px rgba(0,0,0,.25)" })}</div>
  <div class="abs" style="left:70px;right:70px;top:1490px;text-align:center">${cta("COTIZA EN VEZMONEY.COM", "#fff", C.azul)}</div>
  ${F(x)}`;
}

// B3 · Tres baldosas con foto circular
export function t(x, copy = {}) {
  const c = x.cor;
  const l1 = copy.l1 ?? "Tu envío", l2 = copy.l2 ?? "en **números**";
  return `${bgB}
  ${mark("full", "dark")}
  ${frame(x, { l: 290, t: 215, w: 500, h: 500, shape: "circle", bw: 14 })}
  <div class="abs" style="left:0;right:0;top:750px;display:flex;justify-content:center">${pillInfo(x)}</div>
  <div class="abs" style="top:860px;left:70px;right:70px;text-align:center"><div class="m" style="font-weight:900;font-size:100px;line-height:1.04;color:#fff;letter-spacing:-.03em">${l1}<br>${hl(l2, "#9FBBFF", "#fff").replace(/color:#fff;padding:0 18px/g, `color:${C.azul};padding:0 18px`)}</div></div>
  <div class="abs" style="left:46px;right:46px;top:1140px">${tableTiles(x, { bg: "#fff", ink: C.azul, numInk: C.vez, hi: 1, hiBg: "#fff", hiInk: C.azul })}</div>
  <div class="abs" style="top:1420px;left:70px;right:70px;text-align:center;color:#fff"><div style="font-weight:700;font-size:40px">${unitRate(c, x.cur)}</div></div>
  <div class="abs" style="top:1510px;left:70px;right:70px;text-align:center">${cta(copy.cta ?? "ENVIAR AHORA", "#fff", C.azul)}</div>
  ${F(x)}`;
}

// B4 · Cotizador dentro de un celular (sin foto ni logo)
export function q(x) {
  const c = x.cor, m = c.amounts[1];
  const row = (fl, txt, big) => `<div style="display:flex;align-items:center;gap:16px;background:#fff;border-radius:26px;padding:18px 24px;box-shadow:0 6px 18px rgba(0,28,112,.1)">${fl}<span class="m" style="font-weight:${big ? 900 : 800};font-size:${big ? 44 : 48}px;color:${big ? C.vez : C.azul};white-space:nowrap">${txt}</span></div>`;
  return `${bgB}
  <div class="abs" style="left:70px;right:70px;top:140px;text-align:center;color:#fff"><div class="m" style="font-weight:900;font-size:96px;line-height:1.02;letter-spacing:-.04em">Cotiza desde<br>tu <span style="color:#9FBBFF">celular</span></div></div>
  <div class="abs" style="left:230px;top:430px;width:620px;height:960px;border-radius:76px;background:#F6F7FB;border:14px solid #fff;box-shadow:0 40px 90px rgba(0,0,0,.5);overflow:hidden">
    <div style="position:absolute;left:50%;top:16px;transform:translateX(-50%);width:120px;height:26px;border-radius:14px;background:${C.azul}"></div>
    <div style="padding:78px 34px 0">
      <div style="display:flex;justify-content:center;margin-bottom:26px"><img src="assets/logos/principal_horizontal.png" style="height:46px"></div>
      <div style="font-weight:600;font-size:25px;color:${C.gris};margin:0 0 8px 6px">Tú envías</div>
      ${row(flag(c.fromFlag, 58), money(c, m), false)}
      <div style="display:flex;justify-content:center;margin:-10px 0 -10px"><span style="position:relative;z-index:2;width:62px;height:62px;border-radius:50%;background:${C.rosa};color:#fff;display:flex;align-items:center;justify-content:center;transform:rotate(90deg)">${arrowSvg(34)}</span></div>
      <div style="font-weight:600;font-size:25px;color:${C.gris};margin:0 0 8px 6px">Tu contacto recibe</div>
      ${row(flag(c.toFlag, 58), `${conv(x, m)} ${c.unit}`, true)}
      <div style="background:#fff;border-radius:22px;padding:18px 24px;margin-top:26px;font-weight:600;font-size:24px;color:${C.azul};line-height:1.8">
        <div style="display:flex;justify-content:space-between"><span style="color:${C.gris}">Monto a convertir:</span><b>${money(c, m)}</b></div>
        <div style="display:flex;justify-content:space-between"><span style="color:${C.gris}">Tipo de cambio:</span><b>${unitRate(c, x.cur)}</b></div>
      </div>
      <div class="m" style="margin-top:30px;background:${C.rosa};color:#fff;font-weight:800;font-size:32px;text-align:center;padding:24px;border-radius:999px">Enviar ahora</div>
    </div>
  </div>
  <div class="abs" style="left:70px;right:70px;top:1470px;text-align:center">${pillInfo(x, glassPill)}</div>
  ${F(x)}`;
}
