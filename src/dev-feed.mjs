// dev-feed.mjs — render rápido de los 6 posts de feed con datos reales: node src/dev-feed.mjs [f1,f2,...]
import fs from "node:fs";
import { getSeries } from "./data.mjs";
import { hoursNote, disclaimer } from "./info.mjs";
import { FEED_PLAN, buildFeed, feedCaption } from "./feed.mjs";
import { renderPage, closeBrowser } from "./render.mjs";

const keys = (process.argv[2] || "f1,f2,f3,f4,f5,f6").split(",");
const photos = ["dev7.jpg", "dev2.jpg", "dev6.jpg", "dev3.jpg", "dev8.jpg", "dev5.jpg"];
fs.mkdirSync("preview", { recursive: true });
for (const [i, k] of keys.entries()) {
  const plan = FEED_PLAN[k], main = plan.main;
  const d = await getSeries(main.from, main.to);
  const list = plan.others ? await Promise.all(plan.others.map(async (o) => ({ o, cur: (await getSeries(o.from, o.to)).cur }))) : [];
  const x = { ...d, cor: main, list, photo: photos[i], pos: "50% 30%", tip: "", note: hoursNote(i + 1, 10), disclaimer: disclaimer(d.hh) };
  await renderPage(buildFeed(k, x), { width: 1080, height: 1350, out: `preview/feed_${k}.jpg` });
  console.log("ok", k);
  if (process.env.CAPTION) console.log(feedCaption(x, k));
}
await closeBrowser();
