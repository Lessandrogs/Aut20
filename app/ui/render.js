// app/ui/render.js
// Renderiza base + atributos + perícias + recursos (PV/PM/Defesa).

import { calcularModificador, formatarMod } from "../calc/attributes.js";
import { calcularMeioNivel } from "../calc/skillsCalc.js";
import { criarTabelaPericiasSeNaoExiste, renderPericias } from "./skillsTable.js";

import {
  calcularPVMax,
  calcularPMMax,
  calcularDefesa,
  clampInt,
} from "../calc/resourcesCalc.js";

function renderAtributo(personagem, inputEl, modEl, statusEl, nomeChave) {
  const valor = personagem.atributos[nomeChave];
  inputEl.value = String(valor);

  const mod = calcularModificador(valor);
  modEl.textContent = formatarMod(mod);
  statusEl.textContent = "Atualizado";
}

function renderBase(personagem, ui) {
  ui.nivel.value = String(personagem.nivel);
  ui.penalidadeArmadura.value = String(personagem.penalidadeArmadura);
  ui.classe.value = personagem.classeId ?? "";
  ui.meioNivel.textContent = String(calcularMeioNivel(personagem.nivel));

  ui.statusNivel.textContent = "OK";
  ui.statusPenalidade.textContent = "OK";
  ui.statusClasse.textContent = personagem.classeId ? "OK" : "";
}

function renderAtributos(personagem, ui) {
  renderAtributo(personagem, ui.forca, ui.modForca, ui.statusForca, "forca");
  renderAtributo(
    personagem,
    ui.destreza,
    ui.modDestreza,
    ui.statusDestreza,
    "destreza"
  );
  renderAtributo(
    personagem,
    ui.constituicao,
    ui.modConstituicao,
    ui.statusConstituicao,
    "constituicao"
  );
  renderAtributo(
    personagem,
    ui.inteligencia,
    ui.modInteligencia,
    ui.statusInteligencia,
    "inteligencia"
  );
  renderAtributo(
    personagem,
    ui.sabedoria,
    ui.modSabedoria,
    ui.statusSabedoria,
    "sabedoria"
  );
  renderAtributo(
    personagem,
    ui.carisma,
    ui.modCarisma,
    ui.statusCarisma,
    "carisma"
  );
}

/**
 * Render + recálculo dos recursos derivados (PV/PM/Defesa).
 * Esse é o “coração” para não bugar no futuro:
 * - muda nível -> PV/PM mudam
 * - muda CON -> PV muda
 * - muda DES -> defesa muda
 */
function renderRecursos(personagem, ui) {
  // Calcula máximos/defesa
  const pvMax = calcularPVMax(personagem);
  const pmMax = calcularPMMax(personagem);
  const defesa = calcularDefesa(personagem);

  // Atualiza state (derivados)
  personagem.recursos.pvMax = pvMax;
  personagem.recursos.pmMax = pmMax;
  personagem.recursos.defesa = defesa;

  // “Clamp” dos atuais (não deixa passar do máximo)
  // FIX: precisa rodar aqui, porque pvMax/pmMax mudam quando nível/CON/classe mudam,
  // mesmo que o usuário não mexa manualmente no input de PV/PM.
  personagem.recursos.pvAtual = clampInt(
    personagem.recursos.pvAtual,
    0,
    pvMax,
    pvMax
  );

  personagem.recursos.pmAtual = clampInt(
    personagem.recursos.pmAtual,
    0,
    pmMax,
    pmMax
  );

  // Render na UI
  ui.vidaMax.textContent = String(pvMax);
  ui.manaMax.textContent = String(pmMax);
  ui.defesa.textContent = String(defesa);

  ui.vidaAtual.value = String(personagem.recursos.pvAtual);
  ui.manaAtual.value = String(personagem.recursos.pmAtual);
}

export function renderTudo(personagem, ui) {
  renderBase(personagem, ui);
  renderAtributos(personagem, ui);

  criarTabelaPericiasSeNaoExiste(ui);
  renderPericias(personagem, ui);

  // Recursos entram no fluxo padrão
  renderRecursos(personagem, ui);
}
