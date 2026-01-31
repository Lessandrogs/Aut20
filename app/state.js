// app/state.js
// Define o ESTADO do personagem.
// Aqui NÃO tem DOM, NÃO tem cálculo, NÃO tem render.
// Apenas dados mutáveis e estrutura.
//
// Regra de ouro:
// - Tudo que o usuário edita fica aqui
// - Tudo que é cálculo fica em /calc

import { SKILLS } from "./skills.js";

/**
 * Cria o estado inicial das perícias com base no catálogo SKILLS.
 * Isso garante que:
 * - novas perícias entram automaticamente
 * - salvar/carregar funciona sem quebrar
 */
function criarEstadoPericias() {
  const pericias = {};
  for (const skill of SKILLS) {
    pericias[skill.id] = {
      treinado: false,
      outros: 0,
      // Apenas Ofício e similares usam nome custom
      nomeCustom: skill.nomePersonalizavel ? "" : undefined,
    };
  }
  return pericias;
}

/**
 * Fábrica do estado inicial do personagem.
 * Usada para:
 * - criar personagem novo
 * - fallback quando não existe save
 * - reset
 */
export function createInitialState() {
  return {
    meta: {
      version: 1,
      updatedAt: Date.now(),
    },

    // ===== BASE =====
    nivel: 1,
    penalidadeArmadura: 0,

    // ===== CLASSE =====
    // ID da classe selecionada (ex.: "guerreiro")
    classeId: "",

    // ===== ATRIBUTOS =====
    atributos: {
      forca: 10,
      destreza: 10,
      constituicao: 10,
      inteligencia: 10,
      sabedoria: 10,
      carisma: 10,
    },

    // ===== RECURSOS =====
    // pvMax / pmMax / defesa são DERIVADOS (calculados no render / calc)
    // pvAtual / pmAtual são editáveis (serão clampados no render)
    recursos: {
      pvAtual: 0,
      pmAtual: 0,
    },

    // ===== EQUIPAMENTO =====
    // Apenas bônus "puros"
    equipamento: {
      bonusArmadura: 0,
      bonusEscudo: 0,
      outrosDefesa: 0,
    },

    // ===== PERÍCIAS =====
    pericias: criarEstadoPericias(),
  };
}

/**
 * Estado vivo (singleton) do app.
 * Importante: mantemos o MESMO objeto para não quebrar referências.
 */
export const personagem = createInitialState();

/**
 * Substitui o estado inteiro com segurança (sem trocar a referência do objeto).
 * Útil para load e reset.
 */
export function replacePersonagem(nextState) {
  // Remove chaves antigas que não existam mais
  for (const k of Object.keys(personagem)) delete personagem[k];
  // Copia novas
  Object.assign(personagem, nextState);

  // Atualiza meta
  if (!personagem.meta) personagem.meta = { version: 1, updatedAt: Date.now() };
  personagem.meta.updatedAt = Date.now();
  if (typeof personagem.meta.version !== "number") personagem.meta.version = 1;

  return personagem;
}

/** Reseta para o estado inicial. */
export function resetPersonagem() {
  return replacePersonagem(createInitialState());
}
