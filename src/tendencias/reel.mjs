// reel.mjs — arma el reel: baja el video real de TikTok, lo recorta a 9:16, le superpone el gancho, el crédito al autor y el remate de VezMoney.
//   crearReel(pieza, id, { token })  →  { archivo (mp4), miniatura (jpg) }
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { renderPng, closeBrowser } from "../render.mjs";
import { overlaysReel } from "./disenos.mjs";
import { descargarVideo } from "./fuentes-video.mjs";

const run = (cmd, args) => { const r = spawnSync(cmd, args, { encoding: "utf8", maxBuffer: 50 * 1024 * 1024 }); if (r.status) throw new Error(`${cmd} falló: ${(r.stderr || "").split("\n").slice(-6).join(" | ")}`); return r.stdout.trim(); };

export async function crearReel(pieza, id, { token, local } = {}) {
  const dir = "out/tendencias/tmp"; fs.mkdirSync(dir, { recursive: true });
  const src = local ?? path.join(dir, `${id}_fuente.mp4`);
  if (!local) fs.writeFileSync(src, (await descargarVideo(pieza.video.url, token)).buffer);
  const total = Number(run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", src]));
  const inicio = Math.max(0, Number(pieza.inicio || 0)), dur = Math.max(3, Math.min(Number(pieza.duracion), total - inicio));
  const { a, b } = overlaysReel(pieza), pa = path.join(dir, `${id}_a.png`), pb = path.join(dir, `${id}_b.png`);
  await renderPng(a, { width: 1080, height: 1920, out: pa });
  await renderPng(b, { width: 1080, height: 1920, out: pb });
  const version = Date.now().toString(36), archivo = path.join(dir, `${id}_${version}.mp4`), miniatura = path.join(dir, `${id}_${version}.jpg`);
  const t3 = Math.max(0, dur - 3).toFixed(2);
  const args = ["-y", "-ss", String(inicio), "-t", String(dur), "-i", src, "-loop", "1", "-t", String(dur), "-i", pa, "-loop", "1", "-t", String(dur), "-i", pb,
    "-filter_complex", `[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1,fps=30[v];[v][1:v]overlay=0:0[x];[x][2:v]overlay=0:0:enable='gte(t,${t3})'[out]`,
    "-map", "[out]", ...(pieza.audio === "silencio" ? ["-an"] : ["-map", "0:a?", "-c:a", "aac", "-b:a", "128k"]),
    "-c:v", "libx264", "-preset", "veryfast", "-crf", "24", "-maxrate", "4M", "-bufsize", "8M", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-t", String(dur), archivo];
  run("ffmpeg", args);
  run("ffmpeg", ["-y", "-ss", String(Math.min(1, dur / 2)), "-i", archivo, "-frames:v", "1", "-q:v", "3", miniatura]);
  fs.rmSync(pa, { force: true }); fs.rmSync(pb, { force: true });
  return { archivo, miniatura, segundos: dur, mb: +(fs.statSync(archivo).size / 1048576).toFixed(1) };
}
export { closeBrowser };
