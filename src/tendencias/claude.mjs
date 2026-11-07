// claude.mjs — llama a Claude Code en modo no interactivo (en GitHub Actions usa ANTHROPIC_API_KEY, una clave de la API de Anthropic propia de VezMoney; en el PC, tu sesión).
import { spawnSync } from "node:child_process";

export function claude(prompt, { maxTurns = 4, tools = [], timeoutMin = 12 } = {}) {
  const args = ["-p", "--output-format", "text", "--max-turns", String(maxTurns)];
  if (tools.length) args.push("--allowedTools", ...tools, "--permission-mode", "acceptEdits");
  const r = spawnSync("claude", args, { input: prompt, encoding: "utf8", shell: process.platform === "win32", maxBuffer: 50 * 1024 * 1024, timeout: timeoutMin * 60000 });
  if (r.error) throw new Error("No pude ejecutar claude: " + r.error.message);
  if (r.status !== 0 && !r.stdout) throw new Error(`claude terminó con código ${r.status}: ${(r.stderr || "").slice(0, 400)}`);
  return r.stdout.trim();
}

// saca el primer objeto JSON de una respuesta (por si el modelo agrega texto alrededor)
export function extraerJSON(txt) {
  const t = txt.replace(/```json|```/g, "");
  const a = t.indexOf("{"), b = t.lastIndexOf("}");
  if (a < 0 || b < a) throw new Error("La respuesta no trae JSON");
  return JSON.parse(t.slice(a, b + 1));
}
