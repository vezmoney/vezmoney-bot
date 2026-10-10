// fam-f.mjs — FAMILIA F · SÁBADO · "Lavanda": fondo lavanda suave, formas lúdicas, toques turquesa, tarjetas apiladas.
import { C, f, flag, flagsRow, arrowSvg, rateFmt, baseTxt, unitRate, conv, money, varPct, logoC, dot, photo, orb, kicker, sticker, badgeHTML, cta, hl, frame, bottom, bgLav, chart, statChips, chip } from "./common.mjs";

export const style = "pill";
const bgF = `${bgLav}${orb("right:-200px;top:-160px;width:640px;height:640px;background:rgba(255,255,255,.35)")}${orb("left:-130px;top:1130px;width:300px;height:300px;border:26px solid rgba(34,199,201,.5)")}${orb("right:70px;top:1010px;width:46px;height:46px;background:rgba(3,37,140,.28)")}${orb("left:60px;top:600px;width:26px;height:26px;background:rgba(34,199,201,.8)")}`;
const B = (x) => bottom(x, { ink: C.azul, dim: "#3C4A86", acc: C.vez, tip: false });

// F1 · Foto en forma orgánica con sticker de sábado
export function s(x) {
  const c = x.cor;
  return `${bgF}
  ${logoC(64, "left:50%;top:104px;transform:translateX(-50%)")}
  ${frame(x, { l: 100, t: 215, w: 880, h: 790, shape: "blob", bw: 14 })}
  ${orb("left:50px;top:830px;width:170px;height:170px;background:" + C.turq + ";opacity:.9")}
  ${sticker("¡Feliz sábado!", C.azul, "#fff", "right:50px;top:200px;transform:rotate(6deg)", 42)}
  ${chip(x, C.vez, "#fff", "left:50%;top:950px;transform:translateX(-50%) rotate(-2deg)", 54)}
  <div class="abs" style="left:70px;right:70px;top:1085px;text-align:center">
    <div style="margin-bottom:10px">${flagsRow(c, 60, "#fff", C.azul)}</div>
    ${kicker(`${dot()}Tasa de las ${x.hh} · ${c.label}`, C.vez)}
    <div style="font-weight:600;font-size:40px;margin-top:16px;color:#3C4A86">Si envías <b class="m" style="color:${C.azul};font-weight:800">${money(c, c.amounts[0])}</b>, tu contacto recibe</div>
    <div class="m" style="font-weight:900;font-size:120px;letter-spacing:-.03em;line-height:1.1;color:${C.azul};margin-top:2px">${conv(x, c.amounts[0])} ${c.unit}</div>
    <div style="margin-top:10px">${badgeHTML(x.badge, "rgba(255,255,255,.7)", C.vez, C.cielo)}</div>
  </div>
  <div class="abs" style="left:70px;right:70px;top:1455px;text-align:center">${cta("COTIZAR EN VEZMONEY.COM")}</div>
  ${B(x)}`;
}

// F2 · Cápsulas de 24 h + foto circular que se asoma sobre la tarjeta
export function g(x) {
  const c = x.cor;
  return `${bgF}
  ${logoC(64, "left:70px;top:104px")}
  <div class="abs" style="left:70px;top:250px;width:640px">
    <div>${flagsRow(c, 52, "#fff", C.azul)}</div>
    <div style="margin-top:12px">${kicker(`Tasa de las ${x.hh}`, C.vez)}</div>
    <div class="m" style="font-weight:900;font-size:90px;line-height:1.02;letter-spacing:-.04em;margin-top:18px;color:${C.azul}">Hoy sábado,<br>así va <span style="color:${C.vez}">la tasa</span></div>
  </div>
  <div class="abs" style="left:56px;right:56px;top:650px;background:#fff;border-radius:44px;padding:36px 36px 24px;box-shadow:0 24px 60px rgba(3,37,140,.2)">
    <div style="font-weight:600;font-size:26px;color:${C.gris};margin-bottom:4px">${c.label} · cada hora, últimas 24 h · variación de ${varPct(x)} %</div>
    ${chart(x, 920, 380, "capsule", { line: C.lav, ink: C.azul, now: C.rosa, grid: "rgba(3,37,140,.14)" })}
    <div style="display:flex;justify-content:space-between;margin-top:6px;font-weight:600;font-size:25px;color:${C.gris}"><span>hace 24 h</span><span>ahora</span></div>
  </div>
  ${frame(x, { l: 790, t: 445, w: 210, h: 210, shape: "circle", bw: 10 })}
  <div class="abs" style="left:56px;right:56px;top:1170px;display:flex;gap:18px">${statChips(x, { bg: "#fff", ink: C.azul, hiBg: C.azul, hiInk: "#fff", shadow: "0 10px 26px rgba(3,37,140,.18)" })}</div>
  <div class="abs" style="left:70px;right:70px;top:1315px;text-align:center;color:${C.azul}">${x.badge ? badgeHTML(x.badge, "rgba(255,255,255,.7)", C.vez, C.cielo, "font-size:27px") : `<div style="font-weight:600;font-size:38px">Hoy <b class="m">${money(c, c.amounts[0])}</b> → <b class="m" style="color:${C.vez}">${conv(x, c.amounts[0])} ${c.unit}</b></div>`}</div>
  <div class="abs" style="left:70px;right:70px;top:1425px;text-align:center">${cta("COTIZA EN VEZMONEY.COM")}</div>
  ${B(x)}`;
}

// F3 · Tarjetas apiladas en zigzag
export function t(x, copy = {}) {
  const c = x.cor;
  const l1 = copy.l1 ?? "Elige tu monto,", l2 = copy.l2 ?? "mira tu **tasa**";
  const card = (m, i) => `<div style="margin:${i ? 22 : 0}px 0 0 ${i === 1 ? 70 : 0}px;margin-right:${i === 1 ? 0 : 70}px;background:#fff;border-radius:40px;padding:24px 36px;box-shadow:0 18px 44px rgba(3,37,140,.2);display:flex;align-items:center;gap:20px;${i === 1 ? `border:5px solid ${C.turq};` : ""}">${flag(c.fromFlag, 58)}<span style="font-weight:700;font-size:36px;color:${C.azul};flex:1">${money(c, m)}</span><span style="color:${C.cielo}">${arrowSvg(34)}</span><span class="m" style="font-weight:900;font-size:44px;color:${C.vez};min-width:330px;text-align:right">${conv(x, m)} ${c.unit}</span></div>`;
  return `${bgF}
  ${logoC(64, "left:70px;top:104px")}
  ${frame(x, { l: 700, t: 190, w: 310, h: 400, shape: "arch", r: 40, bw: 10 })}
  <div class="abs" style="left:70px;top:250px;width:600px"><div style="display:flex;align-items:center;gap:14px">${flagsRow(c, 46, "#fff", C.azul)}</div><div style="margin-top:12px">${kicker(`Tasa de las ${x.hh}`, C.vez, 25)}</div><div class="m" style="font-weight:900;font-size:84px;line-height:1.03;letter-spacing:-.04em;margin-top:16px;color:${C.azul}">${l1}<br>${hl(l2, C.vez)}</div></div>
  <div class="abs" style="left:56px;right:56px;top:700px">${c.amounts.map(card).join("")}</div>
  <div class="abs" style="top:1200px;left:70px;right:70px;text-align:center;color:${C.azul}"><span class="m" style="display:inline-block;background:${C.turq};color:${C.azul};font-weight:800;font-size:40px;padding:14px 38px;border-radius:999px">${unitRate(c, x.cur)}</span><div style="margin-top:14px">${badgeHTML(x.badge, "rgba(255,255,255,.7)", C.vez, C.cielo, "font-size:26px")}</div></div>
  <div class="abs" style="top:1440px;left:70px;right:70px;text-align:center">${cta(copy.cta ?? "ENVIAR AHORA")}</div>
  ${bottom({ ...x, tip: copy.tip ?? x.tip }, { ink: C.azul, dim: "#3C4A86", acc: C.vez, tip: !!copy.tip })}`;
}

// F4 · Cotizador en dos paneles (azul / blanco) con botón de intercambio
export function q(x) {
  const c = x.cor, m = c.amounts[1];
  return `${bgF}
  ${logoC(64, "left:50%;top:104px;transform:translateX(-50%)")}
  ${frame(x, { l: 60, t: 200, w: 340, h: 340, shape: "circle", bw: 12 })}
  ${sticker(`Tasa de las ${x.hh}`, C.turq, C.azul, "right:50px;top:300px;transform:rotate(5deg)", 36)}
  <div class="abs" style="left:56px;right:56px;top:610px">
    <div style="border-radius:56px;overflow:hidden;box-shadow:0 30px 70px rgba(3,37,140,.28)">
      <div style="background:${C.azul};color:#fff;padding:36px 44px 56px"><div style="font-weight:600;font-size:28px;opacity:.85;margin-bottom:12px">Tú envías</div><div style="display:flex;align-items:center;gap:22px">${flag(c.fromFlag, 84)}<span class="m" style="font-weight:900;font-size:68px;letter-spacing:-.03em;white-space:nowrap">${money(c, m)}</span></div></div>
      <div style="background:#fff;padding:56px 44px 36px"><div style="font-weight:600;font-size:28px;color:${C.gris};margin-bottom:12px">Tu contacto recibe</div><div style="display:flex;align-items:center;gap:22px">${flag(c.toFlag, 84)}<span class="m" style="font-weight:900;font-size:68px;letter-spacing:-.03em;color:${C.vez};white-space:nowrap">${conv(x, m)} ${c.unit}</span></div></div>
    </div>
    <div style="position:absolute;left:50%;top:50%;margin:-46px 0 0 -46px;width:92px;height:92px;border-radius:50%;background:${C.rosa};color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 26px rgba(242,7,117,.4);border:6px solid #fff;transform:rotate(90deg)">${arrowSvg(50)}</div>
  </div>
  <div class="abs" style="left:70px;right:70px;top:1165px;text-align:center"><span class="m" style="display:inline-block;background:#fff;color:${C.azul};font-weight:800;font-size:38px;padding:16px 38px;border-radius:999px;box-shadow:0 12px 30px rgba(3,37,140,.2)">${unitRate(c, x.cur)}</span></div>
  <div class="abs" style="left:70px;right:70px;top:1280px;text-align:center">${badgeHTML(x.badge, "rgba(255,255,255,.7)", C.vez, C.cielo)}</div>
  <div class="abs" style="left:70px;right:70px;top:1455px;text-align:center">${cta("ENVIAR EN VEZMONEY.COM")}</div>
  ${B(x)}`;
}
