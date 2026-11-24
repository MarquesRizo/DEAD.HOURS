'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Upload, Trash2, ZoomIn, ZoomOut, RefreshCw, Crosshair, Check, AlertCircle } from 'lucide-react';
import { tacticalAudio } from '@/lib/audioSynthesis';

interface PhotoUploaderProps {
  currentPhoto?: string;
  zoom?: number;
  offsetX?: number;
  offsetY?: number;
  onPhotoChange: (photoDataUrl: string | undefined, zoom: number, offX: number, offY: number) => void;
}

// Proporção oficial de enquadramento da ficha (168 x 92 = ~1.826)
const TARGET_WIDTH = 336;
const TARGET_HEIGHT = 184;

export default function PhotoUploader({
  currentPhoto,
  zoom = 1,
  offsetX = 0,
  offsetY = 0,
  onPhotoChange,
}: PhotoUploaderProps) {
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(zoom || 1);
  const [currentOffsetX, setCurrentOffsetX] = useState<number>(offsetX || 0);
  const [currentOffsetY, setCurrentOffsetY] = useState<number>(offsetY || 0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Inicializa imagem crua a partir da foto salva se houver
  useEffect(() => {
    if (currentPhoto && !rawImageSrc) {
      setRawImageSrc(currentPhoto);
    }
  }, [currentPhoto, rawImageSrc]);

  // Função para renderizar e comprimir a foto enquadrada no canvas
  const processAndCommitPhoto = useCallback((
    img: HTMLImageElement,
    z: number,
    ox: number,
    oy: number
  ) => {
    const canvas = document.createElement('canvas');
    canvas.width = TARGET_WIDTH;
    canvas.height = TARGET_HEIGHT;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fundo neutro
    ctx.fillStyle = '#0F0F0F';
    ctx.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const targetRatio = TARGET_WIDTH / TARGET_HEIGHT;

    let drawW: number;
    let drawH: number;

    if (imgRatio > targetRatio) {
      drawH = TARGET_HEIGHT * z;
      drawW = drawH * imgRatio;
    } else {
      drawW = TARGET_WIDTH * z;
      drawH = drawW / imgRatio;
    }

    const centerX = TARGET_WIDTH / 2;
    const centerY = TARGET_HEIGHT / 2;
    const drawX = centerX - drawW / 2 + (ox / 100) * (TARGET_WIDTH / 2);
    const drawY = centerY - drawH / 2 + (oy / 100) * (TARGET_HEIGHT / 2);

    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    // Converte para JPEG com compressão tática (qualidade 0.88, super leve e nítido)
    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
    onPhotoChange(compressedDataUrl, z, ox, oy);
  }, [onPhotoChange]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    tacticalAudio.playTacticalClick();
    setErrorMsg(null);

    // Validação de tipo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMsg('Formato inválido. Aceito apenas JPG, PNG ou WebP.');
      return;
    }

    // Validação de tamanho inicial (máx 8MB)
    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg('Arquivo muito grande. O limite máximo é 8MB.');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const src = loadEvent.target?.result as string;
      const img = new Image();
      img.onload = () => {
        imgRef.current = img;
        setRawImageSrc(src);
        setCurrentZoom(1);
        setCurrentOffsetX(0);
        setCurrentOffsetY(0);
        processAndCommitPhoto(img, 1, 0, 0);
        setIsProcessing(false);
      };
      img.onerror = () => {
        setErrorMsg('Erro ao carregar o arquivo de imagem selecionado.');
        setIsProcessing(false);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleZoomChange = (newZoom: number) => {
    const clampedZoom = Math.min(3, Math.max(1, newZoom));
    setCurrentZoom(clampedZoom);
    if (imgRef.current) {
      processAndCommitPhoto(imgRef.current, clampedZoom, currentOffsetX, currentOffsetY);
    }
  };

  const handleOffsetXChange = (newOx: number) => {
    const clamped = Math.min(60, Math.max(-60, newOx));
    setCurrentOffsetX(clamped);
    if (imgRef.current) {
      processAndCommitPhoto(imgRef.current, currentZoom, clamped, currentOffsetY);
    }
  };

  const handleOffsetYChange = (newOy: number) => {
    const clamped = Math.min(60, Math.max(-60, newOy));
    setCurrentOffsetY(clamped);
    if (imgRef.current) {
      processAndCommitPhoto(imgRef.current, currentZoom, currentOffsetX, clamped);
    }
  };

  const handleRemovePhoto = () => {
    tacticalAudio.playTacticalClick();
    setRawImageSrc(null);
    imgRef.current = null;
    setCurrentZoom(1);
    setCurrentOffsetX(0);
    setCurrentOffsetY(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onPhotoChange(undefined, 1, 0, 0);
  };

  return (
    <div className="border border-[#333333] bg-[#0E0E0E] p-4 space-y-4 font-mono-tech text-xs">
      <div className="flex items-center justify-between border-b border-[#222222] pb-2">
        <div className="flex items-center gap-2 text-[#E3DED3] font-bold">
          <Camera className="w-4 h-4 text-[#781D24]" />
          <span>REGISTRO BIOMÉTRICO // IDENTIFICAÇÃO FOTOGRÁFICA</span>
        </div>
        <span className="text-[10px] text-[#77736C]">SETOR Z-01 // ENQUADRAMENTO FACIAL</span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        id="survivor-photo-input"
      />

      {errorMsg && (
        <div className="p-2 border border-[#AA2830] bg-[#4B1117]/30 text-[#E3DED3] text-[11px] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#AA2830] shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        {/* Moldura Documental da Foto */}
        <div className="sm:col-span-6 flex flex-col items-center">
          <div className="relative w-[210px] h-[115px] sm:w-[252px] sm:h-[138px] bg-[#0A0A0A] border-2 border-[#414141] shadow-2xl flex items-center justify-center overflow-hidden group">
            {/* Miras e cantos técnicos */}
            <div className="absolute top-1 left-1 text-[9px] text-[#781D24] font-bold z-10">[+]</div>
            <div className="absolute top-1 right-1 text-[9px] text-[#781D24] font-bold z-10">[+]</div>
            <div className="absolute bottom-1 left-1 text-[9px] text-[#781D24] font-bold z-10">[+]</div>
            <div className="absolute bottom-1 right-1 text-[9px] text-[#781D24] font-bold z-10">[+]</div>

            {currentPhoto ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentPhoto}
                  alt="Fotografia do Sobrevivente"
                  className="w-full h-full object-cover select-none"
                />
                <div className="absolute bottom-0 inset-x-0 bg-[#000000]/80 py-0.5 text-center text-[9px] text-[#AA2830] font-bold border-t border-[#781D24]/50">
                  REGISTRO BIOMÉTRICO ATIVO
                </div>
              </>
            ) : (
              <div className="text-center p-3 space-y-1.5 text-[#555555]">
                <Crosshair className="w-8 h-8 mx-auto text-[#333333] stroke-1" />
                <div className="text-[10px] uppercase font-bold tracking-wider">
                  [ SEM REGISTRO FACIAL ]
                </div>
                <div className="text-[9px] text-[#444444]">
                  RECOMENDADO: ROSTO CENTRALIZADO
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center gap-2 text-white text-[11px]">
                <RefreshCw className="w-4 h-4 animate-spin text-[#781D24]" />
                <span>PROCESSANDO...</span>
              </div>
            )}
          </div>
          <div className="text-[10px] text-[#77736C] mt-1.5 text-center">
            PADRÃO A4: ENQUADRAMENTO HORIZONTAL 16:9 // 168x92 PT
          </div>
        </div>

        {/* Controles de Foto e Ajuste */}
        <div className="sm:col-span-6 space-y-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                tacticalAudio.playTacticalClick();
                fileInputRef.current?.click();
              }}
              className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 py-2 px-3 bg-[#1A1A1A] hover:bg-[#252525] border border-[#414141] hover:border-[#781D24] text-[#E3DED3] font-bold tracking-wider uppercase transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-[#781D24]" />
              <span>{currentPhoto ? 'SUBSTITUIR FOTO' : 'ENVIAR FOTO'}</span>
            </button>

            {currentPhoto && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="flex items-center justify-center gap-1 py-2 px-3 bg-[#1A0E10] hover:bg-[#301215] border border-[#781D24]/60 text-[#AA2830] hover:text-white font-bold tracking-wider uppercase transition-colors"
                title="Remover fotografia"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>REMOVER</span>
              </button>
            )}
          </div>

          {currentPhoto && (
            <div className="bg-[#141414] border border-[#252525] p-2.5 space-y-2">
              <div className="text-[10px] text-[#C3BBA9] font-bold uppercase flex items-center justify-between">
                <span>AJUSTE DE ENQUADRAMENTO:</span>
                <span className="text-[#781D24]">ZOOM {currentZoom.toFixed(1)}X</span>
              </div>

              {/* Slider de Zoom */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-[#77736C]">
                  <span className="flex items-center gap-1">
                    <ZoomOut className="w-3 h-3" /> Zoom
                  </span>
                  <span className="flex items-center gap-1">
                    <ZoomIn className="w-3 h-3" />
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={currentZoom}
                  onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                  className="w-full accent-[#781D24] cursor-pointer h-1.5 bg-[#252525] rounded"
                />
              </div>

              {/* Slider Horizontal (Eixo X) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-[#77736C]">
                  <span>Posição Horizontal (Eixo X)</span>
                  <span className="text-[#E3DED3]">{currentOffsetX > 0 ? `+${currentOffsetX}%` : `${currentOffsetX}%`}</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  step="2"
                  value={currentOffsetX}
                  onChange={(e) => handleOffsetXChange(parseInt(e.target.value))}
                  className="w-full accent-[#781D24] cursor-pointer h-1.5 bg-[#252525] rounded"
                />
              </div>

              {/* Slider Vertical (Eixo Y) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-[#77736C]">
                  <span>Posição Vertical (Eixo Y)</span>
                  <span className="text-[#E3DED3]">{currentOffsetY > 0 ? `+${currentOffsetY}%` : `${currentOffsetY}%`}</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  step="2"
                  value={currentOffsetY}
                  onChange={(e) => handleOffsetYChange(parseInt(e.target.value))}
                  className="w-full accent-[#781D24] cursor-pointer h-1.5 bg-[#252525] rounded"
                />
              </div>
            </div>
          )}

          <div className="text-[10px] text-[#77736C] leading-relaxed">
            Formatos aceitos: JPG, JPEG, PNG, WebP. A foto é redimensionada e incorporada internamente ao PDF e à imagem PNG de alta resolução.
          </div>
        </div>
      </div>
    </div>
  );
}
