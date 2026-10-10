// fam-f.mjs — FAMILIA F · SÁBADO · "Lavanda": fondo lavanda suave, formas lúdicas, toques turquesa, tarjetas apiladas. Minimalista.
// Logos por plantilla: s completo · g colibrí · t sin logo · q colibrí. Las de 9, 10 y 11 h no llevan foto; el corredor sí (foto del destino).
import { C, flag, flagsRow, arrowSvg, rateFmt, baseTxt, unitRate, conv, money, varPct, mark, pillInfo, bigFlags, orb, sticker, cta, hl, frame, footer, bgLav, chart, statChips, chip } from "./common.mjs";

export const style = "pill";
const bgF = `${bgLav}${orb("right:-200px;top:-160px;width:640px;height:640px;background:rgba(255,255,255,.35)")}${orb("left:-130px;top:1130px;width:300px;height:300px;border:26px solid rgba(34,199,201,.5)")}${orb("right:70px;top:1010px;width:46px;height:46px;background:rgba(3,37,140,.28)")}${orb("left:60px;top:640px;width:26px;height:26px;background:rgba(34,199,201,.8)")}`;
const F = (x) => footer(x, { ink: C.azul, dim: "#3C4A86", acc: C.vez, tip: false });
const card = (x, m, i) => { const c = x.cor; return `<div style="margin:${i ? 24 : 0}px ${i === 1 ? 0 : 70}px 0 ${i === 1 ? 70 : 0}px;background:#fff;border-radius:42px;padding:28px 38px;box-shadow:0 18px 44px rgba(3,37,140,.2);display:flex;align-items:center;gap:22px;${i === 1 ? `border:5px solid ${C.turq};` : ""}">${flag(c.fromFlag, 62)}<span style="font-weight:700;font-size:38px;color:${C.azul};flex:1">${money(c, m)}</span><span style="color:${C.cielo}">${arrowSvg(36)}</span><span class="m" style="font-weight:900;font-size:46px;color:${C.vez};min-width:340px;text-align:right">${conv(x, m)} ${c.unit}</span></div>`; };

// F1 · Foto en forma orgánica con sticker de sábado
export function s(x) {
  const c = x.cor;
  return `${bgF}
  ${mark(x.second ? "iso" : "full", "light")}
  ${frame(x, { l: 100, t: 215, w: 880, h: 800, shape: "blob", bw: 14 })}
  ${orb("left:50px;top:850px;width:170px;height:170px;background:" + C.turq + ";opacity:.9")}
  ${sticker("¡Feliz sábado!", C.azul, "#fff", "right:50px;top:200px;transform:rotate(6deg)", 42)}
  ${chip(x, C.vez, "#fff", "left:50%;top:960px;transform:translateX(-50%) rotate(-2deg)", 54)}
  <div class="abs" style="left:70px;right:70px;top:1130px;text-align:center">
    <div style="font-weight:600;font-size:42px;color:#3C4A86">Si envías <b class="m" style="color:${C.azul};font-weight:800">${money(c, c.amounts[0])}</b>, recibe</div>
    <div class="m" style="font-weight:900;font-size:134px;letter-spacing:-.03em;line-height:1.1;color:${C.azul};margin-top:4px">${conv(x, c.amounts[0])} ${c.unit}</div>
    <div style="margin-top:20px">${pillInfo(x)}</div>
  </div>
  <div class="abs" style="left:70px;right:70px;top:1490px;text-align:center">${cta("COTIZAR EN VEZMONEY.COM")}</div>
  ${F(x)}`;
}

// F2 · Cápsulas de 24 h (sin foto)
export function g(x) {
  const c = x.cor;
  return `${bgF}
  ${mark("iso", "light")}
  <div class="abs" style="left:0;right:0;top:250px">${bigFlags(c, 130, "#fff", C.azul)}</div>
  <div class="abs" style="left:70px;right:70px;top:430px;text-align:center"><div class="m" style="font-weight:900;font-size:100px;line-height:1.02;letter-spacing:-.04em;color:${C.azul}">Hoy sábado,<br>así va <span style="color:${C.vez}">la tasa</span></div></div>
  <div class="abs" style="left:56px;right:56px;top:760px;background:#fff;border-radius:44px;padding:36px 36px 24px;box-shadow:0 24px 60px rgba(3,37,140,.2)">
    <div style="font-weight:600;font-size:26px;color:${C.gris};margin-bottom:4px">Cada hora, últimas 24 h · variación de ${varPct(x)} %</div>
    ${chart(x, 920, 420, "capsule", { line: C.lav, ink: C.azul, now: C.rosa, grid: "rgba(3,37,140,.14)" })}
    <div style="display:flex;justify-content:space-between;margin-top:6px;font-weight:600;font-size:25px;color:${C.gris}"><span>hace 24 h</span><span>ahora</span></div>
  </div>
  <div class="abs" style="left:56px;right:56px;top:1300px;display:flex;gap:18px">${statChips(x, { bg: "#fff", ink: C.azul, hiBg: C.azul, hiInk: "#fff", shadow: "0 10px 26px rgba(3,37,140,.18)" })}</div>
  <div class="abs" style="left:70px;right:70px;top:1490px;text-align:center">${cta("COTIZA EN VEZMONEY.COM")}</div>
  ${F(x)}`;
}

// F3 · Tarjetas apiladas en zigzag (sin foto ni logo)
export function t(x, copy = {}) {
  const c = x.cor;
  const l1 = copy.l1 ?? "Elige tu monto,", l2 = copy.l2 ?? "mira tu **tasa**";
  return `${bgF}
  <div class="abs" style="left:0;right:0;top:170px">${bigFlags(c, 120, "#fff", C.azul)}</div>
  <div class="abs" style="left:70px;right:70px;top:340px;text-align:center"><div class="m" style="font-weight:900;font-size:100px;line-height:1.03;letter-spacing:-.04em;color:${C.azul}">${l1}<br>${hl(l2, C.vez)}</div><div style="margin-top:26px">${pillInfo(x)}</div></div>
  <div class="abs" style="left:56px;right:56px;top:790px">${c.amounts.map((m, i) => card(x, m, i)).join("")}</div>
  <div class="abs" style="top:1300px;left:70px;right:70px;text-align:center"><span class="m" style="display:inline-block;background:${C.turq};color:${C.azul};font-weight:800;font-size:42px;padding:16px 40px;border-radius:999px">${unitRate(c, x.cur)}</span></div>
  <div class="abs" style="top:1490px;left:70px;right:70px;text-align:center">${cta(copy.cta ?? "ENVIAR AHORA")}</div>
  ${F(x)}`;
}

// F4 · Cotizador en dos paneles azul / blanco con botón de intercambio (sin foto)
export function q(x) {
  const c = x.cor, m = c.amounts[1];
  return `${bgF}
  ${mark("iso", "light")}
  <div class="abs" style="left:70px;right:70px;top:240px;text-align:center"><div class="m" style="font-weight:900;font-size:104px;line-height:1.0;letter-spacing:-.04em;color:${C.azul}">Cotiza<br><span style="color:${C.vez}">tu envío</span></div><div style="margin-top:28px">${pillInfo(x)}</div></div>
  <div class="abs" style="left:56px;right:56px;top:690px">
    <div style="border-radius:56px;overflow:hidden;box-shadow:0 30px 70px rgba(3,37,140,.28)">
      <div style="background:${C.azul};color:#fff;padding:40px 46px 62px"><div style="font-weight:600;font-size:30px;opacity:.85;margin-bottom:14px">Tú envías</div><div style="display:flex;align-items:center;gap:24px">${flag(c.fromFlag, 92)}<span class="m" style="font-weight:900;font-size:74px;letter-spacing:-.03em;white-space:nowrap">${money(c, m)}</span></div></div>
      <div style="background:#fff;padding:62px 46px 40px"><div style="font-weight:600;font-size:30px;color:${C.gris};margin-bottom:14px">Tu contacto recibe</div><div style="display:flex;align-items:center;gap:24px">${flag(c.toFlag, 92)}<span class="m" style="font-weight:900;font-size:74px;letter-spacing:-.03em;color:${C.vez};white-space:nowrap">${conv(x, m)} ${c.unit}</span></div></div>
    </div>
    <div style="position:absolute;left:50%;top:50%;margin:-48px 0 0 -48px;width:96px;height:96px;border-radius:50%;background:${C.rosa};color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 26px rgba(242,7,117,.4);border:6px solid #fff;transform:rotate(90deg)">${arrowSvg(52)}</div>
  </div>
  <div class="abs" style="left:70px;right:70px;top:1310px;text-align:center"><span class="m" style="display:inline-block;background:#fff;color:${C.azul};font-weight:800;font-size:40px;padding:16px 40px;border-radius:999px;box-shadow:0 12px 30px rgba(3,37,140,.2)">${unitRate(c, x.cur)}</span></div>
  <div class="abs" style="left:70px;right:70px;top:1490px;text-align:center">${cta("ENVIAR EN VEZMONEY.COM")}</div>
  ${F(x)}`;
}

// Corredor del sábado: tarjetas apiladas con foto en arco del destino
export function corridor(x, copy = {}) {
  const c = x.cor;
  return `${bgF}
  ${frame(x, { l: 70, t: 190, w: 330, h: 440, shape: "arch", r: 40, bw: 10 })}
  <div class="abs" style="left:440px;top:240px;width:570px"><div style="display:flex">${flagsRow(c, 54, "#fff", C.azul)}</div><div class="m" style="font-weight:900;font-size:92px;line-height:1.03;letter-spacing:-.04em;margin-top:18px;color:${C.azul}">${copy.l1}<br>${hl(copy.l2, C.vez)}</div><div style="margin-top:22px">${pillInfo(x)}</div></div>
  <div class="abs" style="left:56px;right:56px;top:740px">${c.amounts.map((m, i) => card(x, m, i)).join("")}</div>
  <div class="abs" style="top:1270px;left:70px;right:70px;text-align:center"><span class="m" style="display:inline-block;background:${C.turq};color:${C.azul};font-weight:800;font-size:42px;padding:16px 40px;border-radius:999px">${unitRate(c, x.cur)}</span></div>
  <div class="abs" style="top:1490px;left:70px;right:70px;text-align:center">${cta(copy.cta)}</div>
  ${F(x)}`;
}
