// icons3d.mjs — íconos "3D de arcilla" dibujados en SVG con la paleta VezMoney (sin dependencias, sin licencias de terceros).
// Cada función devuelve un <svg> de 200×200 escalable: ico.coin(120), ico.bill(160, {rot:-12}) …
// Luz desde arriba a la izquierda: degradado radial + brillo suave + borde más oscuro abajo + sombra proyectada.
let _n = 0;
const id = (p) => `${p}${_n++}`;
const TONES = {
  azul: ["#9DBBFF", "#3F6FF0", "#0A2A9A", "#001450"],
  cielo: ["#E3EDFF", "#8FB0FF", "#4F7DF0", "#2A4FC0"],
  lav: ["#EEF0FF", "#BFC3FB", "#8F95EC", "#5F66C4"],
  oro: ["#FFF3C4", "#FFD866", "#F2A81E", "#B8700A"],
  rosa: ["#FFC1DC", "#FF5CA6", "#F20775", "#A0044E"],
  blanco: ["#FFFFFF", "#F1F4FB", "#D5DCEC", "#A9B4CE"],
  turq: ["#CFFAFA", "#6EE3E4", "#22C7C9", "#128A8C"],
};
const grad = (gid, t, cx = "32%", cy = "26%") => `<radialGradient id="${gid}" cx="${cx}" cy="${cy}" r="82%"><stop offset="0" stop-color="${t[0]}"/><stop offset=".38" stop-color="${t[1]}"/><stop offset=".78" stop-color="${t[2]}"/><stop offset="1" stop-color="${t[3]}"/></radialGradient>`;
const lin = (gid, a, b, x2 = "0", y2 = "1") => `<linearGradient id="${gid}" x1="0" y1="0" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
const shadow = (sid, dy = 10, blur = 9, op = 0.32) => `<filter id="${sid}" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="${dy}" stdDeviation="${blur}" flood-color="#00103A" flood-opacity="${op}"/></filter>`;
const wrap = (size, body, style = "") => `<svg viewBox="0 0 200 200" width="${size}" height="${size}" style="display:block;overflow:visible;${style}">${body}</svg>`;
const rot = (deg, inner) => `<g transform="rotate(${deg} 100 100)">${inner}</g>`;

export const ico = {
  // moneda: canto con grosor, cara con relieve y símbolo
  coin(size, { tone = "cielo", sym = "$", rotate = 0, style = "" } = {}) {
    const t = TONES[tone], g = id("g"), s = id("s"), e = id("e");
    return wrap(size, `<defs>${grad(g, t)}${lin(e, t[2], t[3])}${shadow(s, 12, 8)}</defs>
    ${rot(rotate, `<g filter="url(#${s})"><circle cx="100" cy="112" r="70" fill="url(#${e})"/><circle cx="100" cy="100" r="70" fill="url(#${g})"/></g>
    <circle cx="100" cy="100" r="56" fill="none" stroke="${t[3]}" stroke-opacity=".28" stroke-width="3"/>
    <circle cx="100" cy="100" r="55" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.6" transform="translate(-1 -1)"/>
    <text x="100" y="126" text-anchor="middle" font-family="Inter,Arial" font-weight="900" font-size="${sym.length > 1 ? 54 : 78}" fill="${t[3]}" fill-opacity=".30" transform="translate(2 3)">${sym}</text>
    <text x="100" y="126" text-anchor="middle" font-family="Inter,Arial" font-weight="900" font-size="${sym.length > 1 ? 54 : 78}" fill="#fff" fill-opacity=".92">${sym}</text>
    <path d="M52 78 A56 56 0 0 1 120 46" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="7" stroke-linecap="round"/>`)}`, style);
  },
  // billete inclinado
  bill(size, { tone = "cielo", sym = "Bs", rotate = -10, style = "" } = {}) {
    const t = TONES[tone], g = id("g"), s = id("s"), e = id("e");
    return wrap(size, `<defs>${lin(g, t[0], t[2], "1", "1")}${lin(e, t[2], t[3])}${shadow(s, 12, 8)}</defs>
    ${rot(rotate, `<g filter="url(#${s})"><rect x="14" y="62" width="172" height="92" rx="14" fill="url(#${e})"/><rect x="14" y="54" width="172" height="92" rx="14" fill="url(#${g})"/></g>
    <rect x="24" y="64" width="152" height="72" rx="8" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="2.4" stroke-dasharray="2 5" stroke-linecap="round"/>
    <circle cx="100" cy="100" r="25" fill="#fff" fill-opacity=".28" stroke="#fff" stroke-opacity=".8" stroke-width="2.4"/>
    <text x="100" y="109" text-anchor="middle" font-family="Inter,Arial" font-weight="900" font-size="27" fill="${t[3]}">${sym}</text>
    <circle cx="44" cy="82" r="6" fill="#fff" fill-opacity=".8"/><circle cx="156" cy="118" r="6" fill="#fff" fill-opacity=".8"/>
    <path d="M24 66 H110" stroke="#fff" stroke-opacity=".55" stroke-width="5" stroke-linecap="round"/>`)}`, style);
  },
  // avión de papel con tres caras
  plane(size, { tone = "cielo", rotate = -8, style = "" } = {}) {
    const t = TONES[tone], a = id("a"), b = id("b"), c = id("c"), s = id("s");
    return wrap(size, `<defs>${lin(a, t[0], t[1], "1", "1")}${lin(b, t[1], t[2], "1", "1")}${lin(c, t[2], t[3], "1", "1")}${shadow(s, 14, 9, 0.28)}</defs>
    ${rot(rotate, `<g filter="url(#${s})"><polygon points="14,88 188,28 118,172 96,112" fill="url(#${a})"/><polygon points="96,112 188,28 118,172" fill="url(#${b})"/><polygon points="96,112 118,172 108,126" fill="url(#${c})"/></g><polygon points="14,88 96,112 188,28" fill="#fff" fill-opacity=".28"/>`)}`, style);
  },
  // globo terráqueo con meridianos
  globe(size, { tone = "cielo", style = "" } = {}) {
    const t = TONES[tone], g = id("g"), s = id("s"), k = id("k");
    return wrap(size, `<defs>${grad(g, t)}${shadow(s, 12, 9)}<clipPath id="${k}"><circle cx="100" cy="98" r="66"/></clipPath></defs>
    <g filter="url(#${s})"><circle cx="100" cy="98" r="66" fill="url(#${g})"/></g>
    <g clip-path="url(#${k})" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2.4"><ellipse cx="100" cy="98" rx="30" ry="66"/><ellipse cx="100" cy="98" rx="62" ry="66"/><path d="M34 98H166M44 66H156M44 130H156"/>
    <path d="M62 70c8-10 22-12 28-4s-4 14-12 16-18 2-16-12zM110 108c10-6 24-2 26 8s-8 22-18 20-14-20-8-28z" fill="#fff" fill-opacity=".38" stroke="none"/></g>
    <path d="M56 70 A50 50 0 0 1 104 44" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="7" stroke-linecap="round"/>`, style);
  },
  // celular de pie con pantalla
  phone(size, { tone = "azul", rotate = 8, text = "0,94", style = "" } = {}) {
    const t = TONES[tone], g = id("g"), sc = id("sc"), s = id("s");
    return wrap(size, `<defs>${lin(g, t[1], t[3], "1", "1")}${lin(sc, "#FFFFFF", "#DCE6FF")}${shadow(s, 14, 9, 0.3)}</defs>
    ${rot(rotate, `<g filter="url(#${s})"><rect x="56" y="14" width="88" height="172" rx="20" fill="url(#${g})"/></g>
    <rect x="63" y="22" width="74" height="156" rx="14" fill="url(#${sc})"/><rect x="88" y="27" width="24" height="6" rx="3" fill="${t[3]}" fill-opacity=".55"/>
    <text x="100" y="86" text-anchor="middle" font-family="Inter,Arial" font-weight="900" font-size="27" fill="${t[3]}">${text}</text>
    <rect x="73" y="102" width="54" height="7" rx="3.5" fill="${t[1]}" fill-opacity=".5"/><rect x="73" y="116" width="40" height="7" rx="3.5" fill="${t[1]}" fill-opacity=".35"/>
    <rect x="73" y="140" width="54" height="24" rx="12" fill="#F20775"/><path d="M93 152h14m-5-5 5 5-5 5" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M62 40 A30 30 0 0 1 92 20" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="4" stroke-linecap="round"/>`)}`, style);
  },
  // barras en isométrico
  bars(size, { tone = "azul", style = "" } = {}) {
    const t = TONES[tone], top = id("t"), fr = id("f"), sd = id("d"), s = id("s");
    const bar = (x, h) => { const y = 168 - h; return `<polygon points="${x},${y} ${x + 16},${y - 9} ${x + 46},${y - 9} ${x + 30},${y}" fill="url(#${top})"/><rect x="${x}" y="${y}" width="30" height="${h}" fill="url(#${fr})"/><polygon points="${x + 30},${y} ${x + 46},${y - 9} ${x + 46},${159} ${x + 30},${168}" fill="url(#${sd})"/>`; };
    return wrap(size, `<defs>${lin(top, t[0], t[1])}${lin(fr, t[1], t[2])}${lin(sd, t[2], t[3])}${shadow(s, 12, 9, 0.28)}</defs><g filter="url(#${s})">${bar(26, 50)}${bar(78, 86)}${bar(130, 122)}</g>`, style);
  },
  // ticket con corte
  ticket(size, { tone = "oro", rotate = -12, text = "VIAJE", style = "" } = {}) {
    const t = TONES[tone], g = id("g"), s = id("s");
    return wrap(size, `<defs>${lin(g, t[0], t[2], "1", "1")}${shadow(s, 12, 8)}</defs>
    ${rot(rotate, `<g filter="url(#${s})"><path d="M20 62h160a8 8 0 0 1 8 8v20a12 12 0 0 0 0 24v20a8 8 0 0 1-8 8H20a8 8 0 0 1-8-8v-20a12 12 0 0 0 0-24V70a8 8 0 0 1 8-8z" fill="url(#${g})"/></g>
    <path d="M130 66v68" stroke="${t[3]}" stroke-opacity=".5" stroke-width="3" stroke-dasharray="2 6" stroke-linecap="round"/>
    <text x="70" y="106" text-anchor="middle" font-family="Inter,Arial" font-weight="900" font-size="26" fill="${t[3]}">${text}</text>
    <path d="M148 86l16 14-16 14" fill="none" stroke="${t[3]}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`)}`, style);
  },
  // chispa de 4 puntas
  spark(size, { tone = "blanco", style = "" } = {}) {
    const t = TONES[tone], g = id("g"), s = id("s");
    return wrap(size, `<defs>${grad(g, t)}${shadow(s, 6, 5, 0.22)}</defs><path filter="url(#${s})" d="M100 16c6 44 30 68 84 84-54 16-78 40-84 84-6-44-30-68-84-84 54-16 78-40 84-84z" fill="url(#${g})"/>`, style);
  },
  // pin de mapa
  pin(size, { tone = "rosa", style = "" } = {}) {
    const t = TONES[tone], g = id("g"), s = id("s");
    return wrap(size, `<defs>${grad(g, t)}${shadow(s, 10, 7, 0.3)}</defs><g filter="url(#${s})"><path d="M100 184C62 138 40 112 40 78a60 60 0 0 1 120 0c0 34-22 60-60 106z" fill="url(#${g})"/></g><circle cx="100" cy="78" r="24" fill="#fff"/><circle cx="100" cy="78" r="10" fill="${t[2]}"/><path d="M58 52 A46 46 0 0 1 98 30" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="6" stroke-linecap="round"/>`, style);
  },
  // escudo con check (seguridad)
  shield(size, { tone = "azul", style = "" } = {}) {
    const t = TONES[tone], g = id("g"), s = id("s");
    return wrap(size, `<defs>${grad(g, t)}${shadow(s, 10, 8, 0.3)}</defs><g filter="url(#${s})"><path d="M100 18l66 24v50c0 40-28 66-66 86-38-20-66-46-66-86V42z" fill="url(#${g})"/></g><path d="M68 100l24 24 42-48" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/><path d="M56 48 L100 32" stroke="#fff" stroke-opacity=".6" stroke-width="6" stroke-linecap="round"/>`, style);
  },
};
