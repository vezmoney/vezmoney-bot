// avisos.mjs — piezas especiales de VezMoney: feriados (Chile y otros países) y avisos de horario de fin de año.
// Misma lógica que Giros del Sur, con el sistema visual de VezMoney (azules y blanco; rosa solo como acento).
// Uso: node src/avisos.mjs → content/feriados/, content/feriados-paises/, content/cierres/ (se programan en Metricool con la URL raw de GitHub)
// Horario VezMoney: L–V 08:30–20:00 · sábado 08:30–16:00 · domingo cerrado.
import { C, flag, arrowSvg, mark, orb, wing, bgAzul, bgBlanco, bgCielo, cta, hl, frame, kicker } from "./common.mjs";
import { renderPage, closeBrowser } from "./render.mjs";

const TAGS = "#VezMoney #Remesas #EnviarDinero #RemesasInternacionales #Migrantes #EnvíoDeDinero #Chile #Venezuela";
const PAIS = { PE: "Perú", CO: "Colombia", VE: "Venezuela", CL: "Chile" };

const TEMAS = {
  azul: { bg: `${bgAzul}${wing("right:-260px;top:-200px;width:820px;height:820px")}${wing("left:-300px;bottom:180px;width:760px;height:760px", "c")}`, ink: "#fff", acc: "#9FBBFF", tag: ["#fff", C.azul], pill: ["#fff", C.azul], cta: ["#fff", C.azul], tone: "dark", card: "#fff", cardInk: C.azul, icon: ["#fff", C.vez] },
  blanco: { bg: bgBlanco, ink: C.azul, acc: C.vez, tag: [C.azul, "#fff"], pill: [C.azul, "#fff"], cta: [C.azul, "#fff"], tone: "light", card: C.nube, cardInk: C.azul, icon: [C.azul, "#fff"] },
  cielo: { bg: `${bgCielo}${orb("right:-260px;top:-220px;width:760px;height:760px;background:rgba(255,255,255,.14)")}${orb("left:-300px;bottom:260px;width:760px;height:760px;background:rgba(255,255,255,.1)")}`, ink: "#fff", acc: "#DCE6FF", tag: [C.azul, "#fff"], pill: ["#fff", C.azul], cta: ["#fff", C.azul], tone: "dark", card: "#fff", cardInk: C.azul, icon: ["#fff", C.vez] },
};

const ICONOS = {
  calendario: `<rect x="14" y="22" width="72" height="64" rx="14" fill="none" stroke="currentColor" stroke-width="6"/><path d="M14 44h72M32 12v18M68 12v18" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><path d="M34 66l11 11 22-24" fill="none" stroke="${C.rosa}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`,
  reloj: `<circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" stroke-width="6"/><path d="M50 26v26l18 11" fill="none" stroke="${C.rosa}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`,
  corazon: `<path d="M50 84C20 62 14 44 14 33a20 20 0 0 1 36-12 20 20 0 0 1 36 12c0 11-6 29-36 51z" fill="none" stroke="currentColor" stroke-width="6" stroke-linejoin="round"/><circle cx="72" cy="30" r="6" fill="${C.rosa}"/>`,
  check: `<circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" stroke-width="6"/><path d="M32 52l13 13 25-28" fill="none" stroke="${C.rosa}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`,
};
const icono = (kind, T, style, size = 230) => `<div class="abs" style="${style};width:${size}px;height:${size}px;border-radius:${Math.round(size * 0.3)}px;background:${T.icon[0]};color:${T.icon[1]};display:flex;align-items:center;justify-content:center;box-shadow:0 20px 48px rgba(0,22,80,.3);transform:rotate(6deg)"><svg viewBox="0 0 100 100" width="${Math.round(size * 0.58)}" height="${Math.round(size * 0.58)}">${ICONOS[kind] ?? ICONOS.calendario}</svg></div>`;

const page = (w, h, cls, inner) => `<!doctype html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=${w},height=${h}"><link rel="stylesheet" href="kit.css"></head><body class="${cls}"><div id="root">${inner}</div></body></html>`;
const foot = (ink) => `<div class="m abs" style="left:80px;right:80px;bottom:60px;display:flex;justify-content:space-between;font-weight:700;font-size:26px;color:${ink}"><span>@vezmoneyoficial</span><span>vezmoney.com</span></div>`;
const pill = (t, bg, color) => `<span class="m" style="display:inline-block;background:${bg};color:${color};font-weight:800;font-size:40px;padding:22px 40px;border-radius:999px;box-shadow:0 14px 34px rgba(0,22,80,.28)">${t}</span>`;
const tambienHTML = (p, color, size = 34) => p.tambien?.length
  ? `<div style="display:flex;align-items:center;flex-wrap:wrap;gap:8px 22px;font-weight:600;font-size:${size}px;color:${color}"><span>También feriado en</span>${p.tambien.map((c) => `<span style="display:inline-flex;align-items:center;gap:10px">${flag(c, Math.round(size * 1.35))}<b class="m" style="font-weight:800">${PAIS[c]}</b></span>`).join("")}</div>`
  : "";

// Historia de aviso (feriados, cierres, otros países)
export function story(p) {
  const T = TEMAS[p.tema];
  const flagTag = p.code ? flag(p.code, 96) : "";
  return page(1080, 1920, "story", `${T.bg}
  ${mark("full", T.tone, "left:50%;top:84px;transform:translateX(-50%)", 66)}
  <div class="abs" style="left:80px;right:80px;top:330px">
    <div style="display:flex;align-items:center;gap:22px">${flagTag}<span class="m" style="display:inline-block;background:${T.tag[0]};color:${T.tag[1]};font-weight:800;font-size:34px;letter-spacing:.1em;padding:14px 32px;border-radius:999px">${p.pill}</span></div>
    <div class="m" style="font-weight:700;font-size:40px;color:${T.acc};margin-top:34px">${p.fecha}</div>
    <div class="m" style="font-weight:900;font-size:${p.size ?? 108}px;line-height:1.05;letter-spacing:-.03em;color:${T.ink};margin-top:26px">${hl(p.titulo, T.acc)}</div>
  </div>
  <div class="abs" style="left:80px;right:80px;top:${p.textoTop ?? 880}px;font-weight:500;font-size:44px;line-height:1.34;color:${T.ink}">${p.texto}</div>
  ${p.destacado ? `<div class="abs" style="left:80px;right:300px;top:1130px;font-weight:600;font-size:56px;line-height:1.2;color:${T.ink}">${hl(p.destacado, T.acc)}</div>` : ""}
  <div class="abs" style="left:80px;top:${p.destacado ? 1330 : 1300}px">${pill(p.pildora, T.pill[0], T.pill[1])}</div>
  ${icono(p.icono ?? "calendario", T, `right:60px;top:${p.destacado ? 1110 : 1260}px`)}
  ${p.tambien?.length ? `<div class="abs" style="left:80px;right:80px;top:1500px">${tambienHTML(p, T.ink)}</div>` : ""}
  <div class="abs" style="left:80px;bottom:260px">${cta(p.cta ?? "COTIZA EN VEZMONEY.COM", T.cta[0], T.cta[1])}</div>
  ${foot(T.tone === "dark" ? "rgba(255,255,255,.88)" : C.gris)}`);
}

// Post de feed: foto temática en arco + tarjeta con el aviso
export function feed(p) {
  const x = { photo: p.photo + ".jpg", pos: p.pos };
  return page(1080, 1350, "feed", `${TEMAS.azul.bg}
  ${mark("full", "dark", "left:64px;top:56px", 56)}
  ${frame(x, { l: 660, t: 90, w: 360, h: 480, shape: "arch", r: 44, bw: 10 })}
  <div class="abs" style="left:64px;top:170px;width:560px">
    <span class="m" style="display:inline-block;background:#fff;color:${C.azul};font-weight:800;font-size:26px;letter-spacing:.1em;padding:12px 26px;border-radius:999px">${p.pill}</span>
    <div class="m" style="font-weight:700;font-size:34px;color:#9FBBFF;margin-top:24px">${p.fecha}</div>
    <div class="m" style="font-weight:900;font-size:${p.titulo.length > 34 ? 62 : 80}px;line-height:1.05;letter-spacing:-.03em;color:#fff;margin-top:16px">${hl(p.titulo, "#9FBBFF")}</div>
  </div>
  <div class="abs" style="left:56px;right:56px;top:690px;background:#fff;border-radius:44px;padding:36px 44px;box-shadow:0 24px 60px rgba(0,0,0,.4);display:flex;align-items:center;gap:30px">
    <div style="width:120px;height:120px;flex:none;color:${C.vez}"><svg viewBox="0 0 100 100" width="120" height="120">${ICONOS[p.icono ?? "calendario"]}</svg></div>
    <div>
      <div class="m" style="font-weight:900;font-size:46px;line-height:1.12;color:${C.azul}">${hl(p.cardTitulo, C.vez, C.azul)}</div>
      <div style="font-weight:600;font-size:32px;line-height:1.3;color:${C.gris};margin-top:10px">${p.cardTexto}</div>
      ${p.tambien?.length ? `<div style="margin-top:14px">${tambienHTML(p, C.azul, 26)}</div>` : ""}
    </div>
  </div>
  <div class="abs" style="left:64px;right:64px;top:${p.tambien?.length ? 1020 : 960}px;text-align:center;font-weight:500;font-size:28px;line-height:1.36;color:rgba(255,255,255,.92)">${p.motivo}</div>
  <div class="abs" style="left:70px;right:70px;top:${p.tambien?.length ? 1160 : 1100}px;text-align:center">${cta("COTIZA EN VEZMONEY.COM", "#fff", C.azul)}</div>
  <div class="m abs" style="left:80px;right:80px;bottom:34px;display:flex;justify-content:space-between;font-weight:700;font-size:24px;color:rgba(255,255,255,.85)"><span>@vezmoneyoficial</span><span>vezmoney.com</span></div>`);
}

// ---------------- Feriados en Chile (VezMoney trabaja con normalidad) ----------------
// Datos verificados: feriados oficiales de Chile 2026.
export const FERIADOS = [
  { date: "2026-10-12", dia: "Lunes 12 de octubre", nombre: "Encuentro de Dos Mundos", titulo: "Encuentro de **Dos Mundos**", horario: "08:30 a 20:00", photo: "fer_barco-atardecer", pos: "50% 45%",
    motivo: "Se recuerda el encuentro entre Europa y América de 1492. Hoy es una fecha para reflexionar sobre la diversidad cultural y los pueblos indígenas.",
    texto: "Se recuerda el encuentro entre Europa y América, que comenzó con la llegada de Cristóbal Colón el 12 de octubre de 1492. Antes se llamaba Día de la Raza; hoy es una fecha para reflexionar sobre la diversidad cultural y los pueblos indígenas.", emoji: "🌎", tambien: ["VE", "CO"] },
  { date: "2026-10-31", dia: "Sábado 31 de octubre", nombre: "Día de las Iglesias Evangélicas y Protestantes", titulo: "Día de las Iglesias **Evangélicas y Protestantes**", horario: "08:30 a 16:00", photo: "fer_portal-wittenberg", pos: "50% 50%",
    motivo: "Se recuerda el inicio de la Reforma Protestante en 1517 y se reconoce el aporte de las iglesias evangélicas y protestantes y la libertad de culto.",
    texto: "Se conmemora cada 31 de octubre porque ese día de 1517 Martín Lutero dio inicio a la Reforma Protestante. El feriado se instituyó con la Ley 20.299 (2008) para reconocer el aporte social, espiritual y cultural de las iglesias evangélicas y protestantes, y la libertad de culto.", emoji: "🙏" },
  { date: "2026-12-08", dia: "Martes 8 de diciembre", nombre: "Inmaculada Concepción", titulo: "Inmaculada **Concepción**", horario: "08:30 a 20:00", photo: "fer_inmaculada", pos: "50% 30%",
    motivo: "Se celebra la Inmaculada Concepción de la Virgen María, una fiesta religiosa del calendario católico que en Chile es feriado.",
    texto: "Se celebra la Inmaculada Concepción de la Virgen María, una fiesta religiosa del calendario católico que en Chile es feriado cada 8 de diciembre.", emoji: "🕊️", tambien: ["CO", "PE"] },
];
export const DOMINGO = { date: "2026-11-01", dia: "Domingo 1 de noviembre", titulo: "Día de **Todos los Santos**", tambien: ["PE"] };

const feriadoApertura = (f) => ({ ...f, tema: "azul", pill: "FERIADO EN CHILE", fecha: f.dia, texto: f.motivo, destacado: "Hoy **trabajamos con normalidad**", pildora: `Atendemos de ${f.horario}`, icono: "calendario", size: f.nombre.length > 30 ? 84 : 108, textoTop: f.nombre.length > 30 ? 880 : 800 });
const feriadoMediodia = (f) => ({ tema: "blanco", pill: "FERIADO EN CHILE", fecha: f.dia, titulo: "Seguimos **atendiendo**", texto: "Aunque hoy sea feriado, puedes cotizar y enviar con normalidad en vezmoney.com.", pildora: `Atendemos de ${f.horario}`, icono: "check", cta: "ENVÍA EN VEZMONEY.COM" });
const feriadoFeed = (f) => ({ ...f, pill: "FERIADO EN CHILE", fecha: f.dia, cardTitulo: "Hoy trabajamos **con normalidad**", cardTexto: `Atendemos de ${f.horario}` });
const domingoStory = (f) => ({ tema: "cielo", pill: "FERIADO EN CHILE", fecha: f.dia, titulo: f.titulo, texto: "Hoy descansamos. Retomamos el lunes 2 de noviembre desde las 08:30.", destacado: "Hoy **descansamos**", pildora: "Volvemos lunes 08:30", icono: "calendario", tambien: f.tambien, textoTop: 880 });

export const captionFeriado = (f) => `Hoy ${f.dia.toLowerCase()} es feriado en Chile: ${f.nombre} ${f.emoji}

${f.texto}

En VezMoney trabajamos con normalidad 💙
🕗 Atendemos de ${f.horario}.

👉 Cotiza y envía en vezmoney.com

${TAGS} #Feriado`;

// ---------------- Feriados de otros países (siempre recordando que seguimos operativos) ----------------
export const PAISES = [
  { date: "2026-11-02", dia: "Lunes 2 de noviembre", code: "CO", titulo: "Día de **Todos los Santos**", motivo: "En Colombia, el feriado de Todos los Santos se traslada al lunes 2 de noviembre.", horario: "08:30 a 20:00", tema: "azul" },
  { date: "2026-11-16", dia: "Lunes 16 de noviembre", code: "CO", titulo: "Independencia de **Cartagena**", motivo: "Se conmemora la independencia de Cartagena, proclamada el 11 de noviembre de 1811. El feriado se traslada al lunes 16.", horario: "08:30 a 20:00", tema: "blanco" },
  { date: "2026-12-09", dia: "Miércoles 9 de diciembre", code: "PE", titulo: "Batalla de **Ayacucho**", motivo: "Se recuerda la Batalla de Ayacucho de 1824, decisiva para la independencia de Perú y de Sudamérica.", horario: "08:30 a 20:00", tema: "azul" },
];
const paisStory = (p) => ({ ...p, pill: `FERIADO EN ${PAIS[p.code].toUpperCase()}`, fecha: p.dia, texto: p.motivo, destacado: "**Seguimos operativos**", pildora: `Atendemos de ${p.horario}`, icono: "check", textoTop: 800 });

// ---------------- Cierres y horarios de fin de año ----------------
// Calendario copiado de Giros del Sur (por confirmar con VezMoney): 24 y 31-dic hasta 19:00; 25-dic cerrado; 26-dic (sáb) hasta 12:00;
// 1-ene cerrado; 2-ene (sáb) cerrado; reapertura lun 4-ene 08:30.
export const CIERRES = [
  { id: "2026-12-24_story-aviso-navidad", tipo: "story", tema: "azul", pill: "AVISO DE HORARIO", fecha: "Jueves 24 de diciembre", titulo: "Hoy atendemos **hasta las 19:00**", texto: "Mañana, viernes 25, es Navidad y no operamos. Retomamos el sábado 26 de 08:30 a 12:00.", pildora: "Hoy hasta las 19:00", icono: "reloj" },
  { id: "2026-12-25_story-navidad", tipo: "story", tema: "cielo", pill: "FERIADO EN CHILE", fecha: "Viernes 25 de diciembre", titulo: "Feliz **Navidad**", texto: "Hoy no operamos. Que la pases junto a los tuyos. Volvemos mañana, sábado 26, de 08:30 a 12:00.", pildora: "Volvemos sábado 08:30", icono: "corazon" },
  { id: "2026-12-25_feed-navidad", tipo: "feed", photo: "fer_navidad", pos: "50% 40%", pill: "FERIADO EN CHILE", fecha: "Viernes 25 de diciembre", titulo: "Feliz **Navidad**", cardTitulo: "Hoy **no operamos**", cardTexto: "Volvemos mañana, sábado 26 de diciembre, de 08:30 a 12:00.", icono: "corazon", motivo: "Desde VezMoney te deseamos una Navidad llena de unión y cariño junto a los tuyos.",
    caption: `Feliz Navidad 🎄💙\n\nDesde VezMoney te deseamos una Navidad llena de unión y cariño junto a los tuyos.\n\nHoy viernes 25 de diciembre, feriado en Chile, no operamos. Volvemos mañana sábado 26 de 08:30 a 12:00.\n\n👉 Cotiza en vezmoney.com\n\n${TAGS} #Navidad` },
  { id: "2026-12-26_story-horario", tipo: "story", tema: "blanco", pill: "HORARIO ESPECIAL", fecha: "Sábado 26 de diciembre", titulo: "Hoy atendemos **hasta las 12:00**", texto: "Estamos operativos de 08:30 a 12:00. Cotiza y envía con tiempo en vezmoney.com.", pildora: "08:30 a 12:00", icono: "reloj" },
  { id: "2026-12-31_story-aviso-anonuevo", tipo: "story", tema: "azul", pill: "AVISO DE HORARIO", fecha: "Jueves 31 de diciembre", titulo: "Hoy atendemos **hasta las 19:00**", texto: "Mañana 1 de enero y el sábado 2 no operamos. Retomamos el lunes 4 de enero desde las 08:30.", pildora: "Hoy hasta las 19:00", icono: "reloj" },
  { id: "2027-01-01_story-anonuevo", tipo: "story", tema: "cielo", pill: "FERIADO EN CHILE", fecha: "Viernes 1 de enero", titulo: "Feliz **Año Nuevo**", texto: "Hoy no operamos. Mañana sábado 2 tampoco. Retomamos el lunes 4 de enero desde las 08:30.", pildora: "Volvemos lunes 08:30", icono: "corazon" },
  { id: "2027-01-01_feed-anonuevo", tipo: "feed", photo: "fer_anonuevo", pos: "50% 45%", pill: "FERIADO EN CHILE", fecha: "Viernes 1 de enero", titulo: "Feliz **Año Nuevo**", cardTitulo: "Hoy **no operamos**", cardTexto: "Mañana sábado 2 tampoco. Volvemos el lunes 4 de enero a las 08:30.", icono: "corazon", motivo: "Gracias por confiar en VezMoney. ¡Que este nuevo año venga lleno de reencuentros!",
    caption: `Feliz Año Nuevo 🎆💙\n\nGracias por confiar en VezMoney. ¡Que este nuevo año venga lleno de reencuentros!\n\nHoy viernes 1 de enero, feriado en Chile, no operamos. Mañana sábado 2 tampoco. Volvemos el lunes 4 de enero a las 08:30.\n\n👉 Cotiza en vezmoney.com\n\n${TAGS} #AñoNuevo` },
  { id: "2027-01-02_story-sabado-cerrado", tipo: "story", tema: "blanco", pill: "AVISO DE HORARIO", fecha: "Sábado 2 de enero", titulo: "Hoy **no operamos**", texto: "Retomamos el lunes 4 de enero desde las 08:30. Puedes cotizar en vezmoney.com cuando quieras.", pildora: "Volvemos lunes 08:30", icono: "reloj" },
];

if (process.argv[1]?.endsWith("avisos.mjs")) {
  const R = async (html, out, h) => { await renderPage(html, { width: 1080, height: h, out }); console.log("ok", out); };
  for (const f of FERIADOS) {
    await R(story(feriadoApertura(f)), `content/feriados/${f.date}_story-apertura.jpg`, 1920);
    await R(story(feriadoMediodia(f)), `content/feriados/${f.date}_story-mediodia.jpg`, 1920);
    await R(feed(feriadoFeed(f)), `content/feriados/${f.date}_feed.jpg`, 1350);
  }
  await R(story(domingoStory(DOMINGO)), `content/feriados/${DOMINGO.date}_story-domingo.jpg`, 1920);
  for (const p of PAISES) await R(story(paisStory(p)), `content/feriados-paises/${p.date}_story-${p.code.toLowerCase()}.jpg`, 1920);
  for (const p of CIERRES) await R(p.tipo === "story" ? story(p) : feed(p), `content/cierres/${p.id}.jpg`, p.tipo === "story" ? 1920 : 1350);
  await closeBrowser();
}
