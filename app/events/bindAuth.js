// app/events/bindAuth.js
// Responsável por:
// - Ligar os botões de login/register/logout
// - Atualizar UI de status
// - Integrar com salvar/carregar personagem

import { registrar, login, logout, getSessionUsername } from "../auth/auth.js";
import { saveJSON, loadJSON, keyCharacter } from "../storage/storage.js";

/**
 * UI “em modo logado” vs “modo deslogado”.
 */
function renderAuthUI(ui, username) {
  const logado = !!username;
  ui._isLoggedIn = logado;

  ui.btnLogout.disabled = !logado;
  ui.btnLogin.disabled = logado;
  ui.btnRegister.disabled = logado;

  ui.username.disabled = logado;
  ui.password.disabled = logado;

  ui.authStatus.textContent = logado
    ? `Logado como: ${username}`
    : "Você não está logado.";
}

/**
 * Carrega personagem do usuário logado.
 * Se não existir, mantém o personagem atual (default).
 */
function carregarPersonagemDoUser(personagem, username) {
  const saved = loadJSON(keyCharacter(username), null);
  if (!saved) return false;

  // Sobrescreve o objeto existente SEM trocar referência
  // (isso evita quebrar imports/referências em outros módulos)
  Object.assign(personagem, saved);
  return true;
}

/**
 * Salva personagem do usuário logado.
 */
function salvarPersonagemDoUser(personagem, username) {
  saveJSON(keyCharacter(username), personagem);
}

export function bindAuth(personagem, ui, onChange) {
  // Ao iniciar: checa sessão
  const sessUser = getSessionUsername();
  renderAuthUI(ui, sessUser);

  // Se já tinha sessão, tenta carregar ficha
  if (sessUser) {
    const ok = carregarPersonagemDoUser(personagem, sessUser);
    if (ok) onChange();
  }

  ui.btnRegister.addEventListener("click", async () => {
    const res = await registrar(ui.username.value, ui.password.value);
    ui.authStatus.textContent = res.msg;
  });

  ui.btnLogin.addEventListener("click", async () => {
    const res = await login(ui.username.value, ui.password.value);
    ui.authStatus.textContent = res.msg;

    if (res.ok) {
      renderAuthUI(ui, res.username);

      // Carrega ficha do usuário (se existir)
      const ok = carregarPersonagemDoUser(personagem, res.username);
      if (ok) {
        onChange();
      } else {
        // Se é primeira vez: salva o “default” como ficha inicial
        salvarPersonagemDoUser(personagem, res.username);
        onChange();
      }
    }
  });

  ui.btnLogout.addEventListener("click", () => {
    logout();
    renderAuthUI(ui, "");

    ui.username.value = "";
    ui.password.value = "";
    ui.authStatus.textContent = "Você saiu. Faça login novamente.";
  });

  /**
   * Hook de autosave:
   * você chama isso no onChange, mas só salva se estiver logado.
   *
   * Como você já tem onChange central, isso encaixa perfeito.
   */
  return {
    autosave() {
      const u = getSessionUsername();
      if (!u) return;
      salvarPersonagemDoUser(personagem, u);
    },
  };
}
