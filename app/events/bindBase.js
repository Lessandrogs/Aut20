// app/events/bindBase.js
// Liga eventos da seção Base:
// - nível
// - penalidade de armadura
// - classe
// - reset da ficha
//
// IMPORTANTE: Mantém a assinatura original do projeto:
// bindBase(personagem, ui, onChange)
// (se inverter, o app.js vai passar os parâmetros “errado” e quebra)

import { resetPersonagem } from "../state.js";
// resetPersonagem() reseta o state SEM trocar a referência do objeto personagem (regra de ouro)

function toInt(value, fallback) {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
}

export function bindBase(personagem, ui, onChange) {
  // Nível
  ui.nivel.addEventListener("input", () => {
    // FIX: nível deve ser inteiro e no mínimo 1 (T20 não tem nível 0)
    const v = Math.max(1, toInt(ui.nivel.value, 1));
    personagem.nivel = v;

    // Status visual (não afeta cálculo, só feedback)
    ui.statusNivel.textContent = "OK";
    onChange();
  });

  // Penalidade de Armadura
  ui.penalidadeArmadura.addEventListener("input", () => {
    // FIX: evita NaN e mantém >= 0 (penalidade negativa geralmente não faz sentido)
    const v = Math.max(0, toInt(ui.penalidadeArmadura.value, 0));
    personagem.penalidadeArmadura = v;

    ui.statusPenalidade.textContent = "OK";
    onChange();
  });

  // Classe
  ui.classe.addEventListener("change", () => {
    // Classe impacta PV/PM via tabela em /data/classes.js
    const id = String(ui.classe.value || "");
    personagem.classeId = id || null;

    ui.statusClasse.textContent = id ? "OK" : "";
    onChange();
  });

  // Reset
  ui.resetPersonagem.addEventListener("click", () => {
    // FIX: reset seguro, sem reatribuir o objeto personagem
    resetPersonagem();
    onChange();
  });
}
