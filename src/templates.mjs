// templates.mjs — 6 familias de historias (una por día, lunes a sábado) × 4 plantillas + 1 de corredor
import * as A from "./fam-a.mjs";
import * as B from "./fam-b.mjs";
import * as Cc from "./fam-c.mjs";
import * as D from "./fam-d.mjs";
import * as E from "./fam-e.mjs";
import * as F from "./fam-f.mjs";
export { CORRIDORS } from "./common.mjs";

const mk = (m) => ({ s: m.s, g: m.g, t: m.t, q: m.q, corridor: (x) => m.t(x, corrCopy(x, m.style)) });
export const corrCopy = (x, style = "pill") => ({
  l1: "¿Envías desde",
  l2: style === "accent" ? `**${x.cor.short}**?` : `##${x.cor.short}##?`,
  cta: `COTIZA ${x.cor.short.toUpperCase()} → VENEZUELA`,
  tip: "tu familia en Venezuela recibe en bolívares (Bs).",
});
export const FAMILIES = { A: mk(A), B: mk(B), C: mk(Cc), D: mk(D), E: mk(E), F: mk(F) };
export const FAMILY_FOR_WEEKDAY = { 1: "A", 2: "B", 3: "C", 4: "D", 5: "E", 6: "F" };
export const wrapStory = (inner) => `<!doctype html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=1080,height=1920">
<link rel="stylesheet" href="kit.css"></head><body class="story"><div id="root">${inner}</div></body></html>`;
