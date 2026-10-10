// avisos.mjs — piezas especiales de VezMoney: feriados (Chile, Venezuela, Colombia y Perú) y avisos de horario de fin de año.
// Misma lógica que Giros del Sur, con el sistema visual de VezMoney: foto real a pantalla completa, azul de marca y mensaje claro.
// Tono: solemne y respetuoso con la fecha, y a la vez comercial ("hoy trabajamos / volvemos…").
// Uso: node src/avisos.mjs → content/feriados/, content/feriados-paises/, content/cierres/ (se programan en Metricool con la URL raw de GitHub)
// Horario VezMoney: L–V 08:30–20:00 · sábado 08:30–16:00 · domingo cerrado.
import { C, flag, arrowSvg, hl } from "./common.mjs";
import { renderPage, closeBrowser } from "./render.mjs";

const TAGS = "#VezMoney #Remesas #EnviarDinero #RemesasInternacionales #Migrantes #EnvíoDeDinero #Chile #Venezuela";
const PAIS = { PE: "Perú", CO: "Colombia", VE: "Venezuela", CL: "Chile" };
const NAVY = "#001450";
const hlA = (s) => hl(s.replace(/##(.+?)##/g, "$1"), "#A9C2FF");

const page = (w, h, cls, inner) => `<!doctype html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=${w},height=${h}"><link rel="stylesheet" href="kit.css"></head><body class="${cls}"><div id="root" style="background:${NAVY}">${inner}</div></body></html>`;
const img = (p, style) => `<img src="assets/photos/${p.photo}.jpg" style="position:absolute;object-fit:cover;object-position:${p.pos ?? "50% 40%"};${style}">`;
const logoW = (h, style) => `<img src="assets/logos/reversa_horizontal.png" style="position:absolute;height:${h}px;${style}">`;
const cta = (t) => `<span class="m" style="display:inline-flex;align-items:center;gap:20px;background:#fff;color:${C.azul};font-weight:800;font-size:34px;padding:18px 24px 18px 40px;border-radius:999px;white-space:nowrap">${t}<span style="width:54px;height:54px;border-radius:50%;background:${C.rosa};color:#fff;display:inline-flex;align-items:center;justify-content:center">${arrowSvg(28)}</span></span>`;
const tambien = (p, size = 30) => p.tambien?.length
  ? `<div style="display:flex;align-items:center;flex-wrap:wrap;gap:8px 20px;font-weight:600;font-size:${size}px;color:rgba(255,255,255,.88)"><span>También es feriado en</span>${p.tambien.map((c) => `<span style="display:inline-flex;align-items:center;gap:10px">${flag(c, Math.round(size * 1.4))}<b class="m" style="font-weight:800;color:#fff">${PAIS[c]}</b></span>`).join("")}</div>`
  : "";
const kicker = (p, size = 26) => !p.pill ? "" : `<div style="display:flex;align-items:center;gap:18px">${p.flagCode ?? p.code ? flag(p.flagCode ?? p.code, size * 2) : ""}<span class="m" style="font-weight:800;font-size:${size}px;letter-spacing:.16em;color:#fff">${p.pill}</span><span style="height:2px;width:70px;background:rgba(255,255,255,.55)"></span></div>`;

// Historia 1080x1920: foto arriba que se funde con el azul; todo el texto apilado desde abajo (nada se superpone)
export function story(p) {
  const PH = p.ph ?? 1500;
  return page(1080, 1920, "story", `
  <div class="abs" style="left:0;top:0;width:1080px;height:${PH}px;overflow:hidden">${img(p, `left:0;top:0;width:100%;height:100%;${p.zoom ? `transform:scale(${p.zoom});transform-origin:${p.zo ?? "50% 50%"};` : ""}`)}</div>
  <div class="abs" style="left:0;top:0;width:1080px;height:${PH}px;background:linear-gradient(to bottom,rgba(0,20,76,.60) 0%,rgba(0,20,76,.06) 20%,rgba(0,20,76,.10) 38%,rgba(0,20,80,.80) 66%,${NAVY} 100%)"></div>
  ${logoW(64, "left:50%;top:86px;transform:translateX(-50%)")}
  <div class="abs" style="left:80px;right:80px;bottom:110px;display:flex;flex-direction:column;gap:${p.gap ?? 24}px;color:#fff">
    ${kicker(p)}
    <div class="m" style="font-weight:600;font-size:36px;color:#BFD0FF">${p.fecha}</div>
    <div class="m" style="font-weight:900;font-size:${p.size ?? 104}px;line-height:1.03;letter-spacing:-.035em">${hlA(p.titulo)}</div>
    ${p.texto ? `<div style="font-weight:500;font-size:37px;line-height:1.36;color:rgba(255,255,255,.9)">${p.texto}</div>` : ""}
    <div style="height:2px;background:rgba(255,255,255,.28);margin:6px 0 2px"></div>
    <div class="m" style="font-weight:800;font-size:54px;line-height:1.1;letter-spacing:-.02em">${hlA(p.mensaje)}</div>
    <div style="font-weight:600;font-size:36px;color:#DCE6FF">${p.detalle}</div>
    ${tambien(p)}
    <div style="margin-top:10px">${cta(p.cta ?? "COTIZA EN VEZMONEY.COM")}</div>
    <div class="m" style="display:flex;justify-content:space-between;font-weight:700;font-size:25px;color:rgba(255,255,255,.75);margin-top:6px"><span>@vezmoneyoficial</span><span>vezmoney.com</span></div>
  </div>`);
}

// Post de feed 1080x1350: foto arriba (con el título encima) y panel azul con el mensaje comercial
export function feed(p) {
  return page(1080, 1350, "feed", `
  <div class="abs" style="left:0;top:0;width:1080px;height:800px;overflow:hidden">${img(p, "left:0;top:0;width:100%;height:100%")}</div>
  <div class="abs" style="left:0;top:0;width:1080px;height:800px;background:linear-gradient(to bottom,rgba(0,20,76,.55) 0%,rgba(0,20,76,.05) 26%,rgba(0,20,76,.18) 52%,rgba(0,20,80,.88) 86%,${NAVY} 100%)"></div>
  ${logoW(58, "left:64px;top:56px")}
  <div class="abs" style="left:64px;right:64px;top:430px;color:#fff;display:flex;flex-direction:column;gap:16px">
    ${kicker(p, 24)}
    <div class="m" style="font-weight:600;font-size:32px;color:#BFD0FF">${p.fecha}</div>
    <div class="m" style="font-weight:900;font-size:${p.titulo.length > 34 ? 66 : 84}px;line-height:1.03;letter-spacing:-.035em">${hlA(p.titulo)}</div>
  </div>
  <div class="abs" style="left:64px;right:64px;top:820px;color:#fff;display:flex;flex-direction:column;gap:18px">
    ${p.motivo ? `<div style="font-weight:500;font-size:29px;line-height:1.38;color:rgba(255,255,255,.88)">${p.motivo}</div>` : ""}
    <div style="height:2px;background:rgba(255,255,255,.28)"></div>
    <div class="m" style="font-weight:800;font-size:44px;line-height:1.1;letter-spacing:-.02em">${hlA(p.mensaje)}</div>
    <div style="font-weight:600;font-size:30px;color:#DCE6FF">${p.detalle}</div>
    ${tambien(p, 26)}
  </div>
  <div class="abs" style="left:64px;right:64px;bottom:50px;display:flex;justify-content:space-between;align-items:center">${cta("COTIZA EN VEZMONEY.COM")}<span class="m" style="font-weight:700;font-size:24px;color:rgba(255,255,255,.75);text-align:right;line-height:1.4">@vezmoneyoficial</span></div>`);
}

// ---------------- Feriados en Chile (VezMoney trabaja con normalidad) ----------------
// Datos verificados: feriados oficiales de Chile 2026.
export const FERIADOS = [
  { date: "2026-10-12", dia: "Lunes 12 de octubre", nombre: "Encuentro de Dos Mundos", titulo: "Encuentro de **Dos Mundos**", horario: "08:30 a 20:00", photo: "fer_barco-atardecer", pos: "50% 45%",
    motivo: "Se recuerda el encuentro entre Europa y América de 1492: una fecha para reflexionar sobre la diversidad cultural y los pueblos indígenas.",
    texto: "Se recuerda el encuentro entre Europa y América, que comenzó con la llegada de Cristóbal Colón el 12 de octubre de 1492. Antes se llamaba Día de la Raza; hoy es una fecha para reflexionar sobre la diversidad cultural y los pueblos indígenas.", emoji: "🌎", tambien: ["VE", "CO"] },
  { date: "2026-10-31", dia: "Sábado 31 de octubre", nombre: "Día de las Iglesias Evangélicas y Protestantes", titulo: "Día de las Iglesias **Evangélicas y Protestantes**", horario: "08:30 a 16:00", photo: "fer_portal-wittenberg", pos: "50% 50%", ph: 1400, size: 88,
    motivo: "Se recuerda el inicio de la Reforma Protestante en 1517 y se reconoce el aporte de las iglesias evangélicas y protestantes y la libertad de culto.",
    texto: "Se conmemora cada 31 de octubre porque ese día de 1517 Martín Lutero dio inicio a la Reforma Protestante. El feriado se instituyó con la Ley 20.299 (2008) para reconocer el aporte social, espiritual y cultural de las iglesias evangélicas y protestantes, y la libertad de culto.", emoji: "🙏" },
  { date: "2026-12-08", dia: "Martes 8 de diciembre", nombre: "Inmaculada Concepción", titulo: "Inmaculada **Concepción**", horario: "08:30 a 20:00", photo: "fer_inmaculada", pos: "50% 30%",
    motivo: "Se celebra la Inmaculada Concepción de la Virgen María, fiesta religiosa del calendario católico que en Chile es feriado.",
    texto: "Se celebra la Inmaculada Concepción de la Virgen María, una fiesta religiosa del calendario católico que en Chile es feriado cada 8 de diciembre.", emoji: "🕊️", tambien: ["CO", "PE"] },
];
export const DOMINGO = { date: "2026-11-01", dia: "Domingo 1 de noviembre", titulo: "Día de **Todos los Santos**", tambien: ["PE"], photo: "av_todos-santos-cl", pos: "50% 55%" };

const apertura = (f) => ({ ...f, pill: "FERIADO EN CHILE", fecha: f.dia, texto: f.motivo.length < 150 ? f.motivo : undefined, mensaje: "Hoy trabajamos **con normalidad**", detalle: `Atendemos de ${f.horario}. Envía a los tuyos desde vezmoney.com.` });
const mediodia = (f) => ({ ...f, pill: "FERIADO EN CHILE", fecha: f.dia, texto: "Aunque hoy sea feriado, puedes cotizar y enviar con normalidad.", titulo: "Seguimos **atendiendo**", mensaje: "Tu envío sigue **en marcha**", detalle: `Atendemos de ${f.horario}.`, tambien: undefined, zoom: 1.22, zo: "50% 30%", pos: f.pos2 ?? f.pos, size: 112 });
const feedF = (f) => ({ ...f, pill: "FERIADO EN CHILE", fecha: f.dia, mensaje: "Hoy trabajamos **con normalidad**", detalle: `Atendemos de ${f.horario}` });
const domingo = (f) => ({ ...f, pill: "FERIADO EN CHILE", fecha: f.dia, texto: "Un día para recordar y acompañar a quienes ya no están. Hoy descansamos en familia.", mensaje: "Hoy **descansamos**", detalle: "Retomamos el lunes 2 de noviembre desde las 08:30.", cta: "COTIZA EN VEZMONEY.COM" });

// Recordatorio del domingo 11: mañana, feriado, trabajamos con horario normal
const recordatorio = { pill: "MAÑANA, LUNES 12 DE OCTUBRE", fecha: "Domingo 11 de octubre", titulo: "Mañana trabajamos **con normalidad**", texto: "Aunque mañana lunes 12 es feriado, estaremos atendiendo en nuestro horario habitual.", mensaje: "Cotiza y envía **desde las 08:30**", detalle: "Lunes 12 de octubre, de 08:30 a 20:00.", photo: "fer_barco-atardecer", pos: "50% 45%" };

export const captionFeriado = (f) => `Hoy ${f.dia.toLowerCase()} es feriado en Chile: ${f.nombre} ${f.emoji}

${f.texto}

En VezMoney trabajamos con normalidad 💙
🕗 Atendemos de ${f.horario}.

👉 Cotiza y envía en vezmoney.com

${TAGS} #Feriado`;

// ---------------- Feriados de otros países (siempre recordando que seguimos operativos) ----------------
export const PAISES = [
  { date: "2026-10-12", dia: "Lunes 12 de octubre", code: "VE", titulo: "Día de la **Resistencia Indígena**", motivo: "En Venezuela se recuerda la resistencia de los pueblos originarios y se honra su legado.", horario: "08:30 a 20:00", photo: "av_tepui", pos: "50% 45%", slot: "13:00" },
  { date: "2026-11-02", dia: "Lunes 2 de noviembre", code: "CO", titulo: "Día de **Todos los Santos**", motivo: "En Colombia, el feriado de Todos los Santos se traslada al lunes 2 de noviembre: un día para recordar a los seres queridos.", horario: "08:30 a 20:00", photo: "av_todos-santos-co", pos: "50% 50%", slot: "13:00" },
  { date: "2026-11-16", dia: "Lunes 16 de noviembre", code: "CO", titulo: "Independencia de **Cartagena**", motivo: "Se conmemora la independencia de Cartagena, proclamada el 11 de noviembre de 1811. El feriado se traslada al lunes 16.", horario: "08:30 a 20:00", photo: "av_cartagena", pos: "50% 40%", slot: "13:00" },
  { date: "2026-12-09", dia: "Miércoles 9 de diciembre", code: "PE", titulo: "Batalla de **Ayacucho**", motivo: "Se recuerda la Batalla de Ayacucho de 1824, decisiva para la independencia de Perú y de Sudamérica.", horario: "08:30 a 20:00", photo: "av_ayacucho", pos: "50% 35%", slot: "13:00" },
  { date: "2026-12-24", dia: "Jueves 24 de diciembre", code: "VE", neutro: true, titulo: "Feliz **Nochebuena**", motivo: "Una noche para reunirse en familia y agradecer lo vivido.", horario: "08:30 a 19:00", photo: "av_nochebuena", pos: "50% 50%", slot: "13:00" },
  { date: "2026-12-31", dia: "Jueves 31 de diciembre", code: "VE", neutro: true, titulo: "Feliz **fin de año**", motivo: "Se despide el año junto a los tuyos. Gracias por confiar en VezMoney.", horario: "08:30 a 19:00", photo: "av_fuegos-2", pos: "50% 40%", slot: "13:00" },
];
const paisStory = (p) => ({ ...p, pill: p.neutro ? "" : `FERIADO EN ${PAIS[p.code].toUpperCase()}`, flagCode: p.neutro ? undefined : p.code, fecha: p.dia, texto: p.motivo, mensaje: "**Seguimos operativos**", detalle: `Atendemos de ${p.horario}. Cotiza y envía con normalidad.` });

// ---------------- Cierres y horarios de fin de año ----------------
// Calendario confirmado por VezMoney (9-oct-2026): 24 y 31-dic hasta 19:00; 25-dic cerrado; 26-dic (sáb) hasta 12:00;
// 1-ene cerrado; 2-ene (sáb) cerrado; reapertura lun 4-ene 08:30.
export const CIERRES = [
  { id: "2026-12-24_story-aviso-navidad", tipo: "story", pill: "AVISO DE HORARIO", fecha: "Jueves 24 de diciembre", titulo: "Hoy atendemos **hasta las 19:00**", texto: "Mañana, viernes 25, es Navidad y no operamos. Retomamos el sábado 26 de 08:30 a 12:00.", mensaje: "Envía **con tiempo**", detalle: "Hoy hasta las 19:00 · Nochebuena", photo: "av_mesa-navidad", pos: "50% 55%", size: 96 },
  { id: "2026-12-25_story-navidad", tipo: "story", pill: "", fecha: "Viernes 25 de diciembre", titulo: "Feliz **Navidad**", texto: "Hoy no operamos. Que la pases junto a los tuyos.", mensaje: "Volvemos **mañana**", detalle: "Sábado 26, de 08:30 a 12:00.", photo: "av_arbol2", pos: "50% 45%" },
  { id: "2026-12-25_feed-navidad", tipo: "feed", photo: "fer_navidad", pos: "50% 40%", pill: "", fecha: "Viernes 25 de diciembre", titulo: "Feliz **Navidad**", motivo: "Desde VezMoney te deseamos una Navidad llena de unión y cariño junto a los tuyos.", mensaje: "Hoy **no operamos**", detalle: "Volvemos mañana, sábado 26, de 08:30 a 12:00.",
    caption: `Feliz Navidad 🎄💙\n\nDesde VezMoney te deseamos una Navidad llena de unión y cariño junto a los tuyos.\n\nHoy viernes 25 de diciembre no operamos. Volvemos mañana sábado 26 de 08:30 a 12:00.\n\n👉 Cotiza en vezmoney.com\n\n${TAGS} #Navidad` },
  { id: "2026-12-26_story-horario", tipo: "story", pill: "HORARIO ESPECIAL", fecha: "Sábado 26 de diciembre", titulo: "Hoy atendemos **hasta las 12:00**", texto: "Estamos operativos de 08:30 a 12:00. Cotiza y envía con tiempo.", mensaje: "Seguimos **atendiendo**", detalle: "Hoy de 08:30 a 12:00.", photo: "av_arbol", pos: "50% 50%", size: 96 },
  { id: "2026-12-31_story-aviso-anonuevo", tipo: "story", pill: "AVISO DE HORARIO", fecha: "Jueves 31 de diciembre", titulo: "Hoy atendemos **hasta las 19:00**", texto: "Mañana 1 de enero y el sábado 2 no operamos. Retomamos el lunes 4 de enero desde las 08:30.", mensaje: "Envía **con tiempo**", detalle: "Hoy hasta las 19:00 · fin de año", photo: "av_fuegos-1", pos: "50% 40%", size: 96 },
  { id: "2027-01-01_story-anonuevo", tipo: "story", pill: "", fecha: "Viernes 1 de enero", titulo: "Feliz **Año Nuevo**", texto: "Hoy no operamos. Mañana sábado 2 tampoco.", mensaje: "Volvemos el **lunes 4**", detalle: "Desde las 08:30.", photo: "fer_anonuevo", pos: "50% 45%" },
  { id: "2027-01-01_feed-anonuevo", tipo: "feed", photo: "av_fuegos-3", pos: "50% 45%", pill: "", fecha: "Viernes 1 de enero", titulo: "Feliz **Año Nuevo**", motivo: "Gracias por confiar en VezMoney. ¡Que este nuevo año venga lleno de reencuentros!", mensaje: "Hoy **no operamos**", detalle: "Mañana sábado 2 tampoco. Volvemos el lunes 4 de enero a las 08:30.",
    caption: `Feliz Año Nuevo 🎆💙\n\nGracias por confiar en VezMoney. ¡Que este nuevo año venga lleno de reencuentros!\n\nHoy viernes 1 de enero no operamos. Mañana sábado 2 tampoco. Volvemos el lunes 4 de enero a las 08:30.\n\n👉 Cotiza en vezmoney.com\n\n${TAGS} #AñoNuevo` },
  { id: "2027-01-02_story-sabado-cerrado", tipo: "story", pill: "AVISO DE HORARIO", fecha: "Sábado 2 de enero", titulo: "Hoy **no operamos**", texto: "Puedes cotizar en vezmoney.com cuando quieras.", mensaje: "Volvemos el **lunes 4**", detalle: "Desde las 08:30.", photo: "av_amanecer", pos: "50% 45%" },
];

if (process.argv[1]?.endsWith("avisos.mjs")) {
  const R = async (html, out, h) => { await renderPage(html, { width: 1080, height: h, out }); console.log("ok", out); };
  for (const f of FERIADOS) {
    await R(story(apertura(f)), `content/feriados/${f.date}_story-apertura.jpg`, 1920);
    await R(story(mediodia(f)), `content/feriados/${f.date}_story-mediodia.jpg`, 1920);
    await R(feed(feedF(f)), `content/feriados/${f.date}_feed.jpg`, 1350);
  }
  await R(story(recordatorio), "content/feriados/2026-10-11_story-recordatorio.jpg", 1920);
  await R(story(domingo(DOMINGO)), `content/feriados/${DOMINGO.date}_story-domingo.jpg`, 1920);
  for (const p of PAISES) await R(story(paisStory(p)), `content/feriados-paises/${p.date}_story-${p.code.toLowerCase()}.jpg`, 1920);
  for (const p of CIERRES) await R(p.tipo === "story" ? story(p) : feed(p), `content/cierres/${p.id}.jpg`, p.tipo === "story" ? 1920 : 1350);
  await closeBrowser();
}
