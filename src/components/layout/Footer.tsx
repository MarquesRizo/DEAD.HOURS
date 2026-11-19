import React from 'react';
import Link from 'next/link';
import { Skull, AlertTriangle, ShieldCheck } from 'lucide-react';

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
              Manual digital e arquivo oficial dos sobreviventes do RPG persistente de sobrevivência zumbi via WhatsApp.
            </p>
            <div className="font-mono-tech text-[10px] text-[#C3BBA9] border-l-2 border-[#781D24] pl-2">
              VERSÃO DE CAMPO // EDIÇÃO 1.0<br />
              SISTEMA PERSISTENTE HOMOLOGADO
            </div>
          </div>

          {/* Core Navigation */}
          <div>
            <h4 className="font-title text-sm text-[#E3DED3] tracking-wider uppercase mb-3 border-b border-[#252525] pb-1">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs font-mono-tech">
              <li>
                <Link href="/" className="hover:text-[#E3DED3] transition-colors">
                  &gt; Início
                </Link>
              </li>
              <li>
                <Link href="/manual" className="hover:text-[#E3DED3] transition-colors">
                  &gt; Índice do Manual
                </Link>
              </li>
              <li>
                <Link href="/cadastro" className="hover:text-[#E3DED3] transition-colors">
                  &gt; Ficha de Sobrevivente
                </Link>
              </li>
              <li>
                <Link href="/busca" className="hover:text-[#E3DED3] transition-colors">
                  &gt; Busca nos Capítulos
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Chapters */}
          <div>
            <h4 className="font-title text-sm text-[#E3DED3] tracking-wider uppercase mb-3 border-b border-[#252525] pb-1">
              Capítulos Críticos
            </h4>
            <ul className="space-y-2 text-xs font-mono-tech">
              <li>
                <Link href="/manual/criacao-de-sobrevivente" className="hover:text-[#E3DED3] transition-colors">
                  04 — Criação de Sobrevivente
                </Link>
              </li>
              <li>
                <Link href="/manual/tempo-e-acoes" className="hover:text-[#E3DED3] transition-colors">
                  03 — Pontos de Ação (PA)
                </Link>
              </li>
              <li>
                <Link href="/manual/combate" className="hover:text-[#E3DED3] transition-colors">
                  07 — Regras de Combate
                </Link>
              </li>
              <li>
                <Link href="/manual/ferimentos-infeccao-morte" className="hover:text-[#E3DED3] text-[#781D24] transition-colors">
                  09 — Infecção e Morte
                </Link>
              </li>
              <li>
                <Link href="/manual/apendices" className="hover:text-[#E3DED3] transition-colors">
                  18 — Apêndices &amp; Modelos
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
              O site é exclusivamente um portal de consulta de regras. A condução da campanha, interação social e envio de ordens ocorrem no WhatsApp sob arbitragem da equipe de mestres.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#252525] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono-tech">
          <div>
            DEAD HOURS — MANUAL OFICIAL DO SOBREVIVENTE. EDIÇÃO 1.0.
          </div>
          <div className="text-[#C3BBA9]">
            HORÁRIO OFICIAL: BRASÍLIA (UTC−3) // REINÍCIO MATINAL: 06H00
          </div>
        </div>
      </div>
    </footer>
  );
}
