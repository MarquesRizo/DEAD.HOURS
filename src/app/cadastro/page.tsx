'use client';

import React, { useState, useId } from 'react';
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
  RefreshCw
} from 'lucide-react';
import { 
  FichaData, 
  downloadFichaPNG, 
  downloadFichaPDF, 
  formatFichaForClipboard 
} from '@/lib/exportFicha';
import { tacticalAudio } from '@/lib/audioSynthesis';

export default function CadastroPage() {
  const [formData, setFormData] = useState<FichaData>({
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
  });

  React.useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      data: new Date().toLocaleDateString('pt-BR'),
    }));
  }, []);

  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [isExportingPNG, setIsExportingPNG] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingExportType, setPendingExportType] = useState<'PDF' | 'PNG' | null>(null);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);

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

  const getValidationWarnings = () => {
    const warnings: string[] = [];
    if (!formData.nomePersonagem.trim()) {
      warnings.push('Nome do Personagem não preenchido');
    }
    if (!formData.nomeJogador.trim()) {
      warnings.push('Nome do Jogador não informado');
    }
    if (totalPontos === 0) {
      warnings.push('Nenhum ponto de Atributo distribuído (0/12)');
    }
    if (!formData.declaracaoLida) {
      warnings.push('Termo de Declaração Formal não assinalado');
    }
    return warnings;
  };

  const handleRequestDownload = (type: 'PDF' | 'PNG') => {
    tacticalAudio.playTacticalClick();
    const warnings = getValidationWarnings();
    if (warnings.length > 0) {
      setValidationWarnings(warnings);
      setPendingExportType(type);
    } else {
      if (type === 'PDF') {
        executeDownloadPDF();
      } else {
        executeDownloadPNG();
      }
    }
  };

  const executeDownloadPDF = async () => {
    try {
      setIsExportingPDF(true);
      setErrorMessage(null);
      await downloadFichaPDF(formData);
    } catch (err) {
      console.error(err);
      setErrorMessage('Erro ao gerar PDF editável. Tente novamente.');
    } finally {
      setIsExportingPDF(false);
      setPendingExportType(null);
    }
  };

  const executeDownloadPNG = async () => {
    try {
      setIsExportingPNG(true);
      setErrorMessage(null);
      await downloadFichaPNG(formData);
    } catch (err) {
      console.error(err);
      setErrorMessage('Erro ao gerar imagem PNG. Verifique se o navegador suporta canvas.');
    } finally {
      setIsExportingPNG(false);
      setPendingExportType(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Toast Notification de Cópia ou Erro */}
      {copiedSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#151515] border-2 border-[#781D24] text-[#E3DED3] p-4 shadow-2xl flex items-center gap-3 font-mono-tech text-xs tracking-wider animate-bounce">
          <div className="w-6 h-6 rounded-full bg-[#781D24] flex items-center justify-center text-white font-bold">
            ✓
          </div>
          <div>
            <div className="text-[#E3DED3] font-bold">FICHA COPIADA COM SUCESSO!</div>
            <div className="text-[#C3BBA9] text-[11px]">
              Pronto para colar no WhatsApp, Discord ou editor de texto.
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
            FICHA PREENCHÍVEL // PROCESSAMENTO 100% LOCAL
          </div>
          <p className="text-[#C3BBA9] leading-relaxed">
            Preencha seus dados diretamente nos campos abaixo. Você pode baixar sua ficha personalizada em <strong>PDF editável</strong> ou <strong>imagem PNG</strong> (ambos com a nova identidade visual oficial de DEAD HOURS), ou clicar em <strong>COPIAR FICHA</strong> para enviar o texto formatado no WhatsApp ou Discord da campanha. Nenhum dado é enviado a servidores externos.
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
              <label htmlFor="nomeJogador" className="text-[#77736C] block">Nome do jogador:</label>
              <input
                id="nomeJogador"
                type="text"
                name="nomeJogador"
                value={formData.nomeJogador}
                onChange={handleChange}
                placeholder="Ex: Carlos Oliveira"
                className="w-full border-b border-[#414141] focus:border-[#781D24] h-7 bg-[#0B0B0B]/40 px-2 text-[#E3DED3] placeholder-[#414141] outline-none transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="nomePersonagem" className="text-[#77736C] block">Nome do personagem:</label>
              <input
                id="nomePersonagem"
                type="text"
                name="nomePersonagem"
                value={formData.nomePersonagem}
                onChange={handleChange}
                placeholder="Ex: 'Corvo' / Marcos Silveira"
                className="w-full border-b border-[#414141] focus:border-[#781D24] h-7 bg-[#0B0B0B]/40 px-2 text-[#E3DED3] placeholder-[#414141] outline-none transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="idade" className="text-[#77736C] block">Idade:</label>
              <input
                id="idade"
                type="text"
                name="idade"
                value={formData.idade}
                onChange={handleChange}
                placeholder="Ex: 34"
                className="w-full border-b border-[#414141] focus:border-[#781D24] h-7 bg-[#0B0B0B]/40 px-2 text-[#E3DED3] placeholder-[#414141] outline-none transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="ocupacao" className="text-[#77736C] block">Ocupação anterior ao apocalipse:</label>
              <input
                id="ocupacao"
                type="text"
                name="ocupacao"
                value={formData.ocupacao}
                onChange={handleChange}
                placeholder="Ex: Mecânico automotivo / Enfermeiro"
                className="w-full border-b border-[#414141] focus:border-[#781D24] h-7 bg-[#0B0B0B]/40 px-2 text-[#E3DED3] placeholder-[#414141] outline-none transition-colors"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label htmlFor="aparencia" className="text-[#77736C] block">Aparência física:</label>
              <textarea
                id="aparencia"
                name="aparencia"
                rows={2}
                value={formData.aparencia}
                onChange={handleChange}
                placeholder="Cicatrizes, constituição física, vestimentas, marcas distintas..."
                className="w-full border-b border-[#414141] focus:border-[#781D24] bg-[#0B0B0B]/40 p-2 text-[#E3DED3] placeholder-[#414141] outline-none resize-y transition-colors font-body text-xs"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label htmlFor="personalidade" className="text-[#77736C] block">Personalidade:</label>
              <textarea
                id="personalidade"
                name="personalidade"
                rows={2}
                value={formData.personalidade}
                onChange={handleChange}
                placeholder="Temperamento sob pressão, postura com estranhos, manias..."
                className="w-full border-b border-[#414141] focus:border-[#781D24] bg-[#0B0B0B]/40 p-2 text-[#E3DED3] placeholder-[#414141] outline-none resize-y transition-colors font-body text-xs"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: ATRIBUTOS */}
        <div className="space-y-4">
          <div className="border-b border-[#252525] pb-2 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono-tech text-xs font-bold text-[#781D24] uppercase tracking-wider">
                2. ATRIBUTOS (12 PONTOS DISTRIBUÍDOS // MÁXIMO 3 INICIAL)
              </span>
              <div className="flex items-center gap-2">
                {totalPontos === 12 ? (
                  <span className="font-mono-tech text-[10px] px-2 py-0.5 border border-[#4E8752] text-[#4E8752] bg-[#4E8752]/10 font-bold">
                    ✓ 12/12 PONTOS ALOCADOS (LIMITE EXATO)
                  </span>
                ) : totalPontos < 12 ? (
                  <span className="font-mono-tech text-[10px] px-2 py-0.5 border border-[#414141] text-[#C3BBA9] bg-[#151515]">
                    PONTOS: {totalPontos} / 12 ({12 - totalPontos} RESTANTE{12 - totalPontos > 1 ? 'S' : ''})
                  </span>
                ) : (
                  <span className="font-mono-tech text-[10px] px-2 py-0.5 border border-[#AA2830] text-white bg-[#781D24] font-bold animate-pulse">
                    EXCESSO: {totalPontos} / 12 (+{totalPontos - 12} ACIMA DO LIMITE)
                  </span>
                )}
              </div>
            </div>

            {/* Visualizador de pontos segmentados */}
            <div className="flex items-center gap-1 pt-1">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 transition-all ${
                    i < totalPontos
                      ? totalPontos > 12
                        ? 'bg-[#AA2830]'
                        : 'bg-[#781D24]'
                      : 'bg-[#252525]'
                  }`}
                  title={`Ponto ${i + 1} de 12`}
                />
              ))}
            </div>

            {hasAttrOverLimit && (
              <div className="text-[11px] font-mono-tech text-[#AA2830] bg-[#1a1112] border-l-2 border-[#AA2830] p-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>AVISO: Um ou mais atributos excedem o limite inicial recomendado de 3 pontos para sobreviventes novatos.</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { key: 'forca', label: 'FORÇA', desc: 'Massa muscular e combate corporal' },
              { key: 'agilidade', label: 'AGILIDADE', desc: 'Velocidade, mira e esquiva' },
              { key: 'vigor', label: 'VIGOR', desc: 'Saúde, imunidade e fôlego' },
              { key: 'intelecto', label: 'INTELECTO', desc: 'Medicina, lógica e reparos' },
              { key: 'percepcao', label: 'PERCEPÇÃO', desc: 'Atenção, ruído e rastreio' },
              { key: 'presenca', label: 'PRESENÇA', desc: 'Moral, liderança e autocontrole' }
            ].map((attr) => (
              <div
                key={attr.key}
                className="border border-[#414141] bg-[#0B0B0B]/60 p-3 text-center space-y-2 relative group focus-within:border-[#781D24]"
              >
                <div className="font-mono-tech text-xs font-bold text-[#E3DED3]">
                  {attr.label}
                </div>
                <div className="h-10 border border-[#414141] bg-[#151515] flex items-center justify-center">
                  <input
                    type="number"
                    min={0}
                    max={5}
                    name={attr.key}
                    value={formData[attr.key as keyof FichaData] as string}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full h-full text-center bg-transparent font-title text-2xl text-[#781D24] focus:text-[#E3DED3] outline-none font-bold"
                  />
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
              <span className="text-[#77736C]">VIDA:</span> 10 + ({numVig} × 2) = <strong className="text-[#E3DED3] font-bold">{vidaCalc} PV</strong>
            </div>
            <div>
              <span className="text-[#77736C]">FÔLEGO:</span> 5 + {numVig} = <strong className="text-[#E3DED3] font-bold">{folegoCalc} PF</strong>
            </div>
            <div>
              <span className="text-[#77736C]">DEFESA:</span> 10 + {numAgi} = <strong className="text-[#E3DED3] font-bold">{defesaCalc} DEF</strong>
            </div>
            <div>
              <span className="text-[#77736C]">CARGA:</span> 5 + {numFor} = <strong className="text-[#E3DED3] font-bold">{cargaCalc} slots</strong>
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
              <label htmlFor="esp1" className="text-[#77736C] block">Especialização 1:</label>
              <input
                id="esp1"
                type="text"
                name="esp1"
                value={formData.esp1}
                onChange={handleChange}
                placeholder="Ex: Furtividade Noturna (+2 em Agilidade)"
                className="w-full border-b border-[#414141] focus:border-[#781D24] h-7 bg-[#0B0B0B]/40 px-2 text-[#E3DED3] placeholder-[#414141] outline-none transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="esp2" className="text-[#77736C] block">Especialização 2:</label>
              <input
                id="esp2"
                type="text"
                name="esp2"
                value={formData.esp2}
                onChange={handleChange}
                placeholder="Ex: Primeiros Socorros (+2 em Intelecto)"
                className="w-full border-b border-[#414141] focus:border-[#781D24] h-7 bg-[#0B0B0B]/40 px-2 text-[#E3DED3] placeholder-[#414141] outline-none transition-colors"
              />
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
              <label htmlFor="objetivo" className="text-[#77736C] block">Objetivo pessoal:</label>
              <input
                id="objetivo"
                type="text"
                name="objetivo"
                value={formData.objetivo}
                onChange={handleChange}
                placeholder="A meta imediata que mantém o personagem vivo..."
                className="w-full border-b border-[#414141] focus:border-[#781D24] h-7 bg-[#0B0B0B]/40 px-2 text-[#E3DED3] placeholder-[#414141] outline-none transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="medo" className="text-[#77736C] block">Maior medo:</label>
              <input
                id="medo"
                type="text"
                name="medo"
                value={formData.medo}
                onChange={handleChange}
                placeholder="Trauma que desestabiliza em momentos de crise..."
                className="w-full border-b border-[#414141] focus:border-[#781D24] h-7 bg-[#0B0B0B]/40 px-2 text-[#E3DED3] placeholder-[#414141] outline-none transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="ligacao" className="text-[#77736C] block">Ligação com outro sobrevivente ou NPC:</label>
              <input
                id="ligacao"
                type="text"
                name="ligacao"
                value={formData.ligacao}
                onChange={handleChange}
                placeholder="Nome do aliado ou NPC conhecido e natureza do vínculo..."
                className="w-full border-b border-[#414141] focus:border-[#781D24] h-7 bg-[#0B0B0B]/40 px-2 text-[#E3DED3] placeholder-[#414141] outline-none transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="segredo" className="text-[#77736C] block">Um segredo ou conflito:</label>
              <input
                id="segredo"
                type="text"
                name="segredo"
                value={formData.segredo}
                onChange={handleChange}
                placeholder="Fato oculto que causaria tensão no grupo se revelado..."
                className="w-full border-b border-[#414141] focus:border-[#781D24] h-7 bg-[#0B0B0B]/40 px-2 text-[#E3DED3] placeholder-[#414141] outline-none transition-colors"
              />
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
              <label htmlFor="arma" className="text-[#77736C] block">Arma:</label>
              <input
                id="arma"
                type="text"
                name="arma"
                value={formData.arma}
                onChange={handleChange}
                placeholder="Ex: Faca de Caça (1d4+FOR)"
                className="w-full border-b border-[#414141] focus:border-[#781D24] h-7 bg-[#0B0B0B]/40 px-2 text-[#E3DED3] placeholder-[#414141] outline-none transition-colors"
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
                placeholder="Ex: Lanterna Tática c/ pilhas"
                className="w-full border-b border-[#414141] focus:border-[#781D24] h-7 bg-[#0B0B0B]/40 px-2 text-[#E3DED3] placeholder-[#414141] outline-none transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="outrosItens" className="text-[#77736C] block">Outros itens:</label>
              <input
                id="outrosItens"
                type="text"
                name="outrosItens"
                value={formData.outrosItens}
                onChange={handleChange}
                placeholder="Ex: Cantil 1L, Ração (x1)"
                className="w-full border-b border-[#414141] focus:border-[#781D24] h-7 bg-[#0B0B0B]/40 px-2 text-[#E3DED3] placeholder-[#414141] outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* SECTION 6: DECLARAÇÃO */}
        <div className="pt-6 border-t-2 border-[#414141] space-y-4">
          <label className="border border-[#781D24] p-4 bg-[#0B0B0B] text-xs font-mono-tech leading-relaxed text-[#C3BBA9] flex items-start gap-3 cursor-pointer hover:bg-[#151515] transition-colors">
            <input
              type="checkbox"
              name="declaracaoLida"
              checked={formData.declaracaoLida}
              onChange={handleChange}
              className="mt-0.5 accent-[#781D24] w-4 h-4 rounded cursor-pointer shrink-0"
            />
            <div>
              <span className="text-[#781D24] font-bold block mb-1">TERMO DE DECLARAÇÃO FORMAL:</span>
              &ldquo;Confirmo que li as regras de sobrevivência, combate, ausência e morte permanente de DEAD HOURS. Estou ciente de que cada decisão acarreta riscos irrevogáveis e que a arbitragem dos mestres no WhatsApp é soberana.&rdquo;
            </div>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 text-xs font-mono-tech">
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
      </div>

      {/* ÁREA DE AÇÕES (ABAIXO DA FICHA, SEM ALTERAR SUA ESTRUTURA) */}
      <div className="no-print bg-[#151515] border border-[#252525] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#252525] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#781D24]" />
            <span className="font-title text-base tracking-wider text-[#E3DED3]">
              EXPORTAÇÃO &amp; TRANSMISSÃO DE DADOS
            </span>
          </div>
          <span className="font-mono-tech text-[10px] text-[#77736C]">
            USO LOCAL // SEGURANÇA TOTAL
          </span>
        </div>

        <p className="text-xs text-[#C3BBA9] font-body leading-relaxed">
          Após preencher os dados, utilize uma das opções de exportação abaixo para gerar sua ficha em imagem de alta resolução (PNG com a nova identidade visual oficial de DEAD HOURS), em documento PDF vetorial com campos 100% editáveis, ou copiar o formato textual padrão para colar diretamente nos grupos de WhatsApp ou Discord.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* BOTÃO 1: BAIXAR PDF EDITÁVEL */}
          <button
            onClick={() => handleRequestDownload('PDF')}
            disabled={isExportingPDF}
            className="flex items-center justify-center gap-2 px-4 py-3.5 bg-[#0B0B0B] hover:bg-[#252525] text-[#E3DED3] border border-[#414141] hover:border-[#781D24] font-mono-tech text-xs tracking-wider uppercase transition-all shadow-md disabled:opacity-50"
          >
            {isExportingPDF ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#781D24]" />
                GERANDO PDF...
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4 text-[#781D24]" />
                BAIXAR PDF EDITÁVEL
              </>
            )}
          </button>

          {/* BOTÃO 2: BAIXAR COMO IMAGEM (PNG) */}
          <button
            onClick={() => handleRequestDownload('PNG')}
            disabled={isExportingPNG}
            className="flex items-center justify-center gap-2 px-4 py-3.5 bg-[#0B0B0B] hover:bg-[#252525] text-[#E3DED3] border border-[#414141] hover:border-[#781D24] font-mono-tech text-xs tracking-wider uppercase transition-all shadow-md disabled:opacity-50"
          >
            {isExportingPNG ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#781D24]" />
                GERANDO PNG...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-[#781D24]" />
                BAIXAR COMO IMAGEM (PNG)
              </>
            )}
          </button>

          {/* BOTÃO 3: COPIAR FICHA */}
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 px-4 py-3.5 bg-[#781D24] hover:bg-[#4B1117] text-[#FFFFFF] border border-[#781D24] font-mono-tech text-xs tracking-wider uppercase transition-all shadow-md"
          >
            {copiedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                COPIADO!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                COPIAR FICHA
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modal de Validação Pré-Exportação Não-Bloqueante */}
      {pendingExportType && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131313] border-2 border-[#781D24] max-w-md w-full p-6 space-y-4 shadow-2xl font-mono-tech text-xs">
            <div className="flex items-center gap-2 text-[#AA2830] font-bold text-sm border-b border-[#2B2B2B] pb-2">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>PROTOCOLO // DADOS ESSENCIAIS PENDENTES</span>
            </div>

            <p className="text-[#C3BBA9] leading-relaxed">
              Sua ficha possui campos fundamentais que ainda não foram preenchidos:
            </p>

            <ul className="space-y-1.5 pl-2 border-l-2 border-[#781D24] text-[#E3DED3]">
              {validationWarnings.map((w, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#AA2830] rounded-full shrink-0" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>

            <p className="text-[11px] text-[#77736C] leading-relaxed">
              Deseja revisar os dados antes de gerar o arquivo ou prefere exportar o rascunho com os campos pendentes mesmo assim?
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-3 border-t border-[#2B2B2B]">
              <button
                onClick={() => {
                  tacticalAudio.playTacticalClick();
                  setPendingExportType(null);
                }}
                className="w-full sm:w-auto px-4 py-2 border border-[#414141] bg-[#1E1E1E] hover:bg-[#2B2B2B] text-[#E3DED3] transition-colors uppercase font-bold"
              >
                REVISAR FICHA
              </button>
              <button
                onClick={() => {
                  tacticalAudio.playTacticalClick();
                  if (pendingExportType === 'PDF') {
                    executeDownloadPDF();
                  } else {
                    executeDownloadPNG();
                  }
                }}
                className="w-full sm:w-auto px-4 py-2 border border-[#781D24] bg-[#781D24] hover:bg-[#AA2830] text-white transition-colors uppercase font-bold"
              >
                EXPORTAR MESMO ASSIM
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
