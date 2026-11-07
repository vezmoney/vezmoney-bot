// enviar.mjs — manda a Telegram (vía el Worker) las piezas que dejó disenar.mjs, para la 2.ª aprobación.
// Se ejecuta DESPUÉS de subir las imágenes a GitHub (Telegram y Metricool leen la imagen desde raw.githubusercontent.com).
//   node src/tendencias/enviar.mjs [--nota="Hice: …"]
import fs from "node:fs";

const args = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, ...v] = a.replace(/^--/, "").split("="); return [k, v.length ? v.join("=") : true]; }));
const cfg = JSON.parse(fs.readFileSync("tendencias/config.json", "utf8"));
const manifiesto = JSON.parse(fs.readFileSync("out/tendencias/_manifiesto.json", "utf8"));
const { WORKER_URL, ADMIN_KEY, GITHUB_REPOSITORY = cfg.repo, GITHUB_REF_NAME = "main" } = process.env;
if (!WORKER_URL || !ADMIN_KEY) { console.log("Faltan WORKER_URL / ADMIN_KEY: modo prueba, no envío nada."); process.exit(0); }

const raw = (f) => `https://raw.githubusercontent.com/${GITHUB_REPOSITORY}/${GITHUB_REF_NAME}/${f}`;
async function esperar(url) { for (let i = 0; i < 20; i++) { const r = await fetch(url, { method: "HEAD" }); if (r.ok) return true; await new Promise((ok) => setTimeout(ok, 3000)); } return false; }

const W = WORKER_URL.replace(/\/$/, "");
const subir = async (f, tipo, key) => { const r = await fetch(`${W}/admin/media?key=${key}`, { method: "POST", headers: { "X-Admin-Key": ADMIN_KEY, "content-type": tipo }, body: fs.readFileSync(f) }); const j = await r.json(); if (!j.url) throw new Error("No pude subir " + f + ": " + JSON.stringify(j)); return j.url; };
for (const m of manifiesto) {
  if (m.video) { // reel: el video vive en el Worker (Telegram y Metricool lo leen por URL)
    const key = `${m.id}_${Date.now().toString(36)}`, vUrl = await subir(m.video, "video/mp4", key + ".mp4"), tUrl = await subir(m.miniatura, "image/jpeg", key + ".jpg"), redes = cfg.redes.reel, text = `${m.caption}\n\n${m.hashtags.join(" ")}`;
    const metricool = { text, firstCommentText: "", providers: redes.map((network) => ({ network })), media: [vUrl], mediaAltText: [], videoThumbnailUrl: tUrl, autoPublish: true, draft: false, shortener: false, saveExternalMediaFiles: false,
      ...(redes.includes("instagram") && { instagramData: { type: "REEL", autoPublish: true, showReelOnFeed: true, isAiGenerated: false } }),
      ...(redes.includes("facebook") && { facebookData: { type: "REEL", title: m.titulo.slice(0, 90) } }),
      ...(redes.includes("tiktok") && { tiktokData: { privacyOption: "PUBLIC_TO_EVERYONE", title: m.titulo.slice(0, 90), autoAddMusic: false } }) };
    const r = await fetch(W + "/admin/pieza", { method: "POST", headers: { "X-Admin-Key": ADMIN_KEY, "content-type": "application/json" }, body: JSON.stringify({ id: m.id, ideaId: m.idea, letra: m.letra, titulo: m.titulo, imagen: tUrl, video: vUrl, miniatura: tUrl, caption: text, redes, metricool, nota: args.nota || undefined }) });
    console.log("Telegram", m.id, "(reel)", r.status, r.ok ? "" : await r.text()); if (!r.ok) process.exitCode = 1; continue;
  }
  const url = raw(m.archivo), redes = cfg.redes[m.letra];
  if (!(await esperar(url))) throw new Error("La imagen no está disponible en GitHub: " + url);
  const text = `${m.caption}\n\n${m.hashtags.join(" ")}`;
  const metricool = { text, firstCommentText: "", providers: redes.map((network) => ({ network })), media: [url], mediaAltText: [], autoPublish: true, draft: false, shortener: false, saveExternalMediaFiles: false,
    ...(redes.includes("instagram") && { instagramData: { type: "POST", autoPublish: true, showReelOnFeed: true, isAiGenerated: false } }),
    ...(redes.includes("facebook") && { facebookData: { type: "POST" } }),
    ...(redes.includes("tiktok") && { tiktokData: { privacyOption: "PUBLIC_TO_EVERYONE", title: m.titulo.slice(0, 90), photoCoverIndex: 0 } }) };
  const r = await fetch(WORKER_URL.replace(/\/$/, "") + "/admin/pieza", { method: "POST", headers: { "X-Admin-Key": ADMIN_KEY, "content-type": "application/json" },
    body: JSON.stringify({ id: m.id, ideaId: m.idea, letra: m.letra, titulo: m.titulo, imagen: url, caption: text, redes, metricool, nota: args.nota || undefined }) });
  console.log("Telegram", m.id, r.status, r.ok ? "" : await r.text());
  if (!r.ok) process.exitCode = 1;
}
