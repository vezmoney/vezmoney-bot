// run.mjs — orquestador de VezMoney. Lo ejecuta GitHub Actions varias veces por hora (y tú a mano para probar).
// Flags: --dry (solo genera la imagen)  --check (prueba el token de Metricool: crea un borrador y lo borra)
//        --hour=9 --date=2026-10-07 (forzar hora/fecha de Chile)
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { getSeries, ageMinutes } from "./data.mjs";
import { hoursNote, tipFor, disclaimer } from "./info.mjs";
import { CORRIDORS } from "./common.mjs";
import { FAMILIES, FAMILY_FOR_WEEKDAY, wrapStory } from "./templates.mjs";
import { FEED_PLAN, buildFeed, feedForWeekday, feedCaption } from "./feed.mjs";
import { PHOTOS, FEED_PHOTOS } from "./photos.mjs";
import { renderPage, closeBrowser } from "./render.mjs";
import { createPost, deletePost, whoami } from "./metricool.mjs";

const cfg = JSON.parse(fs.readFileSync("config.json", "utf8"));
const args = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, v] = a.replace(/^--/, "").split("="); return [k, v ?? true]; }));
const DRY = !!args.dry || process.env.DRY_RUN === "true";
const DRAFT = !!args.draft; // prueba completa: genera, sube la imagen y crea BORRADORES en Metricool (que luego borra); no publica nada
const FORCE_HOUR = args.hour ?? (process.env.FORCE_HOUR || undefined);
const FORCE_DATE = args.date ?? (process.env.FORCE_DATE || undefined);
const forced = FORCE_HOUR !== undefined || FORCE_DATE !== undefined;
const TZ = cfg.timezone;

function nowLocal(ms = Date.now()) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" }).formatToParts(new Date(ms));
  const o = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return { y: +o.year, mo: +o.month, d: +o.day, h: +o.hour, mi: +o.minute, s: +o.second, date: `${o.year}-${o.month}-${o.day}`, ms: Date.UTC(+o.year, +o.month - 1, +o.day, +o.hour, +o.minute, +o.second) };
}
const pad = (n) => String(n).padStart(2, "0");
// escribe en el log y también en la pantalla "Summary" de la ejecución en GitHub
const summary = (msg) => { console.log(msg); if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, msg + "\n\n"); };
const stamp = (t) => `${t.date}T${pad(t.h)}:${pad(t.mi)}:${pad(t.s)}`;

let now = nowLocal();
if (FORCE_DATE) { const [y, m, d] = FORCE_DATE.split("-").map(Number); now = { ...now, y, mo: m, d, date: FORCE_DATE, ms: Date.UTC(y, m - 1, d, now.h, now.mi, now.s) }; }
if (FORCE_HOUR !== undefined) now = { ...now, h: Number(FORCE_HOUR), mi: 5 };
const weekday = new Date(Date.UTC(now.y, now.mo - 1, now.d)).getUTCDay(); // 0=domingo … 6=sábado (calculado, no supuesto)
const dayOfYear = Math.floor((Date.UTC(now.y, now.mo - 1, now.d) - Date.UTC(now.y, 0, 0)) / 86400000);

// slots del día (por día de la semana) y su posición entre las historias Chile→Venezuela
const ov = cfg.dayOverrides?.[now.date] ?? {}; // horarios especiales por fecha (cierre temprano, menos historias)
const todaySlots = ov.slots ?? cfg.slots.filter((s) => s.days.includes(weekday));
const slot0 = todaySlots.find((s) => s.hour === now.h);
const slot = slot0 ? { ...slot0, corridor: slot0.corridorByDay?.[weekday] ?? slot0.corridor } : undefined; // corridor del día (la tarde cambia según el día)
const bsIndex = slot ? todaySlots.filter((s) => (s.corridorByDay?.[weekday] ?? s.corridor) === "CLVE").findIndex((s) => s.hour === slot.hour) : -1;

const BS_ORDER = ["s", "g", "t", "q"]; // las 5 historias Chile→Venezuela del día recorren las 4 plantillas de la familia (la 5.ª repite la 1.ª con otra foto)
function pickPhoto(fam, key, code, idx = 0) {
  const pool = key === "corridor" ? PHOTOS[fam].corridor[code] : PHOTOS[fam][key];
  return pool[Math.floor(idx) % pool.length];
}

async function buildContext() {
  const cor = CORRIDORS[slot.corridor];
  const data = await getSeries(cor.from, cor.to);
  const checkFresh = (d, label) => {
    if (forced) return;
    const age = ageMinutes(d.fecha, now.ms);
    if (age > cfg.maxRateAgeMinutes) throw new Error(`La tasa ${label} tiene ${Math.round(age)} min de antigüedad (límite ${cfg.maxRateAgeMinutes}). No publico para no mostrar una tasa vieja.`);
  };
  checkFresh(data, cor.label);
  const fam = FAMILY_FOR_WEEKDAY[weekday];
  const tplKey = slot.corridor === "CLVE" ? BS_ORDER[bsIndex % 4] : "corridor";
  const photo = pickPhoto(fam, tplKey, slot.corridor, slot.corridor === "CLVE" ? bsIndex / 4 : 0);
  const x = { ...data, cor, set: fam, disc: cfg.showDisclaimer === true, second: slot.corridor === "CLVE" && bsIndex >= 4, photo: photo.file, pos: photo.pos, tip: tipFor(dayOfYear, bsIndex < 0 ? 0 : bsIndex), note: hoursNote(weekday, slot.hour, ov.closing), disclaimer: disclaimer(data.hh) };
  let feed = null;
  if (slot.alsoFeed) {
    const fk = feedForWeekday[weekday], plan = FEED_PLAN[fk];
    const fmain = plan.main.key === cor.key ? data : await getSeries(plan.main.from, plan.main.to);
    checkFresh(fmain, plan.main.label);
    const list = plan.others ? await Promise.all(plan.others.map(async (o) => { const d = await getSeries(o.from, o.to); checkFresh(d, o.label); return { o, cur: d.cur }; })) : [];
    const fp = FEED_PHOTOS[fk];
    feed = { key: fk, x: { ...fmain, cor: plan.main, list, photo: fp.file, pos: fp.pos, tip: x.tip, note: x.note, disclaimer: disclaimer(fmain.hh) } };
  }
  return { x, fam, tplKey, feed };
}

const sh = (c) => execSync(c, { stdio: "inherit" });
function gitPush(message) {
  sh("git add -A out state");
  try { execSync("git diff --cached --quiet"); return false; } catch { /* hay cambios */ }
  sh(`git commit -m "${message}"`);
  for (let i = 0; i < 3; i++) {
    try { sh("git pull --rebase --autostash"); sh("git push"); return true; } catch (e) { if (i === 2) throw e; }
  }
}

async function waitPublic(url) {
  for (let i = 0; i < 18; i++) {
    const r = await fetch(url, { method: "HEAD", cache: "no-store" }).catch(() => null);
    if (r && r.ok) return;
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error("La imagen no quedó pública a tiempo: " + url);
}
const rawUrl = (file) => `https://raw.githubusercontent.com/${process.env.GITHUB_REPOSITORY}/${process.env.GITHUB_REF_NAME || "main"}/out/${file}`;

function prune() {
  const limit = Date.UTC(now.y, now.mo - 1, now.d) - cfg.keepDays * 86400000;
  for (const f of fs.existsSync("out") ? fs.readdirSync("out") : []) {
    const m = f.match(/^(\d{4})-(\d{2})-(\d{2})_/);
    if (m && Date.UTC(+m[1], +m[2] - 1, +m[3]) < limit) fs.unlinkSync(path.join("out", f));
  }
}

async function main() {
  if (args.check) {
    const when = stamp(nowLocal(Date.now() + 86400000 * 2));
    const url = `https://raw.githubusercontent.com/${process.env.GITHUB_REPOSITORY}/${process.env.GITHUB_REF_NAME || "main"}/assets/logos/isotipo_azul_vez.png`;
    summary(`🔎 CHECK: probando Metricool (blogId ${process.env.METRICOOL_BLOG_ID || "FALTA"}, userId ${process.env.METRICOOL_USER_ID || "FALTA"}, token ${process.env.METRICOOL_TOKEN ? "cargado" : "FALTA"})…`);
    const tk = (process.env.METRICOOL_TOKEN || "").trim();
    summary(`🔑 El token tiene ${tk.length} caracteres${/^["']|["']$/.test(tk) ? " (¡trae comillas!)" : ""} y ${/\s/.test(process.env.METRICOOL_TOKEN || "") ? "traía espacios o saltos de línea (los quito)" : "no trae espacios"}.`);
    try { summary("✅ Autenticación OK. Marcas de la cuenta: " + (await whoami()).join(" · ")); }
    catch (e) { summary("❌ Falló la autenticación: " + String(e.message).slice(0, 400)); throw new Error("El token o el userId no son válidos para la API de Metricool."); }
    const p = await createPost({ imageUrl: url, type: "STORY", when, timezone: TZ, draft: true });
    console.log("Borrador de prueba creado, id:", p.id);
    if (p.id) { await deletePost(p.id); summary("✅ CHECK OK: el token de Metricool funciona (se creó un borrador de prueba y se borró)."); }
    else summary("⚠️ CHECK: Metricool respondió pero no devolvió el id del borrador: " + JSON.stringify(p.raw).slice(0, 300));
    return;
  }

  if (cfg.paused && process.env.EVENT !== "workflow_dispatch" && !DRY && !DRAFT) { summary("⏸️ El bot está en pausa (config.json → paused): no publica nada."); return; }
  if ((cfg.closedDates ?? []).includes(now.date) && !FORCE_DATE) { summary(`🚫 ${now.date} es un día cerrado (config.json → closedDates): no se publica la tasa.`); return; }
  if (!slot) { summary(`ℹ️ Hora de Chile ${now.date} ${pad(now.h)}:${pad(now.mi)} (día ${weekday}): no hay publicación programada. No se hizo nada.`); return; }
  if (!forced && now.mi > cfg.maxLateMinutes) { summary(`⏭️ Llegué tarde (minuto ${now.mi}). Salto esta hora para no desordenar.`); return; }
  if (!DRY && !process.env.METRICOOL_TOKEN) { summary("⏸️ Aún no hay METRICOOL_TOKEN configurado: el bot está en pausa (no genera ni publica nada)."); return; }
  const key = `${DRAFT ? "prueba_" : ""}${now.date}_${pad(slot.hour)}`;
  const statePath = "state/published.json";
  const state = fs.existsSync(statePath) ? JSON.parse(fs.readFileSync(statePath, "utf8")) : {};
  if (state[key] && !DRY && !DRAFT) { console.log("Ya publicado:", key); return; }

  const { x, fam, tplKey, feed } = await buildContext();
  const storyFile = `${key}_${slot.corridor}_story.jpg`;
  await renderPage(wrapStory(FAMILIES[fam][tplKey](x)), { width: 1080, height: 1920, out: path.join("out", storyFile) });
  const files = [{ kind: "STORY", file: storyFile }];
  if (feed) {
    const feedFile = `${key}_${slot.corridor}_feed.jpg`;
    await renderPage(buildFeed(feed.key, feed.x), { width: 1080, height: 1350, out: path.join("out", feedFile) });
    files.push({ kind: "POST", file: feedFile, text: feedCaption(feed.x, feed.key) });
  }
  console.log("Generado:", files.map((f) => f.file).join(", "), "· familia", fam, "plantilla", tplKey, "· tasa", x.cur, "de las", x.hh);
  if (DRY) { console.log("Modo prueba (--dry): no publico nada."); return; }

  gitPush(`imágenes ${key}`);
  const when = stamp(nowLocal(Date.now() + cfg.publishDelayMinutes * 60000));
  const result = {};
  const drafts = [];
  for (const f of files) {
    const url = rawUrl(f.file);
    await waitPublic(url);
    // Instagram es lo esencial; Facebook y TikTok se intentan aparte para que un fallo no bloquee a Instagram
    const nets = cfg.networks?.[f.kind === "STORY" ? "story" : "post"] ?? ["instagram"];
    for (const network of nets) {
      try {
        const p = await createPost({ imageUrl: url, type: f.kind, when, timezone: TZ, text: f.text || "", network, draft: DRAFT });
        result[`${f.kind.toLowerCase()}_${network}`] = p.id ?? "ok";
        if (DRAFT && p.id) drafts.push(p.id);
        summary(`${DRAFT ? "🧪 BORRADOR de prueba" : "✅ Programado"} ${f.kind} en ${network} (${slot.corridor}, tasa de las ${x.hh}: ${x.cur}) para ${when} · id Metricool ${p.id}`);
      } catch (e) {
        if (network === "instagram") throw e;
        summary(`⚠️ ${f.kind} en ${network} no se pudo programar: ${e.message.slice(0, 300)}`);
      }
    }
  }
  if (DRAFT) {
    for (const id of drafts) await deletePost(id).catch((e) => summary("⚠️ No pude borrar el borrador " + id + ": " + e.message.slice(0, 200)));
    summary(`✅ PRUEBA COMPLETA OK: se generó la pieza, quedó pública en GitHub y Metricool aceptó ${drafts.length} borrador(es) (ya borrados). No se publicó nada.`);
    return;
  }
  state[key] = { ...result, at: new Date().toISOString() };
  fs.mkdirSync("state", { recursive: true });
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
  prune();
  gitPush(`estado ${key}`);
}

try { await main(); } catch (e) { console.error("ERROR:", e.message); summary("❌ ERROR: " + String(e.message).slice(0, 900)); process.exitCode = 1; } finally { await closeBrowser(); }
