// app/skills.js
// Fonte de verdade (dados “fixos” do sistema).
// Aqui você descreve as perícias e flags importantes.
// O motor (calc/ui) só LÊ isso.

export const SKILLS = [
  { id: "acrobacia", nome: "Acrobacia", atributoBase: "destreza", soTreinado: false, sofrePenalidadeArmadura: true },
  { id: "adestramento", nome: "Adestramento", atributoBase: "carisma", soTreinado: true, sofrePenalidadeArmadura: false },
  { id: "atletismo", nome: "Atletismo", atributoBase: "forca", soTreinado: false, sofrePenalidadeArmadura: true },
  { id: "atuacao", nome: "Atuação", atributoBase: "carisma", soTreinado: false, sofrePenalidadeArmadura: false },
  { id: "cavalgar", nome: "Cavalgar", atributoBase: "destreza", soTreinado: false, sofrePenalidadeArmadura: true },
  { id: "conhecimento", nome: "Conhecimento", atributoBase: "inteligencia", soTreinado: true, sofrePenalidadeArmadura: false },
  { id: "cura", nome: "Cura", atributoBase: "sabedoria", soTreinado: false, sofrePenalidadeArmadura: false },
  { id: "diplomacia", nome: "Diplomacia", atributoBase: "carisma", soTreinado: false, sofrePenalidadeArmadura: false },
  { id: "enganacao", nome: "Enganação", atributoBase: "carisma", soTreinado: false, sofrePenalidadeArmadura: false },
  { id: "fortitude", nome: "Fortitude", atributoBase: "constituicao", soTreinado: false, sofrePenalidadeArmadura: false },
  { id: "furtividade", nome: "Furtividade", atributoBase: "destreza", soTreinado: false, sofrePenalidadeArmadura: true },
  { id: "guerra", nome: "Guerra", atributoBase: "inteligencia", soTreinado: true, sofrePenalidadeArmadura: false },
  { id: "iniciativa", nome: "Iniciativa", atributoBase: "destreza", soTreinado: false, sofrePenalidadeArmadura: false },
  { id: "intimidacao", nome: "Intimidação", atributoBase: "carisma", soTreinado: false, sofrePenalidadeArmadura: false },
  { id: "intuicao", nome: "Intuição", atributoBase: "sabedoria", soTreinado: false, sofrePenalidadeArmadura: false },
  { id: "investigacao", nome: "Investigação", atributoBase: "inteligencia", soTreinado: false, sofrePenalidadeArmadura: false },
  { id: "jogatina", nome: "Jogatina", atributoBase: "carisma", soTreinado: true, sofrePenalidadeArmadura: false },
  { id: "ladinagem", nome: "Ladinagem", atributoBase: "destreza", soTreinado: true, sofrePenalidadeArmadura: true },
  { id: "luta", nome: "Luta", atributoBase: "forca", soTreinado: false, sofrePenalidadeArmadura: false },
  { id: "misticismo", nome: "Misticismo", atributoBase: "inteligencia", soTreinado: true, sofrePenalidadeArmadura: false },
  { id: "nobreza", nome: "Nobreza", atributoBase: "inteligencia", soTreinado: true, sofrePenalidadeArmadura: false },

  // Ofício (duas linhas)
  { id: "oficio1", nome: "Ofício", atributoBase: "inteligencia", soTreinado: true, sofrePenalidadeArmadura: false, nomePersonalizavel: true },
  { id: "oficio2", nome: "Ofício", atributoBase: "inteligencia", soTreinado: true, sofrePenalidadeArmadura: false, nomePersonalizavel: true },

  { id: "percepcao", nome: "Percepção", atributoBase: "sabedoria", soTreinado: false, sofrePenalidadeArmadura: false },
  { id: "pilotagem", nome: "Pilotagem", atributoBase: "destreza", soTreinado: true, sofrePenalidadeArmadura: true },
  { id: "pontaria", nome: "Pontaria", atributoBase: "destreza", soTreinado: false, sofrePenalidadeArmadura: false },
  { id: "reflexos", nome: "Reflexos", atributoBase: "destreza", soTreinado: false, sofrePenalidadeArmadura: false },
  { id: "religiao", nome: "Religião", atributoBase: "sabedoria", soTreinado: true, sofrePenalidadeArmadura: false },
  { id: "sobrevivencia", nome: "Sobrevivência", atributoBase: "sabedoria", soTreinado: false, sofrePenalidadeArmadura: false },
  { id: "vontade", nome: "Vontade", atributoBase: "sabedoria", soTreinado: false, sofrePenalidadeArmadura: false },
];
