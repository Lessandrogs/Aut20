// app/calc/skillsCalc.js
// Regras de cálculo de perícias.

export function calcularMeioNivel(nivel) {
  // Tormenta costuma usar “metade do nível” (arredonda pra baixo)
  return Math.floor(nivel / 2);
}

export function bonusTreino(treinado, nivel) {
  // O bônus de treinamento é +2 do 1º ao 6º níveis,
  // +4 do 7º ao 14º níveis e +6 do 15º nível em diante.
  if (!treinado) return 0;
  if (nivel >= 15) return 6;
  if (nivel >= 7) return 4;
  return 2;
}

export function calcularPericiaTotal({
  nivel,
  meioNivel,
  modAtributo,
  treinado,
  outros,
  penalidade = 0
}) {
  // Fórmula Tormenta 20:
  // total = meioNivel + modAtributo + treino + outros - penalidade
  return (
    meioNivel +
    modAtributo +
    bonusTreino(treinado, nivel) +
    outros -
    penalidade
  );
}
