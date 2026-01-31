// app/data/classes.js
// Tabela de classes (dados puros).
// IMPORTANTE: troque os números pelos valores oficiais do seu livro.
//
// Por que isso é bom?
// Exemplo 1: trocar de classe vira só mudar personagem.classeId.
// Exemplo 2: adicionar novas classes não mexe em nenhum cálculo/render.

export const CLASSES = {
  guerreiro: {
    nome: "Guerreiro",
    pvInicial: 20,   // <-- TROQUE pelo valor oficial
    pvPorNivel: 5,   // <-- TROQUE
    pmPorNivel: 3,   // <-- TROQUE
  },
  barbaro: {
    nome: "Bárbaro",
    pvInicial: 24,   // <-- TROQUE
    pvPorNivel: 6,   // <-- TROQUE
    pmPorNivel: 3,   // <-- TROQUE
  },
  ladino: {
    nome: "Ladino",
    pvInicial: 16,   // <-- TROQUE
    pvPorNivel: 4,   // <-- TROQUE
    pmPorNivel: 3,   // <-- TROQUE
  },
  inventor: {
    nome: "Inventor",
    pvInicial: 12,   // <-- TROQUE
    pvPorNivel: 3,   // <-- TROQUE
    pmPorNivel: 4,   // <-- TROQUE
},
}