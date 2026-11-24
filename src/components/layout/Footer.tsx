import React from 'react';
import Link from 'next/link';
import { Skull, AlertTriangle, ShieldCheck, Database, Radio } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0B0B0B] border-t border-[#252525] text-[#77736C] pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#151515] border border-[#781D24] flex items-center justify-center font-title font-bold text-sm text-[#E3DED3]">
                DH
              </div>
              <span className="font-title text-xl tracking-wider text-[#E3DED3]">
                DEAD HOURS
              </span>
            </div>
            <p className="text-xs text-[#77736C] leading-relaxed">
              Manual digital, arquivo de sobrevivência e gerador oficial de fichas do RPG persistente via WhatsApp.
            </p>
            <div className="font-mono-tech text-[10px] text-[#C3BBA9] border-l-2 border-[#781D24] pl-2 space-y-0.5">
              <div>VERSÃO DE CAMPO // EDIÇÃO 1.0</div>
              <div>SISTEMA PERSISTENTE HOMOLOGADO</div>
              <div className="text-[#AA2830] font-bold">RETRANSMISSÃO: FREQ. 142.8 MHz</div>
            </div>
          </div>

          {/* Core Navigation */}
          <div>
            <h4 className="font-title text-sm text-[#E3DED3] tracking-wider uppercase mb-3 border-b border-[#252525] pb-1">
              Terminal
            </h4>
            <ul className="space-y-2 text-xs font-mono-tech">
              <li>
                <Link href="/" className="hover:text-[#E3DED3] transition-colors">
                  &gt; Início / Terminal
                </Link>
              </li>
              <li>
                <Link href="/manual" className="hover:text-[#E3DED3] transition-colors">
                  &gt; Manual Oficial (18 Caps)
                </Link>
              </li>
              <li>
                <Link href="/cadastro" className="hover:text-[#E3DED3] transition-colors">
                  &gt; Ficha de Sobrevivente (PDF/PNG)
                </Link>
              </li>
              <li>
                <Link href="/arquivos" className="hover:text-[#E3DED3] text-[#AA2830] transition-colors">
                  &gt; Arquivos do Mundo
                </Link>
              </li>
              <li>
                <Link href="/busca" className="hover:text-[#E3DED3] transition-colors">
                  &gt; Busca no Manual
                </Link>
              </li>
            </ul>
          </div>

          {/* Arquivos do Mundo Sub-seções */}
          <div>
            <h4 className="font-title text-sm text-[#E3DED3] tracking-wider uppercase mb-3 border-b border-[#252525] pb-1">
              Arquivos do Mundo
            </h4>
            <ul className="space-y-2 text-xs font-mono-tech">
              <li>
                <Link href="/arquivos/mundo-antes" className="hover:text-[#E3DED3] transition-colors">
                  01 — O Mundo Antes
                </Link>
              </li>
              <li>
                <Link href="/arquivos/linha-do-tempo" className="hover:text-[#E3DED3] transition-colors">
                  02 — A Linha do Tempo
                </Link>
              </li>
              <li>
                <Link href="/arquivos/virus" className="hover:text-[#E3DED3] text-[#AA2830] transition-colors">
                  03 — O Vírus (Dossiê Confidencial)
                </Link>
              </li>
              <li>
                <Link href="/arquivos/registros" className="hover:text-[#E3DED3] transition-colors">
                  04 — Registros &amp; Documentos
                </Link>
              </li>
              <li>
                <Link href="/arquivos/locais" className="hover:text-[#E3DED3] transition-colors">
                  05 — Locais &amp; Zonas de Risco
                </Link>
              </li>
            </ul>
          </div>

          {/* Official Survival Notice */}
          <div className="border border-[#252525] bg-[#151515] p-4 text-xs space-y-2">
            <div className="flex items-center gap-2 text-[#781D24] font-mono-tech text-[11px] font-bold uppercase">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              AVISO DE PROTOCOLO
            </div>
            <p className="text-[11px] text-[#C3BBA9] leading-relaxed">
              O site é exclusivamente um portal de consulta de regras e geração de fichas. A condução da campanha, interação social e envio de ordens ocorrem no WhatsApp sob arbitragem da equipe de mestres.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#252525] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono-tech">
          <div>
            DEAD HOURS — TERMINAL DE APOIO DO SOBREVIVENTE // EDIÇÃO 1.0
          </div>
          <div className="text-[#C3BBA9]">
            HORÁRIO OFICIAL: BRASÍLIA (UTC−3) // REINÍCIO MATINAL DE PA: 06H00
          </div>
        </div>
      </div>
    </footer>
  );
}
