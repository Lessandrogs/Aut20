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

export function keyCharacter(username) {
  return k("char", username);
}

export function keySession() {
  return k("session");
}
