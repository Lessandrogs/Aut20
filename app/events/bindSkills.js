// app/events/bindSkills.js
// Liga eventos da tabela de perícias.
// Aqui entra a correção importante:
// Checkbox dispara "input" e depois "change".
// Se renderizar no input do checkbox, ele desmarca sozinho.
// Então: checkbox é tratado só no change.

export function bindSkills(personagem, ui, onChange) {
  // Input: outros (number) e nome custom (text)
  ui.skillsContainer.addEventListener("input", (e) => {
    const el = e.target;
    const tr = el.closest('tr[data-skill-id]');
    if (!tr) return;

    const skillId = tr.getAttribute("data-skill-id");
    const state = personagem.pericias[skillId];
    if (!state) return;

    const role = el.dataset.role;

    // ✅ Checkbox "treinado" NÃO é tratado aqui
    if (role === "treinado") return;

    if (role === "outros") {
      const v = Number(el.value);
      state.outros = Number.isNaN(v) ? 0 : Math.floor(v);
    }

    if (role === "customName") {
      state.nomeCustom = String(el.value ?? "");
    }

    onChange();
  });

  // Change: checkbox treinado
  ui.skillsContainer.addEventListener("change", (e) => {
    const el = e.target;
    const tr = el.closest('tr[data-skill-id]');
    if (!tr) return;

    const skillId = tr.getAttribute("data-skill-id");
    const state = personagem.pericias[skillId];
    if (!state) return;

    const role = el.dataset.role;

    if (role === "treinado") {
      state.treinado = !!el.checked;
      // Debug opcional (se quiser deixar ligado por enquanto)
      // console.log("[DEBUG] treinado:", skillId, "=>", state.treinado);
    }

    onChange();
  });
}
