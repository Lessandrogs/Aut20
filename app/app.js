// app/app.js
console.log("APP.JS CARREGADO DE:", import.meta.url);

import { personagem } from "./state.js";
import { pegarUI } from "./ui/dom.js";
import { renderTudo } from "./ui/render.js";
import { bindClass } from "./events/bindClass.js";
import { bindBase } from "./events/bindBase.js";
import { bindAttributes } from "./events/bindAttributes.js";
import { bindSkills } from "./events/bindSkills.js";
import { bindResources } from "./events/bindResources.js";

export function initApp() {
  console.log("script carregou (módulos)");

  const ui = pegarUI();
  const onChange = () => renderTudo(personagem, ui);

  // render inicial
  onChange();

  // eventos
  bindBase(personagem, ui, onChange);
  bindAttributes(personagem, ui, onChange);
  bindSkills(personagem, ui, onChange);
  bindResources(personagem, ui, onChange);
  bindClass(personagem, ui, onChange);
}

function initAppSafe() {
  try {
    initApp();
  } catch (err) {
    console.error("[INIT ERROR]", err);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAppSafe);
} else {
  initAppSafe();
}

