// data.mjs — lee la API pública de tasas de api.vezmoney.com y calcula estadísticas de las últimas 24 h
const UA = "Mozilla/5.0 (compatible; vezmoney-bot/1.0; +https://vezmoney.com)";
async function getPage(url, intentos = 4) {
  let err;
  for (let i = 1; i <= intentos; i++) {
    try {
      const r = await fetch(url, { headers: { "user-agent": UA, accept: "application/json" }, signal: AbortSignal.timeout(30000) });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return await r.json();
    } catch (e) {
      err = e;
      await new Promise((ok) => setTimeout(ok, 1500 * i));
    }
  }
  throw new Error(`${url}: ${err?.cause?.code ?? err?.message ?? err}`);
}

export async function getSeries(from, to) {
  const base = `https://api.vezmoney.com/api/tasa/listaiden/${from}/${to}`;
  const pages = [await getPage(`${base}?page=1`), await getPage(`${base}?page=2`)];
  const rows = pages
    .flatMap((p) => p.data)
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .slice(-24);
  if (rows.length < 12) throw new Error(`API de tasas ${from}/${to}: solo ${rows.length} registros`);
  const rates = rows.map((r) => Number(r.monto));
  const cur = rates[rates.length - 1];
  const mx = Math.max(...rates);
  const mn = Math.min(...rates);
  const avg = rates.reduce((a, b) => a + b, 0) / rates.length;
  const last = rows[rows.length - 1];
  const hh = last.fecha.slice(11, 13) + ":" + last.fecha.slice(14, 16);
  // El badge solo aparece si es verdad con los datos reales
  const badge =
    cur >= mx - 1e-12 ? "▲ La tasa más alta de las últimas 24 h" : cur > avg ? "▲ Sobre el promedio de las últimas 24 h" : "";
  return { rows, rates, cur, mx, mn, avg, hh, fecha: last.fecha, badge };
}

// minutos entre el último registro (hora de Chile) y "ahora" (hora de Chile, como números)
export function ageMinutes(fecha, nowLocalMs) {
  const [d, t] = fecha.split(" ");
  const [Y, M, D] = d.split("-").map(Number);
  const [h, m, s] = t.split(":").map(Number);
  return (nowLocalMs - Date.UTC(Y, M - 1, D, h, m, s)) / 60000;
}
