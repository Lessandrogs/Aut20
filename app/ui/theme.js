// app/ui/theme.js
// Responsável por:
// - Aplicar tema (light/dark) no <html>
// - Salvar preferência no localStorage
// - Respeitar preferência do sistema na primeira vez

const STORAGE_KEY = "aut20_theme";

/**
 * Aplica o tema no <html>.
 * Exemplo 1: setTheme("dark") => ativa dark mode
 * Exemplo 2: setTheme("light") => ativa modo claro
 */
export function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(STORAGE_KEY, theme);
}

/**
 * Descobre o tema inicial.
 * Ordem:
 * 1) localStorage (se o usuário já escolheu antes)
 * 2) preferência do sistema (prefers-color-scheme)
 * 3) fallback: light
 */
export function getInitialTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "dark" || saved === "light") return saved;

  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  return prefersDark ? "dark" : "light";
}

/**
 * Liga o botão/controle de tema.
 * Ele alterna entre light <-> dark.
 */
export function bindThemeToggle(buttonEl) {
  const initial = getInitialTheme();
  setTheme(initial);
  atualizarTextoBotao(buttonEl, initial);

  buttonEl.addEventListener("click", () => {
    const atual = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    const novo = atual === "dark" ? "light" : "dark";

    setTheme(novo);
    atualizarTextoBotao(buttonEl, novo);
  });
}

function atualizarTextoBotao(buttonEl, theme) {
  const isDark = theme === "dark";
  buttonEl.setAttribute("aria-pressed", String(isDark));
  buttonEl.textContent = isDark ? "☀️ Light" : "🌙 Dark";
}
