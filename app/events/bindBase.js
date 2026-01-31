// app/events/bindBase.js
// Liga eventos da parte “Base” (nível e penalidade).

/**
 * Helper: liga evento input pra campos numéricos e aplica callback.
 * - lê Number
 * - valida NaN
 * - chama setter
 * - chama onChange (render)
 */
function ligarInputNumero(inputEl, setter, onChange) {
  inputEl.addEventListener("input", () => {
    const valor = Number(inputEl.value);
    if (Number.isNaN(valor)) return;
    setter(valor);
    onChange();
  });
}

export function bindBase(personagem, ui, onChange) {
  ligarInputNumero(ui.nivel, (v) => {
    personagem.nivel = Math.max(1, Math.floor(v));
  }, onChange);

  ligarInputNumero(ui.penalidadeArmadura, (v) => {
    personagem.penalidadeArmadura = Math.max(0, Math.floor(v));
  }, onChange);
}
