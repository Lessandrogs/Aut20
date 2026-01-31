// app/calc/attributes.js
// Funções “puras”: entram números, saem números/strings.
// Não conhecem DOM e não mexem no estado.

export function calcularModificador(valor) {
  // Ex.: 10 -> 0, 14 -> +2, 8 -> -1
  return Math.floor((valor - 10) / 2);
}

export function formatarMod(num) {
  // Mostra + quando é positivo (pra ficar com cara de ficha)
  return num >= 0 ? `+${num}` : `${num}`;
}
