// app/app.js
// Orquestrador do app:
// - Pega referências do DOM
// - Renderiza a UI inteira
// - Liga todos os eventos (base, atributos, perícias, recursos, classe)
// - Liga auth (login/register/logout) + autosave
//
// ✅ Regra de ouro deste projeto:
//   O objeto `personagem` NÃO pode ter a referência trocada.
//   Sempre atualize com Object.assign(...) dentro dos módulos de load/reset.
//   (Isso evita quebrar imports e binds em outros arquivos.)

console.log("APP.JS CARREGADO DE:", import.meta.url);

import { personagem, createInitialState } from "./state.js";
import { pegarUI } from "./ui/dom.js";
import { renderTudo } from "./ui/render.js";

// binds de eventos
import { bindBase } from "./events/bindBase.js";
import { bindAttributes } from "./events/bindAttributes.js";
import { bindSkills } from "./events/bindSkills.js";
import { bindResources } from "./events/bindResources.js";
import { bindClass } from "./events/bindClass.js";

// tema (dark mode)
import { bindThemeToggle } from "./ui/theme.js";

// auth
import { bindAuth } from "./events/bindAuth.js";

/**
 * Inicializa o aplicativo:
 * 1) pega referências da UI (IDs do HTML)
 * 2) cria onChange central (render + autosave)
 * 3) render inicial
 * 4) liga theme
 * 5) liga auth (carrega ficha do usuário/char ativo se existir)
 * 6) liga binds do resto do app
 */
export function initApp() {
  console.log("script carregou (módulos)");

  // 1) UI
  const ui = pegarUI();

  // 2) Theme (não depende do resto)
  //    (Se o botão não existir, o bindTheme pode simplesmente não fazer nada)
const btnTheme = document.getElementById("themeToggle");
if (btnTheme) bindThemeToggle(btnTheme);

  // 3) Auth hook (retorna autosave)
  //    ⚠️ bindAuth precisa do createInitialState para criar fichas novas corretamente.
  let authHook = null;
  authHook = bindAuth(personagem, ui, () => onChange(), createInitialState);

  // 4) onChange central:
  //    - Renderiza tudo
  //    - Se estiver logado, autosave no personagem ativo
  function onChange() {
    renderTudo(personagem, ui);
    authHook?.autosave?.();
  }

  // 5) Render inicial
  onChange();

  // 6) Liga eventos por responsabilidade
  //    (Cada bind só escuta inputs e altera o estado, depois chama onChange)
  bindBase(personagem, ui, onChange);
  bindAttributes(personagem, ui, onChange);
  bindSkills(personagem, ui, onChange);
  bindResources(personagem, ui, onChange);
  bindClass(personagem, ui, onChange);
}

/**
 * Boot seguro:
 * - Se o módulo carregou antes do DOM, espera DOMContentLoaded
 * - Caso contrário, inicia imediatamente
 *
 * ✅ Importante: este bloco deve ficar NO FINAL do arquivo.
 */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
