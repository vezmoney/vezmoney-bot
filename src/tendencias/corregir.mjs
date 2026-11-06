// corregir.mjs — aplica un cambio pedido desde Telegram. Claude edita SOLO el JSON de la pieza (o de la idea); después se valida y se vuelve a renderizar.
//   node src/tendencias/corregir.mjs --pieza=<ideaId>-A --cambio="texto"      → corrige la pieza y deja el manifiesto para enviar.mjs
//   node src/tendencias/corregir.mjs --idea=<ideaId> --cambio="texto"         → corrige la idea y la reenvía para la 1.ª aprobación
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { claude } from "./claude.mjs";
import { validar } from "./disenos.mjs";

const args = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, ...v] = a.replace(/^--/, "").split("="); return [k, v.length ? v.join("=") : true]; }));
const nota = (txt) => (txt.split("\n").reverse().find((l) => /^Hice:/i.test(l.trim())) || "Hice: apliqué el cambio pedido.").trim();

if (args.pieza) {
  const f = `tendencias/piezas/${args.pieza}.json`;
  const respuesta = claude(`Lee CLAUDE.md y sigue sus reglas. Corrige la pieza del archivo ${f} aplicando exactamente este cambio pedido por Francisco: «${args.cambio}». Edita solo ese archivo, mantén el JSON válido y respeta los límites de caracteres de su plantilla (puedes cambiar de plantilla solo si el cambio lo pide). Termina con UNA línea que empiece con «Hice:».`, { maxTurns: 12, tools: ["Read", "Edit", "Write"] });
  const errs = validar(JSON.parse(fs.readFileSync(f, "utf8")));
  if (errs.length) throw new Error(`Después del cambio la pieza no cumple: ${errs.join("; ")}`);
  const r = spawnSync("node", ["src/tendencias/disenar.mjs", `--pieza=${args.pieza}`], { stdio: "inherit" });
  if (r.status) process.exit(r.status);
  fs.writeFileSync("out/tendencias/_nota.txt", nota(respuesta));
  console.log(nota(respuesta));
} else if (args.idea) {
  const archivo = fs.readdirSync("tendencias/ideas").filter((x) => x.endsWith(".json")).map((x) => path.join("tendencias/ideas", x)).find((x) => JSON.parse(fs.readFileSync(x, "utf8")).some((i) => i.id === args.idea));
  if (!archivo) throw new Error("No encuentro la idea " + args.idea);
  const respuesta = claude(`Lee CLAUDE.md y sigue sus reglas. En el archivo ${archivo} hay una lista de ideas; modifica SOLO la que tiene "id": "${args.idea}" aplicando este cambio pedido por Francisco: «${args.cambio}». Puedes cambiar el ángulo, los textos, las plantillas y las fotos (solo de tendencias/fotos.json). Mantén el JSON válido y los límites de caracteres. Termina con UNA línea que empiece con «Hice:».`, { maxTurns: 12, tools: ["Read", "Edit", "Write"] });
  const idea = JSON.parse(fs.readFileSync(archivo, "utf8")).find((i) => i.id === args.idea);
  const errs = ["pieza_a", "pieza_b"].flatMap((L) => validar(idea[L]).map((e) => `${L}: ${e}`));
  if (errs.length) throw new Error(`Después del cambio la idea no cumple: ${errs.join("; ")}`);
  if (process.env.WORKER_URL && process.env.ADMIN_KEY) {
    const r = await fetch(process.env.WORKER_URL.replace(/\/$/, "") + "/admin/idea", { method: "POST", headers: { "X-Admin-Key": process.env.ADMIN_KEY, "content-type": "application/json" }, body: JSON.stringify({ id: idea.id, idea }) });
    console.log("Telegram", idea.id, r.status);
  }
  console.log(nota(respuesta));
} else throw new Error("Usa --pieza=<id> o --idea=<id> junto con --cambio");
