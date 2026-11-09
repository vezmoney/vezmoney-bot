// tutorial.mjs — video «tutorial dinámico» de VezMoney (modelo del reel de Giros del Sur): foto real de fondo, un teléfono con capturas REALES del
// cotizador de vezmoney.com, toques, pasos que aparecen uno a uno, cierre con botón, música propia y efectos de sonido.
//   tipo "cotizar": cómo cotizar Chile → <destino> (captura el cotizador en vivo y lo muestra funcionando).
//   tipo "pasos":   lista de pasos o consejos con texto propio sobre una foto, sin teléfono.
// El movimiento se hace con la API de animaciones de la página (todo pausado y avanzado cuadro a cuadro) → JPG por cuadro → ffmpeg.
//   crearTutorial(pieza, id)  →  { archivo (mp4), miniatura (jpg), segundos, mb, tasa }
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { capturarCotizador, DESTINOS, CLIP } from "./tutorial-captura.mjs";
import { flag } from "../common.mjs";

const run = (cmd, args) => { const r = spawnSync(cmd, args, { encoding: "utf8", maxBuffer: 50 * 1024 * 1024 }); if (r.status) throw new Error(`${cmd} falló: ${(r.stderr || "").split("\n").slice(-8).join(" | ")}`); return r.stdout.trim(); };
const EMOJI = /[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\u{FE0F}\u{200D}]/gu;
const esc = (t) => String(t ?? "").replace(EMOJI, "").replace(/\s+/g, " ").trim().replace(/&/g, "&amp;").replace(/</g, "&lt;");
const pista = (cat, id) => { const n = 1 + ([...id].reduce((a, c) => a + c.charCodeAt(0), 0) % 2), f = `assets/musica/${cat}_${n}.mp3`; return fs.existsSync(f) ? f : null; };
const FPS = 30;
export const PASOS_REALES = ["Crea tu cuenta y verifica el código en tu correo", "Elige el país y agrega los datos de quien recibe", "Transfiere a nuestra cuenta bancaria y adjunta el comprobante"];
const NOMBRE_PAIS = { "Perú": "Perú", "Colombia": "Colombia", "Venezuela": "Venezuela", "Argentina": "Argentina", "Ecuador": "Ecuador", "Estados Unidos": "Estados Unidos" };

// ── guion de la animación ────────────────────────────────────────────────────
// Devuelve { html, duracion, sfx: [[archivo, t, volumen]], miniaturaT }
function guion(p, cap, dirRel) {
  const AZ = "#001C70", AZ2 = "#03258C", ROS = "#F20775", AMA = "#FFE27A";
  const esCot = p.tipo === "cotizar", pais = esCot ? NOMBRE_PAIS[p.destino] : null;
  const foto = esCot ? DESTINOS[p.destino].foto : (p.fondo || "pe02.jpg");
  const pasos = (p.pasos?.length ? p.pasos : PASOS_REALES).slice(0, 4);
  const anims = [], sfx = [];
  // helpers del guion (se ejecutan en la página): show(sel, t0, t1, {from, in, out})
  const show = (sel, t0, t1, o = {}) => anims.push({ sel, t0, t1, ...o });
  const k = 640 / CLIP.w;
  let T = 0, body = "", fin;

  const pill = (id, txt) => `<div id="${id}" class="pill">${esc(txt)}</div>`;
  const ripple = (id, x, y) => `<div id="${id}" class="rip" style="left:${x - 60}px;top:${y - 60}px"></div>`;
  const ctaHTML = (titulo, sub, boton, nota) => `<div id="cta" class="blk" style="top:640px">
      <div class="h1" style="font-size:96px">${esc(titulo)}</div>
      <div class="url">vezmoney.com</div>
      <div class="btn">${esc(boton)}</div>
      <div class="handle">@vezmoneyoficial</div>
      ${nota ? `<div class="nota">${esc(nota)}</div>` : ""}</div>`;

  if (esCot) {
    // teléfono: pantalla 640×(568*k). Las capturas ya vienen recortadas al cotizador.
    const alto = Math.round(CLIP.h * k), px = 220, py = 470; // pantalla dentro del teléfono
    const frames = [cap.frames.inicio, cap.frames.lista, cap.frames.destino, ...cap.frames.monto, cap.frames.final];
    const imgs = frames.map((f, i) => `<img id="f${i}" src="${dirRel}/${path.basename(f)}" class="fr" style="width:640px;height:${alto}px">`).join("");
    const pos = (b, fx = 0.5, fy = 0.5) => [Math.round(b.x * k + b.w * k * fx), Math.round(b.y * k + b.h * k * fy)];
    const tSel = pos(cap.pos.selector), tOp = pos(cap.pos.opcion, 0.4), rec = cap.pos.recibe;
    // tiempos
    const tPhone = 2.5, tTap1 = 4.0, tTap2 = 5.1, tType = 6.2, dig = cap.frames.monto.length, tFinal = tType + dig * 0.3 + 0.5, tFinEnd = tFinal + 2.6, tPasos = tFinEnd + 0.3, tCTA = tPasos + 4.6;
    T = tCTA + 4.2;
    body += `<div id="intro" class="blk" style="top:560px"><div class="ruta">${bandera("CL")}<span class="flecha">→</span>${bandera(DESTINOS[p.destino].flag)}</div><div class="h1">${esc(p.titulo)}</div><div class="sub">Envía desde Chile</div></div>`;
    body += `<div id="tel" class="tel" style="left:${px - 20}px;top:${py - 20}px;width:680px;height:${alto + 40}px"><div class="pant" style="width:640px;height:${alto}px">${imgs}${ripple("r1", tSel[0], tSel[1])}${ripple("r2", tOp[0], tOp[1])}
      <div id="halo" class="halo" style="left:${Math.round(rec.x * k - 8)}px;top:${Math.round(rec.y * k - 8)}px;width:${Math.round(rec.w * k + 16)}px;height:${Math.round(rec.h * k + 16)}px"></div></div></div>`;
    body += pill("p1", `1 · Elige ${pais}`) + pill("p2", "2 · Escribe cuánto envías") + pill("p3", "3 · Mira cuánto recibe");
    body += `<div id="pasos" class="blk" style="top:420px"><div class="h1" style="font-size:84px">Solo 3 pasos</div>${PASOS_REALES.map((s, i) => `<div class="card" id="c${i}"><span class="num">${i + 1}</span><span class="ct">${esc(s.replace("el país", pais))}</span></div>`).join("")}</div>`;
    body += ctaHTML(p.remate, "", `ENVÍA A ${pais.toUpperCase()}`, p.nota || "Capturas del cotizador real. La tasa se actualiza en tiempo real: la vigente es la que ves en vezmoney.com");
    // animaciones
    show("#intro", 0.2, tPhone - 0.1, { from: "translateY(50px)", in: 0.5, out: 0.35 });
    show("#tel", tPhone, tFinEnd, { from: "translateY(420px)", in: 0.7, out: 0.5, to: "translateY(500px)" });
    frames.forEach((_, i) => { const t0 = i === 0 ? tPhone : i === 1 ? tTap1 + 0.2 : i === 2 ? tTap2 + 0.2 : i < 3 + dig ? tType + (i - 3) * 0.3 : tFinal; const t1 = i < frames.length - 1 ? (i === 0 ? tTap1 + 0.2 : i === 1 ? tTap2 + 0.2 : i === 2 ? tType : t0 + 0.3) : tFinEnd; show(`#f${i}`, t0, t1, { in: 0.001, out: 0.001, hold: true }); });
    show("#r1", tTap1, tTap1 + 0.6, { pulse: true }); show("#r2", tTap2, tTap2 + 0.6, { pulse: true });
    show("#halo", tFinal, tFinEnd - 0.2, { in: 0.3, out: 0.3, glow: true });
    show("#p1", tPhone + 0.4, tType - 0.5, { from: "translateY(-30px)", in: 0.4, out: 0.3 });
    show("#p2", tType - 0.3, tFinal + 0.1, { from: "translateY(-30px)", in: 0.4, out: 0.3 });
    show("#p3", tFinal, tFinEnd - 0.1, { from: "translateY(-30px)", in: 0.4, out: 0.3 });
    show("#pasos", tPasos, tCTA - 0.2, { from: "translateY(40px)", in: 0.4, out: 0.4 });
    PASOS_REALES.forEach((_, i) => { show(`#c${i}`, tPasos + 0.7 + i * 0.8, tCTA - 0.2, { from: "translateX(-120px) scale(.96)", in: 0.45, out: 0.4 }); sfx.push(["step", tPasos + 0.75 + i * 0.8, 0.7]); });
    show("#cta", tCTA, T, { from: "translateY(60px) scale(.97)", in: 0.55 });
    sfx.push(["whoosh", tPhone - 0.1, 0.55], ["tap", tTap1, 0.8], ["pop", tTap1 + 0.2, 0.6], ["tap", tTap2, 0.8], ["pop", tTap2 + 0.2, 0.6], ["ding", tFinal, 0.8], ["whoosh", tFinEnd, 0.5], ["pop", tCTA + 0.3, 0.6], ["success", tCTA + 1.2, 0.8]);
    for (let i = 0; i < dig; i++) sfx.push(["tick", tType + i * 0.3, 0.7]);
    fin = { miniaturaT: tFinal + 0.6 };
  } else {
    const n = pasos.length, tIni = 0.2, tPas = 2.7, paso = 1.3, tCTA = tPas + 0.8 + n * paso + 1.2;
    T = tCTA + 3.6;
    body += `<div id="intro" class="blk" style="top:400px"><div class="h1" style="font-size:112px">${esc(p.titulo)}</div></div>`;
    body += `<div id="pasos" class="blk" style="top:810px">${pasos.map((s, i) => `<div class="card" id="c${i}"><span class="num">${i + 1}</span><span class="ct">${esc(s)}</span></div>`).join("")}</div>`;
    body += ctaHTML(p.remate, "", "COTIZA EN VEZMONEY.COM", p.nota || "");
    show("#intro", tIni, tCTA - 0.2, { from: "translateY(50px)", in: 0.6, out: 0.4 });
    show("#pasos", tPas - 0.2, tCTA - 0.2, { from: "translateY(30px)", in: 0.3, out: 0.4 });
    pasos.forEach((_, i) => { show(`#c${i}`, tPas + i * paso, tCTA - 0.2, { from: "translateX(-120px) scale(.96)", in: 0.45, out: 0.4 }); sfx.push(["step", tPas + 0.05 + i * paso, 0.7]); });
    show("#cta", tCTA, T, { from: "translateY(60px) scale(.97)", in: 0.55 });
    sfx.push(["whoosh", 0.2, 0.5], ["pop", tCTA + 0.3, 0.6], ["success", tCTA + 1.2, 0.8]);
    fin = { miniaturaT: tPas + paso * 1.5 };
  }

  const html = `<!doctype html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=1080,height=1920"><link rel="stylesheet" href="kit.css"><style>
  html,body{margin:0;width:1080px;height:1920px;overflow:hidden;background:#001C70}
  #root{position:relative;width:1080px;height:1920px;overflow:hidden;font-family:Inter,sans-serif;color:#fff}
  #bg{position:absolute;inset:-60px;background:url(assets/photos/${foto}) center/cover}
  #sh{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,12,60,.72) 0%,rgba(0,12,60,.6) 45%,rgba(0,12,60,.88) 100%)}
  .blk{position:absolute;left:60px;right:60px;opacity:0}
  .h1{font-weight:900;letter-spacing:-.035em;line-height:1.02;font-size:104px;text-shadow:0 4px 30px rgba(0,0,30,.5)}
  .sub{font-weight:600;font-size:46px;color:#CFE0FF;margin-top:26px}
  .ruta{display:flex;align-items:center;gap:26px;margin-bottom:46px}.flecha{font-size:60px;font-weight:900}
  .tel{position:absolute;opacity:0;background:#0A1230;border-radius:84px;box-shadow:0 40px 90px rgba(0,0,30,.6);padding:20px;box-sizing:border-box}
  .pant{position:relative;border-radius:66px;overflow:hidden;background:#fff}
  .fr{position:absolute;left:0;top:0;opacity:0}
  .rip{position:absolute;width:120px;height:120px;border-radius:50%;border:6px solid ${ROS};background:rgba(242,7,117,.25);opacity:0}
  .halo{position:absolute;border:6px solid ${ROS};border-radius:30px;box-shadow:0 0 0 8px rgba(242,7,117,.25);opacity:0}
  .pill{position:absolute;left:0;right:0;margin:0 auto;top:290px;width:max-content;max-width:940px;background:${ROS};color:#fff;font-weight:900;font-size:50px;padding:20px 44px;border-radius:999px;opacity:0;box-shadow:0 18px 40px rgba(0,0,40,.4);text-align:center}
  .card{display:flex;align-items:center;gap:30px;background:#fff;color:${AZ};border-radius:34px;padding:34px 38px;margin-top:30px;opacity:0;box-shadow:0 20px 50px rgba(0,0,40,.35)}
  .num{flex:none;width:84px;height:84px;border-radius:50%;background:${ROS};color:#fff;font-weight:900;font-size:50px;display:flex;align-items:center;justify-content:center}
  .ct{font-weight:800;font-size:46px;line-height:1.12;letter-spacing:-.02em}
  .url{display:inline-block;margin-top:50px;background:#fff;color:${AZ2};font-weight:900;font-size:74px;padding:26px 56px;border-radius:30px;letter-spacing:-.02em}
  .btn{display:inline-block;margin:36px 0 0 0;background:${ROS};color:#fff;font-weight:900;font-size:44px;padding:24px 52px;border-radius:999px;letter-spacing:.02em}
  .handle{margin-top:34px;font-weight:700;font-size:44px;color:#CFE0FF}
  .nota{margin-top:50px;font-weight:500;font-size:28px;line-height:1.3;color:#B8C8F0;max-width:900px}
  </style></head><body><div id="root"><div id="bg"></div><div id="sh"></div>
  <img src="assets/logos/reversa_horizontal.png" style="position:absolute;left:60px;top:90px;height:46px">
  ${body}</div>
  <script>
  const anims=[];
  const spec=${JSON.stringify(anims)};
  for(const s of spec){ const el=document.querySelector(s.sel); if(!el) continue;
    const d=Math.max(0.05,s.t1-s.t0), a=Math.min(.45,(s.in??.4)/d), b=1-Math.min(.45,(s.out??0)/d), from=s.from||"none", to=s.to||"none";
    let kf;
    if(s.pulse){ kf=[{opacity:0,transform:"scale(.4)"},{opacity:1,transform:"scale(1)",offset:.25},{opacity:0,transform:"scale(1.5)"}]; }
    else if(s.glow){ kf=[{opacity:0,transform:"scale(1.06)"},{opacity:1,transform:"scale(1)",offset:a},{opacity:1,transform:"scale(1.03)",offset:(a+b)/2},{opacity:1,transform:"scale(1)",offset:b},{opacity:0,transform:"scale(1)"}]; }
    else { kf=[{opacity:0,transform:from,offset:0,easing:"cubic-bezier(.16,1,.3,1)"},{opacity:1,transform:"none",offset:a},{opacity:1,transform:"none",offset:b,easing:"ease-in"},{opacity:s.hold?1:0,transform:s.hold?"none":to,offset:1}]; if(s.out===undefined||s.out===0){ kf=[kf[0],kf[1],{opacity:1,transform:"none",offset:1}]; } }
    const an=el.animate(kf,{delay:s.t0*1000,duration:d*1000,fill:"both"}); an.pause(); anims.push(an); }
  document.getAnimations().forEach(x=>x.pause());
  const bg=document.getElementById("bg").animate([{transform:"scale(1)"},{transform:"scale(1.09)"}],{duration:${Math.round(T * 1000)},fill:"both",easing:"linear"}); bg.pause(); anims.push(bg);
  window.seek=(t)=>{ for(const x of anims) x.currentTime=t*1000; };
  </script></body></html>`;
  return { html, duracion: Math.round(T * 10) / 10, sfx, ...fin };
}

const bandera = (code) => flag(code, 120, "#fff");

export async function crearTutorial(pieza, id) {
  const dir = "out/tendencias/tmp"; fs.mkdirSync(dir, { recursive: true });
  const cap = pieza.tipo === "cotizar" ? await capturarCotizador(pieza.destino, `${dir}/${id}_ui`) : null;
  const g = guion(pieza, cap, `${dir}/${id}_ui`);
  fs.writeFileSync("page.html", g.html);
  const frames = `${dir}/${id}_frames`; fs.rmSync(frames, { recursive: true, force: true }); fs.mkdirSync(frames, { recursive: true });
  const b = await chromium.launch();
  try {
    const page = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
    await page.goto(pathToFileURL(path.resolve("page.html")).href, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; })))));
    const total = Math.round(g.duracion * FPS);
    for (let n = 0; n < total; n++) {
      await page.evaluate((t) => window.seek(t), n / FPS);
      await page.screenshot({ path: `${frames}/${String(n).padStart(4, "0")}.jpg`, type: "jpeg", quality: 90 });
    }
  } finally { await b.close(); }
  // audio: música propia a bajo volumen + efectos de sonido en su momento
  const version = Date.now().toString(36), archivo = path.join(dir, `${id}_${version}.mp4`), miniatura = path.join(dir, `${id}_${version}.jpg`);
  const musica = pista(pieza.musica || "positivo", id), D = g.duracion;
  const entradas = ["-framerate", String(FPS), "-i", `${frames}/%04d.jpg`]; let fc = "", mix = [], idx = 1;
  if (musica) { entradas.push("-stream_loop", "-1", "-i", musica); fc += `[${idx}:a]atrim=0:${D},volume=0.32,afade=t=in:d=0.5,afade=t=out:st=${(D - 1.4).toFixed(2)}:d=1.4[m]`; mix.push("[m]"); idx++; }
  for (const [nom, t, vol] of g.sfx) { const f = `assets/sfx/${nom}.wav`; if (!fs.existsSync(f)) continue; entradas.push("-i", f); fc += `${fc ? ";" : ""}[${idx}:a]adelay=${Math.round(t * 1000)}|${Math.round(t * 1000)},volume=${vol}[s${idx}]`; mix.push(`[s${idx}]`); idx++; }
  fc += `${fc ? ";" : ""}${mix.join("")}amix=inputs=${mix.length}:normalize=0:duration=longest,atrim=0:${D},alimiter=limit=0.95[aud]`;
  run("ffmpeg", ["-y", ...entradas, "-filter_complex", fc, "-map", "0:v", "-map", "[aud]", "-c:v", "libx264", "-preset", "veryfast", "-crf", "23", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", "-t", String(D), archivo]);
  run("ffmpeg", ["-y", "-ss", String(g.miniaturaT), "-i", archivo, "-frames:v", "1", "-q:v", "3", miniatura]);
  fs.rmSync(frames, { recursive: true, force: true }); fs.rmSync(`${dir}/${id}_ui`, { recursive: true, force: true });
  return { archivo, miniatura, segundos: D, mb: +(fs.statSync(archivo).size / 1048576).toFixed(1), tasa: cap?.info?.tasa };
}
