// animado.mjs — crea un video propio (cuando no hay un video real parecido): clips reales de stock (Pexels / Pixabay, uso comercial
// sin atribución) + textos grandes que entran con movimiento + cierre de marca + música propia con licencia. Sin fondos de «diseño»:
// lo que se ve es imagen real; el texto va encima, como lo harían a mano en una edición.
//   crearAnimado(pieza, id)  →  { archivo (mp4), miniatura (jpg), segundos, mb, clips: ["pexels:123", …] }
// Claves: PEXELS_API_KEY y/o PIXABAY_API_KEY en el entorno (en GitHub, como secretos del repo).
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { renderPng, closeBrowser } from "../render.mjs";
import { overlaysAnimado } from "./disenos.mjs";

const run = (cmd, args) => { const r = spawnSync(cmd, args, { encoding: "utf8", maxBuffer: 50 * 1024 * 1024 }); if (r.status) throw new Error(`${cmd} falló: ${(r.stderr || "").split("\n").slice(-8).join(" | ")}`); return r.stdout.trim(); };
const pista = (cat, id) => { const n = 1 + ([...id].reduce((a, c) => a + c.charCodeAt(0), 0) % 2), f = `assets/musica/${cat}_${n}.mp3`; return fs.existsSync(f) ? f : null; };
const { PEXELS_API_KEY, PIXABAY_API_KEY } = process.env;

async function json(url, headers) { const r = await fetch(url, { headers }); if (!r.ok) throw new Error(`${new URL(url).hostname} respondió ${r.status}`); return r.json(); }

// Busca un clip vertical que sirva de fondo (mínimo 5 s). Devuelve { id, url, autor }.
async function buscarClip(q, usados) {
  const errores = [];
  if (PEXELS_API_KEY) {
    try {
      const d = await json(`https://api.pexels.com/videos/search?query=${encodeURIComponent(q)}&per_page=20&orientation=portrait&size=medium`, { Authorization: PEXELS_API_KEY });
      for (const v of d.videos || []) {
        if (v.duration < 5 || usados.has("pexels:" + v.id)) continue;
        const fs_ = (v.video_files || []).filter((f) => f.file_type === "video/mp4" && f.height >= f.width && f.width >= 720).sort((a, b) => Math.abs(a.width - 1080) - Math.abs(b.width - 1080));
        if (fs_[0]) return { id: "pexels:" + v.id, url: fs_[0].link, autor: v.user?.name };
      }
    } catch (e) { errores.push(String(e.message)); }
  }
  if (PIXABAY_API_KEY) {
    try {
      const d = await json(`https://pixabay.com/api/videos/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(q.slice(0, 100))}&per_page=20&safesearch=true`);
      for (const v of d.hits || []) {
        if (v.duration < 5 || usados.has("pixabay:" + v.id)) continue;
        const f = ["large", "medium"].map((s) => v.videos?.[s]).find((x) => x?.url && x.height >= x.width);
        if (f) return { id: "pixabay:" + v.id, url: f.url, autor: v.user };
      }
    } catch (e) { errores.push(String(e.message)); }
  }
  if (!PEXELS_API_KEY && !PIXABAY_API_KEY) throw new Error("Faltan PEXELS_API_KEY / PIXABAY_API_KEY para buscar clips de stock");
  throw new Error(`No encontré un clip vertical para «${q}»${errores.length ? " (" + errores.join("; ") + ")" : ""}`);
}

export async function crearAnimado(pieza, id) {
  const dir = "out/tendencias/tmp"; fs.mkdirSync(dir, { recursive: true });
  const D = Number(pieza.duracion), FIN = 2.8, N = pieza.escenas.length, L = (D - FIN) / N;
  // 1) clips de fondo: uno por consulta; si hay menos clips que escenas, se reutilizan desde otro punto
  const usados = new Set(), clips = [];
  for (const [i, q] of pieza.busqueda.entries()) {
    const c = await buscarClip(q, usados); usados.add(c.id);
    const f = path.join(dir, `${id}_clip${i}.mp4`); const r = await fetch(c.url); if (!r.ok) throw new Error("No pude bajar el clip " + c.id);
    fs.writeFileSync(f, Buffer.from(await r.arrayBuffer()));
    clips.push({ ...c, file: f, dur: Number(run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f])) });
  }
  // 2) capas de texto
  const ov = overlaysAnimado(pieza), pngs = [];
  const guardar = async (html, nombre) => { const p = path.join(dir, `${id}_${nombre}.png`); await renderPng(html, { width: 1080, height: 1920, out: p }); pngs.push(p); return p; };
  const base = await guardar(ov.base, "base"), fin = await guardar(ov.fin, "fin"), esc = [];
  for (const [i, h] of ov.escenas.entries()) esc.push(await guardar(h, "e" + i));

  // 3) ffmpeg: N segmentos de fondo (con deriva lenta de cámara y un poco de grano), capas con entrada deslizada, cierre y música
  const entradas = [], seg = [];
  for (let k = 0; k < N; k++) {
    const c = clips[k % clips.length], vuelta = Math.floor(k / clips.length), largoSeg = L + (k === N - 1 ? FIN : 0);
    const ini = Math.max(0, Math.min(c.dur - largoSeg - 0.1, vuelta * (L + 0.5))); // reutilizar el clip desde otro punto
    entradas.push("-stream_loop", "-1", "-ss", ini.toFixed(2), "-t", largoSeg.toFixed(2), "-i", c.file);
    const sentido = k % 2 ? "(40-40*t/" + largoSeg.toFixed(2) + ")" : "(40*t/" + largoSeg.toFixed(2) + ")";
    seg.push(`[${k}:v]scale=1188:2112:force_original_aspect_ratio=increase,crop=1188:2112,crop=1080:1920:x='54-20+${sentido}':y=96,setsar=1,fps=30,eq=saturation=1.06:contrast=1.04[s${k}]`);
  }
  const idx = (n) => N + n; // índices de las entradas de imagen (después de los clips)
  const imgs = [base, ...esc, fin];
  for (const p of imgs) entradas.push("-loop", "1", "-t", String(D), "-i", p);
  let musica = pieza.musica ? pista(pieza.musica, id) : pista("positivo", id);
  if (musica) entradas.push("-stream_loop", "-1", "-i", musica);

  let fc = seg.join(";") + ";" + seg.map((_, k) => `[s${k}]`).join("") + `concat=n=${N}:v=1:a=0,noise=alls=6:allf=t[bg];[bg][${idx(0)}:v]overlay=0:0[v0]`;
  let prev = "v0";
  for (let k = 0; k < N; k++) {
    const a = k * L + 0.15, b = (k + 1) * L - 0.1; // cada escena entra con un deslizamiento hacia arriba y sale con fundido
    fc += `;[${idx(1 + k)}:v]format=rgba,fade=t=in:st=${a.toFixed(2)}:d=0.35:alpha=1,fade=t=out:st=${(b - 0.3).toFixed(2)}:d=0.3:alpha=1[t${k}]`;
    fc += `;[${prev}][t${k}]overlay=x=0:y='if(lt(t-${a.toFixed(2)},0.45),90*pow(1-(t-${a.toFixed(2)})/0.45,3),0)':shortest=1[v${k + 1}]`;
    prev = `v${k + 1}`;
  }
  const tf = N * L; // el cierre de marca aparece sobre el último clip
  fc += `;[${idx(1 + N)}:v]format=rgba,fade=t=in:st=${tf.toFixed(2)}:d=0.45:alpha=1[tf];[${prev}][tf]overlay=0:0:shortest=1,format=yuv420p[out]`;
  let audio = ["-an"];
  if (musica) { fc += `;[${idx(2 + N)}:a]atrim=0:${D},volume=0.85,afade=t=in:d=0.4,afade=t=out:st=${(D - 1.2).toFixed(2)}:d=1.2[aud]`; audio = ["-map", "[aud]", "-c:a", "aac", "-b:a", "128k"]; }

  const version = Date.now().toString(36), archivo = path.join(dir, `${id}_${version}.mp4`), miniatura = path.join(dir, `${id}_${version}.jpg`);
  run("ffmpeg", ["-y", ...entradas, "-filter_complex", fc, "-map", "[out]", ...audio, "-c:v", "libx264", "-preset", "veryfast", "-crf", "23", "-maxrate", "5M", "-bufsize", "10M", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-t", String(D), archivo]);
  run("ffmpeg", ["-y", "-ss", (L * 0.7).toFixed(2), "-i", archivo, "-frames:v", "1", "-q:v", "3", miniatura]);
  for (const p of [...pngs, ...clips.map((c) => c.file)]) fs.rmSync(p, { force: true });
  return { archivo, miniatura, segundos: D, mb: +(fs.statSync(archivo).size / 1048576).toFixed(1), clips: clips.map((c) => c.id), musica: musica ? path.basename(musica) : null };
}
export { closeBrowser };
