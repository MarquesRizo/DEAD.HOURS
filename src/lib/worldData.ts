export interface WorldArchiveSection {
  id: string;
  title: string;
  classification: string;
  dateTag?: string;
  content: string[];
  callout?: {
    type: 'classified' | 'warning' | 'pending' | 'tech';
    title: string;
    text: string;
  };
  metadata?: { label: string; value: string }[];
}

export interface TimelinePhase {
  id: string;
  phaseNumber: string;
  phaseCode: string;
  title: string;
  period: string;
  status: 'Arquivado' | 'Parcial' | 'Classificado' | 'Ativo';
  summary: string;
  events: {
    code: string;
    timestamp: string;
    title: string;
    description: string;
    classification: string;
    status: 'Confirmado' | 'Fragmentado' | 'Pendente';
  }[];
}

export interface VirusDossierField {
  id: string;
  fieldCode: string;
  label: string;
  status: 'AGUARDANDO REGISTRO' | 'INFORMAÇÃO NÃO DISPONÍVEL' | 'CLASSIFICADO - NÍVEL 4' | 'ANÁLISE PENDENTE';
  description: string;
  notes: string;
}

export interface DocumentRecord {
  id: string;
  catalogCode: string;
  type: 'Comunicado Oficial' | 'Relatório de Campo' | 'Carta Pessoal' | 'Transcrição de Rádio' | 'Diário Encontrado';
  title: string;
  dateRecovered: string;
  originLocation: string;
  condition: 'Legível' | 'Manchado' | 'Fragmentado' | 'Carbonizado';
  excerpt: string[];
  archivistNotes: string;
}

export interface WorldLocation {
  id: string;
  code: string;
  name: string;
  category: 'Infraestrutura' | 'Saúde' | 'Comércio' | 'Refúgio' | 'Trânsito';
  riskLevel: 'Baixo' | 'Moderado' | 'Crítico' | 'Morte Iminente';
  condition: string;
  imagePath: string;
  description: string;
  knownResources: string[];
  tacticalNotes: string;
  status: 'Explorado' | 'Bloqueado' | 'Hostil' | 'Desconhecido';
}

// 1. O MUNDO ANTES
export const WORLD_BEFORE_DATA: WorldArchiveSection[] = [
  {
    id: 'sociedade-cotidiano',
    title: 'A Sociedade Pré-Colapso & Rotina Urbana',
    classification: 'ARQUIVO HISTÓRICO // RECUPERADO',
    dateTag: 'REGISTRO ESTIMADO: T-0',
    content: [
      'Antes da queda, as metrópoles operavam em sincronia de alta densidade populacional, dependentes de cadeias de suprimentos just-in-time e distribuição elétrica centralizada.',
      'A rotina diária era marcada por tráfego intenso em avenidas arteriais, comércio contínuo e hospitais municipais que atendiam no limite de sua capacidade estrutural.',
      'Com o início dos primeiros incidentes, o tráfego colapsou nas primeiras 48 horas, transformando as principais rodovias em cemitérios de veículos.'
    ],
    callout: {
      type: 'classified',
      title: 'REGISTRO ARQUIVÍSTICO',
      text: 'A infraestrutura civil moderna foi projetada para fluxo constante. Interrompida por 72 horas consecutivas sem manutenção, o colapso hidráulico e elétrico tornou-se irreversível.'
    },
    metadata: [
      { label: 'Densidade Urbana Estimada', value: '4.200 hab/km²' },
      { label: 'Dependência Energética', value: 'Rede Centralizada (Zero redundância)' },
      { label: 'Autonomia Alimentar', value: 'Menos de 4 dias por domicílio' }
    ]
  },
  {
    id: 'comunicacoes-governo',
    title: 'Governança & Falha nos Protocolos de Emergência',
    classification: 'DOCUMENTO CIVIL // FRAGMENTADO',
    dateTag: 'REGISTRO DE CAMPO',
    content: [
      'As primeiras tentativas estatais de contenção envolveram quarentenas zonais escalonadas e o acionamento de forças de segurança pública.',
      'A velocidade de transmissão e o pânico em massa rapidamente sobrecarregaram delegacias, bombeiros e quartéis, que perderam coesão operacional com o corte das linhas de telecomunicação.',
      'Transmissões de rádio em frequência AM/FM e ondas curtas tornaram-se o último elo entre núcleos isolados antes do silêncio definitivo das emissoras.'
    ],
    callout: {
      type: 'warning',
      title: 'FALHA DE REDUNDÂNCIA',
      text: 'Os protocolos governamentais de evacuação falharam ao priorizar corredores rodoviários já saturados, encurralando comboios civis.'
    },
    metadata: [
      { label: 'Última Transmissão Oficial', value: 'Frequência de Emergência 142.8 MHz' },
      { label: 'Estado das Instituições', value: 'Inoperantes / Descentralizadas' }
    ]
  }
];

// 2. A LINHA DO TEMPO
export const TIMELINE_PHASES: TimelinePhase[] = [
  {
    id: 'fase-0',
    phaseNumber: '00',
    phaseCode: 'FASE-PRÉ',
    title: 'Antes do Colapso',
    period: 'Período Antecedente',
    status: 'Arquivado',
    summary: 'A normalidade aparente de uma civilização industrial em pleno funcionamento, sem indícios visíveis da catástrofe que se aproximava.',
    events: [
      {
        code: 'EVT-001',
        timestamp: 'T-Pré // Registro Urbano',
        title: 'Operação Regular da Infraestrutura',
        description: 'Cidades operando com fornecimento contínuo de energia elétrica, telecomunicações funcionais e circulação de mercadorias sem restrições.',
        classification: 'PÚBLICO // DADO HISTÓRICO',
        status: 'Confirmado'
      },
      {
        code: 'EVT-002',
        timestamp: 'T-Pré // Monitoramento Sanitário',
        title: 'Rotina Hospitalar Pré-Crise',
        description: 'Sistemas municipais de saúde atendendo demandas ordinárias. Ausência de alertas microbiológicos ou restrições de trânsito civil.',
        classification: 'PÚBLICO // ARQUIVO',
        status: 'Confirmado'
      }
    ]
  },
  {
    id: 'fase-1',
    phaseNumber: '01',
    phaseCode: 'FASE-SINAIS',
    title: 'Primeiros Sinais & Anomalias',
    period: 'Semanas Iniciais',
    status: 'Parcial',
    summary: 'Notícias isoladas, relatos incomuns em áreas periféricas e aumento abrupto de atendimentos emergenciais em hospitais sentinela.',
    events: [
      {
        code: 'EVT-010',
        timestamp: 'T+Sinais // Transmissão Local',
        title: 'Aumento Anômalo de Triagens Médicas',
        description: 'Prontuários registrando pacientes com sintomas neurológicos incomuns e agressividade desmedida em unidades periféricas de pronto-socorro.',
        classification: 'CONFIDENCIAL // REGISTRO SANITÁRIO',
        status: 'Fragmentado'
      },
      {
        code: 'EVT-011',
        timestamp: 'T+Sinais // Boletim de Ocorrência',
        title: 'Incidentes Rodoviários Inexplicáveis',
        description: 'Bloqueios pontuais causados por acidentes em série sem causas mecânicas evidentes. Relatos esparsos de pânico coletivo em postos de pedágio.',
        classification: 'RESTRITO // SEGURANÇA',
        status: 'Fragmentado'
      }
    ]
  },
  {
    id: 'fase-2',
    phaseNumber: '02',
    phaseCode: 'FASE-CRISE',
    title: 'Início da Crise Sanitária',
    period: 'Dias Críticos',
    status: 'Parcial',
    summary: 'Colapso dos centros de saúde, instalação de barracas de triagem provisórias e desabastecimento de produtos essenciais em supermercados e farmácias.',
    events: [
      {
        code: 'EVT-020',
        timestamp: 'T+Crise // Boletim de Emergência',
        title: 'Saturação dos Leitos Hospitalares',
        description: 'Improvisação de tendas externas de triagem em estacionamentos públicos. Relatos de equipes médicas abandonando postos por falta de contenção.',
        classification: 'URGENTE // ALERTA VERMELHO',
        status: 'Confirmado'
      },
      {
        code: 'EVT-021',
        timestamp: 'T+Crise // Relato Civil',
        title: 'Desabastecimento em Cadeia & Saques',
        description: 'Supermercados e postos de combustível esvaziados em menos de 12 horas. Escassez imediata de combustíveis, enlatados e medicamentos básicos.',
        classification: 'REGISTRO DE TESTEMUNHA',
        status: 'Confirmado'
      }
    ]
  },
  {
    id: 'fase-3',
    phaseNumber: '03',
    phaseCode: 'FASE-COLAPSO',
    title: 'Colapso Social & Evacuação',
    period: 'Fase de Ruptura',
    status: 'Classificado',
    summary: 'Fuga desordenada das metrópoles, fechamento de fronteiras estaduais, bloqueio total de rodovias e cessação de transmissões civis de televisão.',
    events: [
      {
        code: 'EVT-030',
        timestamp: 'T+Colapso // Ordem de Campo',
        title: 'Corte da Rede Elétrica Central',
        description: 'Subestações transmissoras desligadas por sobrecarga ou abandono funcional. Cidades mergulhadas na escuridão noturna completa.',
        classification: 'INFRAESTRUTURA // CRÍTICO',
        status: 'Confirmado'
      },
      {
        code: 'EVT-031',
        timestamp: 'T+Colapso // Ponto de Checagem',
        title: 'Bloqueio das Vias Rodoviárias Principais',
        description: 'Rotas de fuga saturadas de veículos abandonados por falta de combustível ou colisões. Trânsito inviável para veículos com mais de duas rodas.',
        classification: 'CAMPO TÁTICO // RESTRITO',
        status: 'Confirmado'
      }
    ]
  },
  {
    id: 'fase-4',
    phaseNumber: '04',
    phaseCode: 'FASE-LEI-MARCIAL',
    title: 'Queda das Instituições',
    period: 'Período Militar / Vácuo',
    status: 'Classificado',
    summary: 'Últimas mensagens pré-gravadas de rádio de emergência, dispersão dos destacamentos militares em facções autônomas e isolamento absoluto de povoados.',
    events: [
      {
        code: 'EVT-040',
        timestamp: 'T+Vácuo // Transmissão de Loop',
        title: 'Cessação das Mensagens Oficiais de Rádio',
        description: 'Frequências governamentais passam a emitir apenas sinais de rádio-farol e estática. Fim das operações de resgate organizado.',
        classification: 'COMUNICAÇÃO // FINAL',
        status: 'Confirmado'
      }
    ]
  },
  {
    id: 'fase-5',
    phaseNumber: '05',
    phaseCode: 'FASE-PRESENTE',
    title: 'O Presente do Ermo',
    period: 'Momento Atual // Campanha Ativa',
    status: 'Ativo',
    summary: 'O cenário em que os sobreviventes operam no WhatsApp. Escassez extrema, comunidades improvisadas, perigo constante de mortos e disputa por recursos vitais.',
    events: [
      {
        code: 'EVT-050',
        timestamp: 'TEMPO PRESENTE // CAMPO ATIVO',
        title: 'Início das Expedições de Reconhecimento',
        description: 'Pequenos grupos de sobreviventes estabelecem rotas seguras e catalogam pontos de interesse no mapa persistente da temporada.',
        classification: 'PROTOCOLO ATIVO // SOBREVIVÊNCIA',
        status: 'Confirmado'
      }
    ]
  }
];

// 3. O VÍRUS (DOSSIÊ 100% ESTRUTURAL — SEM LORE INVENTADO)
export const VIRUS_DOSSIER_FIELDS: VirusDossierField[] = [
  {
    id: 'agente-patogenico',
    fieldCode: 'BIO-PAT-01',
    label: 'Identificação & Nomenclatura do Agente',
    status: 'AGUARDANDO REGISTRO',
    description: 'Espaço reservado para registro da nomenclatura científica oficial, codinome atribuído pelas forças de contenção e identificadores microbiológicos formais.',
    notes: 'CAMPO RESERVADO PARA ATUALIZAÇÃO OFICIAL DA MESTRIA.'
  },
  {
    id: 'classificacao-biologica',
    fieldCode: 'BIO-PAT-02',
    label: 'Classificação & Estrutura Biológica',
    status: 'CLASSIFICADO - NÍVEL 4',
    description: 'Mapeamento taxonômico da cepa: natureza biológica (viral, bacteriana, priônica ou sintética), tempo de resistência em superfícies inertes e tolerância térmica.',
    notes: 'INFORMAÇÕES COM RESTRIÇÃO DE ACESSO MILITAR NÍVEL 4.'
  },
  {
    id: 'origem-vetor',
    fieldCode: 'BIO-PAT-03',
    label: 'Origem Geográfica & Hipóteses de Dispersão',
    status: 'INFORMAÇÃO NÃO DISPONÍVEL',
    description: 'Localização do primeiro surto registrado, vetor animal ou ambiental suspeito e mapa de dispersão inicial anterior ao fechamento de fronteiras.',
    notes: 'ARQUIVOS LABORATORIAIS PRIMÁRIOS DESTRUÍDOS OU INACESSÍVEIS.'
  },
  {
    id: 'vias-transmissao',
    fieldCode: 'BIO-PAT-04',
    label: 'Mecanismo de Contágio & Vias de Infecção',
    status: 'AGUARDANDO REGISTRO',
    description: 'Parâmetros mecânicos de contágio comprovados em campo (fluidos corporais, mordidas, arranhões, aerossol ou água contaminada) e regras de isolamento.',
    notes: 'CONFORME REGRA DE CAMPO (CAP. 09): MORDIDAS EXIGEM TESTE DE VIGOR CD 14 COM PROTOCOLO DE 24H.'
  },
  {
    id: 'sintomatologia-estagios',
    fieldCode: 'BIO-PAT-05',
    label: 'Sintomatologia Clínica & Fases de Progressão',
    status: 'ANÁLISE PENDENTE',
    description: 'Quadro clínico progressivo: tempo de incubação, alterações metabólicas, sintomas febris, colapso neurológico e momento da transição motora pós-morte.',
    notes: 'LAUDOS DE AUTÓPSIA AGUARDANDO RECOMPILAÇÃO PELOS MÉDICOS DE CAMPO.'
  },
  {
    id: 'comportamento-infectados',
    fieldCode: 'BIO-PAT-06',
    label: 'Padrão Comportamental & Resposta a Estímulos',
    status: 'ANÁLISE PENDENTE',
    description: 'Mapeamento etológico dos mortos: reação a fontes sonoras, sensibilidade à luz, padrões de movimentação em hordas errantes e capacidade de preensão.',
    notes: 'OBSERVAÇÕES EMPÍRICAS DETALHADAS NO MANUAL OFICIAL (CAPÍTULO 08).'
  },
  {
    id: 'tratamento-terapeutica',
    fieldCode: 'BIO-PAT-07',
    label: 'Protocolos Terapêuticos, Vacinais & Intervenções',
    status: 'INFORMAÇÃO NÃO DISPONÍVEL',
    description: 'Registro de ensaios clínicos, fármacos estabilizadores, antibióticos de amplo espectro testados e viabilidade de procedimentos cirúrgicos de amputação.',
    notes: 'NENHUMA CURA OU TRATAMENTO DEFINITIVO HOMOLOGADO NESTA UNIDADE.'
  }
];

// 4. REGISTROS E DOCUMENTOS ENCONTRADOS
export const DOCUMENT_RECORDS: DocumentRecord[] = [
  {
    id: 'doc-comunicado-evacuacao',
    catalogCode: 'DOC-EVAC-014',
    type: 'Comunicado Oficial',
    title: 'Diretriz de Evacuação da Rodovia Sul (BR-101)',
    dateRecovered: 'Dia +12 do Colapso',
    originLocation: 'Posto de Triagem Rodoviário KM 48',
    condition: 'Manchado',
    excerpt: [
      '“Aos motoristas civis: A circulação no sentido da capital está terminantemente suspensa por tempo indeterminado. Todas as pistas foram reservadas para veículos prioritários de socorro e comboios militares.”',
      '“Mantenham os motores desligados para economizar combustível. Em caso de disparos ou tumultos na lateral das pistas, permaneçam no interior dos veículos com portas travadas.”'
    ],
    archivistNotes: 'Documento impresso em papel sulfite comum timbrado da Defesa Civil. Encontrado preso ao vidro de uma cabine de pedágio abandonada.'
  },
  {
    id: 'doc-relatorio-patrulha',
    catalogCode: 'REL-PAT-089',
    type: 'Relatório de Campo',
    title: 'Despacho de Reconhecimento: Setor Hospitalar Central',
    dateRecovered: 'Dia +34 do Colapso',
    originLocation: 'Entrada de Ambulâncias do Hospital Municipal',
    condition: 'Legível',
    excerpt: [
      '“Setor de emergência intransitável. Portas de vidro temperado estilhaçadas. Há sinais de barricada improvisada com macas e arquivos de aço na entrada da UTI, mas foi rompida de fora para dentro.”',
      '“Farmácia central totalmente saqueada. Encontramos apenas ampolas de soro fisiológico quebradas e caixas vazias de sedativos. Ruído constante vindo do poço do elevador de serviço; decidimos não prosseguir.”'
    ],
    archivistNotes: 'Manuscrito a lápis em folha de caderno pautado. Assinado apenas por "Sgt. R. Dias — Patrulha Delta".'
  },
  {
    id: 'doc-carta-pessoal',
    catalogCode: 'CART-FAM-003',
    type: 'Carta Pessoal',
    title: 'Bilhete deixado em geladeira de residência residencial',
    dateRecovered: 'Dia +19 do Colapso',
    originLocation: 'Bairro Jardim América, Casa 142',
    condition: 'Legível',
    excerpt: [
      '“Felipe, se você conseguir voltar para casa: eu e a Duda fomos com o grupo do seu tio para o sítio perto da represa. Não ficamos porque os vizinhos estavam arrombando as casas atrás de água.”',
      '“Deixei a lata de leite em pó e o isqueiro escondidos no forno do fogão. Não faça barulho se passar pela ponte velha. Amamos você.”'
    ],
    archivistNotes: 'Folha de papel de embrulho colada com fita crepe. Moradia encontrada vazia e com portas arrombadas.'
  },
  {
    id: 'doc-transcricao-radio',
    catalogCode: 'RAD-TRANS-042',
    type: 'Transcrição de Rádio',
    title: 'Captação de Onda Curta — Transmissão em Loop (7.145 kHz)',
    dateRecovered: 'Dia +41 do Colapso',
    originLocation: 'Antena de Repetidora no Morro do Cruzeiro',
    condition: 'Fragmentado',
    excerpt: [
      '“[Estática intensa] ...aqui é a estação comunitária de Vila Verde... restam onze pessoas abrigadas na escola municipal... temos poço artesiano, mas pouca munição... se houver comboio de suprimentos do governo ouvindo... [corte de áudio]”',
      '“[Sinal repetido a cada 15 minutos até cessar definitivamente no dia seguinte].”'
    ],
    archivistNotes: 'Áudio gravado em fita magnética por rádio-amador da região leste. Nenhuma expedição de socorro pôde ser enviada.'
  }
];

// 5. LOCAIS E REGIÕES DO ERMO
export const WORLD_LOCATIONS: WorldLocation[] = [
  {
    id: 'rodovia-bloqueada',
    code: 'LOC-ROD-01',
    name: 'Gargalo da Rodovia Federal (KM 42)',
    category: 'Trânsito',
    riskLevel: 'Crítico',
    condition: 'Bloqueio total de veículos enferrujados em 8 km de extensão.',
    imagePath: '/images/hero-highway.jpg',
    description: 'Principal artéria de saída da região metropolitana. Centenas de automóveis, ônibus de linha e caminhões de carga bloqueiam as seis pistas. Excelente fonte de peças mecânicas, mas infestada de infectados presos em habitáculos ou escondidos sob as carcaças.',
    knownResources: ['Combustível residual em tanques perfurados', 'Baterias automotivas', 'Ferramentas de mecânica', 'Bagagens civis intocadas'],
    tacticalNotes: 'Movimentação exclusiva a pé ou com veículos de duas rodas. Evitar uso de armas de fogo devido ao eco amplificado entre as encostas da serra.',
    status: 'Explorado'
  },
  {
    id: 'posto-combustivel',
    code: 'LOC-PST-04',
    name: 'Posto Estrela do Norte & Loja de Conveniência',
    category: 'Comércio',
    riskLevel: 'Moderado',
    condition: 'Estrutura parcialmente vandalizada, bombas de combustível desativadas.',
    imagePath: '/images/location-gas-station.jpg',
    description: 'Posto de beira de estrada isolado. As bombas foram esvaziadas no início do colapso, mas o depósito subterrâneo pode conter resíduos decantados. A loja de conveniência teve as prateleiras reviradas, porém as áreas administrativas permanecem fechadas.',
    knownResources: ['Fitas isolantes e colas industriais', 'Óleo de motor e lubrificantes', 'Abrigo seco provisório'],
    tacticalNotes: 'Boa visibilidade do perímetro rodoviário. Risco de emboscada por saqueadores devido à posição evidente na rodovia.',
    status: 'Explorado'
  },
  {
    id: 'hospital-regional',
    code: 'LOC-HSP-02',
    name: 'Hospital Regional São Lucas (Ala de Emergência)',
    category: 'Saúde',
    riskLevel: 'Morte Iminente',
    condition: 'Barricadas rompidas, foco de contaminação biológica em decomposição.',
    imagePath: '/images/location-hospital.jpg',
    description: 'Antigo epicentro de triagem e internação dos primeiros surtos. O interior é escuro, com odor pútrido intenso e múltiplos caminhantes confinados nos corredores de internação. Abriga os medicamentos mais raros da região, como antibióticos de amplo espectro.',
    knownResources: ['Antibióticos e sedativos farmacêuticos', 'Material de sutura e curativos estéreis', 'Bolsas de soro e equipos', 'Macas de transporte'],
    tacticalNotes: 'Apenas grupos armados de no mínimo 4 pessoas com iluminação própria e máscaras respiratórias devem entrar. Proibido disparar armas de fogo no interior.',
    status: 'Hostil'
  },
  {
    id: 'sala-comando-emergencia',
    code: 'LOC-CMD-07',
    name: 'Bunker Subterrâneo de Comunicações da Defesa Civil',
    category: 'Infraestrutura',
    riskLevel: 'Baixo',
    condition: 'Acesso controlado por porta corta-fogo blindada, arquivos preservados.',
    imagePath: '/images/world-archives.jpg',
    description: 'Instalação subterrânea construída sob o antigo prédio da prefeitura. Os geradores a diesel esgotaram-se, mas o acervo documental em papel e equipamentos analógicos permanecem intactos, protegidos da umidade e de incursões externas.',
    knownResources: ['Mapas topográficos da bacia hidrográfica', 'Rádios analógicos de reserva', 'Manuais de engenharia civil e elétrica', 'Arquivo histórico municipal'],
    tacticalNotes: 'Excelente candidato para posto de retransmissão de rádio ou arquivo seguro de registros da comunidade de sobreviventes.',
    status: 'Explorado'
  }
];
