// disenos.mjs — plantillas del contenido de tendencia (1080×1350). Cada pieza = { plantilla, …campos, caption, hashtags }.
// Todo es texto corto y marca VezMoney; las fotos salen de tendencias/fotos.json. Nada de datos inventados: el agente solo rellena textos.
import { A, ph, logo, pageFeed, btn, C } from "../skins/_k.mjs";

const D = "DisplayV, Impact, sans-serif", S = "ScriptV, cursive", I = "Inter, sans-serif";
const AZ = "#001C70", AZ2 = "#03258C", CIE = "#5B8CFF", ROS = "#F20775", TUR = "#22C7C9", AMA = "#FFE27A";

// límites de caracteres por plantilla (los usan el validador y el agente de correcciones)
export const LIMITES = {
  meme: { arriba: 60, abajo: 70 },
  titular: { etiqueta: 22, titular: 80, bajada: 120, remate: 60 },
  pregunta: { pregunta: 80, remate: 60 },
  dato: { numero: 10, texto: 110, remate: 60 },
  versus: { remate: 60 },
  reel: { gancho: 60, remate: 60 }, // video real de tendencia con texto encima (ver reel.mjs)
};
const PROHIBIDAS = [/sin comisi[oó]n/i, /sin costo/i, /el m[aá]s barato/i, /la mejor tasa/i, /garantizad/i, /100\s?%\s?seguro/i, /24\s?\/\s?7/i, /\ben \d+ (min|minutos|horas|segundos)\b/i, /al instante/i, /brasil/i];

const okVideoUrl = (u) => { try { const x = new URL(u), h = x.hostname; return ((h === "tiktok.com" || h.endsWith(".tiktok.com")) && x.pathname.includes("/video/")) || ((h === "instagram.com" || h.endsWith(".instagram.com")) && /^\/(p|reel|reels|tv)\//.test(x.pathname)); } catch { return false; } };
export function validar(p) {
  const errs = [];
  if (!LIMITES[p?.plantilla]) return [`plantilla desconocida: ${p?.plantilla}`];
  for (const [k, max] of Object.entries(LIMITES[p.plantilla])) { if (!p[k]) errs.push(`falta ${k}`); else if (String(p[k]).length > max) errs.push(`${k} pasa de ${max} caracteres (${String(p[k]).length})`); }
  if (p.plantilla === "meme" && !p.foto) errs.push("falta foto");
  if (p.plantilla === "pregunta" && !(p.opciones?.length >= 2 && p.opciones.length <= 3)) errs.push("pregunta necesita 2 o 3 opciones");
  if (p.plantilla === "versus") for (const l of ["izquierda", "derecha"]) { if (!p[l]?.titulo || !(p[l]?.items?.length >= 2)) errs.push(`versus.${l} incompleto`); }
  const enImagen = [...Object.keys(LIMITES[p.plantilla]).map((k) => p[k]), ...(p.opciones || []), ...(p.izquierda?.items || []), ...(p.derecha?.items || []), p.izquierda?.titulo, p.derecha?.titulo].filter(Boolean).join(" ");
  if (new RegExp(EMOJI.source, "u").test(enImagen)) errs.push("no uses emojis en el texto de la imagen (solo en el caption)");
  if (p.plantilla === "reel") {
    if (!okVideoUrl(p.video?.url)) errs.push("reel: falta video.url de TikTok o Instagram");
    if (!p.video?.autor) errs.push("reel: falta video.autor (se le da crédito)");
    else if (!String(p.caption || "").toLowerCase().includes("@" + String(p.video.autor).toLowerCase().replace(/^@/, ""))) errs.push("reel: el caption debe dar crédito al autor (@" + p.video.autor + ")");
    if (!(p.duracion >= 3 && p.duracion <= 20)) errs.push("reel: duracion debe estar entre 3 y 20 segundos");
    if (p.estilo && !ESTILOS_REEL[p.estilo]) errs.push("reel: estilo debe ser " + Object.keys(ESTILOS_REEL).join(", "));
    if (p.audio && !AUDIOS_REEL.includes(p.audio)) errs.push("reel: audio debe ser " + AUDIOS_REEL.join(", "));
    if (p.audio === "musica" && p.musica && !MUSICAS_REEL.includes(p.musica)) errs.push("reel: musica debe ser " + MUSICAS_REEL.join(", "));
  }
  if (!p.caption) errs.push("falta caption");
  if (!(p.hashtags?.length >= 4)) errs.push("faltan hashtags");
  const todo = JSON.stringify(p);
  for (const re of PROHIBIDAS) if (re.test(todo)) errs.push(`texto prohibido: ${re}`);
  return errs;
}

// tamaño de letra para que un texto (con saltos de línea automáticos) quepa en ancho × alto
const tam = (txt, ancho, alto, { ratio = 0.52, lh = 1.1, max = 120, min = 26 } = {}) => {
  for (let s = max; s >= min; s -= 2) { const cpl = Math.max(4, Math.floor(ancho / (s * ratio))), lineas = String(txt).split(/\s+/).reduce((acc, w) => { const l = acc[acc.length - 1]; if (l && (l + " " + w).length <= cpl) acc[acc.length - 1] = l + " " + w; else acc.push(w); return acc; }, []).length; if (lineas * s * lh <= alto) return s; }
  return min;
};
const pie = (claro = false) => `${A("left:50px;bottom:44px;right:50px;display:flex;align-items:center;justify-content:space-between", `<span style="display:inline-block">${btn("COTIZA EN VEZMONEY.COM", { bg: claro ? AZ2 : "#fff", color: claro ? "#fff" : AZ2, size: 28 })}</span>`)}`;
const lg = (v = "reversa_horizontal", style = "left:50px;top:46px") => logo(v, 52, style);
const EMOJI = /[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\u{FE0F}\u{200D}]/gu;
const esc = (t) => String(t ?? "").replace(EMOJI, "").replace(/\s+/g, " ").trim().replace(/&/g, "&amp;").replace(/</g, "&lt;");

const PLANTILLAS = {
  meme: (p) => pageFeed(`${ph(p.foto, "50% 30%", "left:0;top:0;width:100%;height:100%")}${A("inset:0;background:linear-gradient(180deg,rgba(0,0,0,.45) 0%,transparent 28%,transparent 52%,rgba(0,16,80,.92) 82%)")}
    ${A(`left:50px;right:50px;top:50px;text-align:center;font-family:${D};text-transform:uppercase;color:#fff;line-height:1.05;font-size:${tam(p.arriba, 980, 250, { ratio: 0.42, lh: 1.05, max: 96 })}px;text-shadow:-3px -3px 0 #000,3px -3px 0 #000,-3px 3px 0 #000,3px 3px 0 #000,0 6px 14px rgba(0,0,0,.5)`, esc(p.arriba))}
    ${A(`left:50px;right:50px;bottom:190px;font-family:${I};font-weight:900;color:#fff;letter-spacing:-.02em;line-height:1.08;font-size:${tam(p.abajo, 980, 260, { ratio: 0.55, lh: 1.08, max: 76 })}px`, esc(p.abajo))}
    ${lg("reversa_horizontal", "left:50px;bottom:120px;opacity:0")}${pie()}`, "#001450"),

  titular: (p) => pageFeed(`${A(`inset:0;background:linear-gradient(160deg,${AZ2} 0%,${AZ} 100%)`)}${A("inset:0;opacity:.18;background-image:radial-gradient(circle,#fff 2px,transparent 2.5px);background-size:44px 44px")}${A("right:-180px;top:-180px;width:640px;height:640px;border-radius:50%;background:" + CIE + ";opacity:.25")}${lg()}
    ${A(`left:50px;top:150px;background:${ROS};color:#fff;font-family:${I};font-weight:900;font-size:34px;letter-spacing:.14em;padding:14px 28px;border-radius:999px;text-transform:uppercase`, esc(p.etiqueta))}
    ${A(`left:50px;right:50px;top:220px;bottom:370px;display:flex;flex-direction:column;justify-content:center;gap:44px`, `<div style="font-family:${I};font-weight:900;color:#fff;letter-spacing:-.03em;line-height:1.04;font-size:${tam(p.titular, 980, 560, { ratio: 0.55, lh: 1.04, max: 118 })}px">${esc(p.titular)}</div><div style="font-family:${I};font-weight:600;color:#CFE0FF;line-height:1.25;font-size:${tam(p.bajada, 940, 200, { ratio: 0.5, lh: 1.25, max: 46, min: 28 })}px">${esc(p.bajada)}</div>`)}
    ${A(`left:50px;right:50px;bottom:140px;background:#fff;border-radius:34px;padding:30px 40px;box-shadow:0 26px 60px rgba(0,0,40,.4)`, `<div style="font-family:${I};font-weight:900;color:${AZ2};letter-spacing:-.02em;line-height:1.1;font-size:${tam(p.remate, 900, 120, { ratio: 0.55, lh: 1.1, max: 54, min: 32 })}px">${esc(p.remate)}</div>`)}
    ${A("left:50px;bottom:44px", btn("COTIZA EN VEZMONEY.COM", { bg: "#fff", color: AZ2, size: 28 }))}`, AZ),

  pregunta: (p) => pageFeed(`${A("inset:0;background:#EAF0FC")}${A("left:-200px;bottom:-200px;width:700px;height:700px;border-radius:50%;background:#CFE0FF")}${lg("principal_horizontal")}
    ${A(`left:50px;right:50px;top:140px;bottom:330px;display:flex;flex-direction:column;justify-content:center;gap:46px`, `<div style="font-family:${I};font-weight:900;color:${AZ};letter-spacing:-.03em;line-height:1.05;font-size:${tam(p.pregunta, 980, 380, { ratio: 0.55, lh: 1.05, max: 100 })}px">${esc(p.pregunta)}</div><div>` + p.opciones.map((o, i) => `<div style="display:flex;align-items:center;gap:22px;background:#fff;border:4px solid ${[AZ2, ROS, TUR][i]};border-radius:30px;padding:26px 32px;margin-bottom:22px;box-shadow:0 14px 30px rgba(0,28,112,.14)"><span style="width:76px;height:76px;border-radius:50%;background:${[AZ2, ROS, TUR][i]};color:#fff;font-family:${I};font-weight:900;font-size:44px;display:inline-flex;align-items:center;justify-content:center;flex:none">${"ABC"[i]}</span><span style="font-family:${I};font-weight:800;color:${AZ};font-size:${tam(o, 760, 90, { ratio: 0.55, lh: 1.1, max: 52, min: 30 })}px;line-height:1.1">${esc(o)}</span></div>`).join("") + `</div>`)}
    ${A(`left:50px;right:50px;bottom:150px;background:${AZ};color:#fff;border-radius:28px;padding:24px 36px;font-family:${I};font-weight:900;line-height:1.12;font-size:${tam(p.remate, 900, 110, { ratio: 0.55, lh: 1.12, max: 48, min: 30 })}px`, esc(p.remate))}
    ${A("left:50px;bottom:44px", btn("COTIZA EN VEZMONEY.COM", { bg: AZ2, size: 28 }))}`, "#EAF0FC"),

  dato: (p) => pageFeed(`${A("inset:0;background:radial-gradient(900px 700px at 70% 20%,#0B2A8C 0%,#031044 60%,#020A2C 100%)")}${lg()}
    ${A(`left:50px;right:50px;top:150px;font-family:${D};color:${TUR};line-height:1;letter-spacing:-.01em;font-size:${Math.min(360, Math.floor(980 / (String(p.numero).length * 0.5)))}px;white-space:nowrap`, esc(p.numero))}
    ${A(`left:50px;right:70px;top:620px;font-family:${I};font-weight:700;color:#fff;line-height:1.2;font-size:${tam(p.texto, 940, 330, { ratio: 0.52, lh: 1.2, max: 56, min: 32 })}px`, esc(p.texto))}
    ${A(`left:50px;right:50px;bottom:140px;background:${ROS};color:#fff;border-radius:28px;padding:26px 36px;font-family:${I};font-weight:900;line-height:1.1;font-size:${tam(p.remate, 900, 110, { ratio: 0.55, lh: 1.1, max: 52, min: 32 })}px`, esc(p.remate))}
    ${A("left:50px;bottom:44px", btn("COTIZA EN VEZMONEY.COM", { bg: "#fff", color: AZ2, size: 28 }))}`, "#020A2C"),

  versus: (p) => { const col = (c, claro) => `<div style="flex:1;background:${claro ? "#fff" : AZ2};color:${claro ? "#3A4764" : "#fff"};border-radius:34px;padding:36px 30px;box-shadow:0 20px 44px rgba(0,28,112,.3);display:flex;flex-direction:column;justify-content:center;${claro ? "" : "transform:translateY(-14px)"}"><div style="font-family:${I};font-weight:900;font-size:54px;letter-spacing:-.02em;margin-bottom:30px;color:${claro ? "#7C8DBA" : AMA}">${esc(c.titulo)}</div>${c.items.slice(0, 3).map((t) => `<div style="display:flex;gap:12px;align-items:flex-start;font-family:${I};font-weight:700;font-size:${tam(t, 320, 190, { ratio: 0.52, lh: 1.15, max: 46, min: 26 })}px;line-height:1.15;margin-bottom:40px"><span style="color:${claro ? "#B5BED6" : TUR};font-weight:900">${claro ? "•" : "✔"}</span><span>${esc(t)}</span></div>`).join("")}</div>`;
    return pageFeed(`${A("inset:0;background:linear-gradient(160deg,#DCE8FF,#B7CDFF)")}${lg("principal_horizontal")}
    ${A("left:50px;right:50px;top:150px;bottom:330px;display:flex;gap:26px;align-items:stretch", col(p.izquierda, true) + col(p.derecha, false))}
    ${A(`left:50px;right:50px;bottom:150px;background:${AZ};color:#fff;border-radius:28px;padding:26px 36px;font-family:${I};font-weight:900;line-height:1.1;font-size:${tam(p.remate, 900, 110, { ratio: 0.55, lh: 1.1, max: 50, min: 30 })}px`, esc(p.remate))}
    ${A("left:50px;bottom:44px", btn("COTIZA EN VEZMONEY.COM", { bg: AZ2, size: 28 }))}`, "#B7CDFF"); },
};

export const html = (pieza) => { const f = PLANTILLAS[pieza.plantilla]; if (!f) throw new Error("plantilla desconocida: " + pieza.plantilla); return f(pieza); };

// capas para el reel: a) logo + gancho + crédito (todo el video) y b) remate + botón (últimos 3 s). Zona segura: nada pegado al borde inferior (interfaz de IG/TikTok).
const capa = (inner) => `<!doctype html><html><head><meta charset="UTF-8"><link rel="stylesheet" href="kit.css"><style>html,body{background:transparent!important;margin:0}</style></head><body><div style="position:relative;width:1080px;height:1920px;overflow:hidden">${inner}</div></body></html>`;
// Estilos de reel (plantillas de marca). vy/vh = dónde va el video dentro del cuadro 1080×1920; fondo = color detrás.
export const ESTILOS_REEL = {
  clasico: { vy: 0, vh: 1920, fondo: "black" },   // video a pantalla completa; gancho arriba, remate al final
  marco: { vy: 300, vh: 1100, fondo: "0x03258C" }, // video dentro de un marco azul de marca con encabezado y pie
  meme: { vy: 0, vh: 1920, fondo: "black" },      // texto de meme (blanco con borde negro) arriba y abajo
  noticia: { vy: 0, vh: 1920, fondo: "black" },   // barra tipo noticiero con etiqueta «EN TENDENCIA»
};
export const AUDIOS_REEL = ["original", "musica", "silencio"];
export const MUSICAS_REEL = ["gancho_urbano", "latino_alegre", "positivo", "emotivo", "humor"];

export function overlaysReel(p) {
  const autor = String(p.video.autor).replace(/^@/, ""), est = p.estilo || "clasico";
  const cred = "Video de @" + esc(autor) + " en " + esc(p.video.plataforma || "TikTok");
  const chip = (top) => A(`left:50px;top:${top}px;background:rgba(0,0,0,.6);color:#fff;font-family:${I};font-weight:700;font-size:30px;padding:12px 24px;border-radius:999px`, cred);
  const lgo = (top, h = 50) => logo("reversa_horizontal", h, `left:50px;top:${top}px`);
  const remateCard = (top, max = 58) => A(`left:50px;right:50px;top:${top}px;background:#fff;border-radius:34px;padding:30px 38px;box-shadow:0 20px 50px rgba(0,0,40,.45)`, `<div style="font-family:${I};font-weight:900;color:${AZ2};letter-spacing:-.02em;line-height:1.1;font-size:${tam(p.remate, 900, 130, { ratio: 0.55, lh: 1.1, max, min: 34 })}px">${esc(p.remate)}</div>`);
  const meme = (txt, top, h) => A(`left:50px;right:50px;top:${top}px;text-align:center;font-family:${D};text-transform:uppercase;color:#fff;line-height:1.05;font-size:${tam(txt, 980, h, { ratio: 0.42, lh: 1.05, max: 104, min: 48 })}px;text-shadow:-4px -4px 0 #000,4px -4px 0 #000,-4px 4px 0 #000,4px 4px 0 #000,0 8px 18px rgba(0,0,0,.5)`, esc(txt));

  if (est === "marco") {
    return {
      a: capa(`${lgo(70, 46)}${A(`left:50px;right:50px;top:135px;font-family:${I};font-weight:900;color:#fff;letter-spacing:-.02em;line-height:1.05;font-size:${tam(p.gancho, 980, 150, { ratio: 0.55, lh: 1.05, max: 68, min: 40 })}px`, esc(p.gancho))}
        ${A("left:0;top:300px;width:1080px;height:1100px;box-sizing:border-box;border:12px solid #fff")}
        ${A(`left:50px;right:50px;top:1425px;background:#fff;border-radius:30px;padding:22px 34px`, `<div style="font-family:${I};font-weight:900;color:${AZ2};letter-spacing:-.02em;line-height:1.1;font-size:${tam(p.remate, 900, 100, { ratio: 0.55, lh: 1.1, max: 50, min: 32 })}px">${esc(p.remate)}</div><div style="font-family:${I};font-weight:800;color:${ROS};font-size:28px;letter-spacing:.12em;margin-top:6px">VEZMONEY.COM</div>`)}
        ${chip(1640)}`),
      b: capa(""),
    };
  }
  if (est === "meme") {
    return {
      a: capa(`${lgo(60, 40)}${meme(p.gancho, 120, 300)}${chip(1330)}`),
      b: capa(`${meme(p.remate, 1130, 280)}${A("left:50px;top:1440px", btn("COTIZA EN VEZMONEY.COM", { bg: AZ2, size: 30 }))}`),
    };
  }
  if (est === "noticia") {
    return {
      a: capa(`${lgo(80)}${A(`left:50px;top:980px;background:${ROS};color:#fff;font-family:${I};font-weight:900;font-size:32px;letter-spacing:.16em;padding:12px 26px;border-radius:12px`, "EN TENDENCIA")}
        ${A(`left:50px;right:50px;top:1045px;background:#fff;border-radius:0 24px 24px 0;border-left:16px solid ${AZ2};padding:26px 34px;box-shadow:0 16px 40px rgba(0,0,40,.4)`, `<div style="font-family:${I};font-weight:900;color:${AZ};letter-spacing:-.02em;line-height:1.08;font-size:${tam(p.gancho, 880, 200, { ratio: 0.55, lh: 1.08, max: 62, min: 36 })}px">${esc(p.gancho)}</div>`)}
        ${chip(1320)}`),
      b: capa(`${A(`left:0;right:0;top:1390px;height:190px;background:${AZ}`, `<div style="padding:26px 50px"><div style="font-family:${I};font-weight:900;color:#fff;letter-spacing:-.02em;line-height:1.1;font-size:${tam(p.remate, 980, 100, { ratio: 0.55, lh: 1.1, max: 54, min: 32 })}px">${esc(p.remate)}</div><div style="font-family:${I};font-weight:800;color:${CIE};font-size:28px;letter-spacing:.12em;margin-top:6px">VEZMONEY.COM</div></div>`)}`),
    };
  }
  // clasico
  return {
    a: capa(`${A("left:0;right:0;top:0;height:620px;background:linear-gradient(180deg,rgba(0,10,50,.7),transparent)")}${lgo(90)}
      ${A(`left:50px;right:50px;top:180px;font-family:${I};font-weight:900;color:#fff;letter-spacing:-.02em;line-height:1.06;font-size:${tam(p.gancho, 980, 330, { ratio: 0.55, lh: 1.06, max: 92, min: 44 })}px;text-shadow:0 4px 18px rgba(0,0,0,.6)`, esc(p.gancho))}
      ${chip(1430)}`),
    b: capa(`${A("left:0;right:0;top:1050px;height:870px;background:linear-gradient(180deg,transparent,rgba(0,16,80,.88))")}${remateCard(1230)}${A("left:50px;top:1440px", btn("COTIZA EN VEZMONEY.COM", { bg: AZ2, size: 32 }))}`),
  };
}
