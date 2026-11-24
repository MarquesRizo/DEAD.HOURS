import React from 'react';
import Link from 'next/link';
import WorldNav from '@/components/world/WorldNav';
import { TIMELINE_PHASES } from '@/lib/worldData';
import { 
  GitCommit, 
  Clock, 
  ArrowRight, 
  ArrowLeft, 
  AlertOctagon, 
  CheckCircle2, 
  FileWarning, 
  Layers,
  Calendar
} from 'lucide-react';

export const metadata = {
  title: 'A Linha do Tempo — Cronologia da Queda // DEAD HOURS',
  description: 'Cronologia dos acontecimentos que moldaram o colapso: dos primeiros sinais periféricos à queda dos governos e ao cotidiano hostil do ermo presente.'
};

export default function LinhaDoTempoPage() {
  return (
    <div className="space-y-0 pb-16">
      <WorldNav />

      {/* Hero da Seção */}
      <section className="relative bg-[#090909] border-b border-[#2B2B2B] overflow-hidden py-12">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#131313] border border-[#781D24] text-[#E3DED3] font-mono-tech text-xs tracking-wider uppercase">
              <GitCommit className="w-3.5 h-3.5 text-[#AA2830]" />
              SEÇÃO 02 // CRONOLOGIA TÁTICA DOS FATOS
            </div>
            <span className="stamp-warning">6 FASES DOCUMENTADAS</span>
          </div>

          <div className="space-y-2">
            <h1 className="font-title text-3xl sm:text-5xl text-[#E3DED3] tracking-wider uppercase">
              A Linha do Tempo do Colapso
            </h1>
            <p className="font-mono-tech text-xs sm:text-sm text-[#C3BBA9] max-w-3xl leading-relaxed">
              Reconstituição cronológica baseada em despachos policiais, boletins hospitalares, gravações de rádio e testemunhos de sobreviventes. A sequência que transformou o mundo civilizado no território de sobrevivência persistente do RPG DEAD HOURS.
            </p>
          </div>
        </div>
      </section>

      {/* Linha do Tempo Vertical */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-12">
        <div className="relative border-l-2 border-[#2B2B2B] ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-16">
          {TIMELINE_PHASES.map((phase) => {
            const isPresent = phase.id === 'fase-5';

            return (
              <div key={phase.id} className="relative group">
                {/* Marcador do Ponto na Linha */}
                <div 
                  className={`absolute -left-[31px] sm:-left-[47px] top-1.5 w-7 h-7 rounded-full border-2 flex items-center justify-center font-mono-tech text-[10px] font-bold ${
                    isPresent
                      ? 'border-[#AA2830] bg-[#781D24] text-[#E3DED3] animate-pulse'
                      : 'border-[#414141] bg-[#131313] text-[#C3BBA9] group-hover:border-[#AA2830]'
                  }`}
                >
                  {phase.phaseNumber}
                </div>

                {/* Conteúdo da Fase */}
                <div className="border border-[#2B2B2B] bg-[#131313] p-6 sm:p-8 space-y-6">
                  {/* Cabeçalho da Fase */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2B2B2B] pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono-tech text-xs text-[#AA2830] font-bold tracking-wider">
                          {phase.phaseCode}
                        </span>
                        <span className="text-xs font-mono-tech text-[#77736C]">
                          // {phase.period}
                        </span>
                      </div>
                      <h2 className="font-title text-2xl sm:text-3xl text-[#E3DED3] tracking-wide">
                        {phase.title}
                      </h2>
                    </div>

                    <div>
                      {phase.status === 'Ativo' ? (
                        <span className="px-2.5 py-1 bg-[#781D24]/20 border border-[#AA2830] text-[#FF6873] font-mono-tech text-xs font-bold uppercase tracking-wider">
                          FASE VIGENTE (CAMPANHA)
                        </span>
                      ) : phase.status === 'Classificado' ? (
                        <span className="stamp-confidential">DADOS CLASSIFICADOS</span>
                      ) : (
                        <span className="stamp-classified">{phase.status.toUpperCase()}</span>
                      )}
                    </div>
                  </div>

                  {/* Resumo da Fase */}
                  <p className="text-sm text-[#C3BBA9] leading-relaxed font-body">
                    {phase.summary}
                  </p>

                  {/* Eventos Catalogados da Fase */}
                  <div className="space-y-4 pt-2">
                    <div className="text-[11px] font-mono-tech text-[#77736C] uppercase tracking-wider flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#AA2830]" />
                      Eventos Documentados nesta Fase:
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {phase.events.map((evt) => (
                        <div 
                          key={evt.code}
                          className="bg-[#0A0A0A] border border-[#222222] hover:border-[#333333] p-4 space-y-2 transition-colors"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tech">
                            <span className="text-[#AA2830] font-bold">
                              [{evt.code}] — {evt.title}
                            </span>
                            <span className="text-[#77736C] text-[10px]">
                              {evt.timestamp}
                            </span>
                          </div>

                          <p className="text-xs text-[#C3BBA9] leading-relaxed font-mono-tech">
                            {evt.description}
                          </p>

                          <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#1C1C1C] text-[10px] font-mono-tech text-[#77736C]">
                            <span>{evt.classification}</span>
                            <span className={evt.status === 'Confirmado' ? 'text-[#3F5E46]' : 'text-[#8C6D3B]'}>
                              STATUS: {evt.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rodapé de Navegação */}
        <div className="pt-8 border-t border-[#2B2B2B] flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/arquivos/mundo-antes"
            className="inline-flex items-center gap-2 text-xs font-mono-tech text-[#77736C] hover:text-[#E3DED3] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            01. O MUNDO ANTES
          </Link>
          <Link
            href="/arquivos/virus"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#181818] border border-[#781D24] text-xs font-mono-tech text-[#E3DED3] hover:bg-[#781D24] transition-colors"
          >
            AVANÇAR: 03. O VÍRUS (DOSSIÊ)
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
