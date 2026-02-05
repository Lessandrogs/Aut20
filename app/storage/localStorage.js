// app/storage/localStorage.js
// Responsável por:
// - salvar o estado do personagem
// - carregar o estado salvo
// - abstrair localStorage (facilita trocar por backend depois)

const STORAGE_KEY = "aut20_personagem";

/**
 * Salva o personagem no localStorage
 * @param {object} personagem - state inteiro do personagem
 */
export function saveCharacter(personagem) {
  try {
    const json = JSON.stringify(personagem);
    localStorage.setItem(STORAGE_KEY, json);
    console.log("[storage] personagem salvo");
  } catch (err) {
    console.error("[storage] erro ao salvar", err);
  }
}

/**
 * Carrega o personagem do localStorage
 * @returns {object|null}
 */
export function loadCharacter() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const data = JSON.parse(raw);
    console.log("[storage] personagem carregado");
    return data;
  } catch (err) {
    console.error("[storage] erro ao carregar", err);
    return null;
  }
}

/**
 * Remove o personagem salvo
 * (útil no futuro pra logout)
 */
export function clearCharacter() {
  localStorage.removeItem(STORAGE_KEY);
}
