// fam-d.mjs — FAMILIA D · JUEVES · "Blanco editorial": página blanca, tipografía grande, bloques azul profundo, boleto de envío.
import { C, f, flag, flagsRow, arrowSvg, rateFmt, baseTxt, unitRate, conv, money, varPct, logoC, logoW, logo, dot, photo, orb, kicker, sticker, badgeHTML, cta, hl, frame, bottom, bgBlanco, chart, statChips, tableTicket, chip } from "./common.mjs";

export const style = "accent";
const B = (x, dark = false) => bottom(x, dark ? { ink: "#fff", dim: "rgba(255,255,255,.78)", acc: "#BFD0FF", tip: false } : { ink: C.azul, dim: C.gris, acc: C.vez, tip: false });
const top = (x, dark = false) => `${dark ? logoW(60, "left:70px;top:100px") : logoC(60, "left:70px;top:100px")}<div class="m abs" style="right:70px;top:112px;font-weight:800;font-size:25px;letter-spacing:.14em;text-transform:uppercase;color:${dark ? "#BFD0FF" : C.vez}">Tasa de las ${x.hh}</div>`;
const outline = (t) => `<span class="m" style="display:inline-flex;align-items:center;gap:20px;background:#fff;color:${C.azul};border:5px solid ${C.azul};font-weight:800;font-size:36px;padding:16px 22px 16px 42px;border-radius:999px;white-space:nowrap">${t}<span style="width:56px;height:56px;border-radius:50%;background:${C.rosa};color:#fff;display:inline-flex;align-items:center;justify-content:center">${arrowSvg(30)}</span></span>`;

// D1 · Editorial: titular grande, tasa gigante, foto apaisada con tarjeta
export function s(x) {
  const c = x.cor;
  return `${bgBlanco}
  ${top(x)}
  <div class="abs" style="left:70px;right:70px;top:215px">
    ${kicker("Hoy en VezMoney", C.vez, 26)}
    <div class="m" style="font-weight:900;font-size:100px;line-height:1.0;letter-spacing:-.04em;margin-top:16px;color:${C.azul}">Mira la tasa<br>de <span style="color:${C.vez}">hoy.</span></div>
  </div>
  <div class="abs" style="left:70px;right:70px;top:545px">
    <div style="display:flex;align-items:center;gap:18px">${flagsRow(c, 56, "#fff", C.azul)}<span class="m" style="font-weight:700;font-size:40px;color:${C.gris}">${baseTxt(c)} ${c.fromUnit} =</span></div>
    <div class="m" style="font-weight:900;font-size:206px;letter-spacing:-.06em;line-height:1;color:${C.azul};margin-top:6px;margin-left:-8px">${rateFmt(c, x.cur)}</div>
    <div class="m" style="font-weight:800;font-size:58px;color:${C.vez};margin-top:-4px">${c.unit}<span style="font-weight:600;color:${C.gris}"> · tasa del momento</span></div>
  </div>
  ${frame(x, { l: 70, t: 1010, w: 940, h: 420, shape: "rect", r: 56, bw: 0, shadow: "0 26px 60px rgba(0,22,80,.25)" })}
  <div class="abs" style="left:110px;right:110px;top:1370px;background:${C.azul};color:#fff;border-radius:34px;padding:22px 34px;box-shadow:0 20px 50px rgba(0,22,80,.4);display:flex;align-items:center;justify-content:space-between"><span style="font-weight:600;font-size:34px">Envías <b class="m">${money(c, c.amounts[0])}</b></span><span style="color:${C.cielo}">${arrowSvg(40)}</span><span class="m" style="font-weight:900;font-size:44px">${conv(x, c.amounts[0])} ${c.unit}</span></div>
  <div class="abs" style="left:70px;right:70px;top:1500px;text-align:center">${outline("COTIZAR EN VEZMONEY.COM")}</div>
  ${B(x)}`;
}

// D2 · Gráfico escalonado en bloque azul + foto inclinada
export function g(x) {
  const c = x.cor;
  return `${bgBlanco}
  ${top(x)}
  <div class="abs" style="left:70px;top:230px;width:640px">
    ${kicker("Un vistazo", C.vez, 26)}
    <div class="m" style="font-weight:900;font-size:94px;line-height:1.0;letter-spacing:-.04em;margin-top:16px;color:${C.azul}">Así va la<br><span style="color:${C.vez}">tasa</span> de hoy</div>
  </div>
  <div class="abs" style="right:60px;top:210px;width:300px;height:360px;border:10px solid #fff;border-radius:40px;transform:rotate(5deg);box-shadow:0 20px 50px rgba(0,22,80,.3);overflow:hidden">${photo(x, "left:0;top:0;width:100%;height:100%")}</div>
  <div class="abs" style="left:0;right:0;top:640px;bottom:0;background:${C.azul};border-radius:70px 70px 0 0"></div>
  <div class="abs" style="left:56px;right:56px;top:690px;color:#fff">
    <div style="display:flex;align-items:center;gap:16px">${flagsRow(c, 48, "#fff", "#fff")}<span style="font-weight:600;font-size:26px;opacity:.85">${c.label} · últimas 24 h · variación de ${varPct(x)} %</span></div>
    ${chart(x, 960, 400, "step", { line: "#fff", area: C.cielo, grid: "rgba(255,255,255,.22)", ink: "#fff", now: C.rosa })}
    <div style="display:flex;justify-content:space-between;margin-top:4px;font-weight:600;font-size:25px;opacity:.85"><span>hace 24 h</span><span>ahora</span></div>
  </div>
  <div class="abs" style="left:56px;right:56px;top:1215px;display:flex;gap:18px">${statChips(x, { bg: "rgba(255,255,255,.14)", ink: "#fff", hiBg: "#fff", hiInk: C.azul, shadow: "none" })}</div>
  <div class="abs" style="left:70px;right:70px;top:1360px;text-align:center;color:#fff">${x.badge ? badgeHTML(x.badge, "rgba(255,255,255,.14)", "#fff", "rgba(255,255,255,.7)", "font-size:27px") : `<div style="font-weight:600;font-size:38px">Hoy <b class="m">${money(c, c.amounts[0])}</b> → <b class="m" style="color:#9FBBFF">${conv(x, c.amounts[0])} ${c.unit}</b></div>`}</div>
  <div class="abs" style="left:70px;right:70px;top:1445px;text-align:center">${cta("COTIZA EN VEZMONEY.COM", "#fff", C.azul)}</div>
  ${B(x, true)}`;
}

// D3 · Boleto de envío sobre bloque azul
export function t(x, copy = {}) {
  const c = x.cor;
  const l1 = copy.l1 ?? "Tu resumen", l2 = copy.l2 ?? "de **envío**";
  return `${bgBlanco}
  ${top(x)}
  ${frame(x, { l: 70, t: 215, w: 330, h: 420, shape: "arch", r: 36, bw: 10 })}
  <div class="abs" style="left:440px;top:260px;width:570px"><div class="m" style="font-weight:900;font-size:88px;line-height:1.02;letter-spacing:-.04em;color:${C.azul}">${l1}<br>${hl(l2, C.vez, C.azul)}</div><div style="margin-top:20px;display:flex;align-items:center;gap:14px">${flagsRow(c, 44, "#fff", C.azul)}<span style="font-weight:600;font-size:27px;color:${C.gris}">${c.label}</span></div></div>
  <div class="abs" style="left:0;right:0;top:700px;bottom:0;background:${C.azul};border-radius:80px 80px 0 0"></div>
  <div class="abs" style="left:60px;right:60px;top:770px">${tableTicket(x, { bg: "#fff", ink: C.azul, numInk: C.vez })}</div>
  <div class="abs" style="top:1190px;left:70px;right:70px;text-align:center;color:#fff"><div style="font-weight:700;font-size:40px">${unitRate(c, x.cur)}</div><div style="margin-top:12px">${badgeHTML(x.badge, "rgba(255,255,255,.14)", "#fff", "rgba(255,255,255,.7)", "font-size:26px")}</div></div>
  <div class="abs" style="top:1445px;left:70px;right:70px;text-align:center">${cta(copy.cta ?? "ENVIAR AHORA", "#fff", C.azul)}</div>
  ${bottom({ ...x, tip: copy.tip ?? x.tip }, { ink: "#fff", dim: "rgba(255,255,255,.78)", acc: "#BFD0FF", tip: !!copy.tip })}`;
}

// D4 · Pase de abordar: envías → recibes
export function q(x) {
  const c = x.cor, m = c.amounts[2];
  const sec = (label, fl, name, amt, ink) => `<div style="padding:34px 44px 30px"><div class="m" style="font-weight:800;font-size:25px;letter-spacing:.16em;color:${C.gris}">${label}</div><div style="display:flex;align-items:center;gap:26px;margin-top:14px">${fl}<div><div class="m" style="font-weight:900;font-size:66px;letter-spacing:-.03em;color:${ink};line-height:1.05;white-space:nowrap">${amt}</div><div style="font-weight:600;font-size:28px;color:${C.gris};margin-top:2px">${name}</div></div></div></div>`;
  return `${bgBlanco}
  ${top(x)}
  ${frame(x, { l: 70, t: 205, w: 940, h: 440, shape: "rect", r: 56, bw: 0, shadow: "0 26px 60px rgba(0,22,80,.25)" })}
  ${sticker("Envía y compara", C.azul, "#fff", "right:110px;top:600px;transform:rotate(4deg)", 36)}
  <div class="abs" style="left:70px;right:70px;top:720px;background:#fff;border-radius:48px;box-shadow:0 30px 70px rgba(0,22,80,.28);overflow:hidden">
    ${sec("ENVÍAS", flag(c.fromFlag, 96), COUNTRY_NAME(c.fromCode), money(c, m), C.azul)}
    <div style="position:relative;height:0;border-top:4px dashed ${C.gris20};margin:0 40px">
      <span style="position:absolute;left:50%;top:-36px;transform:translateX(-50%);width:72px;height:72px;border-radius:50%;background:#fff;border:4px solid ${C.gris20};display:flex;align-items:center;justify-content:center"><img src="assets/logos/isotipo_rosa.png" style="height:38px"></span>
      <span style="position:absolute;left:-76px;top:-26px;width:48px;height:48px;border-radius:50%;background:#EEF1FB"></span><span style="position:absolute;right:-76px;top:-26px;width:48px;height:48px;border-radius:50%;background:#EEF1FB"></span>
    </div>
    ${sec("RECIBE", flag(c.toFlag, 96), COUNTRY_NAME(c.toCode), `${conv(x, m)} ${c.unit}`, C.vez)}
    <div class="m" style="background:${C.azul};color:#fff;text-align:center;font-weight:800;font-size:38px;padding:26px">${unitRate(c, x.cur)}</div>
  </div>
  <div class="abs" style="left:70px;right:70px;top:1400px;text-align:center">${badgeHTML(x.badge, "rgba(91,140,255,.16)", C.vez, C.cielo)}</div>
  <div class="abs" style="left:70px;right:70px;top:1480px;text-align:center">${outline("ENVIAR EN VEZMONEY.COM")}</div>
  ${B(x)}`;
}
import { COUNTRY } from "./common.mjs";
const COUNTRY_NAME = (code) => COUNTRY[code].name;
