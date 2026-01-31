// app/calc/resourcesCalc.js
// Regras de PV / PM / Defesa.
// Não mexe no DOM. Só calcula números.

import { CLASSES } from "../data/classes.js";
import { calcularModificador } from "./attributes.js";

/**
 * Pega a classe do personagem. Se não existir, cai em guerreiro (fallback).
 * Isso evita quebrar o app se classeId estiver vazio.
 */
function pegarClasse(personagem) {
  return CLASSES[personagem.classeId] ?? CLASSES.guerreiro;
}

/**
 * PV Máximo:
 * pvInicial (nível 1)
 * + (nivel - 1) * pvPorNivel
 * + nivel * modCON
 *
 * Exemplo 1: nível 1 -> pvInicial + 1*modCON
 * Exemplo 2: subir CON muda PV em todos os níveis (porque CON entra por nível)
 */
export function calcularPVMax(personagem) {
  const classe = pegarClasse(personagem);
  const nivel = Math.max(1, Number(personagem.nivel) || 1);

  const con = Number(personagem.atributos.constituicao) || 10;
  const modCon = calcularModificador(con);

  const pv = classe.pvInicial + (nivel - 1) * classe.pvPorNivel + nivel * modCon;
  return Math.max(1, pv);
}

/**
 * PM Máximo:
 * nivel * pmPorNivel
 *
 * Exemplo 1: nível 1 guerreiro -> 1 * pmPorNivel
 * Exemplo 2: subir nível atualiza PM automaticamente
 */
export function calcularPMMax(personagem) {
  const classe = pegarClasse(personagem);
  const nivel = Math.max(1, Number(personagem.nivel) || 1);
  const pm = nivel * classe.pmPorNivel;
  return Math.max(0, pm);
}

/**
 * Defesa (MVP):
 * 10 + modDES + bonusArmadura + bonusEscudo + outrosDefesa
 *
 * Exemplo 1: DES 16 (+3) sem armadura -> 13
 * Exemplo 2: armadura +4 e escudo +2 -> soma direto sem refatorar nada
 */
export function calcularDefesa(personagem) {
  const des = Number(personagem.atributos.destreza) || 10;
  const modDes = calcularModificador(des);

  const bonusArmadura = Number(personagem.equipamento?.bonusArmadura) || 0;
  const bonusEscudo = Number(personagem.equipamento?.bonusEscudo) || 0;
  const outrosDefesa = Number(personagem.equipamento?.outrosDefesa) || 0;

  return 10 + modDes + bonusArmadura + bonusEscudo + outrosDefesa;
}

/**
 * Garante que um valor fique dentro do intervalo [min, max].
 * Usado para PV/PM atuais não passarem do máximo.
 */
export function clampInt(value, min, max, fallback = min) {
  const n = Number(value);
  if (Number.isNaN(n)) return fallback;
  const i = Math.floor(n);
  return Math.min(max, Math.max(min, i));
}
