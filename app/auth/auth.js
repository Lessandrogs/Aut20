// app/auth/auth.js
// Responsável por:
// - Criar conta
// - Logar/deslogar
// - Persistir sessão
// - Hash de senha (SHA-256) no browser (MVP)

import { saveJSON, loadJSON, removeKey, keyUser, keySession } from "../storage/storage.js";

/**
 * Gera hash SHA-256 em hex, usando a Web Crypto API.
 * Isso evita salvar senha “em texto puro”.
 */
export async function hashSenha(senha) {
  const enc = new TextEncoder().encode(senha);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  const bytes = Array.from(new Uint8Array(buf));
  return bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Cria conta. Retorna { ok, msg }.
 */
export async function registrar(username, password) {
  username = username.trim().toLowerCase();

  if (!username || !password) {
    return { ok: false, msg: "Preencha usuário e senha." };
  }

  const userKey = keyUser(username);
  const existente = loadJSON(userKey, null);
  if (existente) {
    return { ok: false, msg: "Esse usuário já existe." };
  }

  const senhaHash = await hashSenha(password);

  // Armazena apenas o hash
  saveJSON(userKey, { username, senhaHash, createdAt: Date.now() });

  return { ok: true, msg: "Conta criada! Agora faça login." };
}

/**
 * Login. Retorna { ok, msg, username }.
 */
export async function login(username, password) {
  username = username.trim().toLowerCase();

  if (!username || !password) {
    return { ok: false, msg: "Preencha usuário e senha." };
  }

  const user = loadJSON(keyUser(username), null);
  if (!user) {
    return { ok: false, msg: "Usuário não encontrado." };
  }

  const senhaHash = await hashSenha(password);

  if (senhaHash !== user.senhaHash) {
    return { ok: false, msg: "Senha incorreta." };
  }

  // Salva sessão simples
  saveJSON(keySession(), { username, loggedAt: Date.now() });

  return { ok: true, msg: "Login OK!", username };
}

/**
 * Logout (remove sessão).
 */
export function logout() {
  removeKey(keySession());
}

/**
 * Retorna o username logado ou "".
 */
export function getSessionUsername() {
  const sess = loadJSON(keySession(), null);
  return sess?.username ?? "";
}
