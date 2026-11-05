import fs from "node:fs";
import { renderPage, closeBrowser } from "./render.mjs";
const files = fs.readdirSync("assets/icons3d").filter((f) => f.endsWith(".png")).sort();
const html = `<body style="margin:0;background:#EEF1FB;font-family:Inter"><div style="display:grid;grid-template-columns:repeat(10,190px);gap:8px;padding:14px">${files.map((f) => `<div style="background:#fff;border-radius:16px;padding:8px;text-align:center"><img src="assets/icons3d/${f}" style="width:150px;height:150px"><div style="font-size:15px;color:#555">${f.replace(".png", "")}</div></div>`).join("")}</div></body>`;
await renderPage(html, { width: 2000, height: Math.ceil(files.length / 10) * 210 + 30, out: "sheets/fluent3d.jpg" });
await closeBrowser();
