import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import WorldNav from '@/components/world/WorldNav';
import { VIRUS_DOSSIER_FIELDS } from '@/lib/worldData';
import { 
  Biohazard, 
  ShieldAlert, 
  Lock, 
  FileWarning, 
  ArrowRight, 
  ArrowLeft, 
  AlertTriangle,
  Info,
  Clock,
  HeartCrack
} from 'lucide-react';

export const metadata = {
  title: 'O Vírus (Dossiê Confidencial) // DEAD HOURS',
  description: 'Prontuário biológico e estrutura documental de contenção epidemiológica do RPG DEAD HOURS. Informações em quarentena com diretrizes clínicas de campo.'
};

export default function VirusDossierPage() {
  return (
    <div className="space-y-0 pb-16">
      <WorldNav />

      {/* Hero da Seção */}
      <section className="relative bg-[#090909] border-b border-[#2B2B2B] overflow-hidden py-12">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#131313] border border-[#781D24] text-[#E3DED3] font-mono-tech text-xs tracking-wider uppercase">
              <Biohazard className="w-3.5 h-3.5 text-[#AA2830]" />
              SEÇÃO 03 // DOSSIÊ BIOLÓGICO CLASSIFICADO
            </div>
            <span className="stamp-confidential">ACESSO MILITAR NÍVEL 4</span>
          </div>

          <div className="space-y-2">
            <h1 className="font-title text-3xl sm:text-5xl text-[#E3DED3] tracking-wider uppercase">
              Dossiê do Patógeno
            </h1>
            <p className="font-mono-tech text-xs sm:text-sm text-[#C3BBA9] max-w-3xl leading-relaxed">
              Estrutura documental de contenção e vigilância epidemiológica. Este arquivo reúne a estrutura padronizada para registro de dados laboratoriais, laudos de necropsia e diretrizes de quarentena.
            </p>
          </div>
        </div>
      </section>

      {/* Fotografia Documental do Laboratório / Quarentena */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="relative border border-[#2B2B2B] bg-[#131313] overflow-hidden group">
          <div className="relative h-64 sm:h-96 w-full">
            <Image
              src="/images/virus-lab.jpg"
              alt="Instalação improvisada de triagem biológica em quarentena industrial"
              fill
              className="object-cover filter contrast-115 brightness-90 group-hover:brightness-100 transition-all duration-700"
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-transparent to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="stamp-confidential">ZONA DE QUARENTENA // DESERTA</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tech text-[#E3DED3] bg-[#090909]/85 border border-[#2B2B2B] px-3.5 py-2 backdrop-blur-sm">
              <span className="flex items-center gap-2">
                <Biohazard className="w-3.5 h-3.5 text-[#AA2830]" />
                REGISTRO VISUAL: Unidade de Triagem e Isolamento Setorial C-12
              </span>
              <span className="text-[#77736C]">ARQUIVO: BIO-EVID-4412.RAW</span>
            </div>
          </div>
        </div>
      </section>

      {/* Alerta Institucional de Ausência de Lore Fechada */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="border border-[#781D24] bg-[#131313] p-6 space-y-3">
          <div className="flex items-center gap-2.5 text-xs font-mono-tech font-bold text-[#AA2830] uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            AVISO OFICIAL AOS SOBREVIVENTES &amp; MESTRES DE JOGO
          </div>
          <p className="text-xs font-mono-tech text-[#C3BBA9] leading-relaxed">
            As causas exatas, manipulações genéticas ou vetores primários que deflagraram o colapso não possuem explicação canônica unilateral no arquivo civil. Os sobreviventes enfrentam as consequências imediatas da infecção em campo sem acesso a relatórios laboratoriais de cúpula. Este dossiê preserva a estrutura de formulário militar com campos aguardando preenchimento conforme a evolução de cada campanha.
          </p>
        </div>
      </section>

      {/* Grid de Campos do Dossiê */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {VIRUS_DOSSIER_FIELDS.map((field) => {
            const isConfidential = field.status === 'CLASSIFICADO - NÍVEL 4';
            const isPending = field.status === 'AGUARDANDO REGISTRO' || field.status === 'ANÁLISE PENDENTE';
            const isUnavailable = field.status === 'INFORMAÇÃO NÃO DISPONÍVEL';

            return (
              <div 
                key={field.id}
                className="border border-[#2B2B2B] bg-[#131313] p-6 space-y-4 flex flex-col justify-between hover:border-[#414141] transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2B2B2B] pb-2.5">
                    <span className="font-mono-tech text-xs text-[#AA2830] font-bold">
                      {field.fieldCode}
                    </span>
                    <div>
                      {isConfidential && (
                        <span className="stamp-confidential">NÍVEL 4 // RESTRITO</span>
                      )}
                      {isPending && (
                        <span className="stamp-pending">{field.status}</span>
                      )}
                      {isUnavailable && (
                        <span className="stamp-classified">INDISPONÍVEL</span>
                      )}
                    </div>
                  </div>

                  <h2 className="font-title text-xl text-[#E3DED3] tracking-wide">
                    {field.label}
                  </h2>

                  <p className="text-xs text-[#C3BBA9] leading-relaxed font-mono-tech">
                    {field.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#222222] bg-[#0A0A0A] p-3 border">
                  <div className="text-[10px] font-mono-tech text-[#77736C] uppercase mb-1 flex items-center gap-1.5">
                    <Info className="w-3 h-3 text-[#AA2830]" />
                    DESPACHO DA DIRETORIA MÉDICA:
                  </div>
                  <div className="text-xs font-mono-tech text-[#E3DED3]">
                    {field.notes}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Protocolo de Emergência Clínico de Campo (Mecânica Real do Cap. 09) */}
        <div className="border border-[#781D24] bg-[#131313] p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono-tech text-[#AA2830] font-bold uppercase tracking-wider">
            <HeartCrack className="w-4 h-4" />
            PROTOCOLO VIGENTE DE CONTÁGIO EM COMBATE (MANUAL OFICIAL — CAPÍTULO 09)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono-tech text-xs">
            <div className="bg-[#090909] p-4 border border-[#2B2B2B] space-y-1">
              <div className="text-[#AA2830] font-bold uppercase">01. Teste de Vigor (CD 14)</div>
              <p className="text-[#C3BBA9] leading-relaxed">
                Qualquer mordida de caminhante exige teste imediato de Vigor. Falha resulta no início da contaminação sanguínea.
              </p>
            </div>
            <div className="bg-[#090909] p-4 border border-[#2B2B2B] space-y-1">
              <div className="text-[#AA2830] font-bold uppercase">02. Janela Crítica de 24 Horas</div>
              <p className="text-[#C3BBA9] leading-relaxed">
                Sem intervenção cirúrgica de emergência (amputação de membro atingido) ou estabilização médica, a morte biológica e reanimação são irreversíveis.
              </p>
            </div>
            <div className="bg-[#090909] p-4 border border-[#2B2B2B] space-y-1">
              <div className="text-[#AA2830] font-bold uppercase">03. Destruição do Encéfalo</div>
              <p className="text-[#C3BBA9] leading-relaxed">
                O único método confirmado de cessação definitiva da atividade motora dos infectados consiste em trauma físico direto no tronco encefálico.
              </p>
            </div>
          </div>
        </div>

        {/* Rodapé de Navegação */}
        <div className="pt-8 border-t border-[#2B2B2B] flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/arquivos/linha-do-tempo"
            className="inline-flex items-center gap-2 text-xs font-mono-tech text-[#77736C] hover:text-[#E3DED3] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            02. A LINHA DO TEMPO
          </Link>
          <Link
            href="/arquivos/registros"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#181818] border border-[#781D24] text-xs font-mono-tech text-[#E3DED3] hover:bg-[#781D24] transition-colors"
          >
            AVANÇAR: 04. REGISTROS &amp; DOCUMENTOS
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
