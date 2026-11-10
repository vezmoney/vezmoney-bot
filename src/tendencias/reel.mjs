// reel.mjs — arma el reel: baja el video real, lo coloca según el estilo de marca (clasico, marco, meme, noticia),
// le superpone gancho, crédito al autor y remate de VezMoney, y resuelve el audio (original, música propia o silencio).
//   crearReel(pieza, id, { token })  →  { archivo (mp4), miniatura (jpg), segundos, mb }
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { renderPng, closeBrowser } from "../render.mjs";
import { overlaysReel, ESTILOS_REEL } from "./disenos.mjs";
import { descargarVideo } from "./fuentes-video.mjs";

const run = (cmd, args) => { const r = spawnSync(cmd, args, { encoding: "utf8", maxBuffer: 50 * 1024 * 1024 }); if (r.status) throw new Error(`${cmd} falló: ${(r.stderr || "").split("\n").slice(-6).join(" | ")}`); return r.stdout.trim(); };
const tiene = (f) => run("ffprobe", ["-v", "error", "-select_streams", "a", "-show_entries", "stream=codec_type", "-of", "csv=p=0", f]).includes("audio");
const pista = (cat, id) => { const n = 1 + ([...id].reduce((a, c) => a + c.charCodeAt(0), 0) % 2), f = `assets/musica/${cat}_${n}.mp3`; return fs.existsSync(f) ? f : null; };

export async function crearReel(pieza, id, { token, local } = {}) {
  const dir = "out/tendencias/tmp"; fs.mkdirSync(dir, { recursive: true });
  const src = local ?? path.join(dir, `${id}_fuente.mp4`);
  if (!local) fs.writeFileSync(src, (await descargarVideo(pieza.video.url, token)).buffer);
  const total = Number(run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", src]));
  const inicio = Math.max(0, Number(pieza.inicio || 0)), dur = Math.max(3, Math.min(Number(pieza.duracion), total - inicio));
  const est = ESTILOS_REEL[pieza.estilo || "clasico"] ?? ESTILOS_REEL.clasico;
  const { a, b } = overlaysReel(pieza), pa = path.join(dir, `${id}_a.png`), pb = path.join(dir, `${id}_b.png`);
  await renderPng(a, { width: 1080, height: 1920, out: pa });
  await renderPng(b, { width: 1080, height: 1920, out: pb });
  const version = Date.now().toString(36), archivo = path.join(dir, `${id}_${version}.mp4`), miniatura = path.join(dir, `${id}_${version}.jpg`);
  const t3 = Math.max(0, dur - 3).toFixed(2), d = String(dur);

  // audio: original (voz/ambiente del creador), musica (pista propia de VezMoney, con licencia) o silencio
  let modo = pieza.audio || "original", musica = null;
  if (modo === "musica") { musica = pista(pieza.musica || "positivo", id); if (!musica) modo = "silencio"; }
  if (modo === "original" && !tiene(src)) modo = "silencio";
  const entradas = ["-ss", String(inicio), "-t", d, "-i", src, "-loop", "1", "-t", d, "-i", pa, "-loop", "1", "-t", d, "-i", pb, ...(musica ? ["-stream_loop", "-1", "-i", musica] : [])];
  // con el estilo «arriba» se recortan las barras negras del video original para que se vea lo más grande posible
  let recorte = "";
  if (est.ajuste === "caber") {
    const r = spawnSync("ffmpeg", ["-ss", String(inicio), "-t", "5", "-i", src, "-vf", "cropdetect=limit=24:round=2:reset=0", "-f", "null", "-"], { encoding: "utf8" });
    const m = [...(r.stderr || "").matchAll(/crop=(\d+):(\d+):(\d+):(\d+)/g)].pop();
    if (m && +m[1] >= 200 && +m[2] >= 200) recorte = "crop=" + m[1] + ":" + m[2] + ":" + m[3] + ":" + m[4] + ",";
  }
  let fc = `${est.ajuste === "caber" ? `[0:v]${recorte}split=2[s1][s2];[s1]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=40:8,eq=brightness=-0.3:saturation=0.8,setsar=1,fps=30[bg];[s2]scale=1080:${est.vh}:force_original_aspect_ratio=decrease,setsar=1,fps=30[v];[bg][v]overlay=(W-w)/2:${est.vy}+(${est.vh}-h)/2:shortest=1[base]` : `[0:v]scale=1080:${est.vh}:force_original_aspect_ratio=increase,crop=1080:${est.vh},setsar=1,fps=30[v];color=c=${est.fondo}:s=1080x1920:r=30[bg];[bg][v]overlay=0:${est.vy}:shortest=1[base]`};[base][1:v]overlay=0:0[x];[x][2:v]overlay=0:0:enable='gte(t,${t3})'[out]`;
  let audio = ["-an"];
  if (modo === "original") audio = ["-map", "0:a", "-c:a", "aac", "-b:a", "128k"];
  if (modo === "musica") { fc += `;[3:a]atrim=0:${d},volume=0.9,afade=t=out:st=${Math.max(0, dur - 1.2).toFixed(2)}:d=1.2[aud]`; audio = ["-map", "[aud]", "-c:a", "aac", "-b:a", "128k"]; }
  run("ffmpeg", ["-y", ...entradas, "-filter_complex", fc, "-map", "[out]", ...audio, "-c:v", "libx264", "-preset", "veryfast", "-crf", "24", "-maxrate", "4M", "-bufsize", "8M", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-t", d, archivo]);
  run("ffmpeg", ["-y", "-ss", String(Math.min(1, dur / 2)), "-i", archivo, "-frames:v", "1", "-q:v", "3", miniatura]);
  fs.rmSync(pa, { force: true }); fs.rmSync(pb, { force: true });
  return { archivo, miniatura, segundos: dur, mb: +(fs.statSync(archivo).size / 1048576).toFixed(1), estilo: pieza.estilo || "clasico", audio: modo };
}
export { closeBrowser };
