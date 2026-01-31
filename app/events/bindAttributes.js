// app/events/bindAttributes.js
// Liga eventos dos 6 atributos.

function ligarInputNumero(inputEl, setter, onChange) {
  inputEl.addEventListener("input", () => {
    const valor = Number(inputEl.value);
    if (Number.isNaN(valor)) return;
    setter(valor);
    onChange();
  });
}

export function bindAttributes(personagem, ui, onChange) {
  ligarInputNumero(ui.forca, (v) => (personagem.atributos.forca = Math.floor(v)), onChange);
  ligarInputNumero(ui.destreza, (v) => (personagem.atributos.destreza = Math.floor(v)), onChange);
  ligarInputNumero(ui.constituicao, (v) => (personagem.atributos.constituicao = Math.floor(v)), onChange);
  ligarInputNumero(ui.inteligencia, (v) => (personagem.atributos.inteligencia = Math.floor(v)), onChange);
  ligarInputNumero(ui.sabedoria, (v) => (personagem.atributos.sabedoria = Math.floor(v)), onChange);
  ligarInputNumero(ui.carisma, (v) => (personagem.atributos.carisma = Math.floor(v)), onChange);
}
