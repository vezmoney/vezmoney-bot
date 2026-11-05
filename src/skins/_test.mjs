// _test.mjs — renderiza las 7 piezas de un estilo para revisarlo: node src/skins/_test.mjs bolsa
import fs from "node:fs";
import { renderPage, closeBrowser } from "../render.mjs";
import { loadCtx } from "./_k.mjs";
import { PHOTOS_DEST } from "./fotos.mjs";
const name = process.argv[2];
const sk = (await import(`./${name}.mjs`))[name];
const ctx = await loadCtx();
fs.mkdirSync("sheets/skin", { recursive: true });
const jobs = [["hero", sk.hero(ctx.x)], ["grafico", sk.grafico(ctx.x)], ["calc", sk.calc(ctx.x)], ["montos", sk.montos(ctx.x)], ["corrPE", sk.corr(ctx.pe, PHOTOS_DEST.PE[0])], ["corrCO", sk.corr(ctx.co, PHOTOS_DEST.CO[0])], ["todos", sk.todos(ctx)]];
if (sk.hero2) jobs.push(["hero2", sk.hero2(ctx.x)]);
for (const [k, html] of jobs) await renderPage(html, { width: 1080, height: 1920, out: `sheets/skin/${name}_${k}.jpg` });
await renderPage(sk.feed(ctx.x, null), { width: 1080, height: 1350, out: `sheets/skin/${name}_feed.jpg` });
await renderPage(sk.feed(ctx.x, ["CLPE", "CLAR", "CLEC", "CLCO", "CLUS"].map((k) => ctx.all[k])), { width: 1080, height: 1350, out: `sheets/skin/${name}_feed2.jpg` });
await closeBrowser();
console.log("ok", name);
