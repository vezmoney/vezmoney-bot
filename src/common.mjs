// common.mjs — piezas compartidas de las plantillas VezMoney (formatos, banderas, gráficos, tablas, cotizadores, fondos)
// Paleta: azul protagonista + blanco; rosa SOLO como acento puntual (marca 60 % azules · 25 % blancos · 10 % rosa · 5 % acentos).

// de-DE agrupa miles desde 4 cifras ("1.502,82"); es-CL no lo hace. Coma decimal en ambos.
export const f = (n, min = 0, max = min) => n.toLocaleString("de-DE", { minimumFractionDigits: min, maximumFractionDigits: max });

export const C = { azul: "#001C70", vez: "#03258C", cielo: "#5B8CFF", lav: "#A3A7F7", turq: "#22C7C9", rosa: "#F20775", nube: "#F6F7FB", gris: "#5D6574", gris20: "#D8DDE8" };

// ---------- países y corredores (pares de api.vezmoney.com) ----------
export const COUNTRY = {
  CL: { name: "Chile", api: "CLP", unit: "CLP", flag: "CL" },
  VE: { name: "Venezuela", api: "BS", unit: "Bs", flag: "VE" },
  PE: { name: "Perú", api: "PEN", unit: "PEN", flag: "PE" },
  CO: { name: "Colombia", api: "COP", unit: "COP", flag: "CO" },
  AR: { name: "Argentina", api: "ARS", unit: "ARS", flag: "AR" },
  EC: { name: "Ecuador", api: "USD", unit: "USD", flag: "EC" },
  US: { name: "EE. UU.", api: "USD", unit: "USD", flag: "US" },
  BR: { name: "Brasil", api: "BRL", unit: "BRL", flag: "BR" },
};
// monto de ejemplo y base de la tasa unitaria según el país de ORIGEN
const ORIGIN = { CL: { base: 1, amounts: [10000, 50000, 100000] }, PE: { base: 1, amounts: [50, 100, 500] }, CO: { base: 1000, amounts: [50000, 100000, 500000] } };
export const pair = (from, to) => {
  const a = COUNTRY[from], b = COUNTRY[to], o = ORIGIN[from];
  return { key: `${from}${to}`, from: a.api, to: b.api, fromCode: from, toCode: to, unit: b.unit, fromUnit: a.unit, fromFlag: a.flag, toFlag: b.flag, label: `${a.name} → ${b.name}`, short: a.name, toName: b.name, base: o.base, amounts: o.amounts };
};
// corredores de las historias (siempre hacia Venezuela, como Karduto y Giros del Sur)
export const CORRIDORS = { BS: pair("CL", "VE"), PE: pair("PE", "VE"), CO: pair("CO", "VE") };

// ---------- banderas circulares vectoriales ----------
let _fid = 0;
const star = (cx, cy, R, r, fill) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (-90 + i * 36) * (Math.PI / 180), rad = i % 2 ? r : R;
    return `${(cx + rad * Math.cos(a)).toFixed(2)},${(cy + rad * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
  return `<polygon points="${pts}" fill="${fill}"/>`;
};
const FLAGS = {
  CL: { dx: 0, svg: `<rect width="150" height="50" fill="#fff"/><rect y="50" width="150" height="50" fill="#D52B1E"/><rect width="50" height="50" fill="#0039A6"/>${star(25, 25, 14, 5.6, "#fff")}` },
  VE: { dx: -25, svg: `<rect width="150" height="33.4" fill="#FFCC00"/><rect y="33.4" width="150" height="33.3" fill="#00247D"/><rect y="66.7" width="150" height="33.3" fill="#CF142B"/>${Array.from({ length: 8 }, (_, i) => { const a = (-155 + i * (130 / 7)) * (Math.PI / 180); return star(75 + 28 * Math.cos(a), 72 + 28 * Math.sin(a), 3.6, 1.5, "#fff"); }).join("")}` },
  PE: { dx: -25, svg: `<rect width="50" height="100" fill="#D91023"/><rect x="50" width="50" height="100" fill="#fff"/><rect x="100" width="50" height="100" fill="#D91023"/>` },
  CO: { dx: -25, svg: `<rect width="150" height="50" fill="#FCD116"/><rect y="50" width="150" height="25" fill="#003893"/><rect y="75" width="150" height="25" fill="#CE1126"/>` },
  AR: { dx: -25, svg: `<rect width="150" height="33.4" fill="#74ACDF"/><rect y="33.4" width="150" height="33.3" fill="#fff"/><rect y="66.7" width="150" height="33.3" fill="#74ACDF"/><circle cx="75" cy="50" r="8.5" fill="#F6B40E"/><circle cx="75" cy="50" r="12" fill="none" stroke="#F6B40E" stroke-width="2.2" stroke-dasharray="2.2 3.2"/>` },
  BR: { dx: -25, svg: `<rect width="150" height="100" fill="#009C3B"/><polygon points="75,10 140,50 75,90 10,50" fill="#FFDF00"/><circle cx="75" cy="50" r="22" fill="#002776"/><path d="M54 52 Q76 42 97 55" stroke="#fff" stroke-width="4.2" fill="none"/>` },
  US: { dx: 0, svg: `${Array.from({ length: 13 }, (_, i) => `<rect y="${(i * 100 / 13).toFixed(2)}" width="150" height="${(100 / 13 + 0.2).toFixed(2)}" fill="${i % 2 ? "#fff" : "#B22234"}"/>`).join("")}<rect width="64" height="53.9" fill="#3C3B6E"/>${Array.from({ length: 12 }, (_, i) => `<circle cx="${(10 + (i % 4) * 14).toFixed(1)}" cy="${(11 + Math.floor(i / 4) * 15).toFixed(1)}" r="2.6" fill="#fff"/>`).join("")}` },
  EC: { dx: -25, svg: `<rect width="150" height="50" fill="#FFDD00"/><rect y="50" width="150" height="25" fill="#034EA2"/><rect y="75" width="150" height="25" fill="#ED1C24"/><ellipse cx="75" cy="50" rx="13" ry="15" fill="#fff" stroke="#8d6e1a" stroke-width="2"/><circle cx="75" cy="46" r="6" fill="#9ecfe9"/><path d="M66 56 Q75 50 84 56" fill="#7a5c1c"/>` },
};
export const flag = (code, size, ring = "#fff") => {
  const id = "fc" + _fid++, fl = FLAGS[code];
  return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" style="display:block;flex:none;filter:drop-shadow(0 4px 8px rgba(0,22,80,.28))"><defs><clipPath id="${id}"><circle cx="50" cy="50" r="50"/></clipPath></defs><g clip-path="url(#${id})"><g transform="translate(${fl.dx},0)">${fl.svg}</g></g><circle cx="50" cy="50" r="48.5" fill="none" stroke="${ring}" stroke-width="3.5"/></svg>`;
};
export const arrowSvg = (s, sw = 2.8) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}"><path d="M4 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
export const flagsRow = (c, size, ring, color = "currentColor") =>
  `<span style="display:inline-flex;align-items:center;gap:${Math.round(size * 0.22)}px;vertical-align:middle;color:${color}">${flag(c.fromFlag, size, ring)}${arrowSvg(Math.round(size * 0.5))}${flag(c.toFlag, size, ring)}</span>`;

// ---------- formatos ----------
export const rateFmt = (c, v) => f(v * c.base, 2, 6);
export const baseTxt = (c) => (c.base === 1000 ? "1.000" : "1");
export const unitRate = (c, cur) => `${baseTxt(c)} ${c.fromUnit} = ${rateFmt(c, cur)} ${c.unit}`;
export const conv = (x, amt) => f(amt * x.cur, 2);
export const money = (c, amt) => `${f(amt)} ${c.fromUnit}`;
export const varPct = (x) => f(((x.mx - x.mn) / x.mn) * 100, 1);

// ---------- piezas básicas ----------
export const logo = (v, h, style = "") => `<img src="assets/logos/${v}.png" style="position:absolute;height:${h}px;${style}">`;
export const logoW = (h, style) => logo("reversa_horizontal", h, style);
export const logoC = (h, style) => logo("principal_horizontal", h, style);
export const dot = (c = "#F20775") => `<span style="display:inline-block;width:16px;height:16px;border-radius:50%;background:${c};box-shadow:0 0 0 6px ${c}33;margin-right:14px;vertical-align:middle"></span>`;
export const photo = (x, style) => `<img src="assets/photos/${x.photo}" style="position:absolute;object-fit:cover;object-position:${x.pos || "50% 20%"};${style}">`;
export const orb = (style) => `<div class="abs" style="border-radius:50%;${style}"></div>`;
export const kicker = (t, color, size = 27) => `<div class="m" style="font-weight:800;font-size:${size}px;letter-spacing:.14em;text-transform:uppercase;color:${color}">${t}</div>`;
export const sticker = (t, bg, color, style, size = 44) => `<div class="m abs" style="${style};background:${bg};color:${color};font-weight:800;font-size:${size}px;padding:20px 34px;border-radius:26px;box-shadow:0 14px 34px rgba(0,22,80,.3);white-space:nowrap">${t}</div>`;
export const badgeHTML = (badge, bg, color, border, extra = "") =>
  badge ? `<div class="m" style="display:inline-block;background:${bg};color:${color};border:3px solid ${border};font-weight:700;font-size:28px;padding:12px 28px;border-radius:999px;${extra}">${badge}</div>` : "";
// botón: azul/blanco con la flecha en rosa (único acento)
export const cta = (t, bg = C.azul, color = "#fff", { arrow = C.rosa, size = 36 } = {}) =>
  `<span class="m" style="display:inline-flex;align-items:center;gap:20px;background:${bg};color:${color};font-weight:800;font-size:${size}px;padding:20px 26px 20px 44px;border-radius:999px;box-shadow:0 14px 34px rgba(0,22,80,.32);white-space:nowrap">${t}<span style="width:${size + 20}px;height:${size + 20}px;border-radius:50%;background:${arrow};color:#fff;display:inline-flex;align-items:center;justify-content:center">${arrowSvg(size * 0.8)}</span></span>`;
// resalte de texto: ##palabra## = pastilla azul · **palabra** = color de acento
export const hl = (s, c, pill = C.azul) => s.replace(/##(.+?)##/g, `<span style="background:${pill};color:#fff;padding:0 18px;border-radius:16px;box-decoration-break:clone">$1</span>`).replace(/\*\*(.+?)\*\*/g, `<span style="color:${c}">$1</span>`);

// marco de foto con forma: rect | arch | circle | squircle | blob
export const frame = (x, { l, t, w, h, shape = "rect", r = 56, border = "#fff", bw = 12, shadow = "0 26px 70px rgba(0,22,80,.35)", extra = "" }) => {
  const rad = { rect: `${r}px`, arch: `${w / 2}px ${w / 2}px ${r}px ${r}px`, circle: "50%", squircle: `${Math.round(Math.min(w, h) * 0.2)}px`, blob: "58% 42% 52% 48% / 46% 54% 46% 54%" }[shape];
  return `<div class="abs" style="left:${l}px;top:${t}px;width:${w}px;height:${h}px;border-radius:${rad};border:${bw}px solid ${border};overflow:hidden;box-shadow:${shadow};${extra}">${photo(x, "left:0;top:0;width:100%;height:100%")}</div>`;
};

// bloque inferior obligatorio: dato + horario + aviso de tasa + marca
export const bottom = (x, { ink, dim, acc, tip = true, handle = ink, bottomPx = 112 }) => `
  <div class="abs" style="left:70px;right:70px;bottom:${bottomPx}px;text-align:center">
    ${tip ? `<div style="font-weight:600;font-size:29px;line-height:1.28;color:${acc}">Dato: ${x.tip}</div>` : ""}
    <div style="font-weight:600;font-size:27px;color:${ink};margin-top:9px">${x.note}</div>
    <div style="font-weight:500;font-size:23px;line-height:1.34;color:${dim};margin-top:11px">${x.disclaimer}</div>
  </div>
  <div class="m abs" style="left:80px;right:80px;bottom:44px;display:flex;justify-content:space-between;font-weight:700;font-size:25px;color:${handle}"><span>@vezmoneyoficial</span><span>vezmoney.com</span></div>`;

// ---------- fondos y adornos ----------
export const bgNube = `<div class="abs" style="inset:0;background:#F6F7FB"></div><div class="abs" style="inset:0;background:radial-gradient(1100px 760px at 90% -8%,rgba(91,140,255,.22),transparent 62%),radial-gradient(900px 640px at -12% 108%,rgba(3,37,140,.12),transparent 62%)"></div>`;
export const bgBlanco = `<div class="abs" style="inset:0;background:#fff"></div><div class="abs" style="inset:0;background:radial-gradient(900px 600px at 100% 0%,rgba(163,167,247,.22),transparent 60%)"></div>`;
export const bgAzul = `<div class="abs" style="inset:0;background:linear-gradient(160deg,#04298f 0%,#001C70 58%,#001450 100%)"></div>`;
export const bgCielo = `<div class="abs" style="inset:0;background:linear-gradient(165deg,#86A9FF 0%,#4F80F5 40%,#03258C 100%)"></div>`;
export const bgLav = `<div class="abs" style="inset:0;background:linear-gradient(170deg,#F1F2FF 0%,#D6D8FC 50%,#A3A7F7 100%)"></div>`;
export const wing = (style, tone = "w") => `<div class="abs" style="border-radius:50% 50% 50% 4%;${tone === "w" ? "background:linear-gradient(160deg,rgba(255,255,255,.55),rgba(255,255,255,0));opacity:.16" : "background:linear-gradient(160deg,rgba(91,140,255,.8),rgba(91,140,255,0));opacity:.28"};${style}"></div>`;
// ruta curva punteada (lenguaje gráfico de marca)
export const route = (style, { w = 600, h = 400, d, color = "rgba(255,255,255,.55)", sw = 5 } = {}) =>
  `<svg class="abs" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" style="${style};overflow:visible"><path d="${d || `M20 ${h - 20} C ${w * 0.3} ${h * 0.1}, ${w * 0.7} ${h * 1.0}, ${w - 20} 30`}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-dasharray="2 20" stroke-linecap="round"/></svg>`;

// ---------- gráficos de 24 h ----------
export function chart(x, w, h, kind, { line = C.vez, area, grid = "rgba(0,28,112,.16)", ink = C.azul, now = C.rosa, nowRing = "#fff", labels = true } = {}) {
  const { rates, mx, mn } = x, c = x.cor;
  const padT = 44, padB = 30, padX = 24;
  const span = mx - mn || mx * 0.001;
  const lo = mn - span * 0.14, hi = mx + span * 0.14;
  const X = (i) => padX + (i * (w - 2 * padX)) / (rates.length - 1);
  const Y = (v) => padT + (1 - (v - lo) / (hi - lo)) * (h - padT - padB);
  const pts = rates.map((v, i) => [X(i), Y(v)]);
  const gridL = [0.25, 0.5, 0.75].map((t) => { const y = (padT + t * (h - padT - padB)).toFixed(1); return `<line x1="${padX}" x2="${w - padX}" y1="${y}" y2="${y}" stroke="${grid}" stroke-width="2" stroke-dasharray="6 10"/>`; }).join("");
  const iMax = rates.indexOf(mx);
  const maxLbl = labels ? `<circle cx="${pts[iMax][0].toFixed(1)}" cy="${pts[iMax][1].toFixed(1)}" r="9" fill="${ink}"/><text x="${Math.min(Math.max(pts[iMax][0], 150), w - 150).toFixed(1)}" y="${(pts[iMax][1] - 22).toFixed(1)}" text-anchor="middle" font-family="Inter" font-weight="800" font-size="28" fill="${ink}">máx ${rateFmt(c, mx)}</text>` : "";
  const [lx, ly] = pts[pts.length - 1];
  const head = `<circle cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="26" fill="${now}" opacity=".25"/><circle cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="13" fill="${now}" stroke="${nowRing}" stroke-width="5"/>`;
  const svg = (inner) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" style="display:block;overflow:visible">${inner}</svg>`;
  const lineP = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const gid = `g${w}${h}${kind}${Math.round(lo * 1000)}`;
  if (kind === "bars" || kind === "capsule") {
    const bw = ((w - 2 * padX) / rates.length) * (kind === "capsule" ? 0.78 : 0.66);
    const bars = rates.map((v, i) => {
      const y = Y(v), last = i === rates.length - 1;
      return `<rect x="${(X(i) - bw / 2).toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${(h - padB - y).toFixed(1)}" rx="${(bw / (kind === "capsule" ? 2 : 2.4)).toFixed(1)}" fill="${last ? now : line}" opacity="${last ? 1 : 0.5 + 0.5 * (i / rates.length)}"/>`;
    }).join("");
    return svg(gridL + bars + maxLbl);
  }
  if (kind === "dots") {
    const dts = pts.map((p, i) => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${i === pts.length - 1 ? 0 : 7}" fill="${line}"/>`).join("");
    return svg(`${gridL}<path d="${lineP}" fill="none" stroke="${line}" stroke-width="4" opacity=".5" stroke-linecap="round" stroke-linejoin="round"/>${dts}${maxLbl}${head}`);
  }
  if (kind === "lollipop") {
    const stems = pts.map((p, i) => `<line x1="${p[0].toFixed(1)}" x2="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" y2="${h - padB}" stroke="${line}" stroke-width="5" opacity="${i === pts.length - 1 ? 0 : 0.35}" stroke-linecap="round"/><circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${i === pts.length - 1 ? 0 : 9}" fill="${line}"/>`).join("");
    return svg(`${gridL}${stems}${maxLbl}${head}<line x1="${lx.toFixed(1)}" x2="${lx.toFixed(1)}" y1="${ly.toFixed(1)}" y2="${h - padB}" stroke="${now}" stroke-width="5" stroke-linecap="round"/>`);
  }
  if (kind === "step") {
    let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) d += ` H${pts[i][0].toFixed(1)} V${pts[i][1].toFixed(1)}`;
    const dA = d + ` V${h - padB} H${pts[0][0].toFixed(1)} Z`;
    return svg(`<defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${area || line}" stop-opacity=".38"/><stop offset="1" stop-color="${area || line}" stop-opacity="0"/></linearGradient></defs>${gridL}<path d="${dA}" fill="url(#${gid})"/><path d="${d}" fill="none" stroke="${line}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>${maxLbl}${head}`);
  }
  const areaP = lineP + ` L${lx.toFixed(1)} ${h - padB} L${pts[0][0].toFixed(1)} ${h - padB} Z`;
  return svg(`<defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${area || line}" stop-opacity=".5"/><stop offset="1" stop-color="${area || line}" stop-opacity="0"/></linearGradient></defs>${gridL}<path d="${areaP}" fill="url(#${gid})"/><path d="${lineP}" fill="none" stroke="${line}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>${maxLbl}${head}`);
}

export const statChips = (x, { bg = "#fff", ink = C.azul, hiBg = C.azul, hiInk = "#fff", radius = 30, size = 40, shadow = "0 10px 26px rgba(0,22,80,.14)" } = {}) => {
  const c = x.cor, per = c.base === 1000 ? " (x1.000)" : "";
  return [["Mín.", rateFmt(c, x.mn), bg, ink], ["Ahora", rateFmt(c, x.cur), hiBg, hiInk], ["Máx.", rateFmt(c, x.mx), bg, ink]]
    .map(([l, v, b, col]) => `<div style="flex:1;background:${b};color:${col};border-radius:${radius}px;padding:18px 8px;text-align:center;box-shadow:${shadow}"><div style="font-weight:600;font-size:23px;opacity:.82">${l}${per}</div><div class="m" style="font-weight:800;font-size:${size}px">${v}</div></div>`)
    .join("");
};

// ---------- tablas de montos (3 montos de ejemplo con la tasa del momento) ----------
export const tableCard = (x, { bg = "#fff", rowInk = C.azul, numInk = C.vez, border = "rgba(0,28,112,.12)", radius = 44, pad = "14px 44px", shadow = "0 24px 60px rgba(0,22,80,.22)", fs = 40, fn = 48 } = {}) =>
  `<div style="background:${bg};border-radius:${radius}px;padding:${pad};box-shadow:${shadow}">${x.cor.amounts.map((m, i) => `<div style="display:flex;justify-content:space-between;align-items:baseline;padding:12px 0;${i < 2 ? `border-bottom:3px solid ${border};` : ""}"><span style="font-weight:600;font-size:${fs}px;color:${rowInk}">${money(x.cor, m)}</span><span class="m" style="font-weight:800;font-size:${fn}px;color:${numInk}">${conv(x, m)} ${x.cor.unit}</span></div>`).join("")}</div>`;

export const tableTiles = (x, { bg = "#fff", ink = C.azul, numInk = C.vez, gap = 18, radius = 34, hi = 1, hiBg = C.azul, hiInk = "#fff" } = {}) =>
  `<div style="display:flex;gap:${gap}px">${x.cor.amounts.map((m, i) => { const on = i === hi; return `<div style="flex:1;background:${on ? hiBg : bg};color:${on ? hiInk : ink};border-radius:${radius}px;padding:26px 10px;text-align:center;box-shadow:0 14px 34px rgba(0,22,80,.2)"><div style="font-weight:600;font-size:25px;opacity:.85">${money(x.cor, m)}</div><div style="margin:8px 0;display:flex;justify-content:center;opacity:.7">${arrowSvg(34)}</div><div class="m" style="font-weight:800;font-size:${conv(x, m).length > 9 ? 33 : 38}px;color:${on ? hiInk : numInk}">${conv(x, m)}</div><div style="font-weight:700;font-size:25px;opacity:.85">${x.cor.unit}</div></div>`; }).join("")}</div>`;

export const tableLadder = (x, { track = "rgba(0,28,112,.1)", bar = `linear-gradient(90deg,${C.vez},${C.cielo})`, ink = C.azul, numInk = C.azul } = {}) => {
  const max = Math.max(...x.cor.amounts);
  return x.cor.amounts.map((m) => `<div style="margin:22px 0"><div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px"><span style="font-weight:600;font-size:36px;color:${ink}">${money(x.cor, m)}</span><span class="m" style="font-weight:800;font-size:46px;color:${numInk}">${conv(x, m)} ${x.cor.unit}</span></div><div style="height:26px;border-radius:13px;background:${track}"><div style="height:26px;border-radius:13px;width:${Math.max(16, Math.round((m / max) * 100))}%;background:${bar}"></div></div></div>`).join("");
};

export const tablePills = (x, { bg = "#fff", ink = C.azul, numInk = C.vez, ring = "#fff" } = {}) =>
  x.cor.amounts.map((m) => `<div style="display:flex;align-items:center;gap:18px;background:${bg};border-radius:999px;padding:14px 30px 14px 16px;margin:16px 0;box-shadow:0 12px 30px rgba(0,22,80,.2)">${flag(x.cor.fromFlag, 64, ring)}<span style="font-weight:700;font-size:36px;color:${ink};flex:1">${money(x.cor, m)}</span><span style="color:${C.cielo}">${arrowSvg(36)}</span>${flag(x.cor.toFlag, 64, ring)}<span class="m" style="font-weight:800;font-size:40px;color:${numInk};min-width:300px;text-align:right">${conv(x, m)} ${x.cor.unit}</span></div>`).join("");

export const tableTicket = (x, { bg = "#fff", ink = C.azul, numInk = C.vez } = {}) =>
  `<div style="background:${bg};border-radius:34px;padding:34px 46px 26px;box-shadow:0 26px 60px rgba(0,22,80,.28);position:relative">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><span class="m" style="font-weight:800;font-size:26px;letter-spacing:.12em;color:${C.gris};text-transform:uppercase">Resumen de envío</span><span style="display:inline-flex;gap:8px">${flag(x.cor.fromFlag, 40, "#fff")}${flag(x.cor.toFlag, 40, "#fff")}</span></div>
    ${x.cor.amounts.map((m, i) => `<div style="display:flex;justify-content:space-between;align-items:baseline;padding:16px 0;${i ? `border-top:3px dashed ${C.gris20};` : `border-top:3px dashed ${C.gris20};`}"><span style="font-weight:600;font-size:38px;color:${ink}">${money(x.cor, m)}</span><span class="m" style="font-weight:800;font-size:46px;color:${numInk}">${conv(x, m)} ${x.cor.unit}</span></div>`).join("")}
  </div>`;

// ---------- cotizador (réplica del cotizador de vezmoney.com) ----------
export const quote = (x, { bg = "#fff", ink = C.azul, boxBg = C.nube, boxInk = C.azul, numInk = C.vez, arrowBg = C.rosa, rateBg = C.azul, rateInk = "#fff", amt = 2, shadow = "0 26px 70px rgba(0,22,80,.3)", radius = 48, style = "left:56px;right:56px" } = {}) => {
  const c = x.cor, m = c.amounts[amt];
  return `<div class="abs" style="${style};background:${bg};border-radius:${radius}px;padding:40px 44px;box-shadow:${shadow};color:${ink}">
    <div style="font-weight:600;font-size:28px;opacity:.75;margin-bottom:10px">Tú envías</div>
    <div style="display:flex;align-items:center;gap:20px;background:${boxBg};border-radius:28px;padding:20px 26px">${flag(c.fromFlag, 70)}<span class="m" style="font-weight:800;font-size:56px;color:${boxInk}">${money(c, m)}</span></div>
    <div style="display:flex;justify-content:center;margin:-14px 0 -14px"><span style="position:relative;z-index:2;width:76px;height:76px;border-radius:50%;background:${arrowBg};color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 20px rgba(0,0,0,.25);transform:rotate(90deg)">${arrowSvg(42)}</span></div>
    <div style="font-weight:600;font-size:28px;opacity:.75;margin-bottom:10px">Tu contacto recibe</div>
    <div style="display:flex;align-items:center;gap:20px;background:${boxBg};border-radius:28px;padding:20px 26px">${flag(c.toFlag, 70)}<span class="m" style="font-weight:900;font-size:62px;color:${numInk}">${conv(x, m)} ${c.unit}</span></div>
    <div class="m" style="margin-top:24px;text-align:center;background:${rateBg};color:${rateInk};font-weight:800;font-size:34px;padding:16px;border-radius:999px">${unitRate(c, x.cur)}</div>
  </div>`;
};

export const chip = (x, bg, color, style, size = 56) => `<div class="m abs" style="${style};background:${bg};color:${color};font-weight:800;font-size:${size}px;padding:20px 44px;border-radius:999px;white-space:nowrap;box-shadow:0 16px 40px rgba(0,22,80,.32)">${unitRate(x.cor, x.cur)}</div>`;
