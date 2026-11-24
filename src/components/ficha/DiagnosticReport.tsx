'use client';

import React from 'react';
import { FichaData } from '@/lib/exportFicha';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Camera,
  FileCheck
} from 'lucide-react';
import { tacticalAudio } from '@/lib/audioSynthesis';

interface DiagnosticReportProps {
  data: FichaData;
  onNavigateToStep: (stepNumber: number) => void;
  onProceedToEmission: () => void;
}

export interface DiagnosticItem {
  id: string;
  label: string;
  description: string;
  status: 'valid' | 'warning' | 'error';
  stepNumber: number;
}

export default function DiagnosticReport({
  data,
  onNavigateToStep,
  onProceedToEmission,
}: DiagnosticReportProps) {
  const numVig = parseInt(data.vigor) || 0;
  const numAgi = parseInt(data.agilidade) || 0;
  const numFor = parseInt(data.forca) || 0;
  const numInt = parseInt(data.intelecto) || 0;
  const numPer = parseInt(data.percepcao) || 0;
  const numPres = parseInt(data.presenca) || 0;
  const totalPontos = numFor + numAgi + numVig + numInt + numPer + numPres;
  const hasAttrOverLimit = [numFor, numAgi, numVig, numInt, numPer, numPres].some((v) => v > 3);

  const diagnostics: DiagnosticItem[] = [
    // 1. Identificação
    {
      id: 'nomePersonagem',
      label: 'Identificador do Sobrevivente (Nome do Personagem)',
      description: data.nomePersonagem.trim() 
        ? `Definido como "${data.nomePersonagem}"` 
        : 'Ausente. O sobrevivente precisa de um nome ou codinome de campo.',
      status: data.nomePersonagem.trim() ? 'valid' : 'error',
      stepNumber: 1,
    },
    {
      id: 'nomeJogador',
      label: 'Registro do Jogador (Nome Real)',
      description: data.nomeJogador.trim()
        ? `Vinculado a "${data.nomeJogador}"`
        : 'Ausente. Necessário para a lista de presença e moderação dos mestres.',
      status: data.nomeJogador.trim() ? 'valid' : 'error',
      stepNumber: 1,
    },
    {
      id: 'foto',
      label: 'Identificação Fotográfica (Biometria Facial)',
      description: data.foto
        ? 'Fotografia enquadrada e homologada para inclusão no PDF e PNG.'
        : 'Nenhuma fotografia anexada. A ficha será emitida com o carimbo padrão de triagem facial.',
      status: data.foto ? 'valid' : 'warning',
      stepNumber: 1,
    },

    // 2. Capacidades & Atributos
    {
      id: 'atributos_total',
      label: 'Distribuição dos 12 Pontos de Atributos',
      description: totalPontos === 12
        ? 'Matriz matemática 100% calibrada (12/12 pontos alocados).'
        : totalPontos < 12
        ? `Alocados ${totalPontos}/12 pontos (${12 - totalPontos} pontos ainda disponíveis).`
        : `Excesso de pontos! ${totalPontos}/12 pontos alocados (+${totalPontos - 12} acima do limite).`,
      status: totalPontos === 12 ? 'valid' : totalPontos === 0 ? 'error' : 'warning',
      stepNumber: 2,
    },
    {
      id: 'atributos_teto',
      label: 'Limite Inicial Recomendado por Atributo (Máx 3)',
      description: hasAttrOverLimit
        ? 'Um ou mais atributos excedem o valor 3 recomendado para novatos.'
        : 'Todos os atributos respeitam o limite inicial do Capítulo 04.',
      status: hasAttrOverLimit ? 'warning' : 'valid',
      stepNumber: 2,
    },
    {
      id: 'especializacoes',
      label: 'Especializações Oficiais (+2)',
      description: data.esp1 && data.esp2
        ? `Ambas as especializações preenchidas: "${data.esp1}" e "${data.esp2}".`
        : data.esp1 || data.esp2
        ? 'Apenas 1 especialização preenchida. Recomendado selecionar 2 perícias.'
        : 'Nenhuma especialização atribuída. Sobrevivente sem bônus de perícias.',
      status: data.esp1 && data.esp2 ? 'valid' : 'warning',
      stepNumber: 2,
    },

    // 3. Condição Operacional & Declaração
    {
      id: 'declaracao',
      label: 'Termo de Declaração Formal (Permadeath & Regras)',
      description: data.declaracaoLida
        ? 'Termo de ciência de morte permanente aceito formalmente.'
        : 'Pendente! O jogador deve assinalar o termo de responsabilidade no ermo.',
      status: data.declaracaoLida ? 'valid' : 'error',
      stepNumber: 3,
    },
    {
      id: 'assinatura',
      label: 'Assinatura Digital de Registro',
      description: data.assinatura.trim()
        ? `Assinado digitalmente como "${data.assinatura}".`
        : 'Assinatura em branco. Recomendado assinar para autenticidade do dossiê.',
      status: data.assinatura.trim() ? 'valid' : 'warning',
      stepNumber: 3,
    },
  ];

  const errorsCount = diagnostics.filter((d) => d.status === 'error').length;
  const warningsCount = diagnostics.filter((d) => d.status === 'warning').length;
  const validCount = diagnostics.filter((d) => d.status === 'valid').length;

  return (
    <div className="space-y-6 font-mono-tech text-xs">
      {/* Resumo da Avaliação */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 border border-[#4E8752] bg-[#102213] flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-[#4E8752] shrink-0" />
          <div>
            <div className="font-title text-xl text-white font-bold">{validCount}</div>
            <div className="text-[10px] text-[#A2D3A6] uppercase">Parâmetros Validados</div>
          </div>
        </div>

        <div className="p-4 border border-[#8C6D23] bg-[#1C180B] flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-[#C3BBA9] shrink-0" />
          <div>
            <div className="font-title text-xl text-white font-bold">{warningsCount}</div>
            <div className="text-[10px] text-[#C3BBA9] uppercase">Avisos / Recomendações</div>
          </div>
        </div>

        <div className="p-4 border border-[#781D24] bg-[#221013] flex items-center gap-3">
          <XCircle className="w-6 h-6 text-[#AA2830] shrink-0" />
          <div>
            <div className="font-title text-xl text-white font-bold">{errorsCount}</div>
            <div className="text-[10px] text-[#AA2830] uppercase">Pendências Críticas</div>
          </div>
        </div>
      </div>

      {/* Lista Detalhada de Checagem */}
      <div className="border border-[#333333] bg-[#0F0F0F] divide-y divide-[#1F1F1F]">
        <div className="p-3 bg-[#171717] flex items-center justify-between text-[#C3BBA9] font-bold">
          <span className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-[#781D24]" />
            RELATÓRIO DE TRIAGEM // PROTOCOLO DE CONFORMIDADE
          </span>
          <span className="text-[10px] text-[#77736C]">REVISÃO ANTES DA EMISSÃO</span>
        </div>

        {diagnostics.map((item) => (
          <div key={item.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#151515] transition-colors">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">
                {item.status === 'valid' && <CheckCircle2 className="w-4 h-4 text-[#4E8752]" />}
                {item.status === 'warning' && <AlertTriangle className="w-4 h-4 text-[#8C6D23]" />}
                {item.status === 'error' && <XCircle className="w-4 h-4 text-[#AA2830]" />}
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-[#E3DED3]">{item.label}</div>
                <div className="text-[11px] text-[#77736C] leading-relaxed">{item.description}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                tacticalAudio.playTacticalClick();
                onNavigateToStep(item.stepNumber);
              }}
              className="self-end sm:self-center shrink-0 px-3 py-1.5 border border-[#414141] hover:border-[#781D24] bg-[#1A1A1A] hover:bg-[#252525] text-[#C3BBA9] hover:text-white text-[10px] font-bold tracking-wider uppercase transition-colors flex items-center gap-1.5"
            >
              <span>EDITAR ETAPA 0{item.stepNumber}</span>
              <ArrowRight className="w-3 h-3 text-[#781D24]" />
            </button>
          </div>
        ))}
      </div>

      {/* Ação de Continuidade para Emissão */}
      <div className="p-4 border border-[#781D24] bg-[#140E10] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="font-bold text-[#E3DED3] text-sm flex items-center justify-center sm:justify-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#781D24]" />
            {errorsCount === 0 ? 'DOSSIÊ APTO PARA EMISSÃO OFICIAL' : 'FICHA COM PENDÊNCIAS EM ABERTO'}
          </div>
          <div className="text-[11px] text-[#C3BBA9]">
            {errorsCount === 0 
              ? 'Todos os dados essenciais foram conferidos. Você pode prosseguir para a geração do PDF e PNG.'
              : 'O sistema permite a emissão de rascunhos mesmo com pendências para testes no ermo.'}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            tacticalAudio.playTacticalClick();
            onProceedToEmission();
          }}
          className="w-full sm:w-auto px-6 py-3 bg-[#781D24] hover:bg-[#AA2830] text-white font-bold tracking-wider uppercase transition-colors border border-[#AA2830] flex items-center justify-center gap-2 shadow-lg"
        >
          <Sparkles className="w-4 h-4" />
          <span>PROSSEGUIR PARA EMISSÃO (ETAPA 05)</span>
        </button>
      </div>
    </div>
  );
}
