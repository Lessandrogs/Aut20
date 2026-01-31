// app/ui/skillsTable.js
// Responsável por:
// 1) Criar a tabela (uma vez)
// 2) Renderizar os valores das perícias (sempre que o estado muda)

import { SKILLS } from "../skills.js";
import { calcularModificador, formatarMod } from "../calc/attributes.js";
import { calcularMeioNivel, calcularPericiaTotal } from "../calc/skillsCalc.js";

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

    // ===== Treinado (checkbox) =====
    const treinadoCell = document.createElement("td");
    const chk = document.createElement("input");
    chk.type = "checkbox";
    chk.dataset.role = "treinado";
    treinadoCell.appendChild(chk);

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
    const outrosInput = tr.querySelector(`[data-role="outros"]`);
    const totalSpan = tr.querySelector(`[data-role="total"]`);
    const penSpan = tr.querySelector(`[data-role="pen"]`);
    const customNameInput = tr.querySelector(`[data-role="customName"]`);

    // Sincroniza UI com o estado
    if (customNameInput) customNameInput.value = st.nomeCustom ?? "";
    chk.checked = !!st.treinado;
    outrosInput.value = String(st.outros ?? 0);

    // Modificador do atributo base da perícia
    const atributoValor = personagem.atributos[def.atributoBase];
    const modAtr = calcularModificador(atributoValor);

    // Penalidade só entra se a perícia estiver marcada
    const penalidade = def.sofrePenalidadeArmadura ? personagem.penalidadeArmadura : 0;
    penSpan.textContent = penalidade ? `-${penalidade}` : "0";

    // Se for “Somente Treinado (G)” e não estiver treinado, mostra “—”
    if (def.soTreinado && !st.treinado) {
      totalSpan.textContent = "—";
      totalSpan.classList.add("skill-disabled");
      continue;
    }

    totalSpan.classList.remove("skill-disabled");

    // Cálculo do total
    const total = calcularPericiaTotal({
      meioNivel: meio,
      modAtributo: modAtr,
      treinado: !!st.treinado,
      outros: st.outros ?? 0,
      penalidade,
    });

    totalSpan.textContent = formatarMod(total);
  }
}
