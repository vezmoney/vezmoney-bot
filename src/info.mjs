// info.mjs — horarios reales de VezMoney y "datos" rotativos (sin promesas de velocidad ni comparaciones)
// Horario: L–V 08:30–20:00 · sábado 08:30–16:00 · domingo cerrado. weekday: 0=domingo ... 6=sábado
export function hoursNote(weekday, hour, closing) {
  if (closing && weekday !== 0) return hour < 9 ? `Abrimos hoy a las 8:30 · atendemos hasta las ${closing}` : `Hoy atendemos hasta las ${closing}`;
  if (weekday === 0) return "Hoy domingo no operamos: retomamos el lunes desde las 8:30";
  if (weekday === 6) return hour < 9 ? "Abrimos hoy a las 8:30 · atendemos hasta las 16:00" : "Hoy atendemos hasta las 16:00";
  return hour < 9 ? "Abrimos hoy a las 8:30 · atendemos hasta las 20:00" : "Hoy atendemos hasta las 20:00";
}

const TIPS = [
  "cotiza en vezmoney.com y mira cuánto recibe tu contacto antes de enviar.",
  "opera solo en vezmoney.com y verifica siempre la dirección.",
  "verificamos tu depósito con inteligencia artificial: la verificación es automática.",
  "enviar es cuestión de 3 pasos: crea tu cuenta, elige el país y transfiere.",
  "conectamos 8 países desde una sola plataforma.",
  "revisa dos veces los datos del destinatario antes de enviar.",
  "¿dudas? escríbenos por WhatsApp.",
];
export const tipFor = (dayOfYear, slotIndex) => TIPS[(dayOfYear + slotIndex) % TIPS.length];

export const disclaimer = (hh) =>
  `Tasa del momento de publicación (${hh}). Se actualiza automáticamente en tiempo real: la tasa real es la que ves en vezmoney.com.`;
