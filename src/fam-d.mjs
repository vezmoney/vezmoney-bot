// fam-d.mjs — FAMILIA D · JUEVES · "Blanco editorial": página blanca, tipografía grande, bloques azul profundo, boleto de envío. Minimalista.
// Logos por plantilla: s completo · g sin logo · t completo · q colibrí.
import { C, COUNTRY, flag, flagsRow, arrowSvg, rateFmt, baseTxt, unitRate, conv, money, varPct, mark, pillInfo, bigFlags, logoC, photo, sticker, cta, hl, frame, footer, bgBlanco, chart, statChips, tableTicket } from "./common.mjs";

export const style = "accent";
const F = (x, dark = false) => footer(x, dark ? { ink: "#fff", dim: "rgba(255,255,255,.78)", acc: "#BFD0FF", tip: false } : { ink: C.azul, dim: C.gris, acc: C.vez, tip: false });
const stamp = (x, dark = false) => `<div class="m abs" style="right:70px;top:112px;font-weight:800;font-size:25px;letter-spacing:.14em;text-transform:uppercase;color:${dark ? "#BFD0FF" : C.vez}">Tasa de las ${x.hh}</div>`;
const outline = (t) => `<span class="m" style="display:inline-flex;align-items:center;gap:20px;background:#fff;color:${C.azul};border:5px solid ${C.azul};font-weight:800;font-size:36px;padding:16px 22px 16px 42px;border-radius:999px;white-space:nowrap">${t}<span style="width:56px;height:56px;border-radius:50%;background:${C.rosa};color:#fff;display:inline-flex;align-items:center;justify-content:center">${arrowSvg(30)}</span></span>`;

// D1 · Editorial: titular grande, tasa gigante, foto apaisada con tarjeta
export function s(x) {
  const c = x.cor;
  return `${bgBlanco}
  ${mark(x.second ? "iso" : "full", "light", "left:70px;top:100px", 60)}
  ${stamp(x)}
  <div class="abs" style="left:70px;right:70px;top:240px"><div class="m" style="font-weight:900;font-size:108px;line-height:1.0;letter-spacing:-.04em;color:${C.azul}">Mira la tasa<br>de <span style="color:${C.vez}">hoy.</span></div></div>
  <div class="abs" style="left:70px;right:70px;top:590px">
    <div style="display:flex;align-items:center;gap:18px">${flagsRow(c, 56, "#fff", C.azul)}<span class="m" style="font-weight:700;font-size:42px;color:${C.gris}">${baseTxt(c)} ${c.fromUnit} =</span></div>
    <div class="m" style="font-weight:900;font-size:214px;letter-spacing:-.06em;line-height:1;color:${C.azul};margin-top:6px;margin-left:-8px">${rateFmt(c, x.cur)}</div>
    <div class="m" style="font-weight:800;font-size:62px;color:${C.vez};margin-top:-4px">${c.unit}</div>
  </div>
  ${frame(x, { l: 70, t: 1060, w: 940, h: 400, shape: "rect", r: 56, bw: 0, shadow: "0 26px 60px rgba(0,22,80,.25)" })}
  <div class="abs" style="left:110px;right:110px;top:1410px;background:${C.azul};color:#fff;border-radius:34px;padding:22px 34px;box-shadow:0 20px 50px rgba(0,22,80,.4);display:flex;align-items:center;justify-content:space-between"><span style="font-weight:600;font-size:34px">Envías <b class="m">${money(c, c.amounts[0])}</b></span><span style="color:${C.cielo}">${arrowSvg(40)}</span><span class="m" style="font-weight:900;font-size:44px">${conv(x, c.amounts[0])} ${c.unit}</span></div>
  <div class="abs" style="left:70px;right:70px;top:1570px;text-align:center">${outline("COTIZAR EN VEZMONEY.COM")}</div>
  ${F(x)}`;
}

// D2 · Gráfico escalonado en bloque azul (sin foto, sin logo)
export function g(x) {
  const c = x.cor;
  return `${bgBlanco}
  ${stamp(x)}
  <div class="abs" style="left:70px;top:130px">${flagsRow(c, 64, "#fff", C.azul)}</div>
  <div class="abs" style="left:70px;right:70px;top:260px"><div class="m" style="font-weight:900;font-size:112px;line-height:1.0;letter-spacing:-.04em;color:${C.azul}">Un vistazo<br>a la <span style="color:${C.vez}">tasa.</span></div></div>
  <div class="abs" style="left:0;right:0;top:640px;bottom:0;background:${C.azul};border-radius:70px 70px 0 0"></div>
  <div class="abs" style="left:56px;right:56px;top:720px;color:#fff">
    <div style="font-weight:600;font-size:27px;opacity:.85;margin-bottom:6px">Últimas 24 horas · variación de ${varPct(x)} %</div>
    ${chart(x, 960, 480, "step", { line: "#fff", area: C.cielo, grid: "rgba(255,255,255,.22)", ink: "#fff", now: C.rosa })}
    <div style="display:flex;justify-content:space-between;margin-top:4px;font-weight:600;font-size:25px;opacity:.85"><span>hace 24 h</span><span>ahora</span></div>
  </div>
  <div class="abs" style="left:56px;right:56px;top:1290px;display:flex;gap:18px">${statChips(x, { bg: "rgba(255,255,255,.14)", ink: "#fff", hiBg: "#fff", hiInk: C.azul, shadow: "none" })}</div>
  <div class="abs" style="left:70px;right:70px;top:1490px;text-align:center">${cta("COTIZA EN VEZMONEY.COM", "#fff", C.azul)}</div>
  ${F(x, true)}`;
}

// D3 · Boleto de envío sobre bloque azul
export function t(x, copy = {}) {
  const c = x.cor;
  const l1 = copy.l1 ?? "Tu resumen", l2 = copy.l2 ?? "de **envío**";
  return `${bgBlanco}
  ${mark("full", "light", "left:70px;top:100px", 60)}
  ${stamp(x)}
  ${frame(x, { l: 70, t: 215, w: 330, h: 420, shape: "arch", r: 36, bw: 10 })}
  <div class="abs" style="left:440px;top:290px;width:570px"><div class="m" style="font-weight:900;font-size:92px;line-height:1.02;letter-spacing:-.04em;color:${C.azul}">${l1}<br>${hl(l2, C.vez, C.azul)}</div></div>
  <div class="abs" style="left:0;right:0;top:700px;bottom:0;background:${C.azul};border-radius:80px 80px 0 0"></div>
  <div class="abs" style="left:60px;right:60px;top:790px">${tableTicket(x, { bg: "#fff", ink: C.azul, numInk: C.vez })}</div>
  <div class="abs" style="top:1250px;left:70px;right:70px;text-align:center;color:#fff"><div style="font-weight:700;font-size:42px">${unitRate(c, x.cur)}</div></div>
  <div class="abs" style="top:1490px;left:70px;right:70px;text-align:center">${cta(copy.cta ?? "ENVIAR AHORA", "#fff", C.azul)}</div>
  ${F(x, true)}`;
}

// D4 · Pase de abordar: envías → recibes (sin foto)
export function q(x) {
  const c = x.cor, m = c.amounts[2];
  const sec = (label, fl, name, amt, ink) => `<div style="padding:40px 48px 36px"><div class="m" style="font-weight:800;font-size:26px;letter-spacing:.16em;color:${C.gris}">${label}</div><div style="display:flex;align-items:center;gap:28px;margin-top:18px">${fl}<div><div class="m" style="font-weight:900;font-size:72px;letter-spacing:-.03em;color:${ink};line-height:1.05;white-space:nowrap">${amt}</div><div style="font-weight:600;font-size:30px;color:${C.gris};margin-top:2px">${name}</div></div></div></div>`;
  return `${bgBlanco}
  ${mark("iso", "light")}
  <div class="abs" style="left:70px;right:70px;top:230px;text-align:center"><div class="m" style="font-weight:900;font-size:104px;line-height:1.0;letter-spacing:-.04em;color:${C.azul}">Envía<br><span style="color:${C.vez}">y compara.</span></div><div style="margin-top:28px">${pillInfo(x, { bg: C.nube })}</div></div>
  <div class="abs" style="left:70px;right:70px;top:660px;background:#fff;border-radius:52px;box-shadow:0 30px 70px rgba(0,22,80,.28);overflow:hidden">
    ${sec("ENVÍAS", flag(c.fromFlag, 108), COUNTRY[c.fromCode].name, money(c, m), C.azul)}
    <div style="position:relative;height:0;border-top:4px dashed ${C.gris20 ?? "#D8DDE8"};margin:0 44px">
      <span style="position:absolute;left:50%;top:-38px;transform:translateX(-50%);width:76px;height:76px;border-radius:50%;background:#fff;border:4px solid #D8DDE8;display:flex;align-items:center;justify-content:center"><img src="assets/logos/isotipo_rosa.png" style="height:40px"></span>
      <span style="position:absolute;left:-78px;top:-28px;width:52px;height:52px;border-radius:50%;background:#EEF1FB"></span><span style="position:absolute;right:-78px;top:-28px;width:52px;height:52px;border-radius:50%;background:#EEF1FB"></span>
    </div>
    ${sec("RECIBE", flag(c.toFlag, 108), COUNTRY[c.toCode].name, `${conv(x, m)} ${c.unit}`, C.vez)}
    <div class="m" style="background:${C.azul};color:#fff;text-align:center;font-weight:800;font-size:42px;padding:30px">${unitRate(c, x.cur)}</div>
  </div>
  <div class="abs" style="left:70px;right:70px;top:1490px;text-align:center">${outline("ENVIAR EN VEZMONEY.COM")}</div>
  ${F(x)}`;
}
