// tutorial-captura.mjs — capturas REALES del cotizador público de vezmoney.com (vista móvil 390×844). No envía nada: solo cambia la moneda
// de destino y escribe un monto en el cotizador público. Devuelve las capturas (recortadas al cotizador), dónde están los controles
// (para dibujar los toques) y lo que mostró el cotizador (tasa, monto que recibe).
import fs from "node:fs";
import { chromium } from "playwright";

export const DESTINOS = {
  "Perú": { code: "PEN", foto: "pe01.jpg", flag: "PE" },
  "Colombia": { code: "COP", foto: "co01.jpg", flag: "CO" },
  "Venezuela": { code: "BS", foto: "av_tepui.jpg", flag: "VE" },
  "Argentina": { code: "ARS", foto: "ar01.jpg", flag: "AR" },
  "Ecuador": { code: "USDE", foto: "ec01.jpg", flag: "EC" },
  "Estados Unidos": { code: "USD", foto: "us01.jpg", flag: "US" },
};
export const CLIP = { x: 0, y: 92, w: 390, h: 568 }; // región recortada (px CSS) del cotizador dentro de la página móvil

export async function capturarCotizador(destino, dir, monto = "100000") {
  const d = DESTINOS[destino]; if (!d) throw new Error("destino no disponible para el tutorial: " + destino);
  fs.mkdirSync(dir, { recursive: true });
  const b = await chromium.launch();
  try {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2.5, isMobile: true, hasTouch: true, locale: "es-CL" });
    const p = await ctx.newPage();
    await p.goto("https://vezmoney.com/landing.html", { waitUntil: "networkidle", timeout: 60000 });
    await p.waitForTimeout(2200);
    // quita cabeceras fijas para que el cotizador se vea limpio
    await p.evaluate(() => { for (const el of document.querySelectorAll("*")) { const s = getComputedStyle(el).position; if (s === "fixed" || s === "sticky") el.style.display = "none"; } });
    const top = await p.evaluate(() => document.querySelector("#currency_1_amount").getBoundingClientRect().top + window.scrollY);
    const shot = async (n) => { await p.evaluate((t) => window.scrollTo(0, t - 190), top); await p.waitForTimeout(120); const f = `${dir}/${n}.jpg`; await p.screenshot({ path: f, type: "jpeg", quality: 92, clip: { x: CLIP.x, y: CLIP.y, width: CLIP.w, height: CLIP.h } }); return f; };
    const box = async (loc) => { const r = await loc.boundingBox(); return r && { x: r.x - CLIP.x, y: r.y - CLIP.y, w: r.width, h: r.height }; }; // boundingBox es relativo a la ventana
    await p.evaluate((t) => window.scrollTo(0, t - 190), top); await p.waitForTimeout(500);
    const fr = {}, pos = {}; fr.inicio = await shot("0-inicio");
    const selector = p.locator("button.relative").nth(1); pos.selector = await box(selector);
    await selector.click(); await p.waitForTimeout(700);
    fr.lista = await shot("1-lista");
    const opcion = p.locator("li.select-none:visible").filter({ hasText: d.code }).first(); pos.opcion = await box(opcion);
    await opcion.click(); await p.waitForTimeout(900);
    fr.destino = await shot("2-destino");
    const inp = p.locator("#currency_1_amount"); pos.envia = await box(inp); pos.recibe = await box(p.locator("#currency_2_amount"));
    await inp.click(); await p.keyboard.press("Control+A"); await p.keyboard.press("Backspace");
    fr.monto = [];
    for (const [i, ch] of [...monto].entries()) { await p.keyboard.type(ch); await p.waitForTimeout(650); fr.monto.push(await shot("3-monto" + i)); }
    await p.waitForTimeout(800); fr.final = await shot("4-final");
    const info = { code: d.code, tasa: await p.locator("#calculator_exchange_rate").inputValue().catch(() => ""), recibe: await p.locator("#currency_2_amount").inputValue().catch(() => ""), envia: await inp.inputValue() };
    return { frames: fr, pos, info };
  } finally { await b.close(); }
}
