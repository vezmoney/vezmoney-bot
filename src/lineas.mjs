// lineas.mjs — 8 LÍNEAS de diseño para las historias de tasa (muestras con la tasa real de hoy). Se eligen 6, una por día de lunes a sábado.
// Uso: node src/lineas.mjs → lineas/L1..L8.jpg (+ hoja de contacto lineas/_hoja.jpg)
// Estas muestras usan fuentes del sistema (Georgia, Consolas, Bahnschrift, Courier New, Segoe Script, Impact); al producir se empaquetan fuentes libres.
import fs from "node:fs";
import { getSeries } from "./data.mjs";
import { C, f, flag, arrowSvg } from "./common.mjs";
import { ico } from "./icons3d.mjs";
import { renderPage, closeBrowser } from "./render.mjs";

const page = (inner, bg = "#fff") => `<!doctype html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=1080,height=1920"><link rel="stylesheet" href="kit.css"></head><body class="story"><div id="root" style="background:${bg}">${inner}</div></body></html>`;
const ph = (file, pos, style) => `<img src="assets/photos/${file}" style="position:absolute;object-fit:cover;object-position:${pos};${style}">`;
const A = (style, inner) => `<div class="abs" style="${style}">${inner}</div>`;
const logo = (v, h, style) => `<img src="assets/logos/${v}.png" style="position:absolute;height:${h}px;${style}">`;
const rateTxt = (x) => f(x.cur, 2, 6);
const conv = (x, n) => f(n * x.cur, 2);
const fecha = "Jueves 5 de noviembre";

// ───────── L1 · EJECUTIVO — "El Boletín": papel, serif, regla fina, números de periódico financiero
function L1(x) {
  return page(`
  ${A("inset:0;background:linear-gradient(180deg,#F8F9FC,#EEF1F8)", "")}
  ${A("left:70px;right:70px;top:90px;border-top:3px solid #001C70;border-bottom:1px solid #001C70;padding:16px 0 14px;display:flex;justify-content:space-between;align-items:center", `<span style="font-family:Georgia;font-weight:700;font-size:26px;letter-spacing:.32em;color:#001C70">BOLETÍN DE CAMBIO</span><span style="font-family:Georgia;font-style:italic;font-size:27px;color:#5D6574">${fecha} · ${x.hh} h</span>`)}
  ${logo("principal_horizontal", 58, "left:70px;top:210px")}
  ${A("right:70px;top:208px;display:flex;align-items:center;gap:12px", `${flag("CL", 56)}<span style="color:#001C70">${arrowSvg(34)}</span>${flag("VE", 56)}`)}
  ${A("left:70px;right:70px;top:330px", `<div style="font-family:Georgia;font-size:40px;font-style:italic;color:#3A4764;line-height:1.2">Un peso chileno vale hoy</div>
    <div style="font-family:Georgia;font-weight:700;font-size:205px;letter-spacing:-.045em;line-height:1;color:#001C70;margin:6px 0 0 -6px">${rateTxt(x)}</div>
    <div style="font-family:Georgia;font-size:62px;color:#03258C;margin-top:-2px">bolívares <span style="color:#F20775">·</span> Bs</div>`)}
  ${A("left:70px;right:70px;top:800px;border-top:1px solid #001C70;border-bottom:3px double #001C70;padding:34px 0;display:grid;grid-template-columns:1fr 1fr 1fr;gap:0", [10000, 50000, 100000].map((m, i) => `<div style="padding:0 26px;${i ? "border-left:1px solid #9AA6C6;" : "padding-left:0;"}"><div style="font-family:Georgia;font-style:italic;font-size:26px;color:#5D6574">Envías</div><div style="font-family:Georgia;font-weight:700;font-size:34px;color:#001C70;margin:2px 0 14px;white-space:nowrap">${f(m)} CLP</div><div style="font-family:Georgia;font-style:italic;font-size:26px;color:#5D6574">Recibe</div><div style="font-family:Georgia;font-weight:700;font-size:34px;color:#03258C;white-space:nowrap">${conv(x, m)}</div></div>`).join(""))}
  ${A("left:70px;top:1130px;width:500px;height:610px;border:1px solid #001C70;padding:12px", `<div style="position:relative;width:100%;height:100%;overflow:hidden">${ph("s29.jpg", "50% 8%", "left:0;top:0;width:100%;height:100%;filter:saturate(.92)")}</div>`)}
  ${A("left:420px;top:1610px", ico.coin(170, { tone: "cielo" }))}
  ${A("left:620px;top:1130px;right:70px", `<div style="font-family:Georgia;font-size:44px;line-height:1.28;color:#001C70;font-style:italic">“Compara antes de enviar. La tasa del momento, sin letra chica.”</div><div style="width:90px;height:3px;background:#F20775;margin:28px 0 24px"></div><div style="font-family:Georgia;font-size:27px;color:#5D6574;line-height:1.4">Tasa de las ${x.hh} h. Se actualiza cada hora en vezmoney.com.</div>`)}
  ${A("left:620px;right:70px;top:1640px;display:flex;align-items:center;gap:14px;font-family:Georgia;font-weight:700;font-size:36px;color:#001C70;border-bottom:3px solid #001C70;padding-bottom:10px;width:fit-content", `Cotiza en vezmoney.com <span style="color:#F20775">${arrowSvg(34)}</span>`)}
  `);
}

// ───────── L2 · BOLSA — terminal de trading con velas reales de 2 h, indicadores y moneda 3D
function L2(x) {
  const r = x.rates.slice(-25), n = 12, W = 900, H = 560, hi = Math.max(...r), lo = Math.min(...r), pad = (hi - lo) * 0.12 || 0.001;
  const Y = (v) => H - ((v - (lo - pad)) / (hi - lo + 2 * pad)) * H;
  const candles = Array.from({ length: n }, (_, k) => { const s = r.slice(k * 2, k * 2 + 3), o = s[0], c = s[s.length - 1]; return { o, c, h: Math.max(...s), l: Math.min(...s) }; });
  const bw = W / n, svg = candles.map((c, i) => { const up = c.c >= c.o, col = up ? "#22C7C9" : "#F20775", cx = i * bw + bw / 2, top = Y(Math.max(c.o, c.c)), bot = Y(Math.min(c.o, c.c)); return `<line x1="${cx}" x2="${cx}" y1="${Y(c.h)}" y2="${Y(c.l)}" stroke="${col}" stroke-width="3"/><rect x="${cx - 17}" y="${top}" width="34" height="${Math.max(6, bot - top)}" rx="3" fill="${col}"/>`; }).join("");
  const grid = [0, 1, 2, 3, 4].map((i) => `<line x1="0" x2="${W}" y1="${(H / 4) * i}" y2="${(H / 4) * i}" stroke="#fff" stroke-opacity=".08"/><text x="${W + 8}" y="${(H / 4) * i + 6}" font-family="Consolas" font-size="22" fill="#7C8DBA">${f(hi + pad - ((hi - lo + 2 * pad) / 4) * i, 4)}</text>`).join("");
  const chg = ((x.cur - r[0]) / r[0]) * 100, up = chg >= 0;
  return page(`
  ${A("inset:0;background:radial-gradient(900px 700px at 80% 12%,#0B2A8C 0%,#031044 55%,#020A2C 100%)", "")}
  ${A("left:0;right:0;top:0;height:70px;background:rgba(255,255,255,.06);border-bottom:1px solid rgba(255,255,255,.12);display:flex;align-items:center;gap:60px;padding-left:40px;font-family:Consolas;font-size:26px;color:#9FB4E8;white-space:nowrap;overflow:hidden", `<span>CLP/VES <b style="color:#fff">${rateTxt(x)}</b></span><span style="color:${up ? "#22C7C9" : "#F20775"}">${up ? "▲" : "▼"} ${f(Math.abs(chg), 2)}%</span><span>MÁX ${f(x.mx, 4)}</span><span>MÍN ${f(x.mn, 4)}</span>`)}
  ${logo("reversa_horizontal", 58, "left:60px;top:130px")}
  ${A("right:60px;top:122px", ico.coin(190, { tone: "cielo", sym: "Bs" }))}
  ${A("left:60px;top:260px", `<div style="font-family:Consolas;font-size:32px;color:#7C8DBA;letter-spacing:.14em">PESO CHILENO  /  BOLÍVAR · 1H · ${x.hh}</div>
    <div style="font-family:Consolas;font-weight:700;font-size:210px;letter-spacing:-.05em;line-height:1.05;color:#fff;margin-top:4px">${rateTxt(x)}</div>
    <div style="display:inline-flex;align-items:center;gap:14px;margin-top:6px;background:${up ? "rgba(34,199,201,.18)" : "rgba(242,7,117,.18)"};border:2px solid ${up ? "#22C7C9" : "#F20775"};border-radius:14px;padding:10px 22px;font-family:Consolas;font-size:36px;color:${up ? "#22C7C9" : "#F20775"}">${up ? "▲" : "▼"} ${f(Math.abs(chg), 2)} % en 24 h</div>`)}
  ${A("left:60px;top:790px;width:1000px;height:620px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);border-radius:22px", `<svg width="1000" height="620" viewBox="-20 20 1000 620" style="overflow:visible"><g transform="translate(0 20)">${grid}${svg}</g></svg>`)}
  ${A("left:60px;right:60px;top:1450px;display:grid;grid-template-columns:repeat(4,1fr);gap:14px;font-family:Consolas", [["MÁX 24H", f(x.mx, 4)], ["MÍN 24H", f(x.mn, 4)], ["PROM", f(x.avg, 4)], ["AHORA", f(x.cur, 4)]].map(([k, v], i) => `<div style="background:${i === 3 ? "#fff" : "rgba(255,255,255,.07)"};border:1px solid rgba(255,255,255,.15);border-radius:16px;padding:16px 18px"><div style="font-size:21px;color:${i === 3 ? "#5D6574" : "#7C8DBA"}">${k}</div><div style="font-size:36px;font-weight:700;color:${i === 3 ? "#001C70" : "#fff"};margin-top:4px">${v}</div></div>`).join(""))}
  ${A("left:60px;top:1640px;display:flex;align-items:center;gap:26px", `<div style="display:flex;align-items:center;gap:18px;background:#fff;color:#001C70;font-family:Inter;font-weight:800;font-size:36px;padding:18px 24px 18px 40px;border-radius:999px">COTIZA EN VEZMONEY.COM<span style="width:56px;height:56px;border-radius:50%;background:#F20775;color:#fff;display:inline-flex;align-items:center;justify-content:center">${arrowSvg(30)}</span></div>`)}
  ${A("right:50px;top:1560px", ico.bars(230, { tone: "cielo" }))}
  `, "#020A2C");
}

// ───────── L3 · MENÚ LATINO — carta de restaurante con puntos guía, plato de arepa y sello de "tasa del día"
function L3(x) {
  const row = (name, sub, m) => `<div style="margin-bottom:46px"><div style="display:flex;align-items:baseline;gap:14px;font-family:Georgia"><span style="font-size:46px;font-weight:700;color:#0A2A9A;white-space:nowrap">${name}</span><span style="flex:1;border-bottom:4px dotted #0A2A9A;opacity:.45;transform:translateY(-8px)"></span><span style="font-size:48px;font-weight:700;color:#0A2A9A;white-space:nowrap">${conv(x, m)} Bs</span></div><div style="font-family:Georgia;font-style:italic;font-size:29px;color:#6B5B49;margin-top:4px">${sub} · ${f(m)} pesos chilenos</div></div>`;
  return page(`
  ${A("inset:0;background:#FBF4E6", "")}
  ${A("inset:34px;border:3px solid #0A2A9A;border-radius:6px", "")}${A("inset:48px;border:1px solid #0A2A9A;opacity:.6", "")}
  ${A("left:0;right:0;top:100px;text-align:center", `<div style="font-family:Georgia;font-size:28px;letter-spacing:.5em;color:#0A2A9A">· VEZMONEY ·</div><div style="font-family:Georgia;font-style:italic;font-weight:700;font-size:130px;line-height:1;color:#0A2A9A;margin-top:18px">La Carta</div><div style="font-family:Georgia;font-size:46px;letter-spacing:.18em;color:#6B5B49;margin-top:6px">DE LA TASA DEL DÍA</div>`)}
  ${A("left:90px;top:480px;width:340px;height:340px;border-radius:50%;border:10px solid #fff;box-shadow:0 20px 50px rgba(60,40,10,.3);overflow:hidden", ph("ln_arepa.jpg", "50% 55%", "left:0;top:0;width:100%;height:100%;transform:scale(1.15)"))}
  ${A("left:350px;top:470px", ico.coin(190, { tone: "oro" }))}
  ${A("left:500px;top:500px;width:490px;height:300px;display:flex;flex-direction:column;justify-content:center", `<div style="font-family:Georgia;font-size:34px;letter-spacing:.2em;color:#6B5B49">CHILE → VENEZUELA</div><div style="font-family:Georgia;font-weight:700;font-size:92px;color:#0A2A9A;letter-spacing:-.03em;line-height:1.1;white-space:nowrap">${rateTxt(x)}</div><div style="font-family:Georgia;font-style:italic;font-size:34px;color:#6B5B49">bolívares por cada peso</div>`)}
  ${A("left:120px;right:120px;top:930px;text-align:center;color:#0A2A9A;font-family:Georgia;font-size:34px;letter-spacing:1em", "✦ ✦ ✦")}
  ${A("left:120px;right:120px;top:1020px", row("El Antojito", "Para empezar", 10000) + row("El Plato Fuerte", "Para la quincena", 50000) + row("El Gran Banquete", "Para celebrar", 100000))}
  ${A("left:120px;right:120px;top:1590px;text-align:center", `<div style="display:inline-flex;align-items:center;gap:18px;background:#0A2A9A;color:#fff;font-family:Georgia;font-weight:700;font-size:38px;padding:20px 34px 20px 46px;border-radius:999px">Ordena en vezmoney.com<span style="width:54px;height:54px;border-radius:50%;background:#F20775;display:inline-flex;align-items:center;justify-content:center">${arrowSvg(30)}</span></div>`)}
  ${A("right:60px;top:790px;transform:rotate(14deg);width:190px;height:190px;border-radius:50%;border:5px double #F20775;color:#F20775;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:Georgia;font-weight:700;background:rgba(251,244,230,.6)", `<div style="font-size:24px;letter-spacing:.2em">TASA</div><div style="font-size:50px;line-height:1">${x.hh}</div><div style="font-size:24px;letter-spacing:.2em">AL DÍA</div>`)}
  ${A("left:80px;top:1740px;right:80px;text-align:center;font-family:Georgia;font-style:italic;font-size:26px;color:#6B5B49", "Menú ilustrativo · la tasa se actualiza cada hora en vezmoney.com")}
  `, "#FBF4E6");
}

// ───────── L4 · REACCIÓN — persona sorprendida, globo de cómic y monedas volando
function L4(x) {
  return page(`
  ${A("inset:0;background:linear-gradient(180deg,#5B8CFF 0%,#2A56E8 55%,#03258C 100%)", "")}
  ${A("left:-120px;top:240px;width:760px;height:760px;border-radius:50%;background:#A3C0FF;opacity:.55", "")}
  ${A("right:-160px;top:120px;width:560px;height:560px;border-radius:50%;background:#fff;opacity:.16", "")}
  ${logo("reversa_horizontal", 58, "left:60px;top:70px")}
  ${ph("s02.jpg", "50% 30%", "left:90px;top:150px;width:900px;height:1100px;border-radius:44px;box-shadow:0 40px 90px rgba(0,16,80,.45);border:12px solid #fff")}
  ${A("right:20px;top:160px;transform:rotate(7deg)", `<svg width="470" height="300" viewBox="0 0 470 300" style="overflow:visible;filter:drop-shadow(0 16px 20px rgba(0,16,80,.35))"><path d="M30 40Q30 6 70 6H400Q440 6 440 46V190Q440 226 400 226H210L120 288L146 226H70Q30 226 30 190Z" fill="#fff"/><text x="235" y="96" text-anchor="middle" font-family="Impact,Inter" font-size="66" fill="#001C70">¿VISTE LA</text><text x="235" y="182" text-anchor="middle" font-family="Impact,Inter" font-size="70" fill="#F20775">TASA DE HOY?</text></svg>`)}
  ${A("left:30px;top:1000px", ico.coin(230, { tone: "oro", rotate: -12 }))}
  ${A("right:30px;top:700px", ico.coin(170, { tone: "cielo", sym: "Bs", rotate: 14 }))}
  ${A("left:420px;top:1130px", ico.spark(120, { tone: "blanco" }))}
  ${A("left:60px;right:60px;top:1290px;background:#fff;border-radius:44px;padding:34px 48px 40px;box-shadow:0 30px 70px rgba(0,16,80,.4);transform:rotate(-1.5deg)", `<div style="display:flex;align-items:center;gap:16px">${flag("CL", 64)}<span style="color:#03258C">${arrowSvg(38)}</span>${flag("VE", 64)}<span style="margin-left:auto;font-weight:800;font-size:28px;color:#5D6574">Tasa de las ${x.hh}</span></div><div style="font-weight:900;font-size:146px;letter-spacing:-.06em;line-height:1.02;color:#001C70;margin-top:10px;white-space:nowrap">${rateTxt(x)} <span style="font-size:60px;color:#03258C;letter-spacing:-.02em">Bs</span></div><div style="font-weight:600;font-size:38px;color:#3A4764">Por cada peso chileno que envías</div>`)}
  ${A("left:60px;top:1760px", `<div style="display:inline-flex;align-items:center;gap:18px;background:#001C70;color:#fff;font-weight:800;font-size:34px;padding:16px 22px 16px 38px;border-radius:999px">COTIZA EN VEZMONEY.COM<span style="width:52px;height:52px;border-radius:50%;background:#F20775;display:inline-flex;align-items:center;justify-content:center">${arrowSvg(28)}</span></div>`)}
  `, "#03258C");
}

// ───────── L5 · PIZARRA DE AEROPUERTO — fichas que giran, filas de "salida" y avión 3D
function L5(x) {
  const tiles = (txt, w = 56, size = 60, col = "#fff") => [...txt].map((ch) => `<span style="display:inline-block;width:${w}px;height:${Math.round(w * 1.46)}px;margin-right:6px;background:linear-gradient(#1A2147 0 49%,#0F1533 51% 100%);border-radius:7px;text-align:center;line-height:${Math.round(w * 1.46)}px;font-family:Bahnschrift,Consolas;font-weight:700;font-size:${size}px;color:${col};box-shadow:inset 0 -2px 0 rgba(255,255,255,.07)">${ch === " " ? "&nbsp;" : ch}</span>`).join("");
  const row = (dest, code, env, rec, st, col) => `<div style="background:#0A1030;border-radius:18px;padding:22px 24px;margin-bottom:18px;border:1px solid rgba(255,255,255,.1)"><div style="display:flex;align-items:center;gap:14px;margin-bottom:12px">${flag("VE", 46)}<span style="font-family:Bahnschrift;font-size:26px;letter-spacing:.2em;color:#8FA3D8">${dest}</span><span style="margin-left:auto;font-family:Bahnschrift;font-size:26px;color:${col};letter-spacing:.14em">● ${st}</span></div><div style="display:flex;justify-content:space-between;align-items:center"><div>${tiles(env, 40, 44)}</div><span style="color:#5B8CFF">${arrowSvg(40)}</span><div>${tiles(rec, 40, 44, "#9FC0FF")}</div></div></div>`;
  return page(`
  ${A("inset:0;background:linear-gradient(180deg,#0B1237,#050A22)", "")}
  ${A("left:0;right:0;top:0;height:14px;background:repeating-linear-gradient(90deg,#fff 0 40px,#F20775 40px 80px)", "")}
  ${logo("reversa_horizontal", 56, "left:60px;top:70px")}
  ${A("right:50px;top:30px", ico.plane(300, { tone: "cielo", rotate: -4 }))}
  ${A("left:60px;top:260px", `<div style="font-family:Bahnschrift;font-size:34px;letter-spacing:.34em;color:#8FA3D8">SALIDAS · DEPARTURES</div><div style="font-family:Bahnschrift;font-weight:700;font-size:96px;line-height:1.02;color:#fff;margin-top:12px">SANTIAGO<br><span style="color:#5B8CFF">→ CARACAS</span></div>`)}
  ${A("left:60px;right:60px;top:690px;background:#0E1740;border-radius:26px;padding:30px;border:1px solid rgba(255,255,255,.14)", `<div style="font-family:Bahnschrift;font-size:26px;letter-spacing:.3em;color:#8FA3D8;margin-bottom:14px">TASA DEL VUELO · ${x.hh}</div><div>${tiles(rateTxt(x), 94, 118)}</div>`)}
  ${A("left:60px;right:60px;top:1010px", row("VUELO CLP 01", "", f(10000), conv(x, 10000), "ABORDANDO", "#22C7C9") + row("VUELO CLP 02", "", f(50000), conv(x, 50000), "PUERTA 2", "#FFD866") + row("VUELO CLP 03", "", f(100000), conv(x, 100000), "A TIEMPO", "#22C7C9"))}
  ${ph("s17.jpg", "50% 14%", "left:60px;top:1620px;width:150px;height:150px;border-radius:50%;border:6px solid #fff")}
  ${A("left:240px;top:1640px", `<div style="font-family:Bahnschrift;font-size:28px;color:#8FA3D8">¿VIAJAS CON LOS TUYOS?</div><div style="display:inline-flex;align-items:center;gap:16px;margin-top:10px;background:#fff;color:#001C70;font-weight:800;font-size:32px;padding:14px 20px 14px 34px;border-radius:999px">COTIZA EN VEZMONEY.COM<span style="width:50px;height:50px;border-radius:50%;background:#F20775;color:#fff;display:inline-flex;align-items:center;justify-content:center">${arrowSvg(26)}</span></div>`)}
  `, "#050A22");
}

// ───────── L6 · POSTAL — postal, sello, matasellos, polaroid y cinta
function L6(x) {
  const stampEdge = `radial-gradient(circle at 10px 10px, transparent 7px, #fff 7.5px)`;
  return page(`
  ${A("inset:0;background:linear-gradient(160deg,#DCE8FF 0%,#B7CDFF 60%,#9DB8F8 100%)", "")}
  ${A("inset:0;opacity:.35;background-image:radial-gradient(circle,#fff 1.3px,transparent 1.5px);background-size:34px 34px", "")}
  ${logo("principal_horizontal", 56, "left:60px;top:60px")}
  ${A("left:70px;top:190px;width:940px;height:830px;background:#fff;padding:22px;transform:rotate(-2.4deg);box-shadow:0 40px 80px rgba(0,28,112,.35)", `<div style="position:relative;width:100%;height:100%;overflow:hidden">${ph("av_tepui.jpg", "50% 55%", "left:0;top:0;width:100%;height:100%")}<div class="abs" style="left:0;right:0;bottom:0;height:260px;background:linear-gradient(transparent,rgba(0,16,80,.7))"></div><div style="position:absolute;left:34px;bottom:26px;font-family:'Segoe Script','Brush Script MT',cursive;font-size:76px;color:#fff;transform:rotate(-3deg);text-shadow:0 4px 14px rgba(0,0,0,.4)">¡Saludos desde Venezuela!</div></div>`)}
  ${A("left:150px;top:150px;width:210px;height:56px;background:rgba(255,216,102,.85);transform:rotate(-6deg)", "")}
  ${A("right:60px;top:120px;transform:rotate(7deg);width:230px;height:290px;background:#fff;padding:14px;box-shadow:0 14px 30px rgba(0,28,112,.3);filter:drop-shadow(0 0 0 #fff)", `<div style="width:100%;height:100%;border:3px dashed #03258C;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;background:#EAF1FF">${flag("VE", 96)}<div style="font-family:Georgia;font-weight:700;font-size:44px;color:#001C70">${f(x.cur, 2)}</div><div style="font-family:Georgia;font-size:22px;letter-spacing:.2em;color:#03258C">BS · 1 CLP</div></div>`)}
  ${A("right:130px;top:330px;transform:rotate(-14deg)", `<svg width="320" height="170" viewBox="0 0 320 170"><g fill="none" stroke="#001C70" stroke-width="5" opacity=".55"><circle cx="80" cy="85" r="64"/><circle cx="80" cy="85" r="50" stroke-width="2.5"/><path d="M150 40Q190 10 230 40T310 40M150 80Q190 50 230 80T310 80M150 120Q190 90 230 120T310 120"/></g><text x="80" y="78" text-anchor="middle" font-family="Georgia" font-weight="700" font-size="20" fill="#001C70" opacity=".55">SANTIAGO</text><text x="80" y="102" text-anchor="middle" font-family="Georgia" font-weight="700" font-size="20" fill="#001C70" opacity=".55">5 NOV</text></svg>`)}
  ${A("left:70px;top:1090px;width:640px", `<div style="font-family:'Segoe Script','Brush Script MT',cursive;font-size:46px;color:#001C70;line-height:1.35">Hoy un peso chileno vale</div><div style="font-weight:900;font-size:132px;letter-spacing:-.06em;line-height:1.05;color:#001C70;margin:2px 0 0 -4px;white-space:nowrap">${rateTxt(x)}</div><div style="font-family:Georgia;font-style:italic;font-size:46px;color:#03258C">bolívares · tasa de las ${x.hh}</div>`)}
  ${A("right:60px;top:1120px;transform:rotate(-5deg);width:290px;background:#fff;padding:16px 16px 52px;box-shadow:0 18px 40px rgba(0,28,112,.3)", ph("s20.jpg", "55% 20%", "position:relative;display:block;width:100%;height:330px") + `<div style="position:absolute;left:0;right:0;bottom:12px;text-align:center;font-family:'Segoe Script',cursive;font-size:30px;color:#001C70">para los míos 💙</div>`)}
  ${A("left:50px;top:1450px", ico.ticket(250, { tone: "oro", text: "CLP→BS", rotate: -10 }))}
  ${A("left:70px;right:70px;top:1640px", `<div style="display:flex;gap:14px;margin-bottom:22px">${[10000, 50000, 100000].map((m) => `<div style="flex:1;background:#fff;border-radius:22px;padding:16px 18px;box-shadow:0 10px 24px rgba(0,28,112,.2)"><div style="font-weight:600;font-size:23px;color:#5D6574">${f(m)} CLP</div><div style="font-weight:900;font-size:36px;color:#001C70">${conv(x, m)} Bs</div></div>`).join("")}</div><div style="display:inline-flex;align-items:center;gap:16px;background:#001C70;color:#fff;font-weight:800;font-size:32px;padding:14px 20px 14px 34px;border-radius:999px">COTIZA EN VEZMONEY.COM<span style="width:50px;height:50px;border-radius:50%;background:#F20775;display:inline-flex;align-items:center;justify-content:center">${arrowSvg(26)}</span></div>`)}
  `, "#B7CDFF");
}

// ───────── L7 · RECIBO — ticket térmico sobre fondo azul, con código de barras y fotos pegadas
function L7(x) {
  const bars = Array.from({ length: 46 }, (_, i) => `<rect x="${i * 9}" y="0" width="${[3, 6, 4, 7][i % 4]}" height="110"/>`).join("");
  const line = (a, b, big) => `<div style="display:flex;justify-content:space-between;font-size:${big ? 46 : 33}px;${big ? "font-weight:700;" : ""}margin:8px 0"><span>${a}</span><span>${b}</span></div>`;
  return page(`
  ${A("inset:0;background:linear-gradient(180deg,#0A2A9A,#001450)", "")}
  ${A("inset:0;opacity:.12;background-image:linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px);background-size:60px 60px", "")}
  ${logo("reversa_horizontal", 56, "left:60px;top:60px")}
  ${A("left:120px;top:190px;width:840px;background:#FBFBF7;color:#14183A;font-family:'Courier New',monospace;padding:60px 56px 70px;transform:rotate(1.2deg);box-shadow:0 40px 80px rgba(0,0,0,.45);-webkit-mask:conic-gradient(from -45deg at bottom,#0000,#000 1deg 89deg,#0000 90deg) 50%/28px 100%;mask:conic-gradient(from -45deg at bottom,#0000,#000 1deg 89deg,#0000 90deg) 50%/28px 100%", `<div style="text-align:center;font-weight:700;font-size:50px;letter-spacing:.08em">VEZMONEY</div><div style="text-align:center;font-size:27px;margin-top:6px">ENVÍOS · CHILE ⇄ LATAM</div><div style="border-top:3px dashed #14183A;margin:26px 0"></div>
    <div style="font-size:28px">FECHA ... 05/11/2026 ${x.hh}</div><div style="font-size:28px;margin-bottom:8px">RUTA .... CLP → VES</div>
    <div style="border-top:3px dashed #14183A;margin:22px 0"></div>
    ${line("TASA", rateTxt(x), true)}${line("1 CLP", "= " + rateTxt(x) + " Bs")}
    <div style="border-top:3px dashed #14183A;margin:22px 0"></div>
    ${line("10.000 CLP", conv(x, 10000) + " Bs")}${line("50.000 CLP", conv(x, 50000) + " Bs")}${line("100.000 CLP", conv(x, 100000) + " Bs")}
    <div style="border-top:3px dashed #14183A;margin:22px 0"></div>
    <div style="text-align:center;font-weight:700;font-size:36px">GRACIAS POR ENVIAR<br>A LOS TUYOS</div>
    <svg viewBox="0 0 414 110" style="display:block;width:100%;margin-top:26px" fill="#14183A">${bars}</svg><div style="text-align:center;font-size:23px;letter-spacing:.3em;margin-top:8px">VEZMONEY.COM</div>`)}
  ${ph("s13.jpg", "55% 18%", "left:60px;top:1420px;width:300px;height:360px;border:12px solid #fff;border-bottom-width:50px;box-shadow:0 20px 40px rgba(0,0,0,.4);transform:rotate(-7deg)")}
  ${A("right:50px;top:1250px", ico.coin(250, { tone: "oro", rotate: 10 }))}
  ${A("right:210px;top:1510px", ico.bill(280, { tone: "cielo", rotate: -14 }))}
  ${A("right:70px;top:1700px;transform:rotate(-3deg)", `<div style="display:inline-flex;align-items:center;gap:16px;background:#fff;color:#001C70;font-weight:800;font-size:32px;padding:14px 20px 14px 34px;border-radius:999px">COTIZA EN VEZMONEY.COM<span style="width:50px;height:50px;border-radius:50%;background:#F20775;color:#fff;display:inline-flex;align-items:center;justify-content:center">${arrowSvg(26)}</span></div>`)}
  `, "#001450");
}

// ───────── L8 · COLLAGE DE REVISTA — recortes, cinta, trama de puntos, número gigante y stickers 3D
function L8(x) {
  return page(`
  ${A("inset:0;background:#EEF1FA", "")}
  ${A("inset:0;opacity:.5;background-image:radial-gradient(circle,#5B8CFF 2.5px,transparent 3px);background-size:26px 26px;-webkit-mask:linear-gradient(160deg,#000 0%,transparent 55%);mask:linear-gradient(160deg,#000 0%,transparent 55%)", "")}
  ${A("left:-40px;top:140px;width:1160px;height:700px;background:#001C70;transform:rotate(-4deg)", "")}
  ${A("left:60px;top:90px;background:#fff;padding:12px 26px;transform:rotate(-3deg);box-shadow:0 8px 20px rgba(0,28,112,.3)", `<img src="assets/logos/principal_horizontal.png" style="height:48px;display:block">`)}
  ${ph("s27.jpg", "60% 12%", "left:470px;top:150px;width:560px;height:780px;clip-path:polygon(8% 0,100% 4%,96% 100%,0 94%);filter:contrast(1.04)")}
  ${A("left:440px;top:120px;width:200px;height:50px;background:rgba(255,216,102,.9);transform:rotate(-8deg)", "")}
  ${A("left:50px;top:300px;width:520px", `<div style="font-family:Impact,Inter;font-size:112px;line-height:.95;color:#fff;letter-spacing:.01em;text-transform:uppercase">La tasa<br>de <span style="color:#5B8CFF">hoy</span><br>llegó</div>`)}
  ${A("left:50px;top:750px;width:640px;background:#fff;padding:26px 34px 30px;transform:rotate(-2deg);box-shadow:0 20px 44px rgba(0,28,112,.4)", `<div style="font-family:Georgia;font-style:italic;font-size:34px;color:#5D6574">1 peso chileno =</div><div style="font-family:Impact,Inter;font-size:128px;line-height:1.05;color:#001C70;white-space:nowrap">${rateTxt(x)}</div><div style="font-weight:800;font-size:44px;color:#F20775;margin-top:-6px">BOLÍVARES · ${x.hh} h</div>`)}
  ${A("left:30px;top:1000px", ico.coin(210, { tone: "oro", rotate: -10 }))}
  ${A("left:610px;top:790px", ico.spark(130, { tone: "blanco" }))}
  ${A("right:30px;top:820px", ico.bill(250, { tone: "cielo", rotate: 12 }))}
  ${A("left:70px;right:70px;top:1170px;display:grid;grid-template-columns:repeat(3,1fr);gap:18px", [10000, 50000, 100000].map((m, i) => `<div style="background:${["#fff", "#5B8CFF", "#001C70"][i]};color:${["#001C70", "#fff", "#fff"][i]};padding:22px 20px;transform:rotate(${[-2, 1.5, -1][i]}deg);box-shadow:0 14px 30px rgba(0,28,112,.25)"><div style="font-weight:700;font-size:25px;opacity:.85">${f(m)} CLP</div><div style="font-family:Impact,Inter;font-size:50px;line-height:1.1">${conv(x, m)}</div><div style="font-weight:800;font-size:24px;letter-spacing:.12em">BS</div></div>`).join(""))}
  ${ph("s14.jpg", "45% 5%", "left:60px;top:1420px;width:420px;height:330px;clip-path:polygon(0 6%,96% 0,100% 94%,4% 100%)")}
  ${A("left:520px;top:1440px;width:500px", `<div style="font-family:'Segoe Script','Brush Script MT',cursive;font-size:56px;color:#001C70;line-height:1.2;transform:rotate(-3deg)">¡Compara antes<br>de enviar!</div><svg width="360" height="40" viewBox="0 0 360 40" style="display:block;margin-top:6px"><path d="M6 24Q60 4 120 22T240 20T354 18" fill="none" stroke="#F20775" stroke-width="8" stroke-linecap="round"/></svg>`)}
  ${A("left:500px;top:1650px", `<div style="white-space:nowrap;display:inline-flex;align-items:center;gap:16px;background:#001C70;color:#fff;font-weight:800;font-size:30px;padding:14px 18px 14px 30px;border-radius:999px;white-space:nowrap">COTIZA EN VEZMONEY.COM<span style="width:48px;height:48px;border-radius:50%;background:#F20775;display:inline-flex;align-items:center;justify-content:center">${arrowSvg(26)}</span></div>`)}
  `, "#EEF1FA");
}

const LINEAS = { L1, L2, L3, L4, L5, L6, L7, L8 };
const NOMBRES = { L1: "Ejecutivo · El Boletín", L2: "Bolsa de valores", L3: "Menú latino", L4: "Reacción", L5: "Pizarra de aeropuerto", L6: "Postal", L7: "Recibo", L8: "Collage de revista" };
fs.mkdirSync("lineas", { recursive: true });
const d = await getSeries("CLP", "BS");
const x = { ...d, avg: d.avg };
for (const [k, fn] of Object.entries(LINEAS)) {
  await renderPage(fn(x), { width: 1080, height: 1920, out: `lineas/${k}.jpg` });
  console.log("ok", k, NOMBRES[k]);
}
await closeBrowser();
