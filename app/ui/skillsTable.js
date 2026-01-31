// app/ui/skillsTable.js
// Responsável por:
// 1) Criar a tabela (uma vez)
// 2) Renderizar os valores das perícias (sempre que o estado muda)
//
// Inclui:
// - Destaque visual para perícias “Somente Treinado (G)”
// - Badge “Treinado (+2/+4/+6)” conforme nível
// - Tooltip na penalidade explicando “por quê”
// - Tooltip no total mostrando o breakdown do cálculo (fundação escalável)

import { SKILLS } from "../skills.js";
import { calcularModificador, formatarMod } from "../calc/attributes.js";
import {
  calcularMeioNivel,
  calcularPericiaTotal,
  bonusTreino,
} from "../calc/skillsCalc.js";

/**
 * Converte atributo base em abreviação (ex.: destreza -> DES)
 */
function abreviarAtributo(attr) {
  const map = {
    forca: "FOR",
    destreza: "DES",
    constituicao: "CON",
    inteligencia: "INT",
    sabedoria: "SAB",
    carisma: "CAR",
  };
  return map[attr] ?? attr;
}

/**
 * Cria a tabela no DOM (apenas uma vez).
 * Usamos data-skill-id para identificar cada linha.
 */
export function criarTabelaPericiasSeNaoExiste(ui) {
  if (ui.skillsContainer.dataset.montado === "1") return;

  const table = document.createElement("table");
  table.className = "skills-table";
  table.innerHTML = `
    <thead>
      <tr>
        <th>Perícia</th>
        <th>Atr</th>
        <th>Treinado</th>
        <th>Outros</th>
        <th>Pen.</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = table.querySelector("tbody");

  for (const def of SKILLS) {
    const tr = document.createElement("tr");

    // ✅ IMPORTANTE: setAttribute garante consistência com querySelector/closest
    tr.setAttribute("data-skill-id", def.id);

    // UI: marca visualmente perícias “Somente Treinado (G)” para facilitar leitura.
    if (def.soTreinado) {
      tr.classList.add("skill-g-only");
    }

    // ===== Nome =====
    const nomeCell = document.createElement("td");
    nomeCell.className = "skill-name";

    const nameWrap = document.createElement("div");
    nameWrap.className = "skill-name-wrap";

    const label = document.createElement("span");
    label.className = "skill-label";
    label.textContent = def.nome;

    const g = document.createElement("span");
    g.className = "skill-g";
    g.textContent = def.soTreinado ? " G" : "";

    nameWrap.appendChild(label);
    nameWrap.appendChild(g);

    // Campo extra para Ofício (nome custom)
    if (def.nomePersonalizavel) {
      const custom = document.createElement("input");
      custom.type = "text";
      custom.placeholder = "(ex.: Ferreiro)";
      custom.className = "skill-custom-name";
      custom.dataset.role = "customName";
      nameWrap.appendChild(custom);
    }

    nomeCell.appendChild(nameWrap);

    // ===== Atributo =====
    const atrCell = document.createElement("td");
    atrCell.textContent = abreviarAtributo(def.atributoBase);

    // ===== Treinado (checkbox + badge) =====
    const treinadoCell = document.createElement("td");

    // FIX/UI: usamos um label para agrupar o checkbox e o texto do bônus.
    // Isso melhora clique (clicar no texto marca/desmarca) e facilita estilização.
    const trainLabel = document.createElement("label");
    trainLabel.className = "skill-train-label";

    const chk = document.createElement("input");
    chk.type = "checkbox";
    chk.dataset.role = "treinado";

    // FIX/UI: badge dinâmico para mostrar +2 / +4 / +6 conforme nível.
    // O texto real será preenchido em renderPericias().
    const trainBonusSpan = document.createElement("span");
    trainBonusSpan.className = "skill-train-bonus";
    trainBonusSpan.dataset.role = "trainBonus";
    trainBonusSpan.textContent = ""; // placeholder

    trainLabel.appendChild(chk);
    trainLabel.appendChild(trainBonusSpan);
    treinadoCell.appendChild(trainLabel);

    // ===== Outros (number) =====
    const outrosCell = document.createElement("td");
    const outros = document.createElement("input");
    outros.type = "number";
    outros.value = "0";
    outros.className = "skill-outros";
    outros.dataset.role = "outros";
    outrosCell.appendChild(outros);

    // ===== Penalidade =====
    const penCell = document.createElement("td");
    const penSpan = document.createElement("span");
    penSpan.dataset.role = "pen";
    penCell.appendChild(penSpan);

    // ===== Total =====
    const totalCell = document.createElement("td");
    const totalSpan = document.createElement("span");
    totalSpan.dataset.role = "total";
    totalSpan.className = "skill-total";
    totalCell.appendChild(totalSpan);

    tr.appendChild(nomeCell);
    tr.appendChild(atrCell);
    tr.appendChild(treinadoCell);
    tr.appendChild(outrosCell);
    tr.appendChild(penCell);
    tr.appendChild(totalCell);

    tbody.appendChild(tr);
  }

  ui.skillsContainer.appendChild(table);
  ui.skillsContainer.dataset.montado = "1";
}

/**
 * Renderiza todas as perícias (valores, checkbox, penalidade, total etc.)
 */
export function renderPericias(personagem, ui) {
  const meio = calcularMeioNivel(personagem.nivel);

  for (const def of SKILLS) {
    const tr = ui.skillsContainer.querySelector(`tr[data-skill-id="${def.id}"]`);
    if (!tr) continue;

    const st = personagem.pericias[def.id];

    const chk = tr.querySelector(`[data-role="treinado"]`);
    const trainBonusSpan = tr.querySelector(`[data-role="trainBonus"]`);
    const outrosInput = tr.querySelector(`[data-role="outros"]`);
    const totalSpan = tr.querySelector(`[data-role="total"]`);
    const penSpan = tr.querySelector(`[data-role="pen"]`);
    const customNameInput = tr.querySelector(`[data-role="customName"]`);

    // Sincroniza UI com o estado
    if (customNameInput) customNameInput.value = st.nomeCustom ?? "";
    chk.checked = !!st.treinado;
    outrosInput.value = String(st.outros ?? 0);

    // FIX/UI: mostra o bônus de treino atual (+2/+4/+6) quando treinado.
    // Quando não treinado, deixamos vazio para não poluir a tabela.
    if (trainBonusSpan) {
      if (!st.treinado) {
        trainBonusSpan.textContent = "";
        trainBonusSpan.title = "Marque para indicar que você é treinado nesta perícia.";
      } else {
        const b = bonusTreino(true, Number(personagem.nivel));
        trainBonusSpan.textContent = `(+${b})`;
        // UI: tooltip explicando a progressão do bônus de treino.
        trainBonusSpan.title =
          "Bônus de treino: +2 (níveis 1–6), +4 (7–14), +6 (15+).";
      }
    }

    // Modificador do atributo base da perícia
    const atributoValor = personagem.atributos[def.atributoBase];
    const modAtr = calcularModificador(atributoValor);

    // UI/UX: só mostra penalidade quando a perícia realmente sofre penalidade de armadura.
    // Para as demais, mostramos “—” (não aplicável) e o cálculo segue com penalidade 0.
    const penalidade = def.sofrePenalidadeArmadura
      ? personagem.penalidadeArmadura
      : 0;

    penSpan.textContent = def.sofrePenalidadeArmadura
      ? (penalidade ? `-${penalidade}` : "0")
      : "—";

    // UI: tooltip explicando a penalidade de armadura (ou por que não se aplica).
    penSpan.title = def.sofrePenalidadeArmadura
      ? "Penalidade de armadura: esta perícia exige liberdade de movimento. Se estiver usando armadura/escudo, sofre penalidade."
      : "Esta perícia não sofre penalidade de armadura.";

    // Se for “Somente Treinado (G)” e não estiver treinado, mostra “—”
    if (def.soTreinado && !st.treinado) {
      totalSpan.textContent = "—";
      totalSpan.classList.add("skill-disabled");
      // UI: tooltip explicando por que não dá para usar a perícia.
      totalSpan.title =
        "Somente treinado (G): você só pode usar esta perícia se for treinado nela.";
      continue;
    }

    totalSpan.classList.remove("skill-disabled");

    // Cálculo do total
    const total = calcularPericiaTotal({
      nivel: Number(personagem.nivel), // FIX: necessário para o bônus escalar (+2/+4/+6)
      meioNivel: meio,
      modAtributo: modAtr,
      treinado: !!st.treinado,
      outros: st.outros ?? 0,
      penalidade,
    });

    totalSpan.textContent = formatarMod(total);

    // UI: tooltip com breakdown do cálculo do total.
    // Isso ajuda o usuário a entender de onde vem cada parcela (fundação escalável).
    const nivelNum = Number(personagem.nivel);
    const outrosVal = Number(st.outros ?? 0);
    const treinoVal = st.treinado ? bonusTreino(true, nivelNum) : 0;

    totalSpan.title =
      `Cálculo: meio nível (${meio}) + ` +
      `${abreviarAtributo(def.atributoBase)} (${formatarMod(modAtr)}) + ` +
      `treino (${treinoVal ? `+${treinoVal}` : "+0"}) + ` +
      `outros (${outrosVal >= 0 ? `+${outrosVal}` : `${outrosVal}`}) - ` +
      `penalidade (${penalidade}) = ` +
      `${formatarMod(total)}`;
  }
}
