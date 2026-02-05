// app/events/bindAuth.js
// Responsável por:
// - Ligar login/register/logout
// - Controlar UI (logado/deslogado)
// - Controlar múltiplos personagens por usuário (lista + personagem ativo)
// - Carregar/salvar a ficha no localStorage sem quebrar referência do objeto `personagem`
//
// ✅ Regra importante do projeto:
//    NUNCA faça `personagem = outroObjeto` aqui.
//    Sempre use `Object.assign(personagem, dados)` para não quebrar imports/referências
//    em outros módulos (render, binds, etc).

import { registrar, login, logout, getSessionUsername } from "../auth/auth.js";
import {
  saveJSON,
  loadJSON,
  keyCharacter,
  loadCharList,
  saveCharList,
  loadActiveChar,
  saveActiveChar,
} from "../storage/storage.js";

/**
 * 1) UI “modo logado” vs “modo deslogado”.
 * Centraliza tudo que habilita/desabilita botões e campos.
 */
function renderAuthUI(ui, username) {
  const logado = !!username;
  ui._isLoggedIn = logado;

  // auth buttons
  ui.btnLogout.disabled = !logado;
  ui.btnLogin.disabled = logado;
  ui.btnRegister.disabled = logado;

  // auth fields
  ui.username.disabled = logado;
  ui.password.disabled = logado;

  // multi-char (só faz sentido logado)
  ui.charSelect.disabled = !logado;
  ui.btnNewChar.disabled = !logado;
  ui.btnDeleteChar.disabled = !logado;

  ui.authStatus.textContent = logado
    ? `Logado como: ${username}`
    : "Você não está logado.";
}

/**
 * 2) Garante que o usuário tem uma lista de personagens.
 * Se não existir, cria a lista padrão:
 * - { id: "main", nome: "Personagem 1", ... }
 * e marca "main" como ativo.
 */
function ensureDefaultCharList(username) {
  let list = loadCharList(username);

  if (!Array.isArray(list) || list.length === 0) {
    list = [
      {
        id: "main",
        nome: "Personagem 1",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ];
    saveCharList(username, list);
    saveActiveChar(username, "main");
  }

  return list;
}

/**
 * 3) Preenche o <select> de personagens.
 */
function fillCharSelect(ui, list, activeId) {
  ui.charSelect.innerHTML = "";

  for (const c of list) {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.nome || c.id;
    if (c.id === activeId) opt.selected = true;
    ui.charSelect.appendChild(opt);
  }
}

/**
 * 4) Carrega uma ficha (por user + charId).
 * Retorna true se carregou, false se não existe save.
 *
 * ✅ Importante: não troca referência do objeto `personagem`.
 */
function carregarPersonagem(personagem, username, charId) {
  const saved = loadJSON(keyCharacter(username, charId), null);
  if (!saved) return false;

  Object.assign(personagem, saved);
  return true;
}

/**
 * 5) Salva uma ficha (por user + charId).
 * Também atualiza o updatedAt na lista de personagens.
 */
function salvarPersonagem(personagem, username, charId) {
  saveJSON(keyCharacter(username, charId), personagem);

  const list = loadCharList(username);
  const idx = list.findIndex((c) => c.id === charId);
  if (idx >= 0) {
    list[idx].updatedAt = Date.now();
    saveCharList(username, list);
  }
}

/**
 * 6) Gera um ID simples para novos personagens.
 * (Suficiente para localStorage)
 */
function createCharId() {
  return `c${Math.random().toString(36).slice(2, 8)}${Date.now()
    .toString(36)
    .slice(3)}`;
}

/**
 * bindAuth(personagem, ui, onChange, createInitialState)
 *
 * - personagem: objeto de estado mutável (NÃO trocar referência!)
 * - ui: refs do DOM
 * - onChange: sua função central de render
 * - createInitialState: fábrica do estado inicial (para criar personagem novo / fallback)
 */
export function bindAuth(personagem, ui, onChange, createInitialState) {
  // ===== Ao iniciar o app: checa sessão e carrega se estiver logado =====
  const sessUser = getSessionUsername();
  renderAuthUI(ui, sessUser);

  if (sessUser) {
    // garante lista + seleciona ativo
    const list = ensureDefaultCharList(sessUser);
    const active = loadActiveChar(sessUser);

    fillCharSelect(ui, list, active);

    // tenta carregar a ficha do ativo
    const ok = carregarPersonagem(personagem, sessUser, active);

    // se não tiver save ainda (raro), cria um default e salva
    if (!ok && createInitialState) {
      Object.assign(personagem, createInitialState());
      salvarPersonagem(personagem, sessUser, active);
    }

    onChange();
  }

  // ===== Register =====
  ui.btnRegister.addEventListener("click", async () => {
    const res = await registrar(ui.username.value, ui.password.value);
    ui.authStatus.textContent = res.msg;
  });

  // ===== Login =====
  ui.btnLogin.addEventListener("click", async () => {
    const res = await login(ui.username.value, ui.password.value);
    ui.authStatus.textContent = res.msg;

    if (!res.ok) return;

    // muda UI para "logado"
    renderAuthUI(ui, res.username);

    // garante lista + ativo
    const list = ensureDefaultCharList(res.username);
    const active = loadActiveChar(res.username);

    fillCharSelect(ui, list, active);

    // carrega ficha do ativo
    const ok = carregarPersonagem(personagem, res.username, active);

    // se primeira vez: cria ficha default e salva
    if (!ok && createInitialState) {
      Object.assign(personagem, createInitialState());
      salvarPersonagem(personagem, res.username, active);
    }

    onChange();
  });

  // ===== Logout =====
  ui.btnLogout.addEventListener("click", () => {
    logout();
    renderAuthUI(ui, "");

    // limpa inputs
    ui.username.value = "";
    ui.password.value = "";

    // limpa select
    ui.charSelect.innerHTML = "";

    ui.authStatus.textContent = "Você saiu. Faça login novamente.";
  });

  // ===== Trocar personagem no select =====
  ui.charSelect.addEventListener("change", () => {
    const u = getSessionUsername();
    if (!u) return;

    const charId = ui.charSelect.value || "main";

    // marca como ativo
    saveActiveChar(u, charId);

    // carrega ficha do char selecionado (ou cria default se não existir)
    const ok = carregarPersonagem(personagem, u, charId);
    if (!ok && createInitialState) {
      Object.assign(personagem, createInitialState());
      salvarPersonagem(personagem, u, charId);
    }

    onChange();
  });

  // ===== Criar novo personagem =====
  ui.btnNewChar.addEventListener("click", () => {
    const u = getSessionUsername();
    if (!u) return;

    const list = ensureDefaultCharList(u);

    const newId = createCharId();
    const nome = `Personagem ${list.length + 1}`;

    list.push({
      id: newId,
      nome,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    saveCharList(u, list);

    // torna esse novo o ativo
    saveActiveChar(u, newId);
    fillCharSelect(ui, list, newId);

    // cria estado inicial e salva como ficha desse novo personagem
    if (createInitialState) {
      Object.assign(personagem, createInitialState());
    }

    salvarPersonagem(personagem, u, newId);
    onChange();
  });

  // ===== Apagar personagem =====
  ui.btnDeleteChar.addEventListener("click", () => {
    const u = getSessionUsername();
    if (!u) return;

    const list = loadCharList(u);
    if (!Array.isArray(list) || list.length <= 1) {
      ui.authStatus.textContent = "Você precisa ter pelo menos 1 personagem.";
      return;
    }

    const current = ui.charSelect.value || "main";

    // remove da lista
    const newList = list.filter((c) => c.id !== current);
    saveCharList(u, newList);

    // remove a ficha do storage
    localStorage.removeItem(keyCharacter(u, current));

    // escolhe o primeiro restante como ativo
    const next = newList[0].id;
    saveActiveChar(u, next);
    fillCharSelect(ui, newList, next);

    // carrega a ficha do novo ativo
    const ok = carregarPersonagem(personagem, u, next);
    if (!ok && createInitialState) {
      Object.assign(personagem, createInitialState());
      salvarPersonagem(personagem, u, next);
    }

    onChange();
  });

  /**
   * Hook de autosave:
   * você chama isso dentro do seu onChange central (ou quando quiser),
   * mas só salva se estiver logado.
   *
   * Salva no personagem ativo (charId atual).
   */
  return {
    autosave() {
      const u = getSessionUsername();
      if (!u) return;

      const active = loadActiveChar(u);
      salvarPersonagem(personagem, u, active);
    },
  };
}
