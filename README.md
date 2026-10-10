# vezmoney-bot

Publica solo las historias de tasa de VezMoney (y el post de feed de las 9:00) con la tasa **real** de `api.vezmoney.com`, a través de Metricool.

- `config.json` → qué se publica, a qué hora (hora de Chile), de qué corredor y qué días (1 = lunes … 6 = sábado; domingo no hay).
- `src/templates.mjs` + `src/fam-a.mjs … fam-f.mjs` (historias: 6 familias, una por día de lunes a sábado, × 4 plantillas + 1 de corredor) y `src/feed.mjs` (6 posts de feed, lunes a sábado). `src/photos.mjs` → qué foto usa cada plantilla. `src/info.mjs` → horarios y datos rotativos.
- Familias de historias: **A** nube (lun) · **B** azul profundo (mar) · **C** cielo (mié) · **D** blanco editorial (jue) · **E** foto duotono (vie) · **F** lavanda (sáb).
- Feed: lun Chile→Venezuela · mar Chile→Venezuela + Chile→otros · mié Chile→Venezuela · jue Perú→otros · vie Chile→Venezuela · sáb Colombia→otros.
- `.github/workflows/tasa.yml` → el temporizador (GitHub Actions).
- `out/` → imágenes generadas (se limpian solas a los 3 días). `state/published.json` → qué ya se publicó.

Todo lo de tasa lleva el aviso: *tasa del momento de publicación; se actualiza automáticamente en tiempo real; la real es la de vezmoney.com*.

Secretos necesarios (GitHub → Settings → Secrets and variables → Actions): `METRICOOL_TOKEN`, `METRICOOL_USER_ID` (5326777), `METRICOOL_BLOG_ID` (7049753). Sin `METRICOOL_TOKEN` el bot está en pausa y no publica nada.

Pruebas en tu PC: `npm install` · `npx playwright install chromium` · `node src/preview.mjs` (deja las imágenes en `preview/`) · `node src/run.mjs --dry --hour=9 --date=2026-10-12`.
