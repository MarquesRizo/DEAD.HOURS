import React from 'react';
import Link from 'next/link';
import { 
  Skull, 
  ShieldAlert, 
  Compass, 
  Package, 
  HeartCrack, 
  Biohazard, 
  FileText, 
  BookOpen, 
  Users, 
  ArrowRight, 
  Crosshair, 
  AlertOctagon,
  Clock,
  MapPin
} from 'lucide-react';

export default function HomePage() {
  const protocols = [
    {
      title: 'Combate Tático',
      desc: 'Confrontos letais, cálculo de dano, desgaste físico e o perigo mortal do ruído balístico.',
      icon: Crosshair,
      href: '/manual/combate',
      tag: 'TÁTICA-07'
    },
    {
      title: 'Exploração & Mapa',
      desc: 'Mais de 15 pontos de interesse persistentes. Rastreio, arrombamento, saque e emboscadas.',
      icon: Compass,
      href: '/manual/exploracao-e-mapa',
      tag: 'MAPA-13'
    },
    {
      title: 'Recursos & Fisiologia',
      desc: 'Rações, água filtrada, descanso obrigatório e o controle psicológico contra o estresse.',
      icon: Package,
      href: '/manual/sobrevivencia',
      tag: 'VITAL-10'
    },
    {
      title: 'Ferimentos Clínicos',
      desc: 'Graus de dano de leve a crítico. Debilitações físicas reais e estabilização de aliados.',
      icon: HeartCrack,
      href: '/manual/ferimentos-infeccao-morte',
      tag: 'CLÍNICA-09'
    },
    {
      title: 'Infecção Bacteriana',
      desc: 'Mordidas de mortos exigem teste de Vigor (CD 14). Janela de 24h para medicação ou amputação.',
      icon: Biohazard,
      href: '/manual/ferimentos-infeccao-morte',
      tag: 'PERIGO-09'
    },
    {
      title: 'Morte Permanente',
      desc: 'Não há retorno. Quando um sobrevivente cai, sua história encerra-se para sempre.',
      icon: Skull,
      href: '/manual/ferimentos-infeccao-morte',
      tag: 'PERMADEATH'
    }
  ];

  const categories = [
    {
      title: '01. Introdução & Canais',
      desc: 'Pilares de jogo, estrutura de grupos do WhatsApp e rotina de participação.',
      href: '/manual/o-mundo',
      number: 'CAP 01 - 02'
    },
    {
      title: '02. Criação & Atributos',
      desc: '12 pontos nos atributos, 2 especializações (+2) e cálculos derivados de PV e Carga.',
      href: '/manual/criacao-de-sobrevivente',
      number: 'CAP 04'
    },
    {
      title: '03. Testes & Dificuldades',
      desc: 'Sistema 1d20, dificuldades padrão (CD 8 a CD 25) e margens de sucesso crítico.',
      href: '/manual/testes-e-dificuldades',
      number: 'CAP 05'
    },
    {
      title: '04. Ameaças & Caminhantes',
      desc: 'Comportamento dos infectados, atração por som e perigo de hordas errantes.',
      href: '/manual/caminhantes',
      number: 'CAP 08'
    },
    {
      title: '05. Economia & Moeda CS',
      desc: 'Tabela de preços, escambo e os Créditos de Sobrevivência comunitários.',
      href: '/manual/economia',
      number: 'CAP 12'
    },
    {
      title: '06. Assentamentos & Política',
      desc: 'Defesas, hortas, regras de convivência, votos e facções hostis no mapa.',
      href: '/manual/assentamentos',
      number: 'CAP 14 - 15'
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-[#0B0B0B] border-b border-[#252525] px-4 sm:px-6 lg:px-8 bg-grid-pattern">
        {/* Gritty vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0B]/80 via-transparent to-[#0B0B0B] pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto text-center space-y-8 py-16">
          {/* Document stamp */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#151515] border border-[#781D24] text-[#C3BBA9] font-mono-tech text-xs tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-[#781D24] animate-pulse" />
            DOC-001 // PROTOCOLO DE SOBREVIVÊNCIA // ARQUIVO PÚBLICO
          </div>

          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="font-title text-6xl sm:text-8xl md:text-9xl font-bold tracking-tight text-[#E3DED3] drop-shadow-lg">
              DEAD <span className="text-[#781D24]">HOURS</span>
            </h1>
            <p className="font-title text-lg sm:text-2xl md:text-3xl text-[#C3BBA9] tracking-wider max-w-2xl mx-auto font-medium">
              QUANDO O MUNDO ACABOU, SOBREVIVER VIROU UMA ESCOLHA DIÁRIA.
            </p>
          </div>

          {/* Atmospheric Quote */}
          <p className="text-sm sm:text-base text-[#77736C] max-w-xl mx-auto font-body italic leading-relaxed">
            &ldquo;Os mortos caminham. Os recursos acabam. A confiança é escassa. Cada decisão tem consequências.&rdquo;
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/manual"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#781D24] hover:bg-[#4B1117] text-[#FFFFFF] font-title text-base tracking-widest uppercase transition-all duration-200 border border-[#781D24] flex items-center justify-center gap-2 shadow-lg"
            >
              <BookOpen className="w-5 h-5" />
              CONSULTAR MANUAL
            </Link>
            <Link
              href="/cadastro"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#151515] hover:bg-[#252525] text-[#C3BBA9] hover:text-[#E3DED3] font-title text-base tracking-widest uppercase transition-all duration-200 border border-[#414141] hover:border-[#C3BBA9] flex items-center justify-center gap-2"
            >
              <FileText className="w-5 h-5 text-[#781D24]" />
              CADASTRAR SOBREVIVENTE
            </Link>
          </div>

          {/* Operational Meta */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-mono-tech text-[#77736C]">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#781D24]" />
              CICLO: 06H00 BRT
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#781D24]" />
              10 A 20 SOBREVIVENTES
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#781D24]" />
              15 A 25 PONTOS DE INTERESSE
            </span>
          </div>
        </div>
      </section>

      {/* SECTION: O MUNDO ACABOU */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#151515] border border-[#252525] p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#781D24]/10 blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="stamp-warning">REGISTRO DE CAMPO</div>
              <h2 className="font-title text-3xl sm:text-4xl text-[#E3DED3] tracking-wider">
                O MUNDO ACABOU.
              </h2>
              <p className="text-sm sm:text-base text-[#C3BBA9] leading-relaxed">
                As cidades caíram em semanas. Redes elétricas desligaram-se para nunca mais ligar. O asfalto racha sob as raízes e os mortos vagam sem pressa pelos corredores abandonados do país.
              </p>
              <p className="text-xs sm:text-sm text-[#77736C] leading-relaxed">
                DEAD HOURS é um ambiente narrativo cru. Não há heróis com munição infinita ou refúgios intocáveis. Cada participante joga com um único sobrevivente num grupo cooperativo de 10 a 20 pessoas no WhatsApp, administrado por mestres que deliberam sobre tempo, comida, água e ferimentos em tempo real.
              </p>
            </div>

            <div className="lg:col-span-4 border border-[#414141] bg-[#0B0B0B] p-5 space-y-3 font-mono-tech text-xs">
              <div className="text-[#781D24] font-bold uppercase tracking-wider pb-2 border-b border-[#252525]">
                REQUISITOS DO SOBREVIVENTE
              </div>
              <ul className="space-y-2 text-[#C3BBA9]">
                <li className="flex items-start gap-2">
                  <span className="text-[#781D24]">&gt;</span>
                  <span>1 Personagem por jogador. A morte é permanente.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#781D24]">&gt;</span>
                  <span>2 Pontos de Ação (PA) por dia. Não acumulam.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#781D24]">&gt;</span>
                  <span>Consumo diário estrito de ração e água potável.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#781D24]">&gt;</span>
                  <span>Interação social e decisões no WhatsApp.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: PROTOCOLOS DE SOBREVIVÊNCIA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-[#252525] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="font-mono-tech text-xs text-[#781D24] tracking-widest uppercase">
              DIRETRIZES FUNDAMENTAIS
            </div>
            <h2 className="font-title text-3xl sm:text-4xl text-[#E3DED3] tracking-wider">
              PROTOCOLOS DE SOBREVIVÊNCIA
            </h2>
          </div>
          <span className="font-mono-tech text-xs text-[#77736C]">
            CONSULTE ANTES DE ENVIAR ORDENS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {protocols.map((proto) => {
            const Icon = proto.icon;
            return (
              <Link
                key={proto.title}
                href={proto.href}
                className="group rule-card p-6 block hover:bg-[#151515] transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono-tech text-[10px] text-[#781D24] font-semibold tracking-wider">
                    {proto.tag}
                  </span>
                  <Icon className="w-5 h-5 text-[#77736C] group-hover:text-[#E3DED3] transition-colors" />
                </div>
                <h3 className="font-title text-xl text-[#E3DED3] group-hover:text-[#C3BBA9] tracking-wide mb-2">
                  {proto.title}
                </h3>
                <p className="text-xs text-[#77736C] leading-relaxed mb-4">
                  {proto.desc}
                </p>
                <div className="flex items-center gap-1.5 font-mono-tech text-[11px] text-[#781D24] group-hover:translate-x-1 transition-transform">
                  <span>LER PROTOCOLO</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* SECTION: ACESSE OS REGISTROS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-[#252525] pb-4">
          <div className="font-mono-tech text-xs text-[#781D24] tracking-widest uppercase">
            ARQUIVO DIGITAL
          </div>
          <h2 className="font-title text-3xl sm:text-4xl text-[#E3DED3] tracking-wider">
            ACESSE OS REGISTROS
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="p-5 bg-[#151515] border border-[#252525] hover:border-[#414141] transition-all block group"
            >
              <div className="font-mono-tech text-[10px] text-[#77736C] mb-1">
                {cat.number}
              </div>
              <h3 className="font-title text-lg text-[#E3DED3] group-hover:text-[#C3BBA9] tracking-wide mb-1.5">
                {cat.title}
              </h3>
              <p className="text-xs text-[#77736C] leading-relaxed">
                {cat.desc}
              </p>
            </Link>
          ))}
        </div>

        <div className="text-center pt-4">
          <Link
            href="/manual"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#151515] border border-[#414141] hover:border-[#781D24] text-[#E3DED3] font-mono-tech text-xs tracking-wider uppercase transition-colors"
          >
            <BookOpen className="w-4 h-4 text-[#781D24]" />
            VER ÍNDICE GERAL DE TODOS OS 18 CAPÍTULOS
          </Link>
        </div>
      </section>

      {/* SECTION: AVISO AOS SOBREVIVENTES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-2 border-[#781D24] bg-[#4B1117]/30 p-8 sm:p-10 space-y-4">
          <div className="flex items-center gap-3">
            <AlertOctagon className="w-7 h-7 text-[#781D24] shrink-0" />
            <span className="font-title text-xl sm:text-2xl text-[#E3DED3] tracking-wider">
              AVISO OFICIAL AOS SOBREVIVENTES
            </span>
          </div>
          <p className="text-sm text-[#C3BBA9] leading-relaxed">
            Ausência, decisões negligentes e consequências brutais fazem parte inseparável da experiência de DEAD HOURS. Se você se ausentar sem aviso, seu personagem entrará em isolamento preventivo no refúgio. Se entrar em combate inconsequente ou emitir ruído em zona vermelha, a morte permanente é a regra do sistema.
          </p>
          <div className="font-mono-tech text-xs text-[#E3DED3] pt-2 border-t border-[#781D24]/40 flex flex-wrap items-center justify-between gap-2">
            <span>LEIA O MANUAL ANTES DE INTERAGIR NOS GRUPOS.</span>
            <span className="text-[#C3BBA9]">DEAD HOURS // EDIÇÃO 1.0</span>
          </div>
        </div>
      </section>
    </div>
  );
}
