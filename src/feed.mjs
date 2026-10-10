// feed.mjs — 6 plantillas de post de feed (1080x1350), una por día de lunes a sábado (se repiten cada semana).
//  lun · Chile→Venezuela      mar · Chile→Venezuela + Chile→(Perú, Argentina, Ecuador, Colombia, EE. UU.)
//  mié · Chile→Venezuela      jue · Perú→(Venezuela, Chile, Colombia, Argentina, Ecuador, EE. UU.)
//  vie · Chile→Venezuela      sáb · Colombia→(Venezuela, Chile, Perú, Argentina, Ecuador, EE. UU.)
import { C, f, COUNTRY, pair, flag, flagsRow, arrowSvg, rateFmt, baseTxt, unitRate, conv, money, varPct, logoW, logoC, dot, photo, orb, kicker, sticker, badgeHTML, cta, hl, frame, bgNube, bgBlanco, bgAzul, bgCielo, bgLav, wing, route, chart, tableCard, quote, chip } from "./common.mjs";

// qué corredores necesita cada pieza
export const FEED_PLAN = {
  f1: { main: pair("CL", "VE") },
  f2: { main: pair("CL", "VE"), others: ["PE", "AR", "EC", "CO", "US"].map((t) => pair("CL", t)), amt: 0 },
  f3: { main: pair("CL", "VE") },
  f4: { main: pair("PE", "VE"), others: ["VE", "CL", "CO", "AR", "EC", "US"].map((t) => pair("PE", t)), amt: 1 },
  f5: { main: pair("CL", "VE") },
  f6: { main: pair("CO", "VE"), others: ["VE", "CL", "PE", "AR", "EC", "US"].map((t) => pair("CO", t)), amt: 1 },
};
export const FEED_KEYS = Object.keys(FEED_PLAN);
export const feedForWeekday = { 1: "f1", 2: "f2", 3: "f3", 4: "f4", 5: "f5", 6: "f6" };

// pie del feed: aviso de tasa + marca
const foot = (x, ink, dim) => `
  <div class="abs" style="left:70px;right:70px;bottom:62px;text-align:center;font-weight:500;font-size:22px;line-height:1.34;color:${dim}">${x.disclaimer}</div>
  <div class="m abs" style="left:80px;right:80px;bottom:22px;display:flex;justify-content:space-between;font-weight:700;font-size:23px;color:${ink}"><span>@vezmoneyoficial</span><span>${x.note}</span></div>`;

// tasa unitaria legible de un corredor de lista (base 1 o 1.000 unidades de origen)
const listBase = (o) => (o.fromCode === "PE" ? 1 : 1000);
const listRate = (o, cur) => `${f(listBase(o))} ${o.fromUnit} = ${f(cur * listBase(o), 2, 6)} ${o.unit}`;
const recv = (o, cur, amt) => `${f(amt * cur, 2)} ${o.unit}`;

// ---------- lunes · foto arriba + hoja nube con mini gráfico ----------
function f1(x) {
  const c = x.cor;
  return `${bgNube}
  ${photo(x, "left:0;top:0;width:1080px;height:640px")}
  <div class="abs" style="left:0;right:0;top:0;height:240px;background:linear-gradient(to bottom,rgba(0,28,112,.55),transparent)"></div>
  ${logoW(60, "left:64px;top:56px")}
  ${sticker(`Tasa de las ${x.hh}`, "#fff", C.azul, "right:56px;top:62px;transform:rotate(4deg)", 36)}
  <div class="abs" style="left:0;right:0;top:560px;bottom:0;background:#F6F7FB;border-radius:70px 70px 0 0;box-shadow:0 -20px 60px rgba(0,28,112,.25)"></div>
  ${chip(x, C.azul, "#fff", "left:50%;top:496px;transform:translateX(-50%) rotate(-2deg)", 52)}
  <div class="abs" style="left:80px;right:80px;top:650px">
    <div style="display:flex;align-items:center;gap:18px">${flagsRow(c, 54, "#fff", C.azul)}${kicker(`${c.label} · cada hora`, C.vez, 25)}</div>
    <div style="font-weight:600;font-size:38px;margin-top:12px;color:${C.gris}">Si envías <b class="m" style="color:${C.azul}">${money(c, c.amounts[0])}</b>, tu contacto recibe</div>
    <div class="m" style="font-weight:900;font-size:104px;letter-spacing:-.04em;line-height:1.1;color:${C.vez}">${conv(x, c.amounts[0])} ${c.unit}</div>
    <div style="margin-top:8px">${chart(x, 920, 150, "area", { line: C.vez, area: C.cielo, labels: false })}</div>
    <div style="font-weight:600;font-size:23px;color:${C.gris};margin-top:2px">Últimas 24 horas · variación de ${varPct(x)} %</div>
    <div style="margin-top:10px">${badgeHTML(x.badge, "rgba(91,140,255,.16)", C.vez, C.cielo, "font-size:25px")}</div>
  </div>
  ${foot(x, C.azul, C.gris)}`;
}

// ---------- martes · Chile→Venezuela + Chile→otros países en el mismo creativo (minimalista, sin foto) ----------
function f2(x) {
  const c = x.cor, amt = FEED_PLAN.f2.others[0].amounts[FEED_PLAN.f2.amt];
  const rows = x.list.map((r, i) => `<div style="display:flex;align-items:center;gap:22px;padding:11px 0;${i ? "border-top:3px solid rgba(0,28,112,.1)" : ""}">${flag(r.o.toFlag, 62)}<span style="flex:1;font-weight:800;font-size:38px;color:${C.azul}">${COUNTRY[r.o.toCode].name}</span><span class="m" style="font-weight:900;font-size:46px;color:${C.vez}">${recv(r.o, r.cur, amt)}</span></div>`).join("");
  return `${bgAzul}${wing("right:-240px;top:-200px;width:720px;height:720px")}${wing("left:-280px;bottom:100px;width:700px;height:700px", "c")}
  ${logoW(60, "left:64px;top:52px")}
  <div class="abs" style="right:64px;top:62px">${flagsRow(c, 54, "#fff", "#fff")}</div>
  <div class="abs" style="left:64px;right:64px;top:170px;color:#fff">
    <div class="m" style="font-weight:700;font-size:44px">${baseTxt(c)} ${c.fromUnit} =</div>
    <div class="m" style="font-weight:900;font-size:150px;letter-spacing:-.05em;line-height:1;white-space:nowrap">${rateFmt(c, x.cur)} <span style="color:#9FBBFF;font-size:84px">${c.unit}</span></div>
    <div style="font-weight:600;font-size:34px;margin-top:12px">Con <b class="m">${money(c, c.amounts[0])}</b> recibe <b class="m" style="color:#9FBBFF">${conv(x, c.amounts[0])} ${c.unit}</b></div>
  </div>
  <div class="abs" style="left:56px;right:56px;top:560px;background:#fff;border-radius:48px;padding:30px 44px 16px;box-shadow:0 24px 60px rgba(0,0,0,.35)">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px"><span class="m" style="font-weight:900;font-size:40px;color:${C.azul}">Desde Chile, también a</span><span class="m" style="background:${C.azul};color:#fff;font-weight:800;font-size:26px;padding:9px 22px;border-radius:999px">Envías ${f(amt)} CLP</span></div>
    ${rows}
  </div>
  <div class="abs" style="left:70px;right:70px;top:1118px;text-align:center">${cta("COTIZA EN VEZMONEY.COM", "#fff", C.azul, { size: 30 })}</div>
  ${foot(x, "#fff", "rgba(255,255,255,.82)")}`;
}

// ---------- miércoles · cielo con tabla de montos ----------
function f3(x) {
  const c = x.cor;
  return `${bgCielo}${orb("right:-240px;top:-200px;width:700px;height:700px;background:rgba(255,255,255,.14)")}${orb("left:-260px;bottom:-60px;width:700px;height:700px;background:rgba(255,255,255,.1)")}
  ${logoW(60, "left:64px;top:52px")}
  ${frame(x, { l: 690, t: 100, w: 330, h: 440, shape: "arch", r: 40, bw: 10 })}
  <div class="abs" style="left:64px;top:160px;width:600px;color:#fff">
    <div style="display:flex;align-items:center;gap:14px">${flagsRow(c, 50, "#fff", "#fff")}</div>
    <div style="margin-top:10px">${kicker(`Tasa de las ${x.hh}`, "#DCE6FF", 25)}</div>
    <div class="m" style="font-weight:900;font-size:78px;line-height:1.04;letter-spacing:-.04em;margin-top:16px">Mira cuánto<br>recibe <span style="color:#CFE0FF">tu gente</span></div>
    <div style="font-weight:600;font-size:30px;margin-top:16px;opacity:.9">${c.label}</div>
  </div>
  <div class="abs" style="left:56px;right:56px;top:600px">${tableCard(x, { rowInk: C.azul, numInk: C.vez, border: "rgba(0,28,112,.12)", shadow: "0 24px 60px rgba(0,22,80,.3)" })}</div>
  <div class="abs" style="left:70px;right:70px;top:905px;text-align:center;color:#fff"><div style="font-weight:700;font-size:36px">${unitRate(c, x.cur)}</div><div style="margin-top:12px">${badgeHTML(x.badge, "rgba(255,255,255,.16)", "#fff", "rgba(255,255,255,.7)", "font-size:25px")}</div></div>
  <div class="abs" style="left:70px;right:70px;top:1030px;text-align:center">${cta("ENVIAR EN VEZMONEY.COM", "#fff", C.azul)}</div>
  ${foot(x, "#fff", "rgba(255,255,255,.85)")}`;
}

// ---------- cuadrícula de 6 destinos (jueves y sábado) ----------
const tile = (r, amt, { bg, ink, num, sub, border }) => `<div style="background:${bg};border:3px solid ${border};border-radius:34px;padding:20px 24px 18px;box-shadow:0 12px 30px rgba(0,22,80,.12)"><div style="display:flex;align-items:center;gap:14px">${flag(r.o.toFlag, 54)}<span style="font-weight:800;font-size:31px;color:${ink}">${COUNTRY[r.o.toCode].name}</span></div><div class="m" style="font-weight:900;font-size:41px;color:${num};margin-top:12px;white-space:nowrap">${recv(r.o, r.cur, amt)}</div><div style="font-weight:600;font-size:21px;color:${sub};margin-top:4px">${listRate(r.o, r.cur)}</div></div>`;

// ---------- jueves · Perú → demás países ----------
function f4(x) {
  const plan = FEED_PLAN.f4, o0 = plan.others[0], amt = o0.amounts[plan.amt];
  return `${bgBlanco}
  ${photo(x, "left:0;top:0;width:1080px;height:330px;object-position:" + (x.pos || "50% 40%"))}
  <div class="abs" style="left:0;top:0;width:1080px;height:330px;background:linear-gradient(100deg,rgba(0,28,112,.92) 0%,rgba(0,28,112,.55) 55%,rgba(0,28,112,.15) 100%)"></div>
  ${logoW(60, "left:64px;top:50px")}
  <div class="abs" style="left:64px;top:150px;color:#fff;display:flex;align-items:center;gap:26px">${flag("PE", 120)}<div><div class="m" style="font-weight:800;font-size:28px;letter-spacing:.14em;text-transform:uppercase;color:#BFD0FF">Envías desde</div><div class="m" style="font-weight:900;font-size:86px;letter-spacing:-.04em;line-height:1">Perú</div></div></div>
  ${sticker(`Tasa de las ${x.hh}`, "#fff", C.azul, "right:56px;top:60px;transform:rotate(4deg)", 34)}
  <div class="abs" style="left:56px;right:56px;top:372px;display:flex;align-items:center;justify-content:space-between"><span class="m" style="font-weight:900;font-size:36px;color:${C.azul}">Si envías ${f(amt)} PEN, recibe en:</span><span style="color:${C.cielo}">${arrowSvg(40)}</span></div>
  <div class="abs" style="left:56px;right:56px;top:440px;display:grid;grid-template-columns:1fr 1fr;gap:16px">${x.list.map((r) => tile(r, amt, { bg: "#fff", ink: C.azul, num: C.vez, sub: C.gris, border: "rgba(0,28,112,.1)" })).join("")}</div>
  <div class="abs" style="left:70px;right:70px;top:1128px;text-align:center">${cta("COTIZA EN VEZMONEY.COM", C.azul, "#fff", { size: 30 })}</div>
  ${foot(x, C.azul, C.gris)}`;
}

// ---------- viernes · cotizador sobre azul (minimalista, sin foto) ----------
function f5(x) {
  const c = x.cor;
  return `${bgAzul}${wing("left:-240px;bottom:-120px;width:700px;height:700px", "c")}${wing("right:-260px;top:-220px;width:760px;height:760px")}
  ${logoW(60, "left:64px;top:52px")}
  <div class="abs" style="right:64px;top:62px">${flagsRow(c, 54, "#fff", "#fff")}</div>
  <div class="abs" style="left:64px;right:64px;top:190px;color:#fff"><div class="m" style="font-weight:900;font-size:96px;line-height:1.04;letter-spacing:-.04em">Cotiza y mira<br>lo que <span style="color:#9FBBFF">recibe</span><br>tu contacto</div></div>
  ${quote(x, { bg: "#fff", ink: C.azul, boxBg: C.nube, boxInk: C.azul, numInk: C.vez, arrowBg: C.rosa, rateBg: C.azul, rateInk: "#fff", amt: 2, style: "left:56px;right:56px;top:560px" })}
  ${foot(x, "#fff", "rgba(255,255,255,.85)")}`;
}

// ---------- sábado · Colombia → demás países (lavanda) ----------
function f6(x) {
  const plan = FEED_PLAN.f6, o0 = plan.others[0], amt = o0.amounts[plan.amt];
  return `${bgLav}${orb("right:-200px;top:300px;width:600px;height:600px;background:rgba(255,255,255,.3)")}
  ${photo(x, "left:0;top:0;width:1080px;height:330px;object-position:" + (x.pos || "50% 40%"))}
  <div class="abs" style="left:0;top:0;width:1080px;height:330px;background:linear-gradient(100deg,rgba(0,28,112,.9) 0%,rgba(0,28,112,.5) 55%,rgba(0,28,112,.1) 100%)"></div>
  ${logoW(60, "left:64px;top:50px")}
  <div class="abs" style="left:64px;top:150px;color:#fff;display:flex;align-items:center;gap:26px">${flag("CO", 120)}<div><div class="m" style="font-weight:800;font-size:28px;letter-spacing:.14em;text-transform:uppercase;color:#CFE0FF">Envías desde</div><div class="m" style="font-weight:900;font-size:80px;letter-spacing:-.04em;line-height:1">Colombia</div></div></div>
  ${sticker("¡Buen sábado!", C.turq, C.azul, "right:50px;top:56px;transform:rotate(5deg)", 36)}
  <div class="abs" style="left:56px;right:56px;top:372px;display:flex;align-items:center;justify-content:space-between"><span class="m" style="font-weight:900;font-size:36px;color:${C.azul}">Si envías ${f(amt)} COP, recibe en:</span><span style="color:${C.vez}">${arrowSvg(40)}</span></div>
  <div class="abs" style="left:56px;right:56px;top:440px;display:grid;grid-template-columns:1fr 1fr;gap:16px">${x.list.map((r) => tile(r, amt, { bg: "#fff", ink: C.azul, num: C.vez, sub: C.gris, border: "rgba(255,255,255,.9)" })).join("")}</div>
  <div class="abs" style="left:70px;right:70px;top:1128px;text-align:center">${cta("COTIZA EN VEZMONEY.COM", C.azul, "#fff", { size: 30 })}</div>
  ${foot(x, C.azul, "#3C4A86")}`;
}

const FEEDS = { f1, f2, f3, f4, f5, f6 };
export const buildFeed = (key, x) => `<!doctype html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=1080,height=1350">
<link rel="stylesheet" href="kit.css"></head><body class="feed"><div id="root">${FEEDS[key](x)}</div></body></html>`;

// texto del post (el caption que acompaña la imagen)
export function feedCaption(x, key) {
  const c = x.cor, plan = FEED_PLAN[key];
  const head = `Así está la tasa a las ${x.hh}. 📈`;
  let body;
  if (plan.others) {
    const amt = plan.others[0].amounts[plan.amt], o0 = plan.others[0];
    const lines = x.list.map((r) => `• ${COUNTRY[r.o.toCode].name}: ${f(amt)} ${o0.fromUnit} → ${recv(r.o, r.cur, amt)}`).join("\n");
    const intro = key === "f2" ? `Chile → Venezuela: 1 CLP = ${rateFmt(c, x.cur)} Bs. Con ${money(c, c.amounts[0])}, tu contacto recibe ${conv(x, c.amounts[0])} Bs.\n\nY desde Chile también puedes enviar a otros países (ejemplo con ${f(amt)} CLP):` : `Desde ${COUNTRY[o0.fromCode].name}, esto recibe tu contacto con ${f(amt)} ${o0.fromUnit} (ejemplo con la tasa de este momento):`;
    body = `${intro}\n${lines}`;
  } else {
    body = `${x.badge ? x.badge.replace("▲ ", "") + ".\n\n" : ""}${c.label}: con ${money(c, c.amounts[0])}, tu contacto recibe ${conv(x, c.amounts[0])} ${c.unit} (ejemplo con la tasa de este momento).`;
  }
  return `${head}\n\n${body}\n\nLas tasas se actualizan automáticamente en tiempo real: la verdadera es la que ves en vezmoney.com. Esta es la del momento de publicación (${x.hh}).\n\n${x.note}.\n\nCotiza y envía en vezmoney.com\n\n#VezMoney #Remesas #EnviarDinero #RemesasInternacionales #Migrantes #EnvíoDeDinero #TasaDelDía #Chile #Venezuela #Perú #Colombia`;
}
