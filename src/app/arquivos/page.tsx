import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import WorldNav from '@/components/world/WorldNav';
import { 
  Building2, 
  GitCommit, 
  Biohazard, 
  FileSearch, 
  MapPin, 
  ArrowRight,
  ShieldAlert,
  Database,
  Radio,
  Clock,
  Layers
} from 'lucide-react';

export const metadata = {
  title: 'Arquivos do Mundo — Dossiês & Registros Históricos',
  description: 'Arquivo documental de campo do RPG DEAD HOURS: sociedade pré-colapso, cronologia da queda, dossiê biológico do vírus, registros encontrados e catálogo de locais.'
};

export default function ArquivosHubPage() {
  const sections = [
    {
      id: 'mundo-antes',
      title: '01. O Mundo Antes',
      code: 'DOC-HIST-01',
      badge: 'HISTÓRICO',
      badgeClass: 'stamp-tech',
      desc: 'Registros sobre a infraestrutura, governança e rotina da sociedade momentos antes da interrupção definitiva dos serviços civis.',
      href: '/arquivos/mundo-antes',
      icon: Building2,
      meta: '2 Dossiês Arquivados // 3 Parâmetros Estruturais'
    },
    {
      id: 'linha-do-tempo',
      title: '02. A Linha do Tempo',
      code: 'CRONO-COLAPSO-02',
      badge: '6 FASES',
      badgeClass: 'stamp-warning',
      desc: 'Cronologia tática dos acontecimentos: dos primeiros sinais à queda das instituições militares e a rotina do ermo presente.',
      href: '/arquivos/linha-do-tempo',
      icon: GitCommit,
      meta: '6 Marcos Históricos // Eventos Confirmados'
    },
    {
      id: 'virus',
      title: '03. O Vírus (Dossiê Confidencial)',
      code: 'BIO-PAT-03 // NÍVEL 4',
      badge: 'ACESSO RESTRITO',
      badgeClass: 'stamp-confidential',
      desc: 'Prontuário biológico e formulário de contenção epidemiológica. Estrutura documental com campos aguardando laudos de campo oficiais.',
      href: '/arquivos/virus',
      icon: Biohazard,
      meta: '7 Parâmetros Médicos // Dados em Quarentena'
    },
    {
      id: 'registros',
      title: '04. Registros & Documentos',
      code: 'RESG-DOC-04',
      badge: 'RESGATADOS',
      badgeClass: 'stamp-classified',
      desc: 'Documentos físicos recuperados no ermo: transcrições de rádio em código Morse, cartas de familiares, comunicados e relatórios de patrulha.',
      href: '/arquivos/registros',
      icon: FileSearch,
      meta: '4 Documentos Catalogados // Fichário Físico'
    },
    {
      id: 'locais',
      title: '05. Locais & Zonas de Risco',
      code: 'CART-CAMPO-05',
      badge: 'CARTOGRAFIA',
      badgeClass: 'stamp-tech',
      desc: 'Catálogo de exploração tática de pontos de interesse com fotografias de campo, status de risco (Baixo a Extremo) e recursos conhecidos.',
      href: '/arquivos/locais',
      icon: MapPin,
      meta: '8 Pontos Catalogados // Fotografias de Campo & Níveis de Ameaça'
    }
  ];

  return (
    <div className="space-y-0 pb-16">
      <WorldNav />

      {/* Hero Header do Arquivo */}
      <section className="relative bg-[#090909] border-b border-[#2B2B2B] overflow-hidden py-12 sm:py-16">
        <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#781D24]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#131313] border border-[#781D24] text-[#E3DED3] font-mono-tech text-xs tracking-wider uppercase">
              <Database className="w-3.5 h-3.5 text-[#AA2830]" />
              BANCO DE DADOS PERSISTENTE // ARQUIVOS DO MUNDO
            </div>
            <div className="flex items-center gap-4 text-xs font-mono-tech text-[#77736C]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#3F5E46] animate-pulse" />
                TERMINAL ATIVO
              </span>
              <span>CLASSIFICAÇÃO: RESTRITA // NÍVEL 1</span>
            </div>
          </div>

          <div className="max-w-3xl space-y-3">
            <h1 className="font-title text-3xl sm:text-5xl text-[#E3DED3] tracking-wider leading-none">
              ARQUIVOS &amp; REGISTROS DO MUNDO
            </h1>
            <p className="text-sm sm:text-base text-[#C3BBA9] font-body leading-relaxed">
              Consulte os dossiês históricos, transcrições recuperadas de rádio, relatórios de patrulha e cartografia de pontos de interesse de DEAD HOURS. Uma central de inteligência para sobreviventes e mestres de campanha.
            </p>
          </div>

          {/* Quick status feed */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#252525] text-xs font-mono-tech">
            <div className="bg-[#121212] border border-[#252525] p-3">
              <span className="text-[#77736C] block text-[10px]">STATUS DA REDE:</span>
              <strong className="text-[#E3DED3]">DESCENTRALIZADA</strong>
            </div>
            <div className="bg-[#121212] border border-[#252525] p-3">
              <span className="text-[#77736C] block text-[10px]">FREQUÊNCIA DE CAMPO:</span>
              <strong className="text-[#AA2830]">142.8 MHz (CH-01)</strong>
            </div>
            <div className="bg-[#121212] border border-[#252525] p-3">
              <span className="text-[#77736C] block text-[10px]">FONTE DOCUMENTAL:</span>
              <strong className="text-[#C3BBA9]">ARQUIVO DE CAMPO</strong>
            </div>
            <div className="bg-[#121212] border border-[#252525] p-3">
              <span className="text-[#77736C] block text-[10px]">INTEGRIDADE DOS DADOS:</span>
              <strong className="text-[#74B583]">CONFIRMADA (LOCAL)</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Grade de Módulos Documentais */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#252525]">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#AA2830]" />
            <span className="font-title text-base tracking-wider text-[#E3DED3]">
              SEÇÕES DISPONÍVEIS DO ARQUIVO
            </span>
          </div>
          <span className="font-mono-tech text-xs text-[#77736C]">
            5 MÓDULOS ATIVOS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((sec) => {
            const Icon = sec.icon;
            return (
              <Link
                key={sec.id}
                href={sec.href}
                className="terminal-window chamfer-card p-6 block hover:bg-[#161616] transition-all group flex flex-col justify-between border-[#2A2A2A] hover:border-[#781D24]"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-tech text-[10px] text-[#77736C] tracking-widest">
                      {sec.code}
                    </span>
                    <span className={sec.badgeClass}>{sec.badge}</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-[#1C1C1C] border border-[#333333] group-hover:border-[#781D24] text-[#E3DED3] group-hover:text-[#AA2830] transition-colors shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-title text-xl text-[#E3DED3] group-hover:text-[#C3BBA9] tracking-wide">
                        {sec.title}
                      </h2>
                      <span className="font-mono-tech text-[10px] text-[#77736C] block mt-0.5">
                        {sec.meta}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#C3BBA9] font-body leading-relaxed line-clamp-3">
                    {sec.desc}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-[#252525] flex items-center justify-between font-mono-tech text-xs text-[#C3BBA9]">
                  <span className="text-[#77736C]">CONSULTAR DOSSIÊ</span>
                  <span className="flex items-center gap-1.5 text-[#AA2830] font-bold group-hover:translate-x-1.5 transition-transform">
                    ACESSAR <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
