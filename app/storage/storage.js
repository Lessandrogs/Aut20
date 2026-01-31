// app/storage/storage.js
// Responsável por:
// - Ler e escrever dados no localStorage
// - Centralizar as chaves (keys) do seu app
// - Evitar duplicar strings de storage espalhadas no projeto

const KEY_PREFIX = "aut20";

/**
 * Monta a key padrão do localStorage.
 * Exemplo: aut20:user:lessandro
 */
function k(...parts) {
  return [KEY_PREFIX, ...parts].join(":");
}

/**
 * Salva um objeto (JSON) no localStorage.
 */
export function saveJSON(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

/**
 * Carrega um objeto (JSON) do localStorage.
 * Se não existir, retorna fallback.
 */
export function loadJSON(key, fallback = null) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

// ==== NOVAS KEYS (multi-personagem) ====
// FIX: PREFIX não existe. Usamos k() para garantir que KEY_PREFIX (aut20) seja aplicado sempre,
// evitando ReferenceError e padronizando todas as chaves.
export function keyCharList(username) {
  // Lista de personagens do usuário (ids + nomes + meta)
  return k("user", username, "chars");
}

export function keyActiveChar(username) {
  // Personagem “ativo” do usuário (ex.: "main")
  return k("user", username, "activeChar");
}

/**
 * key da ficha por personagem.
 * - charId = "main" é o personagem padrão.
 */
export function keyCharacter(username, charId = "main") {
  // Ficha do personagem específico do usuário
  return k("char", username, charId);
}

// ==== helpers de lista ====
export function loadCharList(username) {
  return loadJSON(keyCharList(username), []);
}

export function saveCharList(username, list) {
  saveJSON(keyCharList(username), list);
}

export function loadActiveChar(username) {
  return localStorage.getItem(keyActiveChar(username)) || "main";
}

export function saveActiveChar(username, charId) {
  localStorage.setItem(keyActiveChar(username), charId);
}

/**
 * Remove uma key do storage.
 */
export function removeKey(key) {
  localStorage.removeItem(key);
}

// ===== Keys “oficiais” do projeto =====
export function keyUser(username) {
  return k("user", username);
}

export function keySession() {
  return k("session");
}
