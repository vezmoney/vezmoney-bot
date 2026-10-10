// dev.mjs — render rápido de una familia para revisarla: node src/dev.mjs A [s,g,t,q,cPE,cCO]
import fs from "node:fs";
import { getSeries } from "./data.mjs";
import { hoursNote, tipFor, disclaimer } from "./info.mjs";
import { CORRIDORS } from "./common.mjs";
import { FAMILIES, wrapStory } from "./templates.mjs";
import { renderPage, closeBrowser } from "./render.mjs";

const fam = (process.argv[2] || "A").toUpperCase();
const which = (process.argv[3] || "s,g,t,q,cPE,cCO").split(",");
const photos = ["dev1.jpg", "dev2.jpg", "dev3.jpg", "dev4.jpg", "dev5.jpg", "dev6.jpg"];
const series = {};
const ctx = async (code, i) => {
  const cor = CORRIDORS[code];
  series[code] ??= await getSeries(cor.from, cor.to);
  return { ...series[code], cor, set: fam, photo: photos[i % photos.length], pos: "50% 22%", tip: tipFor(5, i), note: hoursNote(1, 10), disclaimer: disclaimer(series[code].hh) };
};
fs.mkdirSync("preview", { recursive: true });
const F = FAMILIES[fam];
let i = 0;
for (const k of which) {
  const code = k === "cPE" ? "PE" : k === "cCO" ? "CO" : "BS";
  const x = await ctx(code, i++);
  const html = k.startsWith("c") ? wrapStory(F.corridor(x)) : wrapStory(F[k](x));
  await renderPage(html, { width: 1080, height: 1920, out: `preview/${fam}_${k}.jpg` });
  console.log("ok", fam, k);
}
await closeBrowser();
