export interface SkillItem {
  id: string;
  nome: string;
  atributo: 'FOR' | 'AGI' | 'VIG' | 'INT' | 'PER' | 'PRE';
  atributoNome: string;
  descricao: string;
  exemplos?: string[];
}

export const OFFICIAL_SKILLS: SkillItem[] = [
  // C (Caçar em destaque no topo)
  {
    id: 'cacar',
    nome: 'Caçar',
    atributo: 'PER',
    atributoNome: 'Percepção',
    descricao: 'Rastreio de animais, identificação de pegadas no ermo, montagem de armadilhas e obtenção de carne/alimento.',
    exemplos: ['Armadilhas na mata', 'Rastrear caça', 'Pesca tática']
  },
  {
    id: 'combate-desarmado',
    nome: 'Combate Desarmado',
    atributo: 'FOR',
    atributoNome: 'Força',
    descricao: 'Técnicas de imobilização, socos, pontapés e desvencilhamento corporal em combate corpo a corpo.',
    exemplos: ['Imobilização', 'Soco inglês', 'Luta corporal no chão']
  },
  {
    id: 'conducao-veiculos',
    nome: 'Condução de Veículos',
    atributo: 'AGI',
    atributoNome: 'Agilidade',
    descricao: 'Pilotagem defensiva e evasiva de automóveis, caminhonetes, motocicletas e manobras sob perseguição.',
    exemplos: ['Fuga automotiva', 'Manobras em rodovias bloqueadas', 'Controle de derrapagem']
  },

  // A
  {
    id: 'acrobacia',
    nome: 'Acrobacia & Reflexos',
    atributo: 'AGI',
    atributoNome: 'Agilidade',
    descricao: 'Equilíbrio em telhados, amortecimento de quedas, saltos evasivos e destreza corporal rápida.',
    exemplos: ['Salto entre telhados', 'Esquiva ágil', 'Passagem por frestas estreitas']
  },
  {
    id: 'arrombamento',
    nome: 'Arrombamento & Fechaduras',
    atributo: 'AGI',
    atributoNome: 'Agilidade',
    descricao: 'Abertura rápida e silenciosa de trincos, cadeados, cofres mecânicos e janelas lacradas.',
    exemplos: ['Gazua improvisada', 'Destrancar portões', 'Chave micha']
  },
  {
    id: 'atletismo',
    nome: 'Atletismo & Escalada',
    atributo: 'FOR',
    atributoNome: 'Força',
    descricao: 'Escalada de muros e árvores, corrida sustentada de fuga, natação em correntezas e esforço físico bruto.',
    exemplos: ['Escalar muro de 3m', 'Arrancada pesada', 'Arrastar entulho pesado']
  },
  {
    id: 'autocontrole',
    nome: 'Autocontrole & Sangue Frio',
    atributo: 'PRE',
    atributoNome: 'Presença',
    descricao: 'Capacidade de conter o pânico perante hordas, manter a mira sob terror psicológico e suprimir tremores.',
    exemplos: ['Resistir ao pânico', 'Silêncio sob tensão', 'Manter a calma']
  },

  // D
  {
    id: 'diplomacia',
    nome: 'Diplomacia & Barganha',
    atributo: 'PRE',
    atributoNome: 'Presença',
    descricao: 'Negociação com facções hostis, apaziguamento de disputas internas e fechamento de trocas vantajosas.',
    exemplos: ['Mediação de conflitos', 'Trégua temporária', 'Acordo de suprimentos']
  },

  // E
  {
    id: 'enganacao',
    nome: 'Enganação & Blefe',
    atributo: 'PRE',
    atributoNome: 'Presença',
    descricao: 'Distorção da verdade, fingimento de inocência ou de preparo militar e distração de sentinelas.',
    exemplos: ['Blefar armamento', 'Fingir neutralidade', 'Criar falso alarme']
  },

  // F
  {
    id: 'folego',
    nome: 'Fôlego de Fuga',
    atributo: 'VIG',
    atributoNome: 'Vigor',
    descricao: 'Capacidade aeróbica de corrida prolongada fugindo de hordas sem sofrer exaustão súbita.',
    exemplos: ['Corrida de 5km', 'Fuga de horda', 'Recuperação rápida de ar']
  },
  {
    id: 'furtividade',
    nome: 'Furtividade Noturna',
    atributo: 'AGI',
    atributoNome: 'Agilidade',
    descricao: 'Deslocamento invisível nas sombras, camuflagem acústica e passagem por sentinelas e caminhantes.',
    exemplos: ['Incursão silenciosa', 'Passar por horda', 'Ocultação no escuro']
  },

  // I
  {
    id: 'intimidacao',
    nome: 'Intimidação & Coerção',
    atributo: 'PRE',
    atributoNome: 'Presença',
    descricao: 'Pressão psicológica, demonstração de força letal e imposição de respeito sobre sobreviventes hostis.',
    exemplos: ['Interrogatório tenso', 'Desarmar ameaça verbal', 'Imposição de autoridade']
  },
  {
    id: 'investigacao',
    nome: 'Investigação & Vasculhagem',
    atributo: 'INT',
    atributoNome: 'Intelecto',
    descricao: 'Análise minuciosa de ambientes em ruínas, busca por compartimentos secretos e dedução de rotas.',
    exemplos: ['Achar esconderijo', 'Identificar emboscada prévia', 'Periciar cena de massacre']
  },

  // L
  {
    id: 'lideranca',
    nome: 'Liderança de Campo',
    atributo: 'PRE',
    atributoNome: 'Presença',
    descricao: 'Comando operacional de expedições, coordenação de tarefas de grupo e fortalecimento de moral.',
    exemplos: ['Ordem de retirada coordenada', 'Inspirar aliados', 'Comando de defesa de base']
  },
  {
    id: 'luta-laminas',
    nome: 'Luta com Lâminas & Machados',
    atributo: 'FOR',
    atributoNome: 'Força',
    descricao: 'Manejo letal e preciso de facões de mato, machadinhas, baionetas e armas brancas pesadas.',
    exemplos: ['Golpe com machado', 'Combate com facão', 'Corte letal no crânio']
  },

  // M
  {
    id: 'mecanica',
    nome: 'Mecânica de Veículos e Motores',
    atributo: 'INT',
    atributoNome: 'Intelecto',
    descricao: 'Diagnóstico, ligação direta, substituição de peças, solda e reparo de motores e geradores a diesel.',
    exemplos: ['Consertar alternador', 'Ligação direta rápida', 'Manutenção de gerador']
  },
  {
    id: 'medicina',
    nome: 'Medicina & Cirurgia',
    atributo: 'INT',
    atributoNome: 'Intelecto',
    descricao: 'Procedimentos invasivos de emergência, extração de projéteis, suturas profundas e amputações de membros infectados.',
    exemplos: ['Amputação de emergência', 'Extração de bala', 'Cirurgia de campo']
  },

  // N
  {
    id: 'negociacao',
    nome: 'Negociação & Barganha',
    atributo: 'PRE',
    atributoNome: 'Presença',
    descricao: 'Comércio fiduciário com CS, avaliação de mercadorias no mercado e persuasão sobre preços.',
    exemplos: ['Escambo de munição', 'Troca de medicamentos', 'Avaliação de armas']
  },

  // P
  {
    id: 'percepcao',
    nome: 'Percepção & Atenção',
    atributo: 'PER',
    atributoNome: 'Percepção',
    descricao: 'Identificação imediata de sons de passos, cheiro de carniça ou decomposição e movimento periférico.',
    exemplos: ['Detectar passos atrás da porta', 'Notar arame de tropeço', 'Ouvir ruído no duto']
  },
  {
    id: 'pontaria',
    nome: 'Pontaria & Tiro de Precisão',
    atributo: 'AGI',
    atributoNome: 'Agilidade',
    descricao: 'Disparo visado a longa distância com rifles, cálculo de vento e eliminação precisa de ameaças.',
    exemplos: ['Tiro de precisão a 60m', 'Mira telescópica', 'Compensação de vento']
  },
  {
    id: 'primeiros-socorros',
    nome: 'Primeiros Socorros',
    atributo: 'INT',
    atributoNome: 'Intelecto',
    descricao: 'Estancamento de hemorragias com torniquetes, desinfecção de escoriações e imobilização de fraturas.',
    exemplos: ['Torniquete tático', 'Limpeza de arranhão', 'Bandagem compressiva']
  },

  // R
  {
    id: 'rastreamento',
    nome: 'Rastreamento em Áreas Rurais',
    atributo: 'PER',
    atributoNome: 'Percepção',
    descricao: 'Seguir rastros no barro, ramos quebrados, trilhas de sangue e determinar tempo decorrido de passagem.',
    exemplos: ['Seguir pegadas de saqueadores', 'Estimar tempo de passagem', 'Trilha na mata']
  },
  {
    id: 'reparos',
    nome: 'Reparos & Improvisação',
    atributo: 'INT',
    atributoNome: 'Intelecto',
    descricao: 'Criação de ferramentas rústicas, conserto de armas emperradas, reforço de barricadas e armadilhas.',
    exemplos: ['Desemperrar arma', 'Consertar rádio quebrado', 'Reforçar porta com trancas']
  },
  {
    id: 'resistencia',
    nome: 'Resistência Física & Vigor',
    atributo: 'VIG',
    atributoNome: 'Vigor',
    descricao: 'Tolerância ao frio cortante, privação extrema de sono, dor aguda de ferimentos e caminhadas forçadas.',
    exemplos: ['Suportar hipotermia', 'Resistir à marcha forçada', 'Ignorar dor de fratura']
  },

  // S
  {
    id: 'sobrevivencia',
    nome: 'Sobrevivência no Ermo',
    atributo: 'PER',
    atributoNome: 'Percepção',
    descricao: 'Obtenção e purificação de água, orientação estelar/bússola, montagem de abrigo e conhecimento de plantas venenosas.',
    exemplos: ['Filtrar água de chuva', 'Orientação sem bússola', 'Construir abrigo seguro']
  },

  // T
  {
    id: 'tiro',
    nome: 'Tiro com Pistolas / Rifles',
    atributo: 'AGI',
    atributoNome: 'Agilidade',
    descricao: 'Disparo preciso de projéteis, controle de recuo, tiro visado na cabeça de caminhantes e mira rápida.',
    exemplos: ['Tiro de precisão no crânio', 'Disparo de rifle a 40m', 'Tiro duplo com pistola']
  },
  {
    id: 'tolerancia-toxinas',
    nome: 'Tolerância a Toxinas & Doenças',
    atributo: 'VIG',
    atributoNome: 'Vigor',
    descricao: 'Capacidade imunológica de resistir à água contaminada, alimentos deteriorados e infecções bacterianas.',
    exemplos: ['Resistir a infecção intestinal', 'Consumo de ração vencida', 'Água não fervida']
  },

  // V
  {
    id: 'vigilancia',
    nome: 'Vigilância & Prontidão',
    atributo: 'PER',
    atributoNome: 'Percepção',
    descricao: 'Capacidade de manter guarda noturna sem adormecer, detectar aproximação lenta e agir no primeiro instante.',
    exemplos: ['Turno de guarda noturna', 'Evitar surpresa em descanso', 'Identificar silhueta distante']
  }
];

/**
 * Remove acentos e caracteres especiais para comparação insensível.
 */
export function normalizeSkillText(str: string): string {
  return (str || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Filtra as perícias baseado no termo digitado, priorizando correspondência de início de palavra.
 */
export function filterSkills(query: string): SkillItem[] {
  if (!query || !query.trim()) {
    return OFFICIAL_SKILLS;
  }

  const cleanQuery = normalizeSkillText(query);

  return OFFICIAL_SKILLS.filter((skill) => {
    const cleanName = normalizeSkillText(skill.nome);
    const cleanAttr = normalizeSkillText(skill.atributo);
    const cleanAttrNome = normalizeSkillText(skill.atributoNome);

    // Match no nome
    if (cleanName.includes(cleanQuery)) return true;
    // Match na sigla do atributo (ex: "FOR", "AGI")
    if (cleanAttr.includes(cleanQuery)) return true;
    // Match no nome do atributo
    if (cleanAttrNome.includes(cleanQuery)) return true;

    return false;
  }).sort((a, b) => {
    const aNorm = normalizeSkillText(a.nome);
    const bNorm = normalizeSkillText(b.nome);
    const aStarts = aNorm.startsWith(cleanQuery);
    const bStarts = bNorm.startsWith(cleanQuery);

    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    return aNorm.localeCompare(bNorm);
  });
}
