// photos.mjs — qué foto usa cada plantilla (Pexels; sin repetir personas entre historias y feed).
// pos = object-position para encuadrar bien la cara según el recorte de cada plantilla.
const p = (file, pos = "50% 20%") => ({ file, pos });
export const PHOTOS = {
  // A · lunes (nube)
  A: { s: [p("s02.jpg", "50% 30%"), p("s25.jpg", "50% 15%")], g: [p("s13.jpg", "55% 25%")], t: [p("s09.jpg", "50% 15%")], q: [p("s06.jpg", "50% 22%")],
       corridor: { CLPE: [p("pe01.jpg", "50% 45%")], CLCO: [p("co01.jpg", "50% 50%")] } },
  // B · martes (azul profundo)
  B: { s: [p("s01.jpg", "50% 20%"), p("s26.jpg", "50% 20%")], g: [p("s17.jpg", "50% 16%")], t: [p("s20.jpg", "55% 22%")], q: [p("s21.jpg", "50% 40%")],
       corridor: { PEVE: [p("pe02.jpg", "50% 50%")], COVE: [p("co02.jpg", "50% 50%")] } },
  // C · miércoles (cielo)
  C: { s: [p("s07.jpg", "50% 30%"), p("s27.jpg", "50% 22%")], g: [p("s10.jpg", "50% 5%")], t: [p("s16.jpg", "50% 10%")], q: [p("s04.jpg", "55% 5%")],
       corridor: { CLEC: [p("ec01.jpg", "50% 30%")], CLAR: [p("ar01.jpg", "50% 40%")] } },
  // D · jueves (blanco editorial)
  D: { s: [p("s05.jpg", "45% 25%"), p("s28.jpg", "60% 42%")], g: [p("s12.jpg", "50% 22%")], t: [p("s24.jpg", "50% 5%")], q: [p("s15.jpg", "50% 13%")],
       corridor: { CLUS: [p("us02.jpg", "50% 45%")], CLPE: [p("pe04.jpg", "50% 60%")] } },
  // E · viernes (foto duotono)
  E: { s: [p("s08.jpg", "55% 31%"), p("s29.jpg", "50% 12%")], g: [p("s03.jpg", "55% 5%")], t: [p("s18.jpg", "45% 60%")], q: [p("s22.jpg", "52% 5%")],
       corridor: { PEVE: [p("pe06.jpg", "50% 20%")], COVE: [p("co06.jpg", "50% 50%")] } },
  // F · sábado (lavanda)
  F: { s: [p("s23.jpg", "50% 12%"), p("s30.jpg", "55% 18%")], g: [p("s14.jpg", "45% 5%")], t: [p("s11.jpg", "50% 10%")], q: [p("s19.jpg", "45% 8%")],
       corridor: { CLPE: [p("pe03.jpg", "50% 50%")], CLCO: [p("co03.jpg", "50% 50%")] } },
};
// feed (personas distintas de las historias; los bancos de Perú y Colombia son paisajes distintos a los de las historias)
export const FEED_PHOTOS = {
  f1: p("f02.jpg", "55% 10%"),
  f2: p("f02.jpg", "55% 15%"),
  f3: p("f03.jpg", "50% 10%"),
  f4: p("pe05.jpg", "50% 28%"),
  f5: p("f05.jpg", "50% 20%"),
  f6: p("co05.jpg", "50% 62%"),
};
