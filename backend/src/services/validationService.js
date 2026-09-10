export function emailValido(email) {
  return typeof email === "string" && /^\S+@\S+\.\S+$/.test(email);
}

export function valorMonetarioValido(valor, limite = 1_000_000) {
  const numero = Number(valor);
  return Number.isFinite(numero) && numero > 0 && numero <= limite && Math.round(numero * 100) === numero * 100;
}

export function corHexValida(cor) {
  return typeof cor === "string" && /^#[0-9a-fA-F]{6}$/.test(cor);
}
