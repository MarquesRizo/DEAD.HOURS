import React from 'react';
import Link from 'next/link';
import { CHAPTERS } from '@/lib/chaptersData';
import { BookOpen, Search, ArrowRight, ShieldAlert, Layers } from 'lucide-react';

export const metadata = {
  title: 'Índice Geral do Manual',
  description: 'Consulte os 18 capítulos e apêndices oficiais do sistema DEAD HOURS: regras, combate, sobrevivência e criação de personagens.'
};

export default function ManualIndexPage() {
  const categories = Array.from(new Set(CHAPTERS.map((c) => c.category)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Top Header */}
      <div className="border-b border-[#252525] pb-8 space-y-4">
        <div className="stamp-classified">
          DOCUMENTAÇÃO DE CAMPO // ÍNDICE COMPLETO
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="font-title text-4xl sm:text-5xl text-[#E3DED3] tracking-wider">
              MANUAL OFICIAL DO SOBREVIVENTE
            </h1>
            <p className="text-sm text-[#C3BBA9] max-w-2xl">
              Consulte as diretrizes regulatórias do RPG DEAD HOURS. 18 capítulos com a mecânica completa de sobrevivência, criação de personagens, combate tático, inventário e operação de grupos de WhatsApp.
            </p>
          </div>

          {/* Quick Search Shortcut */}
          <Link
            href="/busca"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#151515] hover:bg-[#252525] border border-[#414141] hover:border-[#781D24] text-[#C3BBA9] hover:text-[#E3DED3] font-mono-tech text-xs tracking-wider uppercase transition-colors shrink-0"
          >
            <Search className="w-4 h-4 text-[#781D24]" />
            PESQUISAR TERMO NO MANUAL
          </Link>
        </div>
      </div>

      {/* Chapter Categories */}
      <div className="space-y-12">
        {categories.map((category) => {
          const categoryChapters = CHAPTERS.filter((c) => c.category === category);
          return (
            <div key={category} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-[#252525] pb-2">
                <Layers className="w-4 h-4 text-[#781D24]" />
                <h2 className="font-title text-2xl text-[#E3DED3] tracking-wide uppercase">
                  {category}
                </h2>
                <span className="font-mono-tech text-xs text-[#77736C]">
                  ({categoryChapters.length} {categoryChapters.length === 1 ? 'capítulo' : 'capítulos'})
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryChapters.map((chapter) => (
                  <Link
                    key={chapter.slug}
                    href={`/manual/${chapter.slug}`}
                    className="rule-card p-6 block hover:bg-[#151515] transition-all group flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono-tech text-xs font-bold text-[#781D24]">
                          CAPÍTULO {chapter.number}
                        </span>
                        <span className="font-mono-tech text-[10px] text-[#77736C] tracking-widest uppercase">
                          {chapter.classification.split('//')[0]}
                        </span>
                      </div>

                      <h3 className="font-title text-xl text-[#E3DED3] group-hover:text-[#C3BBA9] tracking-wide">
                        {chapter.title}
                      </h3>

                      <p className="text-xs text-[#77736C] leading-relaxed line-clamp-2">
                        {chapter.summary}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#252525] flex items-center justify-between font-mono-tech text-[11px] text-[#C3BBA9]">
                      <span className="text-[#77736C]">{chapter.sections.length} seções</span>
                      <span className="flex items-center gap-1 text-[#781D24] group-hover:translate-x-1 transition-transform">
                        LER CAPÍTULO <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
