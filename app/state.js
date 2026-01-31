// app/state.js
// Estado do personagem (dados mutáveis). Aqui NÃO tem DOM.

import { SKILLS } from "./skills.js";

function criarEstadoPericias() {
  const pericias = {};

  for (const skill of SKILLS) {
    pericias[skill.id] = {
      treinado: false,
      outros: 0,
      nomeCustom: skill.nomePersonalizavel ? "" : undefined,
    };
  }

  return pericias;
}

export const personagem = {
  // ===== BASE =====
  nivel: 1,
  penalidadeArmadura: 0,

  // ===== CLASSE (novo) =====
  // Por enquanto fica fixo; depois virará um <select>.
  classeId: "guerreiro",

  // ===== ATRIBUTOS =====
  atributos: {
    forca: 10,
    destreza: 10,
    constituicao: 10,
    inteligencia: 10,
    sabedoria: 10,
    carisma: 10,
  },

  // ===== RECURSOS (novo) =====
  // pvMax/pmMax/defesa serão recalculados no render.
  // pvAtual/pmAtual são editáveis e serão "clampados".
  recursos: {
    pvMax: 0,
    pvAtual: 0,
    pmMax: 0,
    pmAtual: 0,
    defesa: 10,
  },

  // ===== EQUIPAMENTO (novo, preparação) =====
  equipamento: {
    bonusArmadura: 0,
    bonusEscudo: 0,
    outrosDefesa: 0,
  },

  // ===== PERÍCIAS =====
  pericias: criarEstadoPericias(),
};
