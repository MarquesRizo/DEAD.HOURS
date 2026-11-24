import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  MapPin,
  Database,
  Search,
  Radio,
  FileSearch,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const metadata = {
  title: 'DEAD HOURS — Terminal de Sobrevivência // RPG WhatsApp',
  description: 'Terminal oficial do RPG de sobrevivência persistente DEAD HOURS via WhatsApp. Manual de regras, gerador de fichas em PDF/PNG e arquivos confidenciais do mundo.'
};

export default function HomePage() {
  const hubCards = [
    {
      title: 'Manual de Regras',
      code: 'REG-MANUAL // 18 CAPS',
      desc: '18 capítulos com a mecânica completa de sobrevivência: combate tático, infecção, mortos-vivos, assentamentos e economia.',
      href: '/manual',
      icon: BookOpen,
      badge: 'CONSULTA OBRIGATÓRIA',
      badgeClass: 'stamp-warning',
      action: 'ACESSAR CAPÍTULOS'
    },
    {
      title: 'Ficha de Sobrevivente',
      code: 'DOC-FICHA // CADASTRO',
      desc: 'Formulário completo com cálculos automáticos de PV, Defesa e Carga. Exportação em PDF A4 editável e imagem PNG em alta resolução.',
      href: '/cadastro',
      icon: FileText,
      badge: 'PDF EDITÁVEL & PNG',
      badgeClass: 'stamp-tech',
      action: 'GERAR MINHA FICHA'
    },
    {
      title: 'Arquivos do Mundo',
      code: 'BD-ARQUIVOS // 5 SEÇÕES',
      desc: 'Dossiês históricos, linha do tempo do colapso em 6 fases, dossiê epidemiológico do vírus, cartas resgatadas e catálogo de locais.',
      href: '/arquivos',
      icon: Database,
      badge: 'FOTOGRAFIAS REAIS',
      badgeClass: 'stamp-classified',
      action: 'EXPLORAR ARQUIVOS'
    },
    {
      title: 'Pesquisa Tática',
      code: 'INDEX-BUSCA // BUSCADOR',
      desc: 'Localizador instantâneo de termos, tabelas, armamentos, pontos de ação e regras específicas do sistema.',
      href: '/busca',
      icon: Search,
      badge: 'INDEXADOR RÁPIDO',
      badgeClass: 'stamp-pending',
      action: 'BUSCAR TERMO'
    }
  ];

  const protocols = [
    {
      title: 'Combate Tático & Ruído',
      desc: 'Confrontos letais, cálculo de dano por atributos e o perigo mortal da atração sonora causada por disparos de armas de fogo.',
      icon: Crosshair,
      href: '/manual/combate',
      tag: 'TÁTICA-07'
    },
    {
      title: 'Exploração & Mapa',
      desc: 'Mais de 15 pontos de interesse persistentes. Rastreio, arrombamento, furtividade, saque de recursos e emboscadas.',
      icon: Compass,
      href: '/manual/exploracao-e-mapa',
      tag: 'MAPA-13'
    },
    {
      title: 'Recursos & Fisiologia',
      desc: 'Rações, água purificada, descanso obrigatório para recuperação e controle psicológico contra o estresse pós-traumático.',
      icon: Package,
      href: '/manual/sobrevivencia',
      tag: 'VITAL-10'
    },
    {
      title: 'Ferimentos Clínicos',
      desc: 'Graus de dano de leve a crítico. Debilitações físicas reais, perda de mobilidade e estabilização de emergência em campo.',
      icon: HeartCrack,
      href: '/manual/ferimentos-infeccao-morte',
      tag: 'CLÍNICA-09'
    },
    {
      title: 'Infecção Bacteriana',
      desc: 'Mordidas exigem teste de Vigor (CD 14). Janela crítica de 24 horas para medicação ou procedimento cirúrgico de amputação.',
      icon: Biohazard,
      href: '/manual/ferimentos-infeccao-morte',
      tag: 'PERIGO-09'
    },
    {
      title: 'Morte Permanente (Permadeath)',
      desc: 'Não há retorno. Quando um sobrevivente cai em combate ou sucumbe à infecção, sua história encerra-se definitivamente.',
      icon: Skull,
      href: '/manual/ferimentos-infeccao-morte',
      tag: 'PERMADEATH'
    }
  ];

  return (
    <div className="space-y-0 pb-16">
      {/* Cinematic Hero com Fotografia de Fundo */}
      <section className="relative min-h-[520px] sm:min-h-[580px] flex items-center justify-center border-b border-[#2B2B2B] bg-[#090909] overflow-hidden">
        {/* Imagem de Fundo Cinematográfica */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-highway.jpg"
            alt="Rodovia abandonada em ruínas rumo à metrópole morta"
            fill
            className="object-cover filter grayscale contrast-125 brightness-45 scale-105"
            sizes="100vw"
            priority
          />
          {/* Vinheta Escura e Textura */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-[#090909]/75 to-[#090909]/90" />
          <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
        </div>

        {/* Conteúdo do Hero */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#131313]/90 border border-[#781D24] text-[#E3DED3] font-mono-tech text-xs tracking-widest uppercase shadow-lg">
            <Radio className="w-3.5 h-3.5 text-[#AA2830] animate-pulse" />
            FREQ: 142.8 MHz // TERMINAL PERSISTENTE DE SOBREVIVÊNCIA
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="font-title text-5xl sm:text-7xl lg:text-8xl text-[#E3DED3] tracking-widest uppercase leading-none drop-shadow-md">
              DEAD HOURS
            </h1>
            <p className="font-title text-base sm:text-xl lg:text-2xl text-[#C3BBA9] tracking-wider uppercase font-semibold">
              SISTEMA PERSISTENTE DE SOBREVIVÊNCIA ZUMBI VIA WHATSAPP
            </p>
            <p className="font-mono-tech text-xs sm:text-sm text-[#77736C] max-w-2xl mx-auto leading-relaxed pt-2">
              A civilização colapsou. Não há ordens centrais, governo ou resgate militar. Consulte os manuais táticos, gere sua ficha de sobrevivente oficial e enfrente a campanha diária conduzida pela mestria nos grupos de mensagens.
            </p>
          </div>

          {/* Botões de Ação Imediata */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/manual"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#781D24] hover:bg-[#AA2830] text-[#E3DED3] font-mono-tech text-xs font-bold uppercase tracking-wider transition-all shadow-md group"
            >
              <BookOpen className="w-4 h-4" />
              <span>ACESSAR MANUAL OFICIAL</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/cadastro"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#161616] hover:bg-[#202020] border border-[#781D24] text-[#E3DED3] font-mono-tech text-xs font-bold uppercase tracking-wider transition-all shadow-md"
            >
              <FileText className="w-4 h-4 text-[#AA2830]" />
              <span>CRIAR FICHA (PDF/PNG)</span>
            </Link>

            <Link
              href="/arquivos"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#131313] hover:bg-[#1A1A1A] border border-[#333333] hover:border-[#781D24] text-[#C3BBA9] hover:text-[#E3DED3] font-mono-tech text-xs uppercase tracking-wider transition-all"
            >
              <Database className="w-4 h-4 text-[#77736C]" />
              <span>ARQUIVOS DO MUNDO</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Faixa Tática de Telemetria e Status */}
      <section className="bg-[#101010] border-b border-[#2B2B2B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono-tech text-[#77736C]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#3F5E46] animate-pulse" />
              <span>STATUS: <strong className="text-[#E3DED3]">ONLINE / 142.8 MHz</strong></span>
            </div>
            <div>
              FUSO: <strong className="text-[#E3DED3]">UTC−3 (BRASÍLIA)</strong>
            </div>
            <div>
              REINÍCIO DE PA: <strong className="text-[#E3DED3]">06H00 DIARIAMENTE</strong>
            </div>
            <div>
              AMEAÇA BIOLÓGICA: <strong className="text-[#AA2830]">NÍVEL 4 (CRÍTICO)</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Hub Tático de 4 Cartões Centrais */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2B2B2B] pb-3">
          <div className="flex items-center gap-2 font-mono-tech text-xs font-bold text-[#AA2830] uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            CENTRAL DE OPERAÇÕES DO SOBREVIVENTE
          </div>
          <span className="font-mono-tech text-[10px] text-[#77736C]">SISTEMA MODULAR V1.0</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hubCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.code}
                href={card.href}
                className="border border-[#2B2B2B] bg-[#131313] hover:bg-[#161616] hover:border-[#781D24] p-6 flex flex-col justify-between transition-all group shadow-sm"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 bg-[#090909] border border-[#333333] group-hover:border-[#781D24] flex items-center justify-center transition-colors">
                      <Icon className="w-5 h-5 text-[#AA2830]" />
                    </div>
                    <span className={card.badgeClass}>
                      {card.badge}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="font-mono-tech text-[10px] text-[#77736C] uppercase">
                      {card.code}
                    </div>
                    <h3 className="font-title text-xl text-[#E3DED3] group-hover:text-[#FFFFFF] tracking-wide">
                      {card.title}
                    </h3>
                  </div>

                  <p className="text-xs text-[#77736C] leading-relaxed font-mono-tech">
                    {card.desc}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-[#222222] flex items-center justify-between text-xs font-mono-tech text-[#AA2830] font-bold group-hover:text-[#FF6873]">
                  <span>{card.action}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Protocolos Mecânicos Fundamentais */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2B2B2B] pb-3">
          <div className="flex items-center gap-2 font-mono-tech text-xs font-bold text-[#AA2830] uppercase tracking-wider">
            <AlertOctagon className="w-4 h-4" />
            DIRETRIZES TÁTICAS DE SOBREVIVÊNCIA (SISTEMA 1D20)
          </div>
          <Link href="/manual" className="font-mono-tech text-xs text-[#77736C] hover:text-[#E3DED3] transition-colors">
            VER TODOS OS 18 CAPÍTULOS &gt;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {protocols.map((p) => {
            const Icon = p.icon;
            return (
              <Link
                key={p.tag}
                href={p.href}
                className="border border-[#2B2B2B] bg-[#131313] hover:border-[#414141] p-6 space-y-3 transition-colors group block"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono-tech text-xs text-[#AA2830] font-bold">
                    {p.tag}
                  </span>
                  <Icon className="w-4 h-4 text-[#77736C] group-hover:text-[#AA2830] transition-colors" />
                </div>

                <h4 className="font-title text-lg text-[#E3DED3] group-hover:text-[#C3BBA9] tracking-wide">
                  {p.title}
                </h4>

                <p className="text-xs text-[#77736C] leading-relaxed font-mono-tech">
                  {p.desc}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Galeria Cinematográfica de Reconhecimento do Ermo (Homenagem TLOU / Resident Evil) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2B2B2B] pb-3">
          <div className="flex items-center gap-2 font-mono-tech text-xs font-bold text-[#AA2830] uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            RECONHECIMENTO VISUAL // EVIDÊNCIAS FOTOGRÁFICAS DE CAMPO
          </div>
          <Link href="/arquivos/locais" className="font-mono-tech text-xs text-[#77736C] hover:text-[#E3DED3] transition-colors flex items-center gap-1">
            <span>EXPLORAR CARTOGRAFIA COMPLETA</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#AA2830]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Zona de Quarentena',
              code: 'LOC-QZ-09',
              image: '/images/quarantine-zone.jpg',
              risk: 'RISCO CRÍTICO',
              stamp: 'stamp-warning',
              desc: 'Barreiras militares rompidas e concertina de contenção na rodovia.'
            },
            {
              title: 'Distrito Policial',
              code: 'LOC-POL-03',
              image: '/images/police-station.jpg',
              risk: 'MORTE IMINENTE',
              stamp: 'stamp-rpd',
              desc: 'Lobby barricado com arquivos de aço e celas violadas.'
            },
            {
              title: 'Túneis de Esporos',
              code: 'LOC-MET-06',
              image: '/images/infected-tunnel.jpg',
              risk: 'INFESTAÇÃO ALTA',
              stamp: 'stamp-confidential',
              desc: 'Galerias de metrô inundadas com proliferação fúngica e caminhantes mutados.'
            },
            {
              title: 'Santuário da Usina',
              code: 'LOC-REF-12',
              image: '/images/survivor-camp.jpg',
              risk: 'MODERADO // ATIVO',
              stamp: 'stamp-tech',
              desc: 'Refúgio de sobreviventes fortificado com sentinelas armadas.'
            }
          ].map((item) => (
            <Link
              key={item.code}
              href="/arquivos/locais"
              className="border border-[#2B2B2B] bg-[#131313] hover:border-[#781D24] overflow-hidden group block transition-all flex flex-col justify-between"
            >
              <div className="relative h-44 w-full bg-[#090909] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover filter grayscale contrast-120 brightness-80 group-hover:brightness-95 group-hover:scale-105 transition-all duration-700"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent" />
                <div className="absolute top-2.5 left-2.5">
                  <span className={item.stamp}>{item.risk}</span>
                </div>
                <div className="absolute bottom-2 left-2.5 right-2.5 text-[10px] font-mono-tech text-[#E3DED3] bg-[#090909]/80 px-2 py-0.5 border border-[#2B2B2B]">
                  {item.code}
                </div>
              </div>

              <div className="p-4 space-y-1">
                <h4 className="font-title text-base text-[#E3DED3] group-hover:text-[#FFFFFF] tracking-wide">
                  {item.title}
                </h4>
                <p className="text-[11px] text-[#77736C] font-mono-tech leading-snug line-clamp-2">
                  {item.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Seção Como Funciona a Campanha no WhatsApp */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="border border-[#781D24] bg-[#121212] p-6 sm:p-10 space-y-6">
          <div className="flex items-center gap-2 font-mono-tech text-xs font-bold text-[#AA2830] uppercase tracking-wider">
            <Users className="w-4 h-4" />
            COMO FUNCIONA A PARTICIPAÇÃO // GRUPOS DE WHATSAPP
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono-tech text-xs">
            <div className="bg-[#0A0A0A] p-5 border border-[#222222] space-y-2">
              <div className="text-[#E3DED3] font-bold text-sm">
                01. Crie sua Ficha
              </div>
              <p className="text-[#77736C] leading-relaxed">
                Distribua seus 12 pontos de atributos na página de cadastro. Baixe a ficha oficial em PDF editável ou imagem PNG e copie o texto estruturado para envio.
              </p>
            </div>

            <div className="bg-[#0A0A0A] p-5 border border-[#222222] space-y-2">
              <div className="text-[#E3DED3] font-bold text-sm">
                02. Envio nos Grupos
              </div>
              <p className="text-[#77736C] leading-relaxed">
                Envie suas ordens e ações no grupo do seu assentamento. A mestria processa ações entre 06h e 23h de Brasília usando rolagens de 1d20.
              </p>
            </div>

            <div className="bg-[#0A0A0A] p-5 border border-[#222222] space-y-2">
              <div className="text-[#E3DED3] font-bold text-sm">
                03. Consequências Reais
              </div>
              <p className="text-[#77736C] leading-relaxed">
                Ferimentos acumulam penalidades, munição é escassa e a morte de um sobrevivente é definitiva (permadeath). Cooperação é questão de vida ou morte.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
