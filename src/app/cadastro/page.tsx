'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { 
  Printer, 
  AlertTriangle, 
  ArrowLeft, 
  Download, 
  Copy, 
  Check, 
  FileDown, 
  Sparkles,
  RefreshCw,
  Plus,
  Minus,
  Eye,
  X,
  RotateCcw,
  ShieldAlert,
  Save,
  CheckCircle2,
  FileCheck2,
  Sliders,
  UserCheck,
  Flame,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { 
  FichaData, 
  downloadFichaPNG, 
  downloadFichaPDF, 
  formatFichaForClipboard 
} from '@/lib/exportFicha';
import { tacticalAudio } from '@/lib/audioSynthesis';
import { saveDraft, loadDraft, clearDraft } from '@/lib/draftStorage';
import PhotoUploader from '@/components/ficha/PhotoUploader';
import SkillAutocomplete from '@/components/ficha/SkillAutocomplete';
import LivePreviewDossier from '@/components/ficha/LivePreviewDossier';
import DiagnosticReport from '@/components/ficha/DiagnosticReport';

const INITIAL_FORM_DATA: FichaData = {
  nomeJogador: '',
  nomePersonagem: '',
  idade: '',
  ocupacao: '',
  aparencia: '',
  personalidade: '',

  forca: '',
  agilidade: '',
  vigor: '',
  intelecto: '',
  percepcao: '',
  presenca: '',

  esp1: '',
  esp2: '',

  objetivo: '',
  medo: '',
  ligacao: '',
  segredo: '',

  arma: '',
  ferramenta: '',
  outrosItens: '',

  declaracaoLida: false,
  assinatura: '',
  data: '',

  foto: undefined,
  fotoZoom: 1,
  fotoOffsetX: 0,
  fotoOffsetY: 0,
};

const STEPS = [
  { id: 1, name: 'IDENTIFICAÇÃO', code: '01', desc: 'Dados Pessoais & Fotografia' },
  { id: 2, name: 'CAPACIDADES', code: '02', desc: 'Atributos & Especializações' },
  { id: 3, name: 'CONDIÇÃO OPERACIONAL', code: '03', desc: 'Status, Âncoras & Itens' },
  { id: 4, name: 'REVISÃO DO ARQUIVO', code: '04', desc: 'Diagnóstico & Triagem' },
  { id: 5, name: 'EMISSÃO', code: '05', desc: 'PDF, PNG & Transmissão' },
];

export default function CadastroPage() {
  const [formData, setFormData] = useState<FichaData>(INITIAL_FORM_DATA);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [isExportingPNG, setIsExportingPNG] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string>('INICIANDO...');
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const isLoadedRef = useRef(false);

  // 1. Carrega rascunho salvo do IndexedDB na montagem
  useEffect(() => {
    async function restoreDraft() {
      try {
        const saved = await loadDraft();
        if (saved && saved.data) {
          setFormData((prev) => ({
            ...prev,
            ...saved.data,
            data: saved.data.data || new Date().toLocaleDateString('pt-BR'),
          }));
          setSaveStatus(`RECUPERADO (${saved.updatedAt})`);
        } else {
          setFormData((prev) => ({
            ...prev,
            data: new Date().toLocaleDateString('pt-BR'),
          }));
          setSaveStatus('NOVO REGISTRO');
        }
      } catch (err) {
        console.warn('Erro ao restaurar rascunho:', err);
      } finally {
        isLoadedRef.current = true;
      }
    }
    restoreDraft();
  }, []);

  // 2. Gravação automática com debounce no IndexedDB
  useEffect(() => {
    if (!isLoadedRef.current) return;

    setSaveStatus('GRAVANDO...');
    const timer = setTimeout(async () => {
      try {
        const result = await saveDraft(formData);
        if (result.success) {
          setSaveStatus(`SALVO ${result.updatedAt}`);
        } else {
          setSaveStatus('GRAVAÇÃO LOCAL OK');
        }
      } catch {
        setSaveStatus('ERRO AO SALVAR');
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAttributeChange = (key: keyof FichaData, val: string) => {
    const num = parseInt(val) || 0;
    const clamped = Math.max(0, Math.min(5, num));
    setFormData((prev) => ({ ...prev, [key]: clamped === 0 && val === '' ? '' : String(clamped) }));
  };

  const adjustAttribute = (key: keyof FichaData, delta: number) => {
    tacticalAudio.playTacticalClick();
    const current = parseInt(String(formData[key])) || 0;
    const next = Math.max(0, Math.min(5, current + delta));
    setFormData((prev) => ({ ...prev, [key]: next === 0 ? '' : String(next) }));
  };

  const handlePhotoChange = useCallback((
    photoDataUrl: string | undefined,
    zoom: number,
    ox: number,
    oy: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      foto: photoDataUrl,
      fotoZoom: zoom,
      fotoOffsetX: ox,
      fotoOffsetY: oy,
    }));
  }, []);

  const handleResetDraft = async () => {
    tacticalAudio.playTacticalClick();
    await clearDraft();
    setFormData({
      ...INITIAL_FORM_DATA,
      data: new Date().toLocaleDateString('pt-BR'),
    });
    setShowResetModal(false);
    setActiveStep(1);
    setSaveStatus('RASCUNHO LIMPO');
  };

  const handlePrint = () => {
    tacticalAudio.playTacticalClick();
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleCopy = async () => {
    try {
      tacticalAudio.playTacticalClick();
      const formattedText = formatFichaForClipboard(formData);
      await navigator.clipboard.writeText(formattedText);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 3500);
    } catch (err) {
      console.error(err);
      setErrorMessage('Falha ao copiar automaticamente para a área de transferência.');
      setTimeout(() => setErrorMessage(null), 4000);
    }
  };

  const executeDownloadPDF = async () => {
    try {
      tacticalAudio.playTacticalClick();
      setIsExportingPDF(true);
      setErrorMessage(null);
      await downloadFichaPDF(formData);
    } catch (err) {
      console.error(err);
      setErrorMessage('Erro ao gerar PDF editável. Tente novamente.');
    } finally {
      setIsExportingPDF(false);
    }
  };

  const executeDownloadPNG = async () => {
    try {
      tacticalAudio.playTacticalClick();
      setIsExportingPNG(true);
      setErrorMessage(null);
      await downloadFichaPNG(formData);
    } catch (err) {
      console.error(err);
      setErrorMessage('Erro ao gerar imagem PNG. Verifique se o navegador suporta canvas.');
    } finally {
      setIsExportingPNG(false);
    }
  };

  // Cálculos derivados automáticos
  const numVig = parseInt(formData.vigor) || 0;
  const numAgi = parseInt(formData.agilidade) || 0;
  const numFor = parseInt(formData.forca) || 0;
  const numInt = parseInt(formData.intelecto) || 0;
  const numPer = parseInt(formData.percepcao) || 0;
  const numPres = parseInt(formData.presenca) || 0;

  const vidaCalc = 10 + numVig * 2;
  const folegoCalc = 5 + numVig;
  const defesaCalc = 10 + numAgi;
  const cargaCalc = 5 + numFor;

  // Total de pontos gastos nos atributos
  const totalPontos = numFor + numAgi + numVig + numInt + numPer + numPres;
  const hasAttrOverLimit = [numFor, numAgi, numVig, numInt, numPer, numPres].some((v) => v > 3);

  return (
    <div className="min-h-screen bg-[#070707] text-[#E3DED3] pb-16 font-body">
      {/* Toast de Cópia ou Erro */}
      {copiedSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#151515] border-2 border-[#781D24] text-[#E3DED3] p-4 shadow-2xl flex items-center gap-3 font-mono-tech text-xs tracking-wider animate-bounce">
          <div className="w-6 h-6 rounded-full bg-[#781D24] flex items-center justify-center text-white font-bold">
            ✓
          </div>
          <div>
            <div className="text-[#E3DED3] font-bold">FICHA COPIADA COM SUCESSO!</div>
            <div className="text-[#C3BBA9] text-[11px]">
              Pronto para colar no WhatsApp, Discord ou bloco de notas.
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#4B1117] border border-[#781D24] text-[#FFFFFF] p-4 shadow-2xl flex items-center gap-3 font-mono-tech text-xs">
          <AlertTriangle className="w-5 h-5 text-white" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Top Bar Militar Diegética */}
      <div className="no-print bg-[#101010] border-b border-[#252525] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between font-mono-tech text-xs">
          <div className="flex items-center gap-3">
            <Link
              href="/manual/criacao-de-sobrevivente"
              className="inline-flex items-center gap-1.5 text-[#77736C] hover:text-[#E3DED3] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#781D24]" />
              <span className="hidden sm:inline">CAPÍTULO 04 // REGRAS OFICIAIS</span>
              <span className="sm:hidden">CAP. 04</span>
            </Link>
            <span className="text-[#333333]">|</span>
            <div className="flex items-center gap-1.5 text-[11px] text-[#C3BBA9]">
              <span className="w-2 h-2 rounded-full bg-[#781D24] animate-pulse" />
              <span className="hidden md:inline font-bold">POSTO DE TRIAGEM SECTOR Z-01</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Indicador de Salvamento Automático */}
            <div className="flex items-center gap-1.5 text-[10px] text-[#77736C] border border-[#252525] px-2 py-1 bg-[#0A0A0A]">
              <Save className="w-3 h-3 text-[#781D24]" />
              <span>{saveStatus}</span>
            </div>

            {/* Botão de Limpeza com Confirmação */}
            <button
              onClick={() => {
                tacticalAudio.playTacticalClick();
                setShowResetModal(true);
              }}
              className="text-[10px] text-[#77736C] hover:text-[#AA2830] transition-colors uppercase border border-transparent hover:border-[#781D24] px-2 py-1"
              title="Iniciar novo sobrevivente do zero"
            >
              NOVO REGISTRO
            </button>

            {/* Botão de Impressão Rápida */}
            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-[#1A1A1A] hover:bg-[#252525] border border-[#414141] text-[#E3DED3] text-[10px] tracking-wider uppercase transition-colors"
            >
              <Printer className="w-3 h-3 text-[#781D24]" />
              <span>IMPRIMIR A4</span>
            </button>

            {/* Botão de Prévia Mobile */}
            <button
              onClick={() => {
                tacticalAudio.playTacticalClick();
                setShowMobilePreview(true);
              }}
              className="lg:hidden flex items-center gap-1.5 px-2.5 py-1 bg-[#781D24] text-white text-[10px] font-bold tracking-wider uppercase"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>PRÉVIA</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6">
        {/* Cabeçalho Oficial do Terminal */}
        <div className="border border-[#781D24] bg-[#0E0E0E] p-4 sm:p-6 relative overflow-hidden">
          {/* Miras Técnicas de Canto */}
          <div className="absolute top-2 left-2 text-[10px] text-[#781D24] font-bold font-mono-tech">[+]</div>
          <div className="absolute top-2 right-2 text-[10px] text-[#781D24] font-bold font-mono-tech">[+]</div>
          <div className="absolute bottom-2 left-2 text-[10px] text-[#781D24] font-bold font-mono-tech">[+]</div>
          <div className="absolute bottom-2 right-2 text-[10px] text-[#781D24] font-bold font-mono-tech">[+]</div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-mono-tech text-[10px] text-[#AA2830] tracking-widest uppercase font-bold">
                <span className="w-2 h-2 bg-[#781D24]" />
                CENTRAL DE REGISTRO DE SOBREVIVENTES // PROTOCOLO DEAD HOURS
              </div>
              <h1 className="font-title text-2xl sm:text-4xl text-[#FFFFFF] tracking-wider uppercase">
                NOVO REGISTRO DE SOBREVIVENTE
              </h1>
              <p className="text-xs sm:text-sm text-[#C3BBA9] font-mono-tech max-w-2xl leading-relaxed">
                Terminal de triagem física, psicológica e operacional. Preencha as etapas para homologar seu sobrevivente no ermo e emitir o dossiê oficial em <strong>PDF editável</strong>, <strong>PNG de alta definição</strong> ou <strong>transmissão textual</strong>.
              </p>
            </div>

            <div className="shrink-0 font-mono-tech text-right space-y-1 bg-[#141414] border border-[#252525] p-3">
              <div className="text-[10px] text-[#77736C]">SISTEMA:</div>
              <div className="text-xs font-bold text-[#E3DED3]">DEAD HOURS // EDIÇÃO 1.0</div>
              <div className="text-[10px] text-[#4E8752]">LOCAL STORAGE: ATIVO</div>
            </div>
          </div>
        </div>

        {/* Barra de Navegação das 5 Etapas do Registro */}
        <div className="no-print bg-[#111111] border border-[#252525] p-2">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 font-mono-tech">
            {STEPS.map((step) => {
              const isActive = activeStep === step.id;
              const isPast = activeStep > step.id;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    tacticalAudio.playTacticalClick();
                    setActiveStep(step.id);
                  }}
                  className={`p-2.5 text-left border transition-all ${
                    isActive
                      ? 'border-[#781D24] bg-[#221013] text-white'
                      : isPast
                      ? 'border-[#333333] bg-[#161616] text-[#C3BBA9] hover:border-[#781D24]/60'
                      : 'border-[#1F1F1F] bg-[#0E0E0E] text-[#666666] hover:text-[#C3BBA9]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className={`font-bold ${isActive ? 'text-[#AA2830]' : isPast ? 'text-[#4E8752]' : 'text-[#555555]'}`}>
                      {isPast ? '✓ ' : ''}ETAPA {step.code}
                    </span>
                    {isActive && <span className="w-1.5 h-1.5 bg-[#AA2830] rounded-full animate-ping" />}
                  </div>
                  <div className="font-bold text-xs truncate mt-0.5 tracking-wide">
                    {step.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Layout Principal: Formulário / Wizard + Painel Lateral de Prévia */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Coluna Esquerda: Conteúdo da Etapa Ativa */}
          <div className="lg:col-span-8 space-y-6">
            {/* ETAPA 01: IDENTIFICAÇÃO */}
            {activeStep === 1 && (
              <div className="bg-[#121212] border-2 border-[#333333] p-6 space-y-6 animate-in fade-in duration-150">
                <div className="border-b border-[#252525] pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-[#781D24]" />
                    <span className="font-title text-lg text-white tracking-wider">
                      ETAPA 01 — IDENTIFICAÇÃO DO SOBREVIVENTE
                    </span>
                  </div>
                  <span className="font-mono-tech text-[10px] text-[#77736C]">SEC-01 // REGISTRO CIVIL</span>
                </div>

                {/* Submissão e Ajuste de Foto (FASE 2) */}
                <PhotoUploader
                  currentPhoto={formData.foto}
                  zoom={formData.fotoZoom}
                  offsetX={formData.fotoOffsetX}
                  offsetY={formData.fotoOffsetY}
                  onPhotoChange={handlePhotoChange}
                />

                {/* Campos Textuais de Identificação */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono-tech">
                  <div className="space-y-1">
                    <label htmlFor="nomePersonagem" className="text-[#77736C] block">
                      Nome do personagem (Identificador de campo): *
                    </label>
                    <input
                      id="nomePersonagem"
                      type="text"
                      name="nomePersonagem"
                      value={formData.nomePersonagem}
                      onChange={handleChange}
                      placeholder="Ex: Carlos 'Corvo' Silveira"
                      className="w-full border-b border-[#414141] focus:border-[#781D24] h-8 bg-[#0B0B0B]/60 px-2 text-[#E3DED3] placeholder-[#414141] outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="nomeJogador" className="text-[#77736C] block">
                      Nome do jogador (Seu nome real): *
                    </label>
                    <input
                      id="nomeJogador"
                      type="text"
                      name="nomeJogador"
                      value={formData.nomeJogador}
                      onChange={handleChange}
                      placeholder="Ex: Marcos Roberto"
                      className="w-full border-b border-[#414141] focus:border-[#781D24] h-8 bg-[#0B0B0B]/60 px-2 text-[#E3DED3] placeholder-[#414141] outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="idade" className="text-[#77736C] block">
                      Idade cronológica:
                    </label>
                    <input
                      id="idade"
                      type="text"
                      name="idade"
                      value={formData.idade}
                      onChange={handleChange}
                      placeholder="Ex: 34 anos"
                      className="w-full border-b border-[#414141] focus:border-[#781D24] h-8 bg-[#0B0B0B]/60 px-2 text-[#E3DED3] placeholder-[#414141] outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="ocupacao" className="text-[#77736C] block">
                      Ocupação anterior ao apocalipse:
                    </label>
                    <input
                      id="ocupacao"
                      type="text"
                      name="ocupacao"
                      value={formData.ocupacao}
                      onChange={handleChange}
                      placeholder="Ex: Mecânico automotivo / Enfermeiro socorrista"
                      className="w-full border-b border-[#414141] focus:border-[#781D24] h-8 bg-[#0B0B0B]/60 px-2 text-[#E3DED3] placeholder-[#414141] outline-none transition-colors"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label htmlFor="aparencia" className="text-[#77736C] block">
                      Aparência física e marcas distintas:
                    </label>
                    <textarea
                      id="aparencia"
                      name="aparencia"
                      rows={3}
                      value={formData.aparencia}
                      onChange={handleChange}
                      placeholder="Cicatrizes, marcas de queimadura, vestimentas reforçadas, calçado de segurança, constituição física..."
                      className="w-full border-b border-[#414141] focus:border-[#781D24] bg-[#0B0B0B]/60 p-2 text-[#E3DED3] placeholder-[#414141] outline-none resize-y transition-colors font-body text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label htmlFor="personalidade" className="text-[#77736C] block">
                      Personalidade e conduta sob estresse:
                    </label>
                    <textarea
                      id="personalidade"
                      name="personalidade"
                      rows={3}
                      value={formData.personalidade}
                      onChange={handleChange}
                      placeholder="Temperamento sob pressão extrema, lealdade, postura perante desconhecidos e sobreviventes armados..."
                      className="w-full border-b border-[#414141] focus:border-[#781D24] bg-[#0B0B0B]/60 p-2 text-[#E3DED3] placeholder-[#414141] outline-none resize-y transition-colors font-body text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-[#252525]">
                  <button
                    type="button"
                    onClick={() => {
                      tacticalAudio.playTacticalClick();
                      setActiveStep(2);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#781D24] hover:bg-[#AA2830] text-white font-mono-tech text-xs tracking-wider uppercase font-bold transition-colors"
                  >
                    <span>AVANÇAR PARA CAPACIDADES (02)</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ETAPA 02: CAPACIDADES (ATRIBUTOS & ESPECIALIZAÇÕES) */}
            {activeStep === 2 && (
              <div className="bg-[#121212] border-2 border-[#333333] p-6 space-y-6 animate-in fade-in duration-150">
                <div className="border-b border-[#252525] pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-[#781D24]" />
                    <span className="font-title text-lg text-white tracking-wider">
                      ETAPA 02 — CAPACIDADES &amp; ATRIBUTOS (12 PONTOS)
                    </span>
                  </div>
                  <span className="font-mono-tech text-[10px] text-[#77736C]">SEC-02 // BIO-MÉTRICA</span>
                </div>

                {/* Bloco de Distribuição Visual dos 12 Pontos (FASE 4) */}
                <div className="bg-[#0B0B0B] border border-[#2B2B2B] p-4 space-y-3 font-mono-tech">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs font-bold text-[#E3DED3] flex items-center gap-2">
                      <Flame className="w-4 h-4 text-[#781D24]" />
                      DISTRIBUIÇÃO DOS 12 PONTOS (MÁXIMO INICIAL 3):
                    </div>
                    <div>
                      {totalPontos === 12 ? (
                        <span className="text-[10px] px-2.5 py-1 border border-[#4E8752] text-[#4E8752] bg-[#4E8752]/10 font-bold">
                          ✓ 12/12 PONTOS ALOCADOS (EXATO)
                        </span>
                      ) : totalPontos < 12 ? (
                        <span className="text-[10px] px-2.5 py-1 border border-[#8C6D23] text-[#C3BBA9] bg-[#1A180B] font-bold">
                          PONTOS: {totalPontos} / 12 ({12 - totalPontos} RESTANTE{12 - totalPontos > 1 ? 'S' : ''})
                        </span>
                      ) : (
                        <span className="text-[10px] px-2.5 py-1 border border-[#AA2830] text-white bg-[#781D24] font-bold animate-pulse">
                          EXCESSO: {totalPontos} / 12 (+{totalPontos - 12} ACIMA DO LIMITE)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Barra Segmentada de 12 Pontos */}
                  <div className="grid grid-cols-12 gap-1 pt-1">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-2.5 transition-all ${
                          i < totalPontos
                            ? totalPontos > 12
                              ? 'bg-[#AA2830]'
                              : 'bg-[#781D24]'
                            : 'bg-[#222222]'
                        }`}
                        title={`Ponto ${i + 1} de 12`}
                      />
                    ))}
                  </div>

                  {hasAttrOverLimit && (
                    <div className="text-[11px] text-[#AA2830] bg-[#1a1112] border-l-2 border-[#AA2830] p-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>AVISO: Um ou mais atributos excedem o valor recomendado de 3 pontos para sobreviventes novatos.</span>
                    </div>
                  )}
                </div>

                {/* Controles de Atributos com +/- e Input Direto */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { key: 'forca' as const, label: 'FORÇA [FOR]', desc: 'Massa muscular, carregar carga e combate corporal' },
                    { key: 'agilidade' as const, label: 'AGILIDADE [AGI]', desc: 'Reflexos, velocidade, pontaria e furtividade' },
                    { key: 'vigor' as const, label: 'VIGOR [VIG]', desc: 'Saúde, imunidade contra infecção e fôlego' },
                    { key: 'intelecto' as const, label: 'INTELECTO [INT]', desc: 'Medicina, primeiros socorros, lógica e reparos' },
                    { key: 'percepcao' as const, label: 'PERCEPÇÃO [PER]', desc: 'Atenção, ruído no escuro, caça e rastreio' },
                    { key: 'presenca' as const, label: 'PRESENÇA [PRE]', desc: 'Sangue frio, moral, liderança e negociação' },
                  ].map((attr) => {
                    const currentVal = parseInt(String(formData[attr.key])) || 0;
                    return (
                      <div
                        key={attr.key}
                        className={`border p-3 space-y-2 bg-[#0B0B0B] transition-colors ${
                          currentVal >= 3 ? 'border-[#781D24]' : 'border-[#333333]'
                        }`}
                      >
                        <div className="font-mono-tech text-xs font-bold text-[#E3DED3] flex items-center justify-between">
                          <span>{attr.label}</span>
                          <span className="text-[10px] text-[#77736C]">MÁX 3</span>
                        </div>

                        {/* Controles Visuais +/- */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => adjustAttribute(attr.key, -1)}
                            disabled={currentVal <= 0}
                            className="w-8 h-9 bg-[#1A1A1A] hover:bg-[#252525] border border-[#414141] hover:border-[#781D24] text-[#E3DED3] flex items-center justify-center font-bold disabled:opacity-40 transition-colors"
                            title="Diminuir ponto"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <div className="flex-1 h-9 border border-[#414141] bg-[#141414] flex items-center justify-center">
                            <input
                              type="number"
                              min={0}
                              max={5}
                              name={attr.key}
                              value={formData[attr.key]}
                              onChange={(e) => handleAttributeChange(attr.key, e.target.value)}
                              placeholder="0"
                              className="w-full h-full text-center bg-transparent font-title text-xl text-[#781D24] focus:text-[#E3DED3] outline-none font-bold"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => adjustAttribute(attr.key, 1)}
                            disabled={currentVal >= 5}
                            className="w-8 h-9 bg-[#1A1A1A] hover:bg-[#252525] border border-[#414141] hover:border-[#781D24] text-[#E3DED3] flex items-center justify-center font-bold disabled:opacity-40 transition-colors"
                            title="Aumentar ponto"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-[10px] text-[#77736C] leading-tight font-mono-tech">
                          {attr.desc}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Box de Atributos Derivados Oficiais */}
                <div className="border border-[#252525] bg-[#0A0A0A] p-4 text-xs font-mono-tech text-[#C3BBA9] grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <span className="text-[#77736C] block text-[10px]">PONTOS DE VIDA (PV):</span>
                    <strong className="text-[#E3DED3] font-bold text-sm">{vidaCalc} PV</strong>
                    <span className="text-[9px] text-[#555555] block">10 + (2 × VIG)</span>
                  </div>
                  <div>
                    <span className="text-[#77736C] block text-[10px]">PONTOS DE FÔLEGO (PF):</span>
                    <strong className="text-[#E3DED3] font-bold text-sm">{folegoCalc} PF</strong>
                    <span className="text-[9px] text-[#555555] block">5 + VIG</span>
                  </div>
                  <div>
                    <span className="text-[#77736C] block text-[10px]">DEFESA PASSIVA:</span>
                    <strong className="text-[#E3DED3] font-bold text-sm">{defesaCalc} DEF</strong>
                    <span className="text-[9px] text-[#555555] block">10 + AGI</span>
                  </div>
                  <div>
                    <span className="text-[#77736C] block text-[10px]">CAPACIDADE DE CARGA:</span>
                    <strong className="text-[#E3DED3] font-bold text-sm">{cargaCalc} slots</strong>
                    <span className="text-[9px] text-[#555555] block">5 + FOR</span>
                  </div>
                </div>

                {/* Autocomplete de Perícias e Especializações (FASE 3) */}
                <div className="space-y-4 pt-2">
                  <div className="border-b border-[#252525] pb-1">
                    <span className="font-mono-tech text-xs font-bold text-[#781D24] uppercase tracking-wider">
                      ESPECIALIZAÇÕES HOMOLOGADAS (+2 QUANDO APLICÁVEL)
                    </span>
                    <p className="text-[11px] text-[#77736C] mt-0.5">
                      Escolha 2 perícias homologadas pelo sistema ou digite para filtrar com autocomplete em tempo real:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SkillAutocomplete
                      id="esp1"
                      name="esp1"
                      value={formData.esp1}
                      onChange={(val) => setFormData((prev) => ({ ...prev, esp1: val }))}
                      label="Especialização 1:"
                      placeholder="Digite 'C' para Caçar, 'F' para Furtividade..."
                    />

                    <SkillAutocomplete
                      id="esp2"
                      name="esp2"
                      value={formData.esp2}
                      onChange={(val) => setFormData((prev) => ({ ...prev, esp2: val }))}
                      label="Especialização 2:"
                      placeholder="Digite 'P' para Primeiros Socorros, 'M' para Mecânica..."
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#252525]">
                  <button
                    type="button"
                    onClick={() => {
                      tacticalAudio.playTacticalClick();
                      setActiveStep(1);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#1A1A1A] hover:bg-[#252525] text-[#C3BBA9] font-mono-tech text-xs uppercase"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>ETAPA 01</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      tacticalAudio.playTacticalClick();
                      setActiveStep(3);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#781D24] hover:bg-[#AA2830] text-white font-mono-tech text-xs tracking-wider uppercase font-bold transition-colors"
                  >
                    <span>AVANÇAR PARA CONDIÇÃO OPERACIONAL (03)</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ETAPA 03: CONDIÇÃO OPERACIONAL & ÂNCORAS */}
            {activeStep === 3 && (
              <div className="bg-[#121212] border-2 border-[#333333] p-6 space-y-6 animate-in fade-in duration-150">
                <div className="border-b border-[#252525] pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="w-5 h-5 text-[#781D24]" />
                    <span className="font-title text-lg text-white tracking-wider">
                      ETAPA 03 — CONDIÇÃO OPERACIONAL, HISTÓRICO &amp; ITENS
                    </span>
                  </div>
                  <span className="font-mono-tech text-[10px] text-[#77736C]">SEC-03 // REGISTRO DE CAMPO</span>
                </div>

                {/* Seção de Histórico e Âncoras */}
                <div className="space-y-4">
                  <div className="font-mono-tech text-xs font-bold text-[#781D24] uppercase tracking-wider pb-1 border-b border-[#252525]">
                    ÂNCORAS NARRATIVAS &amp; PSICOLÓGICAS
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono-tech">
                    <div className="space-y-1">
                      <label htmlFor="objetivo" className="text-[#77736C] block">
                        Objetivo pessoal imediato:
                      </label>
                      <input
                        id="objetivo"
                        type="text"
                        name="objetivo"
                        value={formData.objetivo}
                        onChange={handleChange}
                        placeholder="A meta prioritária que mantém o personagem vivo..."
                        className="w-full border-b border-[#414141] focus:border-[#781D24] h-8 bg-[#0B0B0B]/60 px-2 text-[#E3DED3] placeholder-[#414141] outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="medo" className="text-[#77736C] block">
                        Maior medo / trauma:
                      </label>
                      <input
                        id="medo"
                        type="text"
                        name="medo"
                        value={formData.medo}
                        onChange={handleChange}
                        placeholder="Gatilho psicológico sob crise..."
                        className="w-full border-b border-[#414141] focus:border-[#781D24] h-8 bg-[#0B0B0B]/60 px-2 text-[#E3DED3] placeholder-[#414141] outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="ligacao" className="text-[#77736C] block">
                        Ligação com outro sobrevivente ou NPC:
                      </label>
                      <input
                        id="ligacao"
                        type="text"
                        name="ligacao"
                        value={formData.ligacao}
                        onChange={handleChange}
                        placeholder="Nome do aliado ou NPC conhecido e vínculo..."
                        className="w-full border-b border-[#414141] focus:border-[#781D24] h-8 bg-[#0B0B0B]/60 px-2 text-[#E3DED3] placeholder-[#414141] outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="segredo" className="text-[#77736C] block">
                        Um segredo ou conflito do passado:
                      </label>
                      <input
                        id="segredo"
                        type="text"
                        name="segredo"
                        value={formData.segredo}
                        onChange={handleChange}
                        placeholder="Fato oculto que causaria tensão se descoberto..."
                        className="w-full border-b border-[#414141] focus:border-[#781D24] h-8 bg-[#0B0B0B]/60 px-2 text-[#E3DED3] placeholder-[#414141] outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Seção de Equipamento Inicial */}
                <div className="space-y-4 pt-2">
                  <div className="font-mono-tech text-xs font-bold text-[#781D24] uppercase tracking-wider pb-1 border-b border-[#252525]">
                    EQUIPAMENTO &amp; MANIFESTO DE CARGA
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono-tech">
                    <div className="space-y-1">
                      <label htmlFor="arma" className="text-[#77736C] block">Arma principal:</label>
                      <input
                        id="arma"
                        type="text"
                        name="arma"
                        value={formData.arma}
                        onChange={handleChange}
                        placeholder="Ex: Faca de Caça (1d4+FOR)"
                        className="w-full border-b border-[#414141] focus:border-[#781D24] h-8 bg-[#0B0B0B]/60 px-2 text-[#E3DED3] placeholder-[#414141] outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="ferramenta" className="text-[#77736C] block">Ferramenta:</label>
                      <input
                        id="ferramenta"
                        type="text"
                        name="ferramenta"
                        value={formData.ferramenta}
                        onChange={handleChange}
                        placeholder="Ex: Lanterna Tática c/ Dínamo"
                        className="w-full border-b border-[#414141] focus:border-[#781D24] h-8 bg-[#0B0B0B]/60 px-2 text-[#E3DED3] placeholder-[#414141] outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="outrosItens" className="text-[#77736C] block">Outros itens e suprimentos:</label>
                      <input
                        id="outrosItens"
                        type="text"
                        name="outrosItens"
                        value={formData.outrosItens}
                        onChange={handleChange}
                        placeholder="Ex: Cantil 1L, Ração (x2), Silver tape"
                        className="w-full border-b border-[#414141] focus:border-[#781D24] h-8 bg-[#0B0B0B]/60 px-2 text-[#E3DED3] placeholder-[#414141] outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Declaração Legal e Assinatura */}
                <div className="space-y-4 pt-4 border-t-2 border-[#2B2B2B]">
                  <label className="border border-[#781D24] p-4 bg-[#0B0B0B] text-xs font-mono-tech leading-relaxed text-[#C3BBA9] flex items-start gap-3 cursor-pointer hover:bg-[#151515] transition-colors">
                    <input
                      type="checkbox"
                      name="declaracaoLida"
                      checked={formData.declaracaoLida}
                      onChange={handleChange}
                      className="mt-0.5 accent-[#781D24] w-4 h-4 rounded cursor-pointer shrink-0"
                    />
                    <div>
                      <span className="text-[#781D24] font-bold block mb-1">
                        TERMO DE DECLARAÇÃO FORMAL &amp; MORTE PERMANENTE:
                      </span>
                      &ldquo;Confirmo que li as regras de sobrevivência, combate, ausência e morte permanente de DEAD HOURS. Estou ciente de que cada decisão acarreta riscos irrevogáveis e que a arbitragem dos mestres no WhatsApp é soberana.&rdquo;
                    </div>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 text-xs font-mono-tech">
                    <div className="space-y-1 text-center">
                      <input
                        type="text"
                        name="assinatura"
                        value={formData.assinatura}
                        onChange={handleChange}
                        placeholder="Digite sua assinatura digital..."
                        className="w-full border-b border-[#414141] focus:border-[#781D24] text-center h-8 bg-transparent text-[#E3DED3] placeholder-[#414141] outline-none font-title text-sm tracking-wider"
                      />
                      <span className="text-[#77736C] block">Assinatura do Sobrevivente</span>
                    </div>

                    <div className="space-y-1 text-center">
                      <input
                        type="text"
                        name="data"
                        value={formData.data}
                        onChange={handleChange}
                        placeholder="DD/MM/AAAA"
                        className="w-full border-b border-[#414141] focus:border-[#781D24] text-center h-8 bg-transparent text-[#E3DED3] placeholder-[#414141] outline-none"
                      />
                      <span className="text-[#77736C] block">Data de Registro Oficial</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#252525]">
                  <button
                    type="button"
                    onClick={() => {
                      tacticalAudio.playTacticalClick();
                      setActiveStep(2);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#1A1A1A] hover:bg-[#252525] text-[#C3BBA9] font-mono-tech text-xs uppercase"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>ETAPA 02</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      tacticalAudio.playTacticalClick();
                      setActiveStep(4);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#781D24] hover:bg-[#AA2830] text-white font-mono-tech text-xs tracking-wider uppercase font-bold transition-colors"
                  >
                    <span>AVANÇAR PARA REVISÃO DO ARQUIVO (04)</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ETAPA 04: REVISÃO DO ARQUIVO & DIAGNÓSTICO (FASE 7) */}
            {activeStep === 4 && (
              <div className="bg-[#121212] border-2 border-[#333333] p-6 space-y-6 animate-in fade-in duration-150">
                <div className="border-b border-[#252525] pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-[#781D24]" />
                    <span className="font-title text-lg text-white tracking-wider">
                      ETAPA 04 — REVISÃO DO ARQUIVO &amp; DIAGNÓSTICO DE TRIAGEM
                    </span>
                  </div>
                  <span className="font-mono-tech text-[10px] text-[#77736C]">SEC-04 // CONFORMIDADE</span>
                </div>

                {/* Relatório de Diagnóstico */}
                <DiagnosticReport
                  data={formData}
                  onNavigateToStep={(stepNum) => setActiveStep(stepNum)}
                  onProceedToEmission={() => setActiveStep(5)}
                />

                <div className="flex items-center justify-between pt-4 border-t border-[#252525]">
                  <button
                    type="button"
                    onClick={() => {
                      tacticalAudio.playTacticalClick();
                      setActiveStep(3);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#1A1A1A] hover:bg-[#252525] text-[#C3BBA9] font-mono-tech text-xs uppercase"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>ETAPA 03</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      tacticalAudio.playTacticalClick();
                      setActiveStep(5);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#781D24] hover:bg-[#AA2830] text-white font-mono-tech text-xs tracking-wider uppercase font-bold transition-colors"
                  >
                    <span>IR PARA EMISSÃO DE DOCUMENTOS (05)</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ETAPA 05: EMISSÃO DOCUMENTAL (FASE 8) */}
            {activeStep === 5 && (
              <div className="bg-[#121212] border-2 border-[#781D24] p-6 space-y-6 animate-in fade-in duration-150">
                <div className="border-b border-[#252525] pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#781D24]" />
                    <span className="font-title text-lg text-white tracking-wider">
                      ETAPA 05 — CENTRAL DE EMISSÃO DOCUMENTAL
                    </span>
                  </div>
                  <span className="font-mono-tech text-[10px] text-[#77736C]">SEC-05 // HOMOLOGAÇÃO</span>
                </div>

                <div className="bg-[#0A0A0A] border border-[#252525] p-4 text-xs font-mono-tech text-[#C3BBA9] space-y-2">
                  <div className="text-white font-bold uppercase flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#4E8752]" />
                    DOSSIÊ PREPARADO PARA GERAÇÃO E COMPARTILHAMENTO
                  </div>
                  <p className="leading-relaxed">
                    Selecione o formato desejado abaixo. O <strong>PDF Editável</strong> preserva todos os campos de formulário AcroForm interativos e incorpora sua fotografia sem achatar o documento. O <strong>PNG</strong> gera uma imagem em altíssima definição (1500×2121 px) pronta para visualização rápida. O botão <strong>Copiar Ficha</strong> copia o texto formatado para o WhatsApp ou Discord da mesa.
                  </p>
                </div>

                {/* Grade de Botões de Emissão */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* BOTÃO 1: PDF EDITÁVEL */}
                  <button
                    type="button"
                    onClick={executeDownloadPDF}
                    disabled={isExportingPDF}
                    className="flex flex-col items-center justify-center gap-2 p-5 bg-[#171717] hover:bg-[#222222] text-[#E3DED3] border-2 border-[#414141] hover:border-[#781D24] font-mono-tech text-xs tracking-wider uppercase transition-all shadow-xl disabled:opacity-50 group"
                  >
                    {isExportingPDF ? (
                      <>
                        <RefreshCw className="w-6 h-6 animate-spin text-[#781D24]" />
                        <span className="font-bold">COMPILANDO PDF...</span>
                        <span className="text-[10px] text-[#77736C]">EMBUTINDO BIOMETRIA</span>
                      </>
                    ) : (
                      <>
                        <FileDown className="w-6 h-6 text-[#781D24] group-hover:scale-110 transition-transform" />
                        <span className="font-bold">BAIXAR PDF EDITÁVEL</span>
                        <span className="text-[10px] text-[#77736C]">A4 VETORIAL // ACROFORM</span>
                      </>
                    )}
                  </button>

                  {/* BOTÃO 2: IMAGEM PNG */}
                  <button
                    type="button"
                    onClick={executeDownloadPNG}
                    disabled={isExportingPNG}
                    className="flex flex-col items-center justify-center gap-2 p-5 bg-[#171717] hover:bg-[#222222] text-[#E3DED3] border-2 border-[#414141] hover:border-[#781D24] font-mono-tech text-xs tracking-wider uppercase transition-all shadow-xl disabled:opacity-50 group"
                  >
                    {isExportingPNG ? (
                      <>
                        <RefreshCw className="w-6 h-6 animate-spin text-[#781D24]" />
                        <span className="font-bold">RENDERIZANDO PNG...</span>
                        <span className="text-[10px] text-[#77736C]">ALTA RESOLUÇÃO CANVAS</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-6 h-6 text-[#781D24] group-hover:scale-110 transition-transform" />
                        <span className="font-bold">BAIXAR COMO IMAGEM (PNG)</span>
                        <span className="text-[10px] text-[#77736C]">1500×2121 PX HD</span>
                      </>
                    )}
                  </button>

                  {/* BOTÃO 3: COPIAR FICHA */}
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex flex-col items-center justify-center gap-2 p-5 bg-[#781D24] hover:bg-[#AA2830] text-white border-2 border-[#781D24] hover:border-white font-mono-tech text-xs tracking-wider uppercase transition-all shadow-xl group"
                  >
                    {copiedSuccess ? (
                      <>
                        <Check className="w-6 h-6" />
                        <span className="font-bold">COPIADO!</span>
                        <span className="text-[10px] text-white/80">PRONTO PARA COLAR</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        <span className="font-bold">COPIAR FICHA</span>
                        <span className="text-[10px] text-white/80">WHATSAPP / DISCORD</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#252525]">
                  <button
                    type="button"
                    onClick={() => {
                      tacticalAudio.playTacticalClick();
                      setActiveStep(4);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#1A1A1A] hover:bg-[#252525] text-[#C3BBA9] font-mono-tech text-xs uppercase"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>REVISAR ARQUIVO (04)</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Coluna Direita: Prévia Permanente no Desktop (FASE 5) */}
          <div className="hidden lg:block lg:col-span-4 sticky top-16">
            <LivePreviewDossier data={formData} />
          </div>
        </div>
      </div>

      {/* Modal Drawer de Prévia para Mobile (FASE 5 & 9) */}
      {showMobilePreview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-100">
          <div className="bg-[#0C0C0C] w-full max-w-md h-full flex flex-col border-l-2 border-[#781D24] shadow-2xl">
            <div className="p-3 bg-[#171717] border-b border-[#2B2B2B] flex items-center justify-between font-mono-tech text-xs">
              <span className="font-bold text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#781D24]" />
                PRÉVIA DO DOSSIÊ
              </span>
              <button
                type="button"
                onClick={() => {
                  tacticalAudio.playTacticalClick();
                  setShowMobilePreview(false);
                }}
                className="p-1 text-[#77736C] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              <LivePreviewDossier data={formData} />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação para Reiniciar Rascunho */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border-2 border-[#AA2830] max-w-md w-full p-6 space-y-4 shadow-2xl font-mono-tech text-xs">
            <div className="flex items-center gap-2 text-[#AA2830] font-bold text-sm border-b border-[#252525] pb-2">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>CONFIRMAÇÃO // INICIAR NOVO REGISTRO</span>
            </div>

            <p className="text-[#C3BBA9] leading-relaxed">
              Tem certeza de que deseja descartar os dados atuais do sobrevivente e o rascunho salvo no navegador? Esta ação não pode ser desfeita.
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#252525]">
              <button
                type="button"
                onClick={() => {
                  tacticalAudio.playTacticalClick();
                  setShowResetModal(false);
                }}
                className="px-4 py-2 border border-[#414141] bg-[#1A1A1A] hover:bg-[#252525] text-[#C3BBA9] uppercase font-bold"
              >
                CANCELAR
              </button>
              <button
                type="button"
                onClick={handleResetDraft}
                className="px-4 py-2 border border-[#AA2830] bg-[#781D24] hover:bg-[#AA2830] text-white uppercase font-bold"
              >
                DESCARTAR E REINICIAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Seção Oculta para Impressão Tradicional A4 (window.print()) */}
      <div className="hidden print:block print-area bg-white text-black p-8 font-mono">
        <h1 className="text-2xl font-bold uppercase mb-2">DEAD HOURS — FICHA DE SOBREVIVENTE</h1>
        <p className="text-sm mb-4">Registro Oficial de Triagem Física e Psicológica</p>
        <pre className="text-xs whitespace-pre-wrap">{formatFichaForClipboard(formData)}</pre>
      </div>
    </div>
  );
}
