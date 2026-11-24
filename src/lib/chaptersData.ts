export interface ChapterSection {
  id: string;
  title: string;
  content: string[];
  callout?: {
    type: 'danger' | 'warning' | 'classified' | 'tech';
    title: string;
    text: string;
  };
  table?: {
    headers: string[];
    rows: (string | number)[][];
  };
}

export interface Chapter {
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  category: 'Introdução' | 'Personagem' | 'Regras de Jogo' | 'Ameaças e Combate' | 'O Mundo' | 'Operação' | 'Apêndices';
  summary: string;
  classification: string;
  sections: ChapterSection[];
}

export const CHAPTERS: Chapter[] = [
  {
    slug: 'o-mundo',
    number: '01',
    title: 'O Mundo de DEAD HOURS',
    subtitle: 'Origem, colapso e as leis da persistência',
    category: 'Introdução',
    summary: 'Apresentação do cenário de sobrevivência realista, estrutura das temporadas e pilares de jogo no WhatsApp.',
    classification: 'DOCUMENTO PÚBLICO // ARQUIVO-01',
    sections: [
      {
        id: 'pilares',
        title: '1.1 Os Quatro Pilares do Universo',
        content: [
          'DEAD HOURS é um RPG de sobrevivência zumbi realista, de tom sombrio e punitivo, concebido para simular as dificuldades físicas, psicológicas e sociais do colapso civilizatório.',
          'Diferente de cenários heróicos, aqui a morte é permanente, os suprimentos são escassos e a confiança entre os vivos é a moeda mais rara.',
          '• Sobrevivência: Cada gota de água, ração enlatada e cartucho de munição é contabilizado. A fome, a desidratação, o frio e a exaustão matam com a mesma eficácia que os caminhantes.',
          '• Relações Humanas: O isolamento enlouquece. A cooperação constrói abrigos, mas a escassez extrema incita traições, disputas internas de poder e dilemas éticos sem final feliz.',
          '• Exploração: O mapa é persistente e vivo. Cada incursão às ruínas de cidades e estradas abandonadas envolve risco calculado contra o ruído e a exposição a hordas.',
          '• Consequências: Nenhuma decisão é desprovida de impacto. Uma porta arrombada com pressa pode atrair mortos para o refúgio; um tiro disparado pode alertar bandidos armados.'
        ],
        callout: {
          type: 'classified',
          title: 'DIRETRIZ DE ATMOSFERA',
          text: 'O jogo não trata sobre matar zumbis com facilidade, mas sobre o custo humano de continuar respirando quando o mundo ao redor já apodreceu.'
        }
      },
      {
        id: 'estrutura-participantes',
        title: '1.2 Estrutura Oficial de Participantes',
        content: [
          'A experiência de DEAD HOURS é dimensionada para manter alta imersão, velocidade de resposta e coerência narrativa contínua:',
          '• Contigente de Jogadores: Grupos de 10 a 20 sobreviventes ativos por ciclo de campanha.',
          '• Personagem Único: Cada participante interpreta exatamente um único sobrevivente. A perda do personagem é permanente e definitiva.',
          '• Assentamento Inicial: Todos iniciam compartilhando uma base precária comum (ou refúgio provisório) delimitada no mapa.',
          '• Pontos de Interesse (POIs): O mapa inicial contém entre 15 e 25 localidades exploráveis catalogadas com níveis distintos de perigo.',
          '• Corpo de Mestres: Coordenação executada por 2 a 3 mestres responsáveis pela validação de ordens, resposta às expedições e narração.',
          '• Duração da Temporada: Ciclos contínuos de aproximadamente 30 dias cronológicos com narrativa em tempo real.'
        ]
      }
    ]
  },
  {
    slug: 'como-funciona',
    number: '02',
    title: 'Como o Jogo Funciona',
    subtitle: 'Estrutura dos grupos de WhatsApp e comunicação',
    category: 'Introdução',
    summary: 'Guia de canais e convivência operacional no aplicativo de mensagens instantâneas.',
    classification: 'CANAL DE COMUNICAÇÃO // PROTOCOLO-02',
    sections: [
      {
        id: 'grupos-whatsapp',
        title: '2.1 Estrutura e Função dos Ambientes',
        content: [
          'O RPG ocorre integralmente através de grupos segmentados no WhatsApp, garantindo organização estrita entre conversas públicas, operações táticas e despachos administrativos:',
          '• [CENTRAL]: Canal reservado para anúncios solenes da equipe, decretos climáticos, viradas de ciclo matinal, avisos globais e eventos de temporada. Interação de texto restrita aos mestres.',
          '• [REFÚGIO]: O canal social de interpretação livre (in-character) entre todos os sobreviventes presentes no assentamento. Conversas em volta da fogueira, votações e debates comunitários.',
          '• [EXPEDIÇÕES]: Ambientes temporários criados exclusivamente quando um grupo de sobreviventes deixa o perímetro seguro para explorar um ponto de interesse no mapa. É encerrado após o retorno ou aniquilação do grupo.',
          '• [ORDENS E MERCADO]: Canal formal onde cada jogador posta suas ordens diárias no formato oficial, além de registrar trocas comerciais de suprimentos e equipamentos entre personagens.',
          '• [EQUIPE]: Canal fechado e sigiloso de deliberação técnica entre os 2 a 3 mestres responsáveis pela mecânica do jogo.'
        ],
        callout: {
          type: 'warning',
          title: 'CONDUTA E ETIQUETA',
          text: 'Mensagens fora do personagem (off-topic) devem ser delimitadas por colchetes ou mantidas estritamente no canal secundário indicado pelos mestres.'
        }
      }
    ]
  },
  {
    slug: 'tempo-e-acoes',
    number: '03',
    title: 'Tempo e Pontos de Ação',
    subtitle: 'Ciclo diário, custos, ordens e proteção contra ausência',
    category: 'Regras de Jogo',
    summary: 'Mecânica do ciclo de 24 horas, acúmulo zero de PA e salvaguardas mecânicas.',
    classification: 'TEMPO & MOVIMENTO // DIRETRIZ-03',
    sections: [
      {
        id: 'ciclo-temporal',
        title: '3.1 O Ciclo Diário Oficial',
        content: [
          'O mundo de DEAD HOURS corre em tempo real sincronizado pelo Horário Oficial de Brasília (UTC−3).',
          '• Reinício Diário: Ocorre impreterivelmente às 06h00 da manhã de cada dia.',
          '• Cota Diária de Ação: Cada sobrevivente recebe exatamente 2 Pontos de Ação (PA) por ciclo.',
          '• Teto Máximo: O limite absoluto de reserva é de 2 PA. Pontos não utilizados no ciclo anterior SÃO PERDIDOS e NÃO ACUMULAM.',
          '• Envio de Ordens: As ordens de ação devem ser submetidas no grupo oficial antes do encerramento das rodadas operacionais diárias estipuladas pelos mestres.'
        ]
      },
      {
        id: 'tabela-custos',
        title: '3.2 Custos Típicos de Ação',
        content: [
          'Cada atividade no ermo demanda energia e tempo cronometrado. Ações prolongadas exigem coordenação prévia.'
        ],
        table: {
          headers: ['Ação', 'Custo em PA', 'Duração Estimada', 'Impacto Principal'],
          rows: [
            ['Exploração Periférica', '1 PA', '4 a 6 horas', 'Saque em pontos de interesse próximos ao refúgio'],
            ['Incursão Profunda', '2 PA', 'Dia inteiro', 'Acesso a zonas urbanas ou instalações distantes'],
            ['Descanso & Recuperação', '1 PA', '6 a 8 horas', 'Recuperação de Vida, alívio de Fadiga e Estresse'],
            ['Fortificação / Obra', '1 a 2 PA', 'Conforme projeto', 'Aumento de defesas, reparo de barricadas'],
            ['Vigilância Atenta', '1 PA', 'Turno de guarda', 'Bônus de percepção contra ataques noturnos'],
            ['Trabalho Especializado', '1 PA', '4 horas', 'Tratamento médico, fabricação de ferramentas ou munição']
          ]
        }
      },
      {
        id: 'protecao-ausencia',
        title: '3.3 Proteção Contra Ausência (Salvaguarda)',
        content: [
          'A vida real pode impedir um jogador de enviar suas ordens em determinado dia. DEAD HOURS possui uma regra estrita de preservação:',
          '• Se um jogador não enviar ordem até o fechamento do ciclo, seu personagem assume automaticamente a postura "Descanso Vigilante no Refúgio".',
          '• O personagem NÃO sairá para missões perigosas, NÃO consumirá PA em aventuras e estará imune a perigos que exijam decisões ativas fora da base.',
          '• No entanto, consome a cota regular diária de comida e água comunitária do assentamento.',
          '• Sobreviventes ausentes há mais de 3 ciclos consecutivos entram em estado de "Isolamento Protetor", podendo ser declarados desaparecidos caso o refúgio seja evacuado.'
        ],
        callout: {
          type: 'tech',
          title: 'CANCELAMENTO DE ORDENS',
          text: 'Uma ordem postada só pode ser cancelada ou editada se os mestres ainda não tiverem iniciado a resolução pública da cena correspondente.'
        }
      }
    ]
  },
  {
    slug: 'criacao-de-sobrevivente',
    number: '04',
    title: 'Criação de Sobrevivente',
    subtitle: 'Atributos, especializações e características derivadas',
    category: 'Personagem',
    summary: 'Construção matemática e narrativa do seu único sobrevivente segundo as regras oficiais da Edição 1.0.',
    classification: 'DOCUMENTO DE REGISTRO // FICHA-04',
    sections: [
      {
        id: 'atributos-base',
        title: '4.1 Atributos Principais',
        content: [
          'Todos os sobreviventes são definidos por 6 atributos primários, representando suas capacidades humanas cruciais:',
          '• Força (FOR): Potência física muscular, capacidade de carregar carga e eficácia no combate corpo a corpo contundente.',
          '• Agilidade (AGI): Reflexos, velocidade de deslocamento, pontaria à distância e capacidade de esquiva e furtividade.',
          '• Vigor (VIG): Resistência imunológica, saúde cardiovascular, tolerância a dores, venenos, toxinas e esforço prolongado.',
          '• Intelecto (INT): Conhecimento pré-queda, raciocínio lógico, primeiros socorros, medicina, reparos mecânicos e improvisação.',
          '• Percepção (PER): Atenção aos arredores, identificação de emboscadas, ruídos no escuro e rastreio de recursos ocultos.',
          '• Presença (PRE): Firmeza psicológica, autocontrole sob terror, liderança, diplomacia, capacidade de inspirar e negociar.'
        ],
        callout: {
          type: 'warning',
          title: 'REGRA MATEMÁTICA DE CRIAÇÃO',
          text: 'O jogador dispõe de exatamente 12 pontos para distribuir livremente entre os 6 atributos. O valor inicial máximo em qualquer atributo é estritamente 3.'
        }
      },
      {
        id: 'especializacoes',
        title: '4.2 Especializações (+2)',
        content: [
          'Na criação, cada sobrevivente escolhe exatamente 2 Especializações que refletem seu passado profissional ou treino particular.',
          '• Efeito Mecânico: Sempre que um teste exigir especificamente o campo daquela especialização, o jogador soma um bônus fixo de +2 à rolagem.',
          'Exemplos de Especializações homologadas:',
          '• Primeiros Socorros (vinculado a Intelecto)',
          '• Furtividade Noturna (vinculado a Agilidade)',
          '• Tiro com Pistolas / Rifles (vinculado a Agilidade)',
          '• Mecânica de Veículos e Motores (vinculado a Intelecto)',
          '• Luta com Lâminas / Machados (vinculado a Força)',
          '• Rastreamento em Áreas Rurais (vinculado a Percepção)',
          '• Negociação & Barganha (vinculado a Presença)',
          '• Atletismo & Escalada (vinculado a Força)'
        ]
      },
      {
        id: 'atributos-derivados',
        title: '4.3 Atributos Derivados (Fórmulas Oficiais)',
        content: [
          'Estes valores decorrem diretamente das pontuações atribuídas e não podem ser alterados arbitrariamente:'
        ],
        table: {
          headers: ['Atributo Derivado', 'Fórmula Oficial', 'Significado Prático no Jogo'],
          rows: [
            ['Pontos de Vida (PV)', '10 + (Vigor × 2)', 'Limiar físico antes da incapacidade e risco iminente de morte'],
            ['Pontos de Fôlego (PF)', '5 + Vigor', 'Energia para arrancadas, corrida de fuga e manobras extremas'],
            ['Defesa Passiva', '10 + Agilidade', 'Dificuldade base para inimigos acertarem ataques corporais'],
            ['Capacidade de Carga', '10 + (2 × Força) em slots', 'Volume máximo de itens e mantimentos que podem ser transportados'],
            ['Estresse Máximo', 'Teto Fixo de 10 Pontos', 'Medidor de sanidade e pressão; colapsos ocorrem ao atingir 10']
          ]
        }
      },
      {
        id: 'historico-narrativo',
        title: '4.4 Histórico e Âncoras Psicológicas',
        content: [
          'Todo registro de sobrevivente deve obrigatoriamente preencher os seguintes campos narrativos:',
          '1. Ocupação Anterior: Profissão ou papel exercido antes do colapso da sociedade.',
          '2. Objetivo Pessoal: A meta imediata que mantém o personagem vivo (encontrar parente, construir cura, vingança).',
          '3. Maior Medo: Trauma psicológico que o desestabiliza em momentos de crise.',
          '4. Ligação: Vínculo explícito com outro sobrevivente do grupo ou NPC conhecido.',
          '5. Segredo ou Conflito: Fato oculto do passado do personagem que causaria tensão se descoberto.'
        ]
      }
    ]
  },
  {
    slug: 'testes-e-dificuldades',
    number: '05',
    title: 'Testes e Dificuldades',
    subtitle: 'Mecânica central de resolução e margens de sucesso',
    category: 'Regras de Jogo',
    summary: 'A rolagem 1d20, classes de dificuldade padrão e consequências críticas de falhas.',
    classification: 'SISTEMA DE RESOLUÇÃO // REGRA-05',
    sections: [
      {
        id: 'formula-teste',
        title: '5.1 A Fórmula de Resolução',
        content: [
          'Sempre que uma ação envolver risco de vida, incerteza factual ou oposição direta, os mestres solicitam um teste:',
          'FÓRMULA FUNDAMENTAL: 1d20 + Atributo Relevante + Bônus Aplicável (Especialização/Item)',
          'O resultado total é comparado contra a Classe de Dificuldade (CD) estipulada para a tarefa.'
        ]
      },
      {
        id: 'tabela-cds',
        title: '5.2 Classes de Dificuldade Oficiais (CD)',
        content: [
          'A tabela abaixo dita os padrões inegociáveis de dificuldade em DEAD HOURS:'
        ],
        table: {
          headers: ['Classe de Dificuldade', 'Grau de Desafio', 'Exemplo Prático de Aplicação'],
          rows: [
            ['CD 8', 'Fácil', 'Forçar janela de madeira emperrada; notar barulho próximo em sala silenciosa'],
            ['CD 12', 'Moderado', 'Revistar despensa escura sob pressa; pular muro de 2 metros; curar corte limpo'],
            ['CD 16', 'Difícil', 'Passar furtivo por grupo de 3 caminhantes; disparar tiro preciso no escuro'],
            ['CD 20', 'Extremo', 'Tratar ferimento de bala com faca quente; consertar motor destruído sem peças'],
            ['CD 25', 'Quase Impossível', 'Rastrear sobrevivente na tempestade torrencial; conter pânico em meio a horda']
          ]
        }
      },
      {
        id: 'margens-resultado',
        title: '5.3 Margens de Sucesso e Falha',
        content: [
          'O valor final obtido além ou aquém da CD determina a magnitude narrativa do desfecho:',
          '• Sucesso Marginal (Igualou ou superou por até 4 pontos): Atinge o objetivo, porém consome tempo extra, gasta recurso ou gera ruído residual.',
          '• Sucesso Amplo (Superou a CD por 5 ou mais pontos): Sucesso limpo e exemplar. Ganho de vantagem tática, economia de material ou conclusão sem ruído.',
          '• Falha Simples (Ficou abaixo da CD por até 4 pontos): A tentativa fracassa sem desastre imediato, mas a porta continua trancada ou o item quebrou.',
          '• Falha Crítica (Ficou 5 ou mais pontos abaixo da CD): O pior cenário ocorre. Ruído massivo é emitido, a ferramenta parte-se irreversivelmente ou o sobrevivente sofre dano/exposição.'
        ]
      }
    ]
  },
  {
    slug: 'progressao',
    number: '06',
    title: 'Progressão de Personagem',
    subtitle: 'Níveis de 1 a 10, experiência e evolução orgânica',
    category: 'Personagem',
    summary: 'Critérios de aquisição de XP e desenvolvimento lento de sobreviventes veteranos.',
    classification: 'DESENVOLVIMENTO PESSOAL // PROG-06',
    sections: [
      {
        id: 'niveis-xp',
        title: '6.1 Escala de Níveis e Experiência',
        content: [
          'A progressão em DEAD HOURS é intencionalmente lenta e árdua, refletindo o desgaste da sobrevivência contínua.',
          'Os personagens avançam do Nível 1 ao Nível 10 através do acúmulo de Pontos de Experiência (XP):'
        ],
        table: {
          headers: ['Nível do Sobrevivente', 'XP Total Acumulado', 'Benefício Concedido ao Avançar'],
          rows: [
            ['Nível 1', '0 XP', 'Ficha inicial (12 pontos em atributos, 2 especializações)'],
            ['Nível 2', '100 XP', '+1 Ponto de Vida máxima, +1 Ponto de Fôlego'],
            ['Nível 3', '250 XP', '+1 Nova Especialização (+2) em habilidade praticada'],
            ['Nível 4', '450 XP', '+1 Ponto de Atributo livre (respeitando limite de 4)'],
            ['Nível 5', '700 XP', '+2 Pontos de Vida máxima, resistência a pânico'],
            ['Nível 6', '1.050 XP', '+1 Nova Especialização (+2)'],
            ['Nível 7', '1.500 XP', '+1 Ponto de Atributo livre'],
            ['Nível 8', '2.100 XP', '+2 Pontos de Vida máxima, +1 slot de Carga'],
            ['Nível 9', '2.800 XP', '+1 Nova Especialização (+2)'],
            ['Nível 10', '3.700 XP', 'Veterano Lendário: +1 Atributo e título comunitário']
          ]
        }
      },
      {
        id: 'aquisicao-xp',
        title: '6.2 Como o XP é Conquistado',
        content: [
          'O ganho de experiência é outorgado pelos mestres ao término dos ciclos com base em ações concretas:',
          '• Expedição bem-sucedida e retorno com suprimentos: 10 a 25 XP.',
          '• Sobrevivência a emboscada ou combate de alta intensidade: 15 a 30 XP.',
          '• Construção ou reparo crítico de estrutura no refúgio: 10 a 20 XP.',
          '• Resolução diplomática pacífica entre facções conflitantes: 20 a 35 XP.',
          '• Atuação exemplar de interpretação (roleplay) com dilema ético: 5 a 15 XP.'
        ]
      }
    ]
  },
  {
    slug: 'combate',
    number: '07',
    title: 'Combate e Balística',
    subtitle: 'Confrontos letais, iniciativas, dano e ruído',
    category: 'Ameaças e Combate',
    summary: 'Regras táticas de combate corpo a corpo e à distância. O perigo mortal do som.',
    classification: 'MANUAL DE ENGAJAMENTO // TÁTICA-07',
    sections: [
      {
        id: 'ordem-confronto',
        title: '7.1 Estrutura do Confronto',
        content: [
          'Em DEAD HOURS, o combate é rápido, visceral e raramente compensa os riscos envolvidos.',
          '1. Iniciativa: Determinada por teste de 1d20 + Percepção. Quem rola mais alto age primeiro.',
          '2. Teste de Ataque Corpo a Corpo: 1d20 + Força (ou Agilidade para armas leves) contra a Defesa do alvo.',
          '3. Teste de Ataque à Distância: 1d20 + Agilidade contra a Defesa do alvo (modificada por cobertura).',
          '4. Rolagem de Dano: Se o ataque acertar, rola-se o dado respectivo da arma e subtrai-se diretamente dos Pontos de Vida do alvo.'
        ],
        callout: {
          type: 'danger',
          title: 'A LEI DO RUÍDO',
          text: 'Armas de fogo geram Índice de Ruído imediato. Disparar em área urbana sem supressor atrai caminhantes em um raio de até 500 metros em rodadas subsequentes.'
        }
      },
      {
        id: 'tabela-armas',
        title: '7.2 Tabela de Armas e Ruído',
        content: [
          'Especificações balísticas e sonoras dos armamentos disponíveis no sistema:'
        ],
        table: {
          headers: ['Armamento', 'Dano Base', 'Alcance', 'Índice de Ruído', 'Propriedades Especiais'],
          rows: [
            ['Faca de Caça', '1d4 + FOR', 'Corpo a corpo', 'Nível 0 (Silencioso)', 'Leve, rápida, fácil de ocultar'],
            ['Machete / Facão', '1d6 + FOR', 'Corpo a corpo', 'Nível 0 (Silencioso)', 'Corta galhos e membros com facilidade'],
            ['Machado de Lenhador', '1d8 + FOR', 'Corpo a corpo', 'Nível 1 (Baixo)', 'Pesado, demorado, quebra trancas'],
            ['Arco Composto', '1d6', 'Médio (20m)', 'Nível 0 (Silencioso)', 'Munição recuperável (50% de chance)'],
            ['Pistola 9mm', '1d8', 'Médio (15m)', 'Nível 4 (Alto)', 'Capacidade 15 tiros, recarga rápida'],
            ['Revólver .38', '1d8+1', 'Médio (15m)', 'Nível 4 (Alto)', 'Capacidade 6 tiros, confiável (não emperra)'],
            ['Espingarda Calibre 12', '2d6', 'Curto (8m)', 'Nível 5 (Ensurdecedor)', 'Espalhamento, destrói alvos próximos'],
            ['Rifle de Caça .308', '1d12', 'Longo (60m)', 'Nível 5 (Ensurdecedor)', 'Perfuração alta, requer mira precisa']
          ]
        }
      }
    ]
  },
  {
    slug: 'caminhantes',
    number: '08',
    title: 'Caminhantes e Ameaças',
    subtitle: 'Comportamento dos mortos, hordas e hostis humanos',
    category: 'Ameaças e Combate',
    summary: 'Taxonomia dos infectados, atração por barulho e os perigos de bandidos armados.',
    classification: 'REGISTRO DE CAMPO // BESTIÁRIO-08',
    sections: [
      {
        id: 'tipos-caminhantes',
        title: '8.1 Taxonomia dos Infectados',
        content: [
          'Os mortos que vagam pelo Brasil pós-colapso apresentam diferentes estados de conservação corporal:',
          '• Caminhante Comum: Cadáver em decomposição lenta. Movimentação vagarosa e errática. PV: 4. Defesa: 8. Dano: 1d4 (Mordida/Arranhão). Perigoso apenas quando em superioridade numérica ou em ambientes fechados.',
          '• Carniçal Recente: Infectado há poucos dias com tecido muscular ainda preservado. Movimentação rápida e agressiva ao avistar presas. PV: 8. Defesa: 11. Dano: 1d6.',
          '• Inchado / Decomposto em Água: Encontrado em esgotos, lagos ou alagadiços. Altamente contagioso; liberação de gases tóxicos e água contaminada ao ser abatido.'
        ]
      },
      {
        id: 'mecanica-horda',
        title: '8.2 Mecânica de Hordas',
        content: [
          'Quando um grupo de caminhantes ultrapassa 10 indivíduos reunidos pelo ruído ou cheiro de sangue, passa a ser tratado como Horda:',
          '• Ataques corporais comuns tornam-se ineficientes para conter a massa.',
          '• A horda realiza testes de avanço coletivo contra as defesas físicas ou barricadas dos sobreviventes.',
          '• Tentar enfrentar uma horda aberta com armas brancas resulta em cercamento inevitável e óbito por soterramento.'
        ],
        callout: {
          type: 'danger',
          title: 'REGRA DE OURO',
          text: 'Contra hordas, a única resposta sensata é a evasão imediata ou o desvio sonoro com dispositivos pirotécnicos distantes.'
        }
      }
    ]
  },
  {
    slug: 'ferimentos-infeccao-morte',
    number: '09',
    title: 'Ferimentos, Infecção e Morte',
    subtitle: 'A gravidade clínica, a praga e a permanência do fim',
    category: 'Ameaças e Combate',
    summary: 'Protocolos de dano crítico, amputação emergencial e irreversibilidade da morte.',
    classification: 'DOCUMENTO CRÍTICO // ALERTA MÁXIMO-09',
    sections: [
      {
        id: 'graus-ferimento',
        title: '9.1 Escala de Ferimentos',
        content: [
          'O dano sofrido não é apenas uma subtração numérica, gerando debilitações clínicas cumulativas:'
        ],
        table: {
          headers: ['Nível de Dano', 'Faixa de PV Restante', 'Penalidade Aplicada', 'Tratamento Necessário'],
          rows: [
            ['Leve', '75% a 99% dos PV', 'Nenhuma penalidade imediata', 'Curativo básico para conter sangramento'],
            ['Moderado', '50% a 74% dos PV', '-1 em testes de Agilidade e Força', 'Repouso e medicação analgésica'],
            ['Grave', '25% a 49% dos PV', '-2 em todos os testes, marcha manca', 'Intervenção médica com Kit de Primeiros Socorros'],
            ['Crítico', '1% a 24% dos PV', '-4 em todos os testes, risco de choque', 'Cirurgia de emergência e repouso absoluto'],
            ['Incapacitado', '0 PV', 'Inconsciência imediata; sangra 1 PV/hora', 'Estabilização urgente por aliado em até 3 horas']
          ]
        }
      },
      {
        id: 'protocolo-infeccao',
        title: '9.2 A Infecção dos Caminhantes',
        content: [
          'Qualquer ferimento provocado diretamente pela boca ou unhas de um caminhante ativa o protocolo de infecção bacteriana letal:',
          '• Ao sofrer mordida, o sobrevivente realiza imediatamente um teste de Vigor (CD 14).',
          '• Em caso de falha, o patógeno instala-se na corrente sanguínea. Febre intensa surge em 6 horas.',
          '• Sem medicação agressiva (antibióticos raros) em até 24 horas, o óbito clínico é matematicamente garantido em 48 a 72 horas.',
          '• Amputação de Emergência: Se a mordida ocorreu em braço ou perna, o membro pode ser amputado por outro sobrevivente em até 10 minutos após o incidente (teste de Intelecto/Medicina CD 14). Salva a vida, mas acarreta perda permanente do membro e trauma psicológico severo.'
        ],
        callout: {
          type: 'danger',
          title: 'MORTE PERMANENTE (PERMADEATH)',
          text: 'Se os PVs chegarem a zero sem socorro hábil ou o tempo da infecção se esgotar, o sobrevivente MORRE DEFINITIVAMENTE. Não há ressurreição, clonagem ou retrocesso de turno. O personagem torna-se um NPC morto ou errante.'
        }
      }
    ]
  },
  {
    slug: 'sobrevivencia',
    number: '10',
    title: 'Sobrevivência e Fisiologia',
    subtitle: 'Fome, desidratação, cansaço e colapso mental',
    category: 'Regras de Jogo',
    summary: 'A gestão do corpo humano: ingestão de calorias, água potável e controle de estresse.',
    classification: 'MANUAL DE CAMPO // FISIOLOGIA-10',
    sections: [
      {
        id: 'necessidades-basicas',
        title: '10.1 Fome e Desidratação Diária',
        content: [
          'No fechamento de cada ciclo de 24 horas (06h00 BRT), o organismo de cada sobrevivente cobra seu tributo:',
          '• Água: É obrigatório o consumo de 1 Unidade de Água Potável por ciclo. Caso passe um ciclo sem água, sofre -2 de penalidade em todos os atributos e perde 2 PVs imediatos.',
          '• Alimento: É obrigatório o consumo de 1 Ração Diária. Se passar um ciclo sem comer, acumula 1 ponto de Fraqueza (-1 em rolagens físicas). Passar 3 ciclos sem alimento gera perda contínua de 1 PV por dia.',
          '• Doenças Hídricas: Beber água não tratada ou parada exige teste de Vigor (CD 12) para evitar diarreia grave e febre desidratante.'
        ]
      },
      {
        id: 'sistema-estresse',
        title: '10.2 A Escala de Estresse (0 a 10)',
        content: [
          'Presenciar horrores, ver companheiros morrerem ou sofrer isolamento prolongado cobra seu preço mental:',
          '• Pontos de Estresse são atribuídos pelos mestres conforme eventos traumáticos (1 a 3 pontos por evento).',
          '• Ao atingir 7 pontos de Estresse: O personagem desenvolve tremores e insônia (-2 em testes de Percepção e Intelecto).',
          '• Ao atingir 10 pontos de Estresse: Colapso Mental Iminente. O sobrevivente deve ser submetido a teste de Presença (CD 16). Se falhar, sofre surto de pânico, paralisia histérica ou fuga cega descontrolada.',
          '• Alívio de Estresse: Conquistado através de conversas no Refúgio, noites completas de sono seguro, ingestão de álcool/cigarros ou realizações bem-sucedidas.'
        ]
      }
    ]
  },
  {
    slug: 'inventario-e-equipamentos',
    number: '11',
    title: 'Inventário e Equipamentos',
    subtitle: 'Slots de carga, durabilidade e itens essenciais',
    category: 'O Mundo',
    summary: 'Capacidade de transporte individual, desgaste de ferramentas e catálogo de utilitários.',
    classification: 'LOGÍSTICA // MATERIAIS-11',
    sections: [
      {
        id: 'capacidade-carga',
        title: '11.1 Sistema de Slots de Carga',
        content: [
          'Para evitar contabilidade irrealista de quilogramas, o jogo opera por Slots de Transporte:',
          '• Capacidade Total do Sobrevivente: 5 + Força (em slots).',
          '• Um item pequeno (faca, bússola, munição) ocupa fração ou 1 slot.',
          '• Um item médio (machado, espingarda, galão de 5L) ocupa 2 slots.',
          '• Sobrecarga: Se carregar mais itens que a capacidade permitida, o personagem fica Lento (-3 em Agilidade e impossibilitado de correr).'
        ]
      },
      {
        id: 'catalogo-equipamentos',
        title: '11.2 Catálogo Oficial de Equipamentos e Durabilidade',
        content: [
          'Equipamentos possuem índices de durabilidade (1 a 5 pontos). O uso intenso ou falhas críticas degradam os itens:'
        ],
        table: {
          headers: ['Item / Equipamento', 'Slots', 'Durabilidade', 'Utilidade Primária no Ermo'],
          rows: [
            ['Mochila Militar', '+4 slots', '5/5', 'Expande a capacidade máxima de carga do portador'],
            ['Kit de Primeiros Socorros', '1 slot', '3 usos', 'Permite estancar sangramentos e estabilizar feridos'],
            ['Lanterna Tática c/ Bateria', '1 slot', '4/4', 'Iluminação noturna de 15m; atrai atenção visual'],
            ['Pederneira / Isqueiro', '0.5 slot', '10 usos', 'Iniciação rápida de fogueiras sem fósforos'],
            ['Corda de Escalada (15m)', '1 slot', '4/4', 'Transposição de desníveis, amarras e resgates'],
            ['Cantil Térmico c/ Água', '1 slot', 'Inquebrável', 'Armazena 1 cota diária de água filtrada'],
            ['Rádio Comunicador Walkie', '1 slot', '3/3', 'Comunicação direta a até 2 km de distância'],
            ['Colete de Proteção Balística', 'Veste (0)', '3/3', 'Concede +2 de Defesa contra armas de fogo e perfuração']
          ]
        }
      }
    ]
  },
  {
    slug: 'economia',
    number: '12',
    title: 'Economia e Mercado',
    subtitle: 'A moeda CS, trocas comunitárias e tabela de preços',
    category: 'O Mundo',
    summary: 'O padrão de escambo institucionalizado através de Créditos de Sobrevivência (CS).',
    classification: 'FINANÇAS DE CRISE // CS-12',
    sections: [
      {
        id: 'moeda-cs',
        title: '12.1 Os Créditos de Sobrevivência (CS)',
        content: [
          'O dinheiro de papel emitido por bancos governamentais não possui mais qualquer lastro ou utilidade.',
          'As comunidades organizadas adotaram os Créditos de Sobrevivência (CS) — títulos fiduciários lastreados em valor calórico, munição e mão de obra de manutenção comunitária.',
          '• Obtenção de CS: Doação de itens saqueados para o depósito comunitário, cumprimento de tarefas de manutenção da base ou comércio direto com outros sobreviventes.',
          '• Liquidez: Mercadores itinerantes e facções neutras aceitam CS ou realizam escambo direto por medicamentos e projéteis.'
        ]
      },
      {
        id: 'tabela-precos',
        title: '12.2 Tabela Oficial de Valores de Mercado',
        content: [
          'Valores médios tabelados praticados no grupo de Ordens e Mercado:'
        ],
        table: {
          headers: ['Mercadoria / Recurso', 'Preço Oficial Base', 'Classificação de Escassez'],
          rows: [
            ['1 Ração de Combate Enlatada', '3 CS', 'Comum (Básica)'],
            ['1 Garrafa de Água Mineral (1,5L)', '2 CS', 'Comum (Básica)'],
            ['10 Cartuchos 9mm / .38', '15 CS', 'Raro (Controlado)'],
            ['5 Cartuchos de Calibre 12', '12 CS', 'Raro (Controlado)'],
            ['Faca de Aço Carbono', '10 CS', 'Incomum'],
            ['Pistola Semiautomática Usada', '40 CS', 'Muito Raro'],
            ['Frasco de Antibióticos (Tratamento)', '25 CS', 'Crítico / Altíssimo Valor'],
            ['Kit Completo de Primeiros Socorros', '15 CS', 'Raro'],
            ['Fita Silver Tape / Adesiva', '4 CS', 'Útil para reparos'],
            ['Galão de Gasolina (5 Litros)', '20 CS', 'Altamente Disputado']
          ]
        }
      }
    ]
  },
  {
    slug: 'exploracao-e-mapa',
    number: '13',
    title: 'Exploração e Mapa Persistente',
    subtitle: 'Pontos de interesse, rotas, saques e emboscadas',
    category: 'O Mundo',
    summary: 'Como planejar incursões no mapa vivo de 15 a 25 pontos de interesse com risco dinâmico.',
    classification: 'CARTOGRAFIA DE SOBREVIVÊNCIA // MAPA-13',
    sections: [
      {
        id: 'classificacao-locais',
        title: '13.1 Classificação dos Pontos de Interesse (POIs)',
        content: [
          'O território circundante ao assentamento inicial possui entre 15 e 25 localidades cartografadas, categorizadas pelo nível de ameaça:',
          '• Zona Verde (Segura / Vasculhada): Próxima ao refúgio, perigo baixo de mortos, porém quase todo o saque valioso já foi esgotado.',
          '• Zona Amarela (Incerta / Residencial): Bairros suburbanos, postos de combustível na rodovia. Presença dispersa de caminhantes (1d6) e suprimentos razoáveis.',
          '• Zona Laranja (Perigosa / Comercial): Mercados, farmácias e oficinas. Alta concentração de infectados (2d6) e risco iminente de emboscadas humanas.',
          '• Zona Vermelha (Crítica / Hospital / Militar): Delegacias, hospitais centrais, bases do exército. Contém os melhores equipamentos do jogo, guardados por hordas maciças e carniçais velozes.'
        ]
      },
      {
        id: 'mecanica-incursao',
        title: '13.2 Procedimento de uma Incursão',
        content: [
          '1. Formação do Grupo: Os jogadores combinam a expedição no Refúgio e definem um Líder de Equipe.',
          '2. Submissão da Ordem: O líder posta a ordem com nomes dos membros, rota escolhida e itens transportados.',
          '3. Abertura do Canal: Os mestres inauguram o grupo [EXPEDIÇÕES] com a cena narrativa de aproximação.',
          '4. Testes de Campo: São exigidos testes sucessivos de Furtividade, Percepção e Arrombamento.',
          '5. Fase de Saque: Determina-se a quantidade de itens encontrados com rolagens em tabelas secretas de pilhagem.',
          '6. Rota de Retorno: Caminho de volta pode sofrer complicações caso tenham gerado ruído excessivo.'
        ]
      }
    ]
  },
  {
    slug: 'assentamentos',
    number: '14',
    title: 'Assentamentos e Comunidades',
    subtitle: 'Consumo comunitário, defesas e projetos de obras',
    category: 'O Mundo',
    summary: 'Manutenção do refúgio, barricadas, plantações e política interna entre os jogadores.',
    classification: 'DESENVOLVIMENTO COMUNITÁRIO // BASE-14',
    sections: [
      {
        id: 'consumo-base',
        title: '14.1 Manutenção do Refúgio',
        content: [
          'O assentamento onde os sobreviventes residem opera como uma entidade viva com necessidades físicas coletivas:',
          '• Estoque Comunitário: Todos os dias, o assentamento consome água e mantimentos proporcionais ao número total de habitantes cadastrados.',
          '• Colapso de Suprimentos: Se o estoque zerar, a base entra em estado de Racionamento Severo, impedindo a recuperação de PVs durante descansos.',
          '• Votações e Liderança: Decisões capitais (aceitar refugiados desconhecidos, declarar guerra, erguer obras prioritárias) são decididas democraticamente no canal [REFÚGIO].'
        ]
      },
      {
        id: 'obras-melhorias',
        title: '14.2 Obras de Melhoria e Fortificação',
        content: [
          'Jogadores podem unir Pontos de Ação (PA) e materiais para construir benfeitorias estruturais na base:'
        ],
        table: {
          headers: ['Estrutura Comunitária', 'Custo em Recursos', 'Esforço Necessário', 'Benefício Proporcionado'],
          rows: [
            ['Barricada Reforçada', '20 CS em madeira/metal', '4 PA acumulados', 'Aumenta em +3 a defesa do refúgio contra invasões'],
            ['Horta Coletiva Sustentável', '30 CS em adubo/sementes', '6 PA acumulados', 'Produz 2 Rações diárias fixas para o estoque'],
            ['Poço de Captação / Filtro', '25 CS em canos/carvão', '5 PA acumulados', 'Fornece 3 Unidades de Água pura diariamente'],
            ['Enfermaria Improvisada', '40 CS em medicamentos', '8 PA acumulados', 'Concede bônus de +2 em testes de Medicina e cirurgias'],
            ['Torre Alta de Vigia', '15 CS em tábuas/cordas', '3 PA acumulados', 'Alerta antecipado de 30 min contra aproximação hostil']
          ]
        }
      }
    ]
  },
  {
    slug: 'faccoes-e-reputacao',
    number: '15',
    title: 'Facções e Reputação',
    subtitle: 'Relações sociais, diplomacia e diplomacia armada',
    category: 'O Mundo',
    summary: 'A escala de reputação com outras comunidades e grupos armados que controlam regiões do mapa.',
    classification: 'GEOPOLÍTICA REGIONAL // DIPLOMACIA-15',
    sections: [
      {
        id: 'escala-reputacao',
        title: '15.1 A Escala de Reputação',
        content: [
          'O comportamento dos sobreviventes molda a atitude de outros grupos humanos organizados:',
          '• Hostil (-3 a -5): Tiroteio à primeira vista. Seus batedores armam emboscadas deliberadas em suas rotas conhecidas.',
          '• Desconfiado (-1 a -2): Não comercializam. Exigem que o grupo mantenha distância de seu perímetro sob mira armada.',
          '• Neutro (0): Aceitam trocas comerciais comedidas na entrada de seus entrepostos; sem concessão de auxílio mútuo.',
          '• Cooperativo (+1 a +2): Compartilham alertas de perigo no mapa e oferecem desconto de 10% nas mercadorias.',
          '• Aliado (+3 a +5): Apoio bélico armado em caso de cerco e trânsito livre em suas dependências seguras.'
        ]
      },
      {
        id: 'faccoes-conhecidas',
        title: '15.2 Exemplos de Grupos Ativos',
        content: [
          '• A Milícia do Viaduto: Sobreviventes armados e disciplinados por ex-policiais. Rígidos, intolerantes com ladrões, protegem um entreposto seguro.',
          '• O Comboio dos Renegados: Saqueadores violentos que operam em picapes blindadas. Sobrevivem extorquindo refúgios menores.',
          '• A Colônia das Águas: Comunidade pacifista focada em agricultura e filtragem fluvial. Possuem suprimentos, mas carecem de defesas armadas.'
        ]
      }
    ]
  },
  {
    slug: 'ordens-e-operacao',
    number: '16',
    title: 'Ordens e Operação do Jogo',
    subtitle: 'Fluxo oficial, estados de ordem e rotina administrativa',
    category: 'Operação',
    summary: 'Como redigir, postar e acompanhar a resolução das suas ações diárias no WhatsApp.',
    classification: 'DIRETRIZ OPERACIONAL // ORDENS-16',
    sections: [
      {
        id: 'fluxo-ordem',
        title: '16.1 Ciclo de Vida de uma Ordem',
        content: [
          'Toda ação do sobrevivente segue um fluxo estrito para manter a ordem matemática das resoluções:',
          '1. [PENDENTE]: O jogador redige a mensagem no modelo padrão no grupo [ORDENS E MERCADO].',
          '2. [EM PROCESSAMENTO]: Um dos mestres assume a ordem, debitando os Pontos de Ação e verificando rolagens.',
          '3. [CONCLUÍDA / RESOLVIDA]: O mestre publica o relatório narrativo oficial contendo ganhos, perdas, dano ou sucessos.',
          '4. [CANCELADA]: Ocorre unicamente quando o jogador revoga o pedido antes do início da arbitragem pelo mestre.'
        ]
      },
      {
        id: 'regras-antiabuso',
        title: '16.2 Regras Contra Abuso e Metagaming',
        content: [
          '• Proibição de Metagaming: Usar informações que o jogador leu no WhatsApp mas que seu personagem jamais saberia no local onde estava resulta em anulação da ordem e penalidade de XP.',
          '• Proibição de Spam: É vedado reenviar ordens repetidas ou pressionar mestres no privado durante a janela de resolução.',
          '• Respeito à Equipe: As decisões dos mestres baseadas nas regras oficiais são soberanas para manter o ritmo narrativo.'
        ]
      }
    ]
  },
  {
    slug: 'eventos-e-temporadas',
    number: '17',
    title: 'Eventos e Temporadas',
    subtitle: 'Temporadas de 30 dias, catástrofes e viradas narrativas',
    category: 'Operação',
    summary: 'A dinâmica das campanhas mensais, desastres climáticos, migrações de hordas e finais de temporada.',
    classification: 'CRONOGRAMA // TEMPORADAS-17',
    sections: [
      {
        id: 'temporadas-mensais',
        title: '17.1 Formato das Temporadas (30 Dias)',
        content: [
          'Cada temporada de DEAD HOURS representa um arco narrativo completo com início, apogeu e desfecho dramático.',
          '• Duração: 30 dias de calendário real com decisões diárias contínuas.',
          '• Clímax Sazonal: Nos últimos 5 dias de temporada, ocorre um evento de grande magnitude (ex: tempestade devastadora, cerco massivo por mega-horda, fuga desesperada para nova região).',
          '• Balanço Final: Sobreviventes que resistirem vivos até o Dia 30 recebem insígnias comemorativas e herdam vantagens de veterano na temporada seguinte.'
        ]
      },
      {
        id: 'eventos-sazonais',
        title: '17.2 Tipos de Eventos Globais',
        content: [
          'Anunciados pelos mestres no canal [CENTRAL]:',
          '• Queda de Suprimentos Aéreos: Um cargueiro misterioso solta caixotes no mapa, iniciando corrida mortal entre facções.',
          '• Chuva Ácida / Temporal Tropical: Inundações inutilizam estradas e obrigam recolhimento compulsório no refúgio.',
          '• Migração de Mega-Horda: Milhares de caminhantes cruzam o mapa, alterando permanentemente os POIs seguros.'
        ]
      }
    ]
  },
  {
    slug: 'apendices',
    number: '18',
    title: 'Apêndices e Modelos Oficiais',
    subtitle: 'Modelos de mensagem para ordens, trocas e relatórios',
    category: 'Apêndices',
    summary: 'Modelos textuais padronizados para copiar, preencher e colar diretamente no WhatsApp.',
    classification: 'DOCUMENTOS DE CAMPO // MODELOS-18',
    sections: [
      {
        id: 'modelo-ordem-exploracao',
        title: '18.1 Modelo: Ordem de Exploração',
        content: [
          'Copie o formato abaixo e envie no grupo [ORDENS E MERCADO]:',
          '--------------------------------------------------',
          '[ORDEM DE EXPEDIÇÃO]',
          '• Personagem Líder: [Nome do Sobrevivente]',
          '• Companheiros: [Nome dos Aliados Presentes]',
          '• Destino / Local: [POI no Mapa Oficial]',
          '• Objetivo Específico: [Ex: Vasculhar Farmácia buscando antibióticos]',
          '• Custo Investido: [1 ou 2 PA por participante]',
          '• Armas em Mãos: [Ex: Machado e Revólver .38]',
          '• Postura do Grupo: [Furtiva / Rápida / Agressiva]',
          '--------------------------------------------------'
        ]
      },
      {
        id: 'modelo-transacao',
        title: '18.2 Modelo: Registro Comercial (CS)',
        content: [
          '--------------------------------------------------',
          '[REGISTRO DE TRANSAÇÃO COMERCIAL]',
          '• Vendedor: [Nome do Sobrevivente]',
          '• Comprador: [Nome do Sobrevivente]',
          '• Itens Negociados: [Ex: 1x Kit Médico por 15 CS]',
          '• Valor Total: [15 CS]',
          '• Declaração: [Ambas as partes confirmam de acordo]',
          '--------------------------------------------------'
        ]
      },
      {
        id: 'modelo-relatorio',
        title: '18.3 Modelo: Relatório de Ação dos Mestres',
        content: [
          'Exemplo de como os mestres devolvem os resultados operacionais:',
          '--------------------------------------------------',
          '[RELATÓRIO DE EXPEDIÇÃO // RESOLUÇÃO OFICIAL]',
          '• Equipe: Carlos e Mariana | Local: Farmácia Popular (POI-04)',
          '• Desfecho: Sucesso Parcial. A porta traseira foi arrombada com sucesso.',
          '• Recursos Obtidos: 2x Analgésicos, 1x Curativo Limpo, 1x Água 500ml.',
          '• Complicação: O arrombamento gerou Ruído Nível 2. Dois caminhantes surgiram.',
          '• Estado Físico: Carlos sofreu 1 ferimento leve (arranho, teste de Vigor superado com 16).',
          '• XP Concedido: +15 XP para cada membro.',
          '--------------------------------------------------'
        ]
      },
      {
        id: 'checklist-mestre',
        title: '18.4 Checklist Operacional de Lançamento',
        content: [
          'Roteiro para os 2 a 3 mestres iniciarem uma nova temporada:',
          '1. Criar e configurar permissões dos 5 grupos oficiais no WhatsApp.',
          '2. Postar o link deste Manual Digital oficial para consulta dos inscritos.',
          '3. Validar fichas enviadas no modelo do Capítulo 04 e conferir limite de 12 pontos.',
          '4. Publicar a imagem oficial do Mapa da Região com os 15 a 25 POIs.',
          '5. Declarar a virada do Dia 01 às 06h00 da manhã no canal [CENTRAL].'
        ]
      }
    ]
  }
];
