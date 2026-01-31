// app/app.js
// Orquestrador do app (inicializa UI, liga eventos e renderiza).

console.log("APP.JS CARREGADO DE:", import.meta.url);

import { personagem, replacePersonagem, resetPersonagem, createInitialState } from "./state.js";
import { pegarUI } from "./ui/dom.js";
import { renderTudo } from "./ui/render.js";

import { bindClass } from "./events/bindClass.js";
import { bindBase } from "./events/bindBase.js";
import { bindAttributes } from "./events/bindAttributes.js";
import { bindSkills } from "./events/bindSkills.js";
import { bindResources } from "./events/bindResources.js";

import { bindThemeToggle } from "./ui/theme.js";
import { bindAuth } from "./events/bindAuth.js";

import { saveCharacter, loadCharacter, clearCharacter } from "./storage/localStorage.js";

/**
 * Inicializa o aplicativo:
 * 1) pega referências da UI (IDs do HTML)
 * 2) carrega save local (se existir)
 * 3) renderiza tudo (tabela + números)
 * 4) liga eventos (inputs/checkboxes)
 */
export function initApp() {
  console.log("script carregou (módulos)");

  const ui = pegarUI();

  // ===== Tema =====
  const btnTheme = document.getElementById("themeToggle");
  if (btnTheme) bindThemeToggle(btnTheme);

  // ===== Load local (antes do primeiro render) =====
  const saved = loadCharacter();
  if (saved) {
    replacePersonagem(saved);
  } else {
    replacePersonagem(createInitialState());
  }

  // Função padrão que usamos em todos os eventos:
  // sempre que algo mudar no estado, re-renderiza.
  const onChange = () => {
    // marca updatedAt
    if (!personagem.meta) personagem.meta = { version: 1, updatedAt: Date.now() };
    personagem.meta.updatedAt = Date.now();

    renderTudo(personagem, ui);

    // autosave local (se não estiver logado via auth)
    // (o bindAuth pode sobrescrever com autosave remoto quando logado)
    if (!ui._isLoggedIn) {
      saveCharacter(personagem);
    }
  };

  // Render inicial (já com estado carregado)
  onChange();

  // ===== Auth + autosave remoto =====
  // bindAuth marca ui._isLoggedIn e devolve um hook opcional para autosave remoto
  bindAuth(personagem, ui, onChange);

  // ===== Eventos =====
  bindBase(personagem, ui, onChange);
  bindAttributes(personagem, ui, onChange);
  bindSkills(personagem, ui, onChange);
  bindResources(personagem, ui, onChange);
  bindClass(personagem, ui, onChange);

  // ===== Reset (centralizado aqui) =====
  if (ui.resetPersonagem) {
    ui.resetPersonagem.addEventListener("click", () => {
      clearCharacter();
      resetPersonagem();
      onChange();
    });
  }
}

// Auto-start seguro (módulo carregado via <script type="module">)
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
