// fam-c.mjs — FAMILIA C · MIÉRCOLES · "Cielo": degradado azul cielo luminoso, círculos grandes, toques turquesa, tarjetas blancas.
import { C, f, flag, flagsRow, arrowSvg, rateFmt, baseTxt, unitRate, conv, money, varPct, logoW, logoC, dot, photo, orb, kicker, sticker, badgeHTML, cta, hl, frame, bottom, bgCielo, chart, statChips, tableLadder, chip } from "./common.mjs";

export const style = "pill";
const bgC = `${bgCielo}${orb("right:-260px;top:-220px;width:760px;height:760px;background:rgba(255,255,255,.14)")}${orb("left:-300px;bottom:260px;width:760px;height:760px;background:rgba(255,255,255,.1)")}`;
const B = (x) => bottom(x, { ink: "#fff", dim: "rgba(255,255,255,.82)", acc: "#DCE6FF", tip: false });

// C1 · Sorpresa a pantalla completa, texto a la izquierda
export function s(x) {
  const c = x.cor;
  return `${photo(x, "left:0;top:-250px;width:1080px;height:2170px")}
  <div class="abs" style="inset:0;background:linear-gradient(to bottom,rgba(3,37,140,.55) 0%,rgba(3,37,140,0) 22%,rgba(0,28,112,.05) 40%,rgba(0,28,112,.9) 66%,rgba(0,20,80,.98) 100%)"></div>
  ${logoW(64, "left:50%;top:104px;transform:translateX(-50%)")}
  ${sticker("¡Buenas noticias!", "#fff", C.azul, "left:56px;top:300px;transform:rotate(-5deg)", 42)}
  <div class="abs" style="left:70px;right:70px;top:935px;color:#fff">
    <div style="display:flex;align-items:center;gap:18px">${flagsRow(c, 62, "#fff", "#fff")}</div>
    <div style="margin-top:16px">${kicker(`${dot(C.turq)}Tasa de las ${x.hh} · ${c.label}`, "#BFD0FF")}</div>
    <div class="m" style="font-weight:700;font-size:50px;margin-top:20px">${baseTxt(c)} ${c.fromUnit} =</div>
    <div class="m" style="font-weight:900;font-size:152px;letter-spacing:-.04em;line-height:1;margin-top:2px">${rateFmt(c, x.cur)} <span style="color:#9FBBFF">${c.unit}</span></div>
    <div style="font-weight:600;font-size:36px;margin-top:22px">Con <b class="m">${money(c, c.amounts[0])}</b> tu contacto recibe <b class="m" style="color:#9FBBFF">${conv(x, c.amounts[0])} ${c.unit}</b></div>
    <div style="margin-top:20px">${badgeHTML(x.badge, "rgba(255,255,255,.14)", "#fff", "rgba(255,255,255,.7)")}</div>
  </div>
  <div class="abs" style="left:70px;top:1475px">${cta("COTIZAR AHORA", "#fff", C.azul)}</div>
  ${B(x)}`;
}

// C2 · Puntos de 24 h sobre tarjeta blanca + foto en arco
export function g(x) {
  const c = x.cor;
  return `${bgC}
  ${logoW(64, "left:70px;top:104px")}
  ${frame(x, { l: 700, t: 200, w: 310, h: 430, shape: "arch", r: 40, bw: 10 })}
  <div class="abs" style="left:70px;top:270px;width:580px;color:#fff">
    <div>${flagsRow(c, 52, "#fff", "#fff")}</div>
    <div style="margin-top:12px">${kicker(`Tasa de las ${x.hh}`, "#DCE6FF")}</div>
    <div class="m" style="font-weight:900;font-size:92px;line-height:1.02;letter-spacing:-.03em;margin-top:18px">¿Cómo<br>va la <span style="color:#CFE0FF">tasa</span>?</div>
  </div>
  <div class="abs" style="left:56px;right:56px;top:680px;background:#fff;border-radius:44px;padding:30px 36px 24px;box-shadow:0 24px 60px rgba(0,22,80,.3)">
    <div style="font-weight:600;font-size:26px;color:${C.gris};margin-bottom:4px">${c.label} · últimas 24 horas · variación de ${varPct(x)} %</div>
    ${chart(x, 920, 380, "dots", { line: C.vez, ink: C.azul })}
    <div style="display:flex;justify-content:space-between;margin-top:6px;font-weight:600;font-size:25px;color:${C.gris}"><span>hace 24 h</span><span>ahora</span></div>
  </div>
  <div class="abs" style="left:56px;right:56px;top:1230px;display:flex;gap:18px">${statChips(x, { bg: "#fff", ink: C.azul, hiBg: C.azul, hiInk: "#fff", shadow: "0 10px 26px rgba(0,22,80,.25)" })}</div>
  <div class="abs" style="left:70px;right:70px;top:1375px;text-align:center;color:#fff">
    ${x.badge ? badgeHTML(x.badge, "rgba(255,255,255,.14)", "#fff", "rgba(255,255,255,.7)", "font-size:27px") : `<div style="font-weight:600;font-size:38px">Hoy <b class="m">${money(c, c.amounts[0])}</b> → <b class="m" style="color:#CFE0FF">${conv(x, c.amounts[0])} ${c.unit}</b></div>`}
  </div>
  <div class="abs" style="left:70px;right:70px;top:1470px;text-align:center">${cta("COTIZA EN VEZMONEY.COM", "#fff", C.azul)}</div>
  ${B(x)}`;
}

// C3 · Escalera de montos con foto cortada en diagonal
export function t(x, copy = {}) {
  const c = x.cor;
  const l1 = copy.l1 ?? "Elige tu monto", l2 = copy.l2 ?? "y mira **cuánto llega**";
  return `${bgC}
  ${photo(x, "left:0;top:0;width:1080px;height:980px;clip-path:polygon(0 0,100% 0,100% 82%,0 100%)")}
  <div class="abs" style="left:0;top:0;width:1080px;height:980px;clip-path:polygon(0 0,100% 0,100% 82%,0 100%);background:linear-gradient(to bottom,rgba(3,37,140,.6),rgba(3,37,140,.1) 40%,rgba(0,28,112,.7))"></div>
  <div class="abs" style="left:0;top:0;width:1080px;height:1000px"><svg width="1080" height="1000"><polygon points="0,980 1080,804 1080,832 0,1008" fill="${C.turq}"/></svg></div>
  ${logoW(64, "left:70px;top:104px")}
  <div class="abs" style="top:200px;left:70px"><span style="display:inline-flex;align-items:center;gap:16px;background:#fff;color:${C.azul};border-radius:999px;padding:10px 28px 10px 14px"><span>${flagsRow(c, 46, "#fff", C.azul)}</span><span class="m" style="font-weight:800;font-size:25px">Tasa de las ${x.hh} · ${c.label}</span></span></div>
  <div class="abs" style="top:290px;left:70px;right:70px"><div class="m" style="font-weight:900;font-size:86px;line-height:1.04;color:#fff;letter-spacing:-.03em;text-shadow:0 4px 24px rgba(0,0,0,.4)">${l1}<br>${hl(l2, "#CFE0FF")}</div></div>
  <div class="abs" style="left:60px;right:60px;top:940px;background:#fff;border-radius:44px;padding:14px 44px 18px;box-shadow:0 24px 60px rgba(0,22,80,.35)">${tableLadder(x)}</div>
  <div class="abs" style="top:1395px;left:70px;right:70px;text-align:center;color:#fff"><div style="font-weight:700;font-size:38px">${unitRate(c, x.cur)}</div></div>
  <div class="abs" style="top:1465px;left:70px;right:70px;text-align:center">${cta(copy.cta ?? "ENVIAR AHORA", "#fff", C.azul)}</div>
  ${bottom({ ...x, tip: copy.tip ?? x.tip }, { ink: "#fff", dim: "rgba(255,255,255,.82)", acc: "#DCE6FF", tip: !!copy.tip, bottomPx: 100 })}`;
}

// C4 · Cotizador como conversación
export function q(x) {
  const c = x.cor, m = c.amounts[1];
  const bubble = (side, label, fl, txt, bg, ink, numInk) => `<div style="display:flex;justify-content:${side === "l" ? "flex-start" : "flex-end"}"><div style="background:${bg};color:${ink};border-radius:${side === "l" ? "48px 48px 48px 12px" : "48px 48px 12px 48px"};padding:26px 36px 28px;box-shadow:0 18px 44px rgba(0,22,80,.28);min-width:600px;max-width:880px"><div style="font-weight:600;font-size:28px;opacity:.8;margin-bottom:12px">${label}</div><div style="display:flex;align-items:center;gap:20px">${fl}<span class="m" style="font-weight:900;font-size:62px;color:${numInk};white-space:nowrap">${txt}</span></div></div></div>`;
  return `${bgC}
  ${logoW(64, "left:50%;top:104px;transform:translateX(-50%)")}
  ${frame(x, { l: 330, t: 210, w: 420, h: 420, shape: "circle", bw: 14 })}
  ${sticker(`Tasa de las ${x.hh}`, "#fff", C.azul, "left:50px;top:560px;transform:rotate(-5deg)", 34)}
  <div class="abs" style="left:60px;right:60px;top:700px">
    ${bubble("l", "Tú envías", flag(c.fromFlag, 76), money(c, m), "#fff", C.azul, C.azul)}
    <div style="height:34px"></div>
    ${bubble("r", "Tu contacto recibe", flag(c.toFlag, 76), `${conv(x, m)} ${c.unit}`, C.azul, "#fff", "#fff")}
  </div>
  <div class="abs" style="left:70px;right:70px;top:1235px;text-align:center"><span class="m" style="display:inline-block;background:rgba(255,255,255,.18);border:2px solid rgba(255,255,255,.5);color:#fff;font-weight:800;font-size:38px;padding:16px 38px;border-radius:999px">${unitRate(c, x.cur)}</span></div>
  <div class="abs" style="left:70px;right:70px;top:1330px;text-align:center">${badgeHTML(x.badge, "rgba(255,255,255,.14)", "#fff", "rgba(255,255,255,.7)")}</div>
  <div class="abs" style="left:70px;right:70px;top:1450px;text-align:center">${cta("ENVIAR EN VEZMONEY.COM", "#fff", C.azul)}</div>
  ${B(x)}`;
}
