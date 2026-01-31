// app/calc/skillsCalc.js
// Regras de cálculo de perícias.

export function calcularMeioNivel(nivel) {
  // Tormenta costuma usar “metade do nível” (arredonda pra baixo)
  return Math.floor(nivel / 2);
}

export function bonusTreino(treinado) {
  // MVP: se treinado, +2
  return treinado ? 2 : 0;
}

export function calcularPericiaTotal({ meioNivel, modAtributo, treinado, outros, penalidade = 0 }) {
  // Fórmula do MVP:
  // total = meioNivel + modAtributo + treino + outros - penalidade
  return meioNivel + modAtributo + bonusTreino(treinado) + outros - penalidade;
}
