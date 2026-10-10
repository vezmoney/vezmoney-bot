// preview.mjs — renderiza TODAS las plantillas con datos reales a preview/ (no publica nada)
//   node src/preview.mjs            → 6 familias × (4 + 2 corredores) + 6 feeds
//   node src/preview.mjs A          → solo la familia A (letra) · node src/preview.mjs feed → solo los feeds
import fs from "node:fs";
import { getSeries } from "./data.mjs";
import { hoursNote, tipFor, disclaimer } from "./info.mjs";
import { CORRIDORS } from "./common.mjs";
import { FAMILIES, FAMILY_FOR_WEEKDAY, wrapStory } from "./templates.mjs";
import { FEED_PLAN, FEED_KEYS, buildFeed } from "./feed.mjs";
import { PHOTOS, FEED_PHOTOS } from "./photos.mjs";
import { renderPage, closeBrowser } from "./render.mjs";

const only = (process.argv[2] || "").toLowerCase();
const series = {};
const get = async (p) => (series[p.key] ??= await getSeries(p.from, p.to));
fs.mkdirSync("preview", { recursive: true });
const wdOf = (fam) => Number(Object.entries(FAMILY_FOR_WEEKDAY).find(([, v]) => v === fam)[0]);

if (!only || only.length === 1) {
  for (const fam of Object.keys(FAMILIES)) {
    if (only && only !== fam.toLowerCase()) continue;
    for (const k of ["s", "g", "t", "q", "cPE", "cCO"]) {
      const code = k === "cPE" ? "PE" : k === "cCO" ? "CO" : "BS";
      const cor = CORRIDORS[code], d = await get(cor);
      const key = k.startsWith("c") ? "corridor" : k;
      const pool = key === "corridor" ? PHOTOS[fam].corridor[code] : PHOTOS[fam][key];
      const p = pool[0];
      const x = { ...d, cor, set: fam, photo: p.file, pos: p.pos, tip: tipFor(5, 0), note: hoursNote(wdOf(fam), 10), disclaimer: disclaimer(d.hh) };
      await renderPage(wrapStory(FAMILIES[fam][key](x)), { width: 1080, height: 1920, out: `preview/story_${fam}_${k}.jpg` });
      console.log("ok", fam, k);
    }
  }
}
if (!only || only === "feed") {
  for (const k of FEED_KEYS) {
    const plan = FEED_PLAN[k], d = await get(plan.main);
    const list = plan.others ? await Promise.all(plan.others.map(async (o) => ({ o, cur: (await get(o)).cur }))) : [];
    const wd = Number(k[1]);
    const x = { ...d, cor: plan.main, list, photo: FEED_PHOTOS[k].file, pos: FEED_PHOTOS[k].pos, tip: tipFor(5, 0), note: hoursNote(wd, 10), disclaimer: disclaimer(d.hh) };
    await renderPage(buildFeed(k, x), { width: 1080, height: 1350, out: `preview/feed_${k}.jpg` });
    console.log("ok", k);
  }
}
await closeBrowser();
