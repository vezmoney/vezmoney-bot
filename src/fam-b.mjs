// fam-b.mjs — FAMILIA B · MARTES · "Azul profundo": fondo azul con alas translúcidas y rutas punteadas, texto blanco.
import { C, f, flag, flagsRow, arrowSvg, rateFmt, baseTxt, unitRate, conv, money, varPct, logoW, logoC, logo, dot, photo, orb, kicker, sticker, badgeHTML, cta, hl, frame, bottom, bgAzul, wing, route, chart, statChips, tableTiles, chip } from "./common.mjs";

export const style = "pill";
const bgB = (extra = "") => `${bgAzul}${wing("right:-260px;top:-200px;width:820px;height:820px")}${wing("left:-300px;bottom:180px;width:760px;height:760px", "c")}${route("left:60px;top:640px;opacity:.9", { w: 960, h: 520, d: "M10 480 C 260 40, 640 560, 950 60" })}${extra}`;
const B = (x) => bottom(x, { ink: "#fff", dim: "rgba(255,255,255,.78)", acc: "#BFD0FF", tip: false });
const glass = "background:rgba(255,255,255,.1);border:2px solid rgba(255,255,255,.28);backdrop-filter:blur(14px)";

// B1 · Sorpresa: foto en arco centrada
export function s(x) {
  const c = x.cor;
  return `${bgB()}
  ${logoW(64, "left:50%;top:104px;transform:translateX(-50%)")}
  ${frame(x, { l: 130, t: 205, w: 820, h: 700, shape: "arch", r: 56, bw: 12 })}
  ${sticker("¡Mira la tasa!", C.rosa, "#fff", "left:44px;top:330px;transform:rotate(-7deg)", 40)}
  ${chip(x, "#fff", C.azul, "left:50%;top:850px;transform:translateX(-50%) rotate(2deg)", 52)}
  <div class="abs" style="left:70px;right:70px;top:990px;text-align:center;color:#fff">
    <div style="margin-bottom:10px">${flagsRow(c, 60, "#fff", "#fff")}</div>
    ${kicker(`${dot("#fff")}Tasa de las ${x.hh} · ${c.label}`, "#BFD0FF")}
    <div style="font-weight:600;font-size:40px;margin-top:16px">Si envías <b class="m" style="font-weight:800">${money(c, c.amounts[0])}</b>, tu contacto recibe</div>
    <div class="m" style="font-weight:900;font-size:124px;letter-spacing:-.03em;line-height:1.1;margin-top:2px">${conv(x, c.amounts[0])} ${c.unit}</div>
    <div style="margin-top:12px">${badgeHTML(x.badge, "rgba(255,255,255,.14)", "#fff", "rgba(255,255,255,.7)")}</div>
  </div>
  <div class="abs" style="left:70px;right:70px;top:1450px;text-align:center">${cta("COTIZAR AHORA", "#fff", C.azul)}</div>
  ${B(x)}`;
}

// B2 · Barras de 24 h sobre panel de vidrio + foto circular
export function g(x) {
  const c = x.cor;
  return `${bgB()}
  ${logoW(64, "left:50%;top:104px;transform:translateX(-50%)")}
  ${frame(x, { l: 70, t: 230, w: 380, h: 380, shape: "circle", bw: 12 })}
  <div class="abs" style="left:490px;top:260px;width:520px;color:#fff">
    <div>${flagsRow(c, 46, "#fff", "#fff")}</div>
    <div style="margin-top:10px">${kicker(`Tasa de las ${x.hh}`, "#BFD0FF")}</div>
    <div class="m" style="font-weight:900;font-size:84px;line-height:1.04;letter-spacing:-.03em;margin-top:14px">Así se<br>movió <span style="color:#9FBBFF">hoy</span></div>
  </div>
  <div class="abs" style="left:56px;right:56px;top:670px;${glass};border-radius:44px;padding:30px 36px 24px">
    <div style="font-weight:600;font-size:26px;color:rgba(255,255,255,.85);margin-bottom:6px">${c.label} · cada hora, últimas 24 h · variación de ${varPct(x)} %</div>
    ${chart(x, 920, 360, "bars", { line: "#9FBBFF", grid: "rgba(255,255,255,.2)", ink: "#fff", now: C.rosa, nowRing: "#fff" })}
    <div style="display:flex;justify-content:space-between;margin-top:6px;font-weight:600;font-size:25px;color:rgba(255,255,255,.85)"><span>hace 24 h</span><span>ahora</span></div>
  </div>
  <div class="abs" style="left:56px;right:56px;top:1190px;display:flex;gap:18px">${statChips(x, { bg: "rgba(255,255,255,.95)", ink: C.azul, hiBg: "#fff", hiInk: C.rosa, shadow: "0 10px 26px rgba(0,0,0,.25)" })}</div>
  <div class="abs" style="left:70px;right:70px;top:1335px;text-align:center;color:#fff">
    ${x.badge ? badgeHTML(x.badge, "rgba(255,255,255,.14)", "#fff", "rgba(255,255,255,.7)", "font-size:27px") : `<div style="font-weight:600;font-size:38px">Hoy <b class="m">${money(c, c.amounts[0])}</b> → <b class="m" style="color:#9FBBFF">${conv(x, c.amounts[0])} ${c.unit}</b></div>`}
  </div>
  <div class="abs" style="left:70px;right:70px;top:1440px;text-align:center">${cta("COTIZA EN VEZMONEY.COM", "#fff", C.azul)}</div>
  ${B(x)}`;
}

// B3 · Tres baldosas con foto circular
export function t(x, copy = {}) {
  const c = x.cor;
  const l1 = copy.l1 ?? "Tu envío", l2 = copy.l2 ?? "en **números**";
  return `${bgB()}
  ${logoW(64, "left:50%;top:104px;transform:translateX(-50%)")}
  ${frame(x, { l: 290, t: 210, w: 500, h: 500, shape: "circle", bw: 14 })}
  <div class="abs" style="left:0;right:0;top:735px;display:flex;justify-content:center"><span style="display:inline-flex;align-items:center;gap:16px;background:#fff;color:${C.azul};border-radius:999px;padding:10px 28px 10px 14px;box-shadow:0 12px 30px rgba(0,0,0,.25)"><span>${flagsRow(c, 48, "#fff", C.azul)}</span><span class="m" style="font-weight:800;font-size:26px">Tasa de las ${x.hh} · ${c.label}</span></span></div>
  <div class="abs" style="top:830px;left:70px;right:70px;text-align:center"><div class="m" style="font-weight:900;font-size:92px;line-height:1.04;color:#fff;letter-spacing:-.03em">${l1}<br>${hl(l2, "#9FBBFF", "#fff").replace(/color:#fff;padding:0 18px/g, `color:${C.azul};padding:0 18px`)}</div></div>
  <div class="abs" style="left:46px;right:46px;top:1100px">${tableTiles(x, { bg: "#fff", ink: C.azul, numInk: C.vez, hi: 1, hiBg: "#fff", hiInk: C.azul })}</div>
  <div class="abs" style="top:1395px;left:70px;right:70px;text-align:center;color:#fff"><div style="font-weight:700;font-size:38px">${unitRate(c, x.cur)}</div></div>
  <div class="abs" style="top:1465px;left:70px;right:70px;text-align:center">${cta(copy.cta ?? "ENVIAR AHORA", "#fff", C.azul)}</div>
  ${bottom({ ...x, tip: copy.tip ?? x.tip }, { ink: "#fff", dim: "rgba(255,255,255,.78)", acc: "#BFD0FF", tip: !!copy.tip, bottomPx: 100 })}`;
}

// B4 · Cotizador dentro de un celular
export function q(x) {
  const c = x.cor, m = c.amounts[1];
  const row = (fl, txt, big) => `<div style="display:flex;align-items:center;gap:16px;background:#fff;border-radius:26px;padding:16px 22px;box-shadow:0 6px 18px rgba(0,28,112,.1)">${fl}<span class="m" style="font-weight:${big ? 900 : 800};font-size:${big ? 40 : 44}px;color:${big ? C.vez : C.azul};white-space:nowrap">${txt}</span></div>`;
  return `${bgB()}
  ${logoW(64, "left:50%;top:104px;transform:translateX(-50%)")}
  <div class="abs" style="left:70px;right:70px;top:205px;text-align:center;color:#fff"><div class="m" style="font-weight:900;font-size:80px;line-height:1.04;letter-spacing:-.03em">Cotiza desde<br>tu <span style="color:#9FBBFF">celular</span></div></div>
  <div class="abs" style="left:250px;top:430px;width:580px;height:880px;border-radius:72px;background:#F6F7FB;border:14px solid #fff;box-shadow:0 40px 90px rgba(0,0,0,.5);overflow:hidden">
    <div style="position:absolute;left:50%;top:16px;transform:translateX(-50%);width:120px;height:26px;border-radius:14px;background:${C.azul}"></div>
    <div style="padding:70px 30px 0">
      <div style="display:flex;justify-content:center;margin-bottom:22px"><img src="assets/logos/principal_horizontal.png" style="height:42px"></div>
      <div style="font-weight:600;font-size:23px;color:${C.gris};margin:0 0 8px 6px">Tú envías</div>
      ${row(flag(c.fromFlag, 54), money(c, m), false)}
      <div style="display:flex;justify-content:center;margin:-10px 0 -10px"><span style="position:relative;z-index:2;width:58px;height:58px;border-radius:50%;background:${C.rosa};color:#fff;display:flex;align-items:center;justify-content:center;transform:rotate(90deg)">${arrowSvg(32)}</span></div>
      <div style="font-weight:600;font-size:23px;color:${C.gris};margin:0 0 8px 6px">Tu contacto recibe</div>
      ${row(flag(c.toFlag, 54), `${conv(x, m)} ${c.unit}`, true)}
      <div style="background:#fff;border-radius:22px;padding:16px 22px;margin-top:22px;font-weight:600;font-size:22px;color:${C.azul};line-height:1.7">
        <div style="display:flex;justify-content:space-between"><span style="color:${C.gris}">Monto a convertir:</span><b>${money(c, m)}</b></div>
        <div style="display:flex;justify-content:space-between"><span style="color:${C.gris}">Tipo de cambio:</span><b>${unitRate(c, x.cur)}</b></div>
      </div>
      <div class="m" style="margin-top:26px;background:${C.rosa};color:#fff;font-weight:800;font-size:30px;text-align:center;padding:22px;border-radius:999px">Enviar ahora</div>
      <div style="text-align:center;font-weight:600;font-size:20px;color:${C.gris};margin-top:14px">Envío internacional seguro</div>
    </div>
  </div>
  ${frame(x, { l: 30, t: 290, w: 240, h: 240, shape: "circle", bw: 10 })}
  ${sticker(`Tasa de las ${x.hh}`, "#fff", C.azul, "right:56px;top:1335px;transform:rotate(4deg)", 34)}
  <div class="abs" style="left:70px;right:70px;top:1445px;text-align:center">${cta("ENVIAR EN VEZMONEY.COM", "#fff", C.azul)}</div>
  ${B(x)}`;
}
