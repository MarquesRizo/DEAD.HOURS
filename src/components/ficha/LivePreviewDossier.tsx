'use client';

import React from 'react';
import { FichaData } from '@/lib/exportFicha';
import { 
  Shield, 
  Heart, 
  Zap, 
  Briefcase, 
  User, 
  Crosshair, 
  CheckCircle2, 
  AlertTriangle,
  FileText
} from 'lucide-react';

interface LivePreviewDossierProps {
  data: FichaData;
  className?: string;
}

export default function LivePreviewDossier({ data, className = '' }: LivePreviewDossierProps) {
  const numVig = parseInt(data.vigor) || 0;
  const numAgi = parseInt(data.agilidade) || 0;
  const numFor = parseInt(data.forca) || 0;
  const numInt = parseInt(data.intelecto) || 0;
  const numPer = parseInt(data.percepcao) || 0;
  const numPres = parseInt(data.presenca) || 0;

  const vidaCalc = 10 + numVig * 2;
  const folegoCalc = 5 + numVig;
  const defesaCalc = 10 + numAgi;
  const cargaCalc = 5 + numFor;
  const totalPontos = numFor + numAgi + numVig + numInt + numPer + numPres;

  const isComplete = Boolean(
    data.nomePersonagem.trim() &&
    data.nomeJogador.trim() &&
    totalPontos === 12 &&
    data.declaracaoLida
  );

  return (
    <div className={`bg-[#0D0D0D] border-2 border-[#333333] shadow-2xl font-mono-tech text-xs text-[#E3DED3] flex flex-col ${className}`}>
      {/* Top Banner de Identificação Militar */}
      <div className="bg-[#1A1A1A] border-b-2 border-[#781D24] px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-[#781D24] animate-pulse" />
          <span className="font-bold text-[11px] tracking-wider text-[#FFFFFF]">
            PRÉVIA DO DOSSIÊ // CAMPO ATIVO
          </span>
        </div>
        <span className="text-[10px] text-[#C3BBA9] border border-[#414141] px-1.5 py-0.5 bg-[#0A0A0A]">
          SECTOR Z-01
        </span>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-140px)]">
        {/* Bloco 1: Identificação Visual & Foto */}
        <div className="grid grid-cols-12 gap-3 border border-[#222222] bg-[#121212] p-3 relative">
          {/* Miras Técnicas */}
          <div className="absolute top-1 left-1 text-[8px] text-[#781D24]">[+]</div>
          <div className="absolute top-1 right-1 text-[8px] text-[#781D24]">[+]</div>

          {/* Foto do Sobrevivente */}
          <div className="col-span-5 sm:col-span-4 flex flex-col items-center justify-center">
            <div className="relative w-full aspect-[16/10] bg-[#0A0A0A] border border-[#781D24] flex items-center justify-center overflow-hidden">
              {data.foto ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={data.foto}
                  alt={data.nomePersonagem || 'Sobrevivente'}
                  className="w-full h-full object-cover select-none"
                />
              ) : (
                <div className="text-center p-2 text-[#444444]">
                  <Crosshair className="w-6 h-6 mx-auto stroke-1" />
                  <span className="text-[8px] block mt-1 uppercase font-bold text-[#666666]">SEM FOTO</span>
                </div>
              )}
            </div>
            <span className="text-[8px] text-[#77736C] mt-1 uppercase">
              {data.foto ? 'BIOMETRIA OK' : 'PENDENTE'}
            </span>
          </div>

          {/* Dados Pessoais Rápidos */}
          <div className="col-span-7 sm:col-span-8 space-y-1.5 pl-1 min-w-0">
            <div>
              <span className="text-[9px] text-[#77736C] uppercase block">Sobrevivente:</span>
              <div className="font-bold text-sm text-white truncate font-title tracking-wider">
                {data.nomePersonagem || '— NÃO INFORMADO —'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1 text-[10px]">
              <div>
                <span className="text-[#77736C] block">Jogador:</span>
                <span className="text-[#C3BBA9] truncate block">{data.nomeJogador || '—'}</span>
              </div>
              <div>
                <span className="text-[#77736C] block">Idade:</span>
                <span className="text-[#C3BBA9] truncate block">{data.idade || '—'}</span>
              </div>
            </div>

            <div className="text-[10px]">
              <span className="text-[#77736C] block">Ocupação Anterior:</span>
              <span className="text-[#C3BBA9] truncate block">{data.ocupacao || '—'}</span>
            </div>
          </div>
        </div>

        {/* Bloco 2: Monitores Vitais Rápidos */}
        <div className="grid grid-cols-4 gap-1.5 text-center">
          <div className="bg-[#140E10] border border-[#781D24] p-1.5">
            <span className="text-[8px] text-[#AA2830] block font-bold">VIDA (PV)</span>
            <span className="font-title text-base font-bold text-white">{vidaCalc}</span>
          </div>
          <div className="bg-[#14120B] border border-[#8C6D23] p-1.5">
            <span className="text-[8px] text-[#C3BBA9] block font-bold">FÔLEGO (PF)</span>
            <span className="font-title text-base font-bold text-white">{folegoCalc}</span>
          </div>
          <div className="bg-[#0B1218] border border-[#2C4A6F] p-1.5">
            <span className="text-[8px] text-[#6CA0DC] block font-bold">DEFESA</span>
            <span className="font-title text-base font-bold text-white">{defesaCalc}</span>
          </div>
          <div className="bg-[#0C140F] border border-[#3F5E46] p-1.5">
            <span className="text-[8px] text-[#7CB382] block font-bold">CARGA</span>
            <span className="font-title text-base font-bold text-white">{cargaCalc} <span className="text-[9px] font-normal">SL</span></span>
          </div>
        </div>

        {/* Bloco 3: Matriz de Atributos */}
        <div className="border border-[#222222] bg-[#101010] p-2.5 space-y-2">
          <div className="flex items-center justify-between text-[10px] border-b border-[#252525] pb-1">
            <span className="text-[#C3BBA9] font-bold uppercase">MATRIZ DE ATRIBUTOS</span>
            <span className={totalPontos === 12 ? 'text-[#4E8752] font-bold' : 'text-[#AA2830] font-bold'}>
              {totalPontos}/12 PTS
            </span>
          </div>

          <div className="grid grid-cols-6 gap-1 text-center">
            {[
              { label: 'FOR', val: data.forca },
              { label: 'AGI', val: data.agilidade },
              { label: 'VIG', val: data.vigor },
              { label: 'INT', val: data.intelecto },
              { label: 'PER', val: data.percepcao },
              { label: 'PRE', val: data.presenca },
            ].map((attr) => (
              <div key={attr.label} className="bg-[#171717] border border-[#333333] py-1">
                <span className="text-[8px] text-[#77736C] block">{attr.label}</span>
                <span className="font-title text-sm font-bold text-[#E3DED3]">{attr.val || 0}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bloco 4: Especializações Homologadas */}
        <div className="border border-[#222222] bg-[#101010] p-2.5 space-y-1.5">
          <span className="text-[9px] text-[#77736C] uppercase font-bold block">
            ESPECIALIZAÇÕES ATIVAS (+2)
          </span>
          <div className="space-y-1 text-[11px]">
            <div className="p-1.5 bg-[#171717] border-l-2 border-[#781D24] text-[#E3DED3] truncate">
              {data.esp1 ? `1. ${data.esp1}` : <span className="text-[#555555]">1. Nenhuma selecionada</span>}
            </div>
            <div className="p-1.5 bg-[#171717] border-l-2 border-[#781D24] text-[#E3DED3] truncate">
              {data.esp2 ? `2. ${data.esp2}` : <span className="text-[#555555]">2. Nenhuma selecionada</span>}
            </div>
          </div>
        </div>

        {/* Bloco 5: Equipamento Inicial */}
        <div className="border border-[#222222] bg-[#101010] p-2.5 space-y-1 text-[10px]">
          <span className="text-[9px] text-[#77736C] uppercase font-bold block">EQUIPAMENTO EM MÃOS</span>
          <div className="text-[#C3BBA9] flex items-center gap-1.5 truncate">
            <span className="text-[#781D24] font-bold">ARMA:</span> {data.arma || '—'}
          </div>
          <div className="text-[#C3BBA9] flex items-center gap-1.5 truncate">
            <span className="text-[#781D24] font-bold">FERR:</span> {data.ferramenta || '—'}
          </div>
        </div>

        {/* Bloco 6: Status de Conformidade */}
        <div className={`p-2.5 border text-[10px] flex items-center justify-between ${
          isComplete 
            ? 'border-[#4E8752] bg-[#102213] text-[#4E8752]' 
            : 'border-[#781D24] bg-[#221013] text-[#AA2830]'
        }`}>
          <div className="flex items-center gap-1.5 font-bold">
            {isComplete ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
            <span>{isComplete ? 'DOSSIÊ 100% HOMOLOGADO' : 'PENDÊNCIAS EM ABERTO'}</span>
          </div>
          <span className="text-[9px] text-[#C3BBA9]">
            {isComplete ? 'APTO AO ERMO' : 'VER DIAGNÓSTICO'}
          </span>
        </div>
      </div>
    </div>
  );
}
