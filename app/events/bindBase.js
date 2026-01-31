// app/events/bindBase.js
// Liga eventos da seção Base (nível, penalidade de armadura, etc).

export function bindBase(personagem, ui, onChange) {
  // Nível
  ui.nivel.addEventListener("input", () => {
    const v = Number(ui.nivel.value);
    personagem.nivel = Number.isFinite(v) ? v : 1;
    onChange();
  });

  // Penalidade de Armadura
  ui.penalidadeArmadura.addEventListener("input", () => {
    const v = Number(ui.penalidadeArmadura.value);
    personagem.penalidadeArmadura = Number.isFinite(v) ? v : 0;
    onChange();
  });
}
