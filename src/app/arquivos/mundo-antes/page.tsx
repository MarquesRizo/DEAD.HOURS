import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import WorldNav from '@/components/world/WorldNav';
import { WORLD_BEFORE_DATA } from '@/lib/worldData';
import { 
  Building2, 
  AlertTriangle, 
  Clock, 
  Layers, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck,
  FileText,
  Activity
} from 'lucide-react';

export const metadata = {
  title: 'O Mundo Antes — Arquivos Históricos // DEAD HOURS',
  description: 'Dossiê sobre a sociedade, governança, infraestrutura urbana e a rotina pré-colapso momentos antes da interrupção definitiva dos serviços civis.'
};

export default function MundoAntesPage() {
  return (
    <div className="space-y-0 pb-16">
      <WorldNav />

      {/* Hero da Seção */}
      <section className="relative bg-[#090909] border-b border-[#2B2B2B] overflow-hidden py-12">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#131313] border border-[#781D24] text-[#E3DED3] font-mono-tech text-xs tracking-wider uppercase">
              <Building2 className="w-3.5 h-3.5 text-[#AA2830]" />
              SEÇÃO 01 // DOSSIÊ HISTÓRICO PRÉ-COLAPSO
            </div>
            <span className="stamp-tech">CLASSIFICAÇÃO: RECUPERADO</span>
          </div>

          <div className="space-y-2">
            <h1 className="font-title text-3xl sm:text-5xl text-[#E3DED3] tracking-wider uppercase">
              O Mundo Antes da Queda
            </h1>
            <p className="font-mono-tech text-xs sm:text-sm text-[#C3BBA9] max-w-3xl leading-relaxed">
              Registros arquivísticos, parâmetros estruturais e laudos documentais que detalham o funcionamento da malha urbana, serviços essenciais e rotinas civis nos últimos dias de estabilidade institucional.
            </p>
          </div>
        </div>
      </section>

      {/* Imagem Fotográfica Documental */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="relative border border-[#2B2B2B] bg-[#131313] overflow-hidden group">
          <div className="relative h-64 sm:h-96 w-full">
            <Image
              src="/images/world-before.jpg"
              alt="Metrópole antes do colapso em manhã nebulosa com tráfego suspenso"
              fill
              className="object-cover filter grayscale contrast-110 brightness-90 group-hover:brightness-95 transition-all duration-700"
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-transparent to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="stamp-classified">FOTOTECA URBANA // REGISTRO T-0</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tech text-[#E3DED3] bg-[#090909]/85 border border-[#2B2B2B] px-3.5 py-2 backdrop-blur-sm">
              <span className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#AA2830]" />
                REGISTRO ÓPTICO: Cruzamento Central — 06:42 AM (Última transmissão de câmeras de tráfego)
              </span>
              <span className="text-[#77736C]">ARQUIVO: FOTO-PRE-0091.RAW</span>
            </div>
          </div>
        </div>
      </section>

      {/* Dossiês Estruturais */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {WORLD_BEFORE_DATA.map((item) => (
            <article 
              key={item.id}
              className="border border-[#2B2B2B] bg-[#131313] p-6 sm:p-8 space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2B2B2B] pb-3">
                  <span className="font-mono-tech text-xs text-[#AA2830] font-bold">
                    {item.classification}
                  </span>
                  {item.dateTag && (
                    <span className="font-mono-tech text-[10px] text-[#77736C]">
                      {item.dateTag}
                    </span>
                  )}
                </div>

                <h2 className="font-title text-2xl text-[#E3DED3] tracking-wide">
                  {item.title}
                </h2>

                <div className="space-y-3 text-sm text-[#C3BBA9] leading-relaxed font-body">
                  {item.content.map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>

                {item.callout && (
                  <div className="p-4 bg-[#181818] border-l-2 border-[#781D24] border border-[#2B2B2B] space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono-tech font-bold text-[#E3DED3]">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#AA2830]" />
                      <span>{item.callout.title}</span>
                    </div>
                    <p className="text-xs text-[#C3BBA9] leading-relaxed font-mono-tech">
                      {item.callout.text}
                    </p>
                  </div>
                )}
              </div>

              {item.metadata && (
                <div className="pt-4 border-t border-[#2B2B2B] space-y-2">
                  <div className="text-[10px] font-mono-tech text-[#77736C] uppercase tracking-wider">
                    Parâmetros Estruturais Verificados:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {item.metadata.map((meta, mIdx) => (
                      <div key={mIdx} className="bg-[#090909] p-2.5 border border-[#222222]">
                        <div className="text-[9px] font-mono-tech text-[#77736C] uppercase">{meta.label}</div>
                        <div className="text-xs font-mono-tech text-[#E3DED3] font-bold mt-0.5">{meta.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>

        {/* Quadro Comparativo de Infraestrutura */}
        <div className="border border-[#2B2B2B] bg-[#131313] p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono-tech text-[#AA2830] font-bold uppercase tracking-wider">
            <Activity className="w-4 h-4" />
            ANÁLISE COMPARATIVA DE INFRAESTRUTURA // CRONOLOGIA DA PERDA
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono-tech border-collapse">
              <thead>
                <tr className="border-b border-[#2B2B2B] text-[#77736C] bg-[#090909]">
                  <th className="p-3">SERVIÇO ESSENCIAL</th>
                  <th className="p-3">STATUS ANTES (T-0)</th>
                  <th className="p-3">HORIZONTE DE FALHA</th>
                  <th className="p-3">ESTADO ATUAL NO ERMO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222222] text-[#C3BBA9]">
                <tr>
                  <td className="p-3 font-bold text-[#E3DED3]">Rede Elétrica Municipal</td>
                  <td className="p-3 text-[#3F5E46]">100% Operacional</td>
                  <td className="p-3 text-[#AA2830]">48 a 72 Horas</td>
                  <td className="p-3">Inoperante. Apenas geradores portáteis a diesel com autonomia restrita.</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-[#E3DED3]">Captação e Tratamento de Água</td>
                  <td className="p-3 text-[#3F5E46]">Contínua / Encanada</td>
                  <td className="p-3 text-[#AA2830]">24 a 48 Horas</td>
                  <td className="p-3">Contaminada ou sem pressão. Dependência de pastilhas de cloro e poços artesianos.</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-[#E3DED3]">Rede de Telecomunicações Celular</td>
                  <td className="p-3 text-[#3F5E46]">Cobertura Ampla 4G/5G</td>
                  <td className="p-3 text-[#AA2830]">12 a 36 Horas</td>
                  <td className="p-3">Silêncio total. Comunicação restrita a rádio transmissor em ondas curtas e VHF.</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-[#E3DED3]">Policiamento e Socorro Médico</td>
                  <td className="p-3 text-[#3F5E46]">Atendimento Centralizado</td>
                  <td className="p-3 text-[#AA2830]">Imediato (Sobrecarregado)</td>
                  <td className="p-3">Descentralizado. Cada grupo de sobreviventes arbitra sua própria proteção.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Navegação Inferior entre Dossiês */}
        <div className="pt-6 border-t border-[#2B2B2B] flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/arquivos"
            className="inline-flex items-center gap-2 text-xs font-mono-tech text-[#77736C] hover:text-[#E3DED3] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            VOLTAR À VISÃO GERAL
          </Link>
          <Link
            href="/arquivos/linha-do-tempo"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#181818] border border-[#781D24] text-xs font-mono-tech text-[#E3DED3] hover:bg-[#781D24] transition-colors"
          >
            AVANÇAR: 02. A LINHA DO TEMPO
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
