'use client';

import React, { useState, useEffect } from 'react';
import { Radio, Volume2, VolumeX, Activity, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { tacticalAudio } from '@/lib/audioSynthesis';

const DIEGETIC_BROADCASTS = [
  'FREQ 142.8 MHz // CANAL DE SOBREVIVÊNCIA PERSISTENTE // ESCUTE COM ATENÇÃO',
  'AVISO GERAL // EVITE A RODOVIA BR-101 // VEÍCULOS ABANDONADOS BLOQUEIAM AMBAS AS PISTAS',
  'POSTO DE CONTROLE // POSTO DA MATA ABANDONADO // SEM SINAL DE RESGATE MILITAR',
  'PROTOCOLO VITAL // QUALQUER DISPARO DE ARMA DE FOGO ATRAI CAMINHANTES NUM RAIO DE 1 KM',
  'ÁGUA CONTAMINADA NOS ARREDORES DO RIO // FERVA QUALQUER SUPRIMENTO ANTES DO CONSUMO',
  'RETRANSMISSÃO AUTOMÁTICA // MANTENHAM O SILÊNCIO // O RUÍDO É A MAIOR AMEAÇA'
];

export default function RadioWidget() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [volume, setVolume] = useState<'low' | 'med'>('low');
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % DIEGETIC_BROADCASTS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const handleTogglePlay = () => {
    const active = tacticalAudio.toggleRadio();
    setIsPlaying(active);
    if (active) {
      tacticalAudio.playRogerBeep();
    }
  };

  const handleVolumeChange = (level: 'low' | 'med') => {
    setVolume(level);
    tacticalAudio.setVolume(level === 'low' ? 0.03 : 0.07);
    tacticalAudio.playTacticalClick();
  };

  return (
    <div className="relative">
      {/* Botão no Header/Faixa Tática */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleTogglePlay}
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono-tech uppercase tracking-wider transition-all border ${
            isPlaying
              ? 'bg-[#151515] text-[#E3DED3] border-[#E3DED3] shadow-[0_0_8px_rgba(227,222,211,0.2)] font-bold'
              : 'bg-black/40 hover:bg-[#151515] text-[#C3BBA9] border-white/20'
          }`}
          title={isPlaying ? 'Silenciar Rádio (Mute)' : 'Sintonizar Estática do Rádio (142.8 MHz)'}
          aria-label={isPlaying ? 'Silenciar Rádio' : 'Sintonizar Rádio'}
        >
          {isPlaying ? (
            <>
              <Volume2 className="w-3 h-3 text-[#E3DED3] animate-pulse" />
              <span className="text-[#E3DED3]">RÁDIO [ON]</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3 h-3 opacity-60" />
              <span>RÁDIO [MUDO]</span>
            </>
          )}
        </button>

        <button
          onClick={() => {
            setIsOpen(!isOpen);
            tacticalAudio.playTacticalClick();
          }}
          className="text-[#C3BBA9] hover:text-[#E3DED3] p-0.5 rounded transition-colors"
          title="Abrir Painel de Frequência"
          aria-label="Abrir Painel de Frequência"
        >
          {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Painel Tático Suspenso */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[#131313] border-2 border-[#781D24] shadow-2xl z-50 p-4 text-xs font-mono-tech space-y-3">
          {/* Header do Widget */}
          <div className="flex items-center justify-between border-b border-[#2B2B2B] pb-2">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#AA2830]" />
              <span className="font-bold text-[#E3DED3] tracking-wider uppercase">
                RECEPTOR VHF // 142.8 MHz
              </span>
            </div>
            <span className={`text-[10px] px-1.5 py-0.5 border ${isPlaying ? 'border-[#4E8752] text-[#4E8752] bg-[#4E8752]/10' : 'border-[#414141] text-[#77736C]'}`}>
              {isPlaying ? 'PORTADORA ATIVA' : 'SINAL SILENCIADO'}
            </span>
          </div>

          {/* Gráfico Analógico de Sinal */}
          <div className="bg-[#090909] border border-[#2B2B2B] p-2.5 flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-[10px] text-[#77736C]">SINAL ANALÓGICO:</div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((bar) => (
                  <div
                    key={bar}
                    className={`w-1.5 transition-all duration-300 ${
                      isPlaying
                        ? bar <= 4
                          ? 'bg-[#E3DED3] h-4 animate-pulse'
                          : 'bg-[#781D24] h-5'
                        : 'bg-[#2B2B2B] h-3'
                    }`}
                  />
                ))}
                <span className="text-[10px] text-[#C3BBA9] ml-2">
                  {isPlaying ? 'ESTÁVEL (-84 dBm)' : 'SEM PORTADORA'}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className="text-[9px] text-[#77736C]">VOLUME</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleVolumeChange('low')}
                  disabled={!isPlaying}
                  className={`px-1.5 py-0.5 text-[9px] border transition-colors ${
                    volume === 'low' && isPlaying
                      ? 'bg-[#781D24] border-[#781D24] text-white'
                      : 'border-[#414141] text-[#77736C] hover:text-[#E3DED3]'
                  }`}
                >
                  SUAVE
                </button>
                <button
                  onClick={() => handleVolumeChange('med')}
                  disabled={!isPlaying}
                  className={`px-1.5 py-0.5 text-[9px] border transition-colors ${
                    volume === 'med' && isPlaying
                      ? 'bg-[#781D24] border-[#781D24] text-white'
                      : 'border-[#414141] text-[#77736C] hover:text-[#E3DED3]'
                  }`}
                >
                  MÉDIO
                </button>
              </div>
            </div>
          </div>

          {/* Letreiro de Transmissão Diegética */}
          <div className="border border-[#2B2B2B] bg-[#090909]/80 p-2 text-[10px] text-[#C3BBA9] space-y-1">
            <div className="text-[9px] text-[#AA2830] font-bold flex items-center gap-1">
              <Activity className="w-3 h-3 animate-spin" />
              DESPACHO DO CANAL:
            </div>
            <p className="font-mono-tech leading-relaxed text-[#E3DED3] min-h-[32px] transition-all duration-500">
              {DIEGETIC_BROADCASTS[messageIndex]}
            </p>
          </div>

          {/* Controles de Ação do Painel */}
          <div className="pt-1 flex items-center justify-between text-[10px]">
            <span className="text-[#77736C]">
              ÁUDIO GERADO 100% LOCAL (WEB AUDIO)
            </span>
            <button
              onClick={handleTogglePlay}
              className={`px-3 py-1 font-bold tracking-wider uppercase transition-colors border ${
                isPlaying
                  ? 'bg-[#781D24] hover:bg-[#AA2830] text-white border-[#AA2830]'
                  : 'bg-[#2B2B2B] hover:bg-[#414141] text-[#E3DED3] border-[#414141]'
              }`}
            >
              {isPlaying ? 'DESLIGAR RÁDIO' : 'LIGAR RÁDIO'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
