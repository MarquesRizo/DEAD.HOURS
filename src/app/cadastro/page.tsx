'use client';

import React from 'react';
import Link from 'next/link';
import { Printer, AlertTriangle, ArrowLeft, ShieldCheck, FileText } from 'lucide-react';

export default function CadastroPage() {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Non-print Top Controls */}
      <div className="no-print space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#252525] pb-4">
          <Link
            href="/manual/criacao-de-sobrevivente"
            className="inline-flex items-center gap-2 text-xs font-mono-tech text-[#77736C] hover:text-[#E3DED3] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#781D24]" />
            CONSULTAR REGRAS DE CRIAÇÃO (CAPÍTULO 04)
          </Link>

          <button
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#781D24] hover:bg-[#4B1117] text-[#FFFFFF] font-mono-tech text-xs tracking-wider uppercase transition-colors border border-[#781D24]"
          >
            <Printer className="w-4 h-4" />
            IMPRIMIR MODELO DE FICHA (A4)
          </button>
        </div>

        {/* Warning Banner */}
        <div className="border border-[#781D24] bg-[#151515] p-4 text-xs font-mono-tech space-y-1">
          <div className="flex items-center gap-2 text-[#781D24] font-bold uppercase">
            <AlertTriangle className="w-4 h-4" />
            AVISO DE ESCOPO: MODELO VISUAL DE REFERÊNCIA
          </div>
          <p className="text-[#C3BBA9] leading-relaxed">
            Esta ficha é exclusivamente um modelo visual de registro. Não há formulário interativo, banco de dados ou salvamento digital neste site. Os dados devem ser preenchidos manualmente pelo sobrevivente ou copiados em mensagem de texto e enviados ao mestre via WhatsApp conforme o Apêndice 18.
          </p>
        </div>
      </div>

      {/* PRINTABLE OFFICIAL REGISTRATION DOCUMENT */}
      <div className="print-area bg-[#151515] border-2 border-[#414141] p-6 sm:p-10 space-y-8 print-box text-[#E3DED3] relative">
        {/* Document Header */}
        <div className="border-b-2 border-[#414141] pb-6 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tech">
            <span className="stamp-warning">REGISTRO DE SOBREVIVENTE</span>
            <span className="text-[#77736C]">ARQUIVO-FICHA // EDIÇÃO 1.0</span>
          </div>

          <div className="space-y-1">
            <h1 className="font-title text-2xl sm:text-4xl tracking-wider text-[#E3DED3]">
              CADASTRO DE SOBREVIVENTE — DEAD HOURS
            </h1>
            <p className="font-mono-tech text-xs text-[#C3BBA9]">
              DOCUMENTO OFICIAL DE IDENTIFICAÇÃO E AVALIAÇÃO FÍSICO-PSICOLÓGICA
            </p>
          </div>
        </div>

        {/* SECTION 1: IDENTIFICAÇÃO */}
        <div className="space-y-4">
          <div className="font-mono-tech text-xs font-bold text-[#781D24] uppercase tracking-wider pb-1 border-b border-[#252525]">
            1. IDENTIFICAÇÃO DO SOBREVIVENTE
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono-tech">
            <div className="space-y-1">
              <span className="text-[#77736C]">Nome do jogador:</span>
              <div className="border-b border-[#414141] h-6 bg-[#0B0B0B]/40 px-2 flex items-center text-[#E3DED3]" />
            </div>

            <div className="space-y-1">
              <span className="text-[#77736C]">Nome do personagem:</span>
              <div className="border-b border-[#414141] h-6 bg-[#0B0B0B]/40 px-2 flex items-center text-[#E3DED3]" />
            </div>

            <div className="space-y-1">
              <span className="text-[#77736C]">Idade:</span>
              <div className="border-b border-[#414141] h-6 bg-[#0B0B0B]/40 px-2 flex items-center text-[#E3DED3]" />
            </div>

            <div className="space-y-1">
              <span className="text-[#77736C]">Ocupação anterior ao apocalipse:</span>
              <div className="border-b border-[#414141] h-6 bg-[#0B0B0B]/40 px-2 flex items-center text-[#E3DED3]" />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <span className="text-[#77736C]">Aparência física:</span>
              <div className="border-b border-[#414141] h-8 bg-[#0B0B0B]/40 px-2 flex items-center text-[#E3DED3]" />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <span className="text-[#77736C]">Personalidade:</span>
              <div className="border-b border-[#414141] h-8 bg-[#0B0B0B]/40 px-2 flex items-center text-[#E3DED3]" />
            </div>
          </div>
        </div>

        {/* SECTION 2: ATRIBUTOS */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between border-b border-[#252525] pb-1">
            <span className="font-mono-tech text-xs font-bold text-[#781D24] uppercase tracking-wider">
              2. ATRIBUTOS (12 PONTOS DISTRIBUÍDOS // MÁXIMO 3 INICIAL)
            </span>
            <span className="font-mono-tech text-[10px] text-[#77736C]">
              ESCALA REGULAR: 0 A 3
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'FORÇA', desc: 'Massa muscular e combate corporal' },
              { label: 'AGILIDADE', desc: 'Velocidade, mira e esquiva' },
              { label: 'VIGOR', desc: 'Saúde, imunidade e fôlego' },
              { label: 'INTELECTO', desc: 'Medicina, lógica e reparos' },
              { label: 'PERCEPÇÃO', desc: 'Atenção, ruído e rastreio' },
              { label: 'PRESENÇA', desc: 'Moral, liderança e autocontrole' }
            ].map((attr) => (
              <div
                key={attr.label}
                className="border border-[#414141] bg-[#0B0B0B]/60 p-3 text-center space-y-2"
              >
                <div className="font-mono-tech text-xs font-bold text-[#E3DED3]">
                  {attr.label}
                </div>
                <div className="h-10 border border-[#414141] bg-[#151515] flex items-center justify-center font-title text-xl text-[#781D24]">
                  [ &nbsp;&nbsp; ]
                </div>
                <div className="text-[9px] text-[#77736C] leading-tight font-mono-tech">
                  {attr.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Derived Attributes Reference Box */}
          <div className="border border-[#252525] bg-[#0B0B0B] p-4 text-[11px] font-mono-tech text-[#C3BBA9] grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <span className="text-[#77736C]">VIDA:</span> 10 + (Vigor × 2) = [ &nbsp; ]
            </div>
            <div>
              <span className="text-[#77736C]">FÔLEGO:</span> 5 + Vigor = [ &nbsp; ]
            </div>
            <div>
              <span className="text-[#77736C]">DEFESA:</span> 10 + Agilidade = [ &nbsp; ]
            </div>
            <div>
              <span className="text-[#77736C]">CARGA:</span> 5 + Força = [ &nbsp; ]
            </div>
          </div>
        </div>

        {/* SECTION 3: ESPECIALIZAÇÕES */}
        <div className="space-y-4">
          <div className="font-mono-tech text-xs font-bold text-[#781D24] uppercase tracking-wider pb-1 border-b border-[#252525]">
            3. ESPECIALIZAÇÕES (+2 QUANDO APLICÁVEL)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono-tech">
            <div className="space-y-1">
              <span className="text-[#77736C]">Especialização 1:</span>
              <div className="border-b border-[#414141] h-6 bg-[#0B0B0B]/40 px-2 flex items-center text-[#E3DED3]" />
            </div>

            <div className="space-y-1">
              <span className="text-[#77736C]">Especialização 2:</span>
              <div className="border-b border-[#414141] h-6 bg-[#0B0B0B]/40 px-2 flex items-center text-[#E3DED3]" />
            </div>
          </div>
        </div>

        {/* SECTION 4: HISTÓRICO */}
        <div className="space-y-4">
          <div className="font-mono-tech text-xs font-bold text-[#781D24] uppercase tracking-wider pb-1 border-b border-[#252525]">
            4. HISTÓRICO E ÂNCORAS NARRATIVAS
          </div>

          <div className="space-y-3 text-xs font-mono-tech">
            <div className="space-y-1">
              <span className="text-[#77736C]">Objetivo pessoal:</span>
              <div className="border-b border-[#414141] h-6 bg-[#0B0B0B]/40 px-2 flex items-center text-[#E3DED3]" />
            </div>

            <div className="space-y-1">
              <span className="text-[#77736C]">Maior medo:</span>
              <div className="border-b border-[#414141] h-6 bg-[#0B0B0B]/40 px-2 flex items-center text-[#E3DED3]" />
            </div>

            <div className="space-y-1">
              <span className="text-[#77736C]">Ligação com outro sobrevivente ou NPC:</span>
              <div className="border-b border-[#414141] h-6 bg-[#0B0B0B]/40 px-2 flex items-center text-[#E3DED3]" />
            </div>

            <div className="space-y-1">
              <span className="text-[#77736C]">Um segredo ou conflito:</span>
              <div className="border-b border-[#414141] h-6 bg-[#0B0B0B]/40 px-2 flex items-center text-[#E3DED3]" />
            </div>
          </div>
        </div>

        {/* SECTION 5: EQUIPAMENTO INICIAL */}
        <div className="space-y-4">
          <div className="font-mono-tech text-xs font-bold text-[#781D24] uppercase tracking-wider pb-1 border-b border-[#252525]">
            5. EQUIPAMENTO INICIAL
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono-tech">
            <div className="space-y-1">
              <span className="text-[#77736C]">Arma:</span>
              <div className="border-b border-[#414141] h-6 bg-[#0B0B0B]/40 px-2 flex items-center text-[#E3DED3]" />
            </div>

            <div className="space-y-1">
              <span className="text-[#77736C]">Ferramenta:</span>
              <div className="border-b border-[#414141] h-6 bg-[#0B0B0B]/40 px-2 flex items-center text-[#E3DED3]" />
            </div>

            <div className="space-y-1">
              <span className="text-[#77736C]">Outros itens:</span>
              <div className="border-b border-[#414141] h-6 bg-[#0B0B0B]/40 px-2 flex items-center text-[#E3DED3]" />
            </div>
          </div>
        </div>

        {/* SECTION 6: DECLARAÇÃO */}
        <div className="pt-6 border-t-2 border-[#414141] space-y-4">
          <div className="border border-[#781D24] p-4 bg-[#0B0B0B] text-xs font-mono-tech leading-relaxed text-[#C3BBA9]">
            <span className="text-[#781D24] font-bold block mb-1">TERMO DE DECLARAÇÃO FORMAL:</span>
            &ldquo;Confirmo que li as regras de sobrevivência, combate, ausência e morte permanente de DEAD HOURS. Estou ciente de que cada decisão acarreta riscos irrevogáveis e que a arbitragem dos mestres no WhatsApp é soberana.&rdquo;
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 text-xs font-mono-tech">
            <div className="space-y-1 text-center">
              <div className="border-b border-[#414141] h-8" />
              <span className="text-[#77736C]">Assinatura do Sobrevivente</span>
            </div>
            <div className="space-y-1 text-center">
              <div className="border-b border-[#414141] h-8" />
              <span className="text-[#77736C]">Data de Registro Oficial</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
