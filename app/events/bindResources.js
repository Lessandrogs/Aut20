// app/events/bindResources.js
// Liga eventos de PV/PM atuais (inputs editáveis).

import { clampInt } from "../calc/resourcesCalc.js";

/**
 * Conecta inputs de PV/PM atual ao state.
 * Exemplo 1: tomou dano -> usuário digita PV atual e o state reflete.
 * Exemplo 2: gastou mana -> usuário digita PM atual e o app não deixa passar do máximo.
 */
export function bindResources(personagem, ui, onChange) {
  ui.vidaAtual.addEventListener("input", () => {
    const max = personagem.recursos.pvMax ?? 0;
    personagem.recursos.pvAtual = clampInt(ui.vidaAtual.value, 0, max, max);
    onChange();
  });

  ui.manaAtual.addEventListener("input", () => {
    const max = personagem.recursos.pmMax ?? 0;
    personagem.recursos.pmAtual = clampInt(ui.manaAtual.value, 0, max, max);
    onChange();
  });
}
