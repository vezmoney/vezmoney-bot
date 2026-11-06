// juegos-bot.mjs — piezas sueltas para el bot de GitHub: una por ejecución, cargando solo los datos que esa hora necesita.
import { CORRIDORS, pair, rateFmt, f as fmt, COUNTRY } from "./common.mjs";
import { getSeries } from "./data.mjs";
import { PHOTOS_DEST } from "./skins/fotos.mjs";
import { DIAS, viejo } from "./juegos.mjs";
import { FEEDS_MES } from "./skins/feeds-mes.mjs";

const getCor = async (k) => ({ ...(await getSeries(CORRIDORS[k].from, CORRIDORS[k].to)), cor: CORRIDORS[k] });
const fotoDestino = (dia) => ({ PE: PHOTOS_DEST.PE[(dia - 1) % 6], CO: PHOTOS_DEST.CO[(dia - 1) % 6] });

// historia de una hora concreta de un día de la semana (1=lunes … 6=sábado)
export async function piezaDeHora(dia, hora) {
  const D = DIAS[dia], sk = D.skin, foto = fotoDestino(dia);
  if (hora === 15) { const pe = await getCor("CLPE"); return { id: "corrPE", datas: [pe], html: sk.corr(pe, foto.PE) }; }
  if (hora === 16) { const co = await getCor("CLCO"); return { id: "corrCO", datas: [co], html: sk.corr(co, foto.CO) }; }
  if (hora === 17) {
    const all = {}; for (const k of ["CLVE", "CLPE", "CLCO", "CLAR", "CLEC", "CLUS", "PEVE", "COVE"]) all[k] = await getCor(k);
    return { id: "todos", datas: Object.values(all), html: sk.todos({ x: all.CLVE, pe: all.CLPE, co: all.CLCO, all, keys: Object.keys(all) }) };
  }
  const x = await getCor("CLVE"), nuevos = { 8: ["hero", () => sk.hero(x)], 9: ["grafico", () => sk.grafico(x)], 11: ["calc", () => sk.calc(x)], 13: ["montos", () => sk.montos(x)] };
  if (nuevos[hora]) return { id: nuevos[hora][0], datas: [x], html: nuevos[hora][1]() };
  if (D.viejos[hora]) return { id: `${D.fam}_${D.viejos[hora]}`, datas: [x], html: viejo(D.fam, D.viejos[hora], x, hora, dia) };
  const k = D.extra10 ?? "hero2";
  return { id: k, datas: [x], html: sk[k](x) };
}

// Feeds del mes: ciclo de 4 semanas que se repite (semana 1 = feeds de cada línea; semanas 2-4 = diseños de feeds-mes.mjs).
// La semana se cuenta por lunes desde una fecha ancla (un lunes), así la rotación es continua y no depende del día del mes.
const ELEGIDOS = { "2-6": "s2-sab-rutas-claro", "4-5": "s4-vie-ventana-venezuela" }; // opciones A/B ya decididas por el usuario
export function semanaCiclo(fecha, ancla) {
  const [y, m, d] = fecha.split("-").map(Number), [ya, ma, da] = ancla.split("-").map(Number);
  const dias = Math.round((Date.UTC(y, m - 1, d) - Date.UTC(ya, ma - 1, da)) / 86400000);
  return (((Math.floor(dias / 7) % 4) + 4) % 4) + 1;
}
export function disenoFeed(sem, dia) {
  const sk = DIAS[dia].skin;
  if (!sem) return { id: "feed", render: sk.feed };
  if (sem === 1) return { id: "feed_s1", render: dia === 1 ? sk.feed : (sk.feed2 ?? sk.feed) };
  const c = FEEDS_MES.filter((x) => x.sem === sem && x.dia === dia), e = c.find((x) => x.id === ELEGIDOS[sem + "-" + dia]) ?? c[0];
  if (!e) throw new Error(`No hay diseño de feed para la semana ${sem}, día ${dia}`);
  return { id: e.id, render: e.render };
}

// feed de las 10:00 del día (fecha y cfg.feedsMes activan la rotación; sin ellos se usa el feed de siempre)
export async function piezaFeed(dia, fecha, feedsMes) {
  const D = DIAS[dia], t = D.feed.tipo;
  let d, otros = null;
  if (t === "uno" || t === "tres") {
    d = await getCor("CLVE");
    if (t === "tres") { otros = []; for (const k of ["CLPE", "CLAR", "CLEC", "CLCO", "CLUS"]) otros.push(await getCor(k)); }
  } else {
    const o = t === "peru" ? "PE" : "CO", mk = async (a, b) => { const c = pair(a, b); return { ...(await getSeries(c.from, c.to)), cor: c }; };
    d = await mk(o, "VE"); otros = [];
    for (const to of ["CL", o === "PE" ? "CO" : "PE", "AR", "EC", "US"]) otros.push(await mk(o, to));
  }
  const sem = feedsMes && fecha && fecha >= feedsMes.desde ? semanaCiclo(fecha, feedsMes.ancla) : 0, dis = disenoFeed(sem, dia);
  return { id: dis.id, datas: [d, ...(otros ?? [])], html: dis.render(d, otros), caption: feedCaption(d, otros) };
}

// texto que acompaña al post de las 10:00 (la tasa nunca se redondea; los montos se truncan)
export function feedCaption(d, otros) {
  const c = d.cor, trunc = (n) => fmt(Math.floor(n * 100 + 1e-9) / 100, 2), base = c.base === 1000 ? "1.000" : "1";
  let cuerpo = `${c.label}: ${base} ${c.fromUnit} = ${rateFmt(c, d.cur)} ${c.unit}.`;
  if (!otros) cuerpo += ` Con ${fmt(c.amounts[0])} ${c.fromUnit}, tu contacto recibe ${trunc(c.amounts[0] * d.cur)} ${c.unit} (ejemplo con la tasa de este momento).`;
  else cuerpo += `\n\nY desde ${COUNTRY[c.fromCode].name} también:\n` + otros.map((o) => `• ${COUNTRY[o.cor.toCode].name}: ${o.cor.base === 1000 ? "1.000" : "1"} ${o.cor.fromUnit} = ${rateFmt(o.cor, o.cur)} ${o.cor.unit}`).join("\n");
  return `Así está la tasa a las ${d.hh}. 📈\n\n${cuerpo}\n\nLas tasas se actualizan automáticamente en tiempo real: la verdadera es la que ves en vezmoney.com. Esta es la del momento de publicación (${d.hh}).\n\nCotiza y envía en vezmoney.com\n\n#VezMoney #Remesas #EnviarDinero #RemesasInternacionales #Migrantes #EnvíoDeDinero #TasaDelDía #Chile #Venezuela #Perú #Colombia`;
}
