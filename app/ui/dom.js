// app/ui/dom.js
// Centraliza o acesso ao DOM e garante que todos os IDs existem.

function $id(id) {
  const el = document.getElementById(id);
  if (!el) {
    throw new Error(`Elemento #${id} não encontrado no HTML`);
  }
  return el;
}

export function pegarUI() {
  return {
    // ===== BASE =====
    nivel: $id("nivel"),
    meioNivel: $id("meioNivel"),
    statusNivel: $id("statusNivel"),

    penalidadeArmadura: $id("penalidadeArmadura"),
    statusPenalidade: $id("statusPenalidade"),

    // ===== COMBATE =====
    vidaAtual: $id("vidaAtual"),
    vidaMax: $id("vidaMax"),

    manaAtual: $id("manaAtual"),
    manaMax: $id("manaMax"),

    defesa: $id("defesa"),

    // ===== ATRIBUTOS =====
    forca: $id("forca"),
    modForca: $id("modForca"),
    statusForca: $id("statusForca"),

    destreza: $id("destreza"),
    modDestreza: $id("modDestreza"),
    statusDestreza: $id("statusDestreza"),

    constituicao: $id("constituicao"),
    modConstituicao: $id("modConstituicao"),
    statusConstituicao: $id("statusConstituicao"),

    inteligencia: $id("inteligencia"),
    modInteligencia: $id("modInteligencia"),
    statusInteligencia: $id("statusInteligencia"),

    sabedoria: $id("sabedoria"),
    modSabedoria: $id("modSabedoria"),
    statusSabedoria: $id("statusSabedoria"),

    carisma: $id("carisma"),
    modCarisma: $id("modCarisma"),
    statusCarisma: $id("statusCarisma"),

    // ===== PERÍCIAS =====
    skillsContainer: $id("skillsContainer"),
  };
}
