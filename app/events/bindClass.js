// app/events/bindClass.js
// Responsável por:
// - Ouvir mudanças no <select id="classe">
// - Atualizar personagem.classeId
// - Chamar onChange() pra re-renderizar

export function bindClass(personagem, ui, onChange) {
  // Render inicial do select (caso state já tenha algo)
  ui.classe.value = personagem.classeId ?? "";

  ui.classe.addEventListener("change", () => {
    personagem.classeId = ui.classe.value; // "guerreiro", "ladino", etc.
    ui.statusClasse.textContent = personagem.classeId ? "OK" : "Selecione uma classe";
    onChange();
  });
}
