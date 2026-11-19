'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { searchManual, SearchResult } from '@/lib/search';
import { Search as SearchIcon, ArrowRight, BookOpen, Tag, HelpCircle } from 'lucide-react';

export default function BuscaPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const quickTerms = [
    'Infecção',
    'Fome',
    'Agilidade',
    'Pontos de ação',
    'Caminhantes',
    'Armas',
    'Ferimentos',
    'Morte',
    'Especializações',
    'Exploração',
    'Créditos CS',
    'Vigor'
  ];

  const results: SearchResult[] = useMemo(() => {
    return searchManual(searchTerm);
  }, [searchTerm]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Search Header */}
      <div className="border-b border-[#252525] pb-6 space-y-3">
        <div className="stamp-classified">
          SISTEMA DE BUSCA LOCAL // MANUAL OFICIAL
        </div>
        <h1 className="font-title text-4xl sm:text-5xl text-[#E3DED3] tracking-wider">
          PESQUISA DE DIRETRIZES &amp; REGRAS
        </h1>
        <p className="text-sm text-[#C3BBA9] max-w-2xl">
          Consulte instantaneamente termos mecânicos, regras de combate, condições fisiológicas e tabelas do manual sem necessidade de conexão externa.
        </p>
      </div>

      {/* Search Bar Input */}
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Digite um termo (ex: infecção, armas, pontos de ação, fome)..."
            className="w-full bg-[#151515] border-2 border-[#414141] focus:border-[#781D24] text-[#E3DED3] placeholder-[#77736C] px-5 py-4 pl-12 font-mono-tech text-sm outline-none transition-colors"
            autoFocus
          />
          <SearchIcon className="w-5 h-5 text-[#77736C] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono-tech text-[#77736C] hover:text-[#E3DED3] px-2 py-1 bg-[#252525]"
            >
              LIMPAR
            </button>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-mono-tech text-[#77736C] flex items-center gap-1">
            <Tag className="w-3 h-3 text-[#781D24]" />
            Sugestões rápidas:
          </span>
          {quickTerms.map((term) => (
            <button
              key={term}
              onClick={() => setSearchTerm(term)}
              className="text-xs font-mono-tech px-2.5 py-1 bg-[#151515] border border-[#252525] hover:border-[#781D24] text-[#C3BBA9] hover:text-[#E3DED3] transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results Area */}
      <div className="space-y-4">
        {searchTerm.trim().length >= 2 && (
          <div className="font-mono-tech text-xs text-[#77736C] border-b border-[#252525] pb-2 flex items-center justify-between">
            <span>
              {results.length} {results.length === 1 ? 'resultado encontrado' : 'resultados encontrados'} para &ldquo;{searchTerm}&rdquo;
            </span>
            <span className="text-[#C3BBA9]">
              ORDENADO POR RELEVÂNCIA
            </span>
          </div>
        )}

        {/* Results List */}
        {results.length > 0 ? (
          <div className="space-y-4">
            {results.map((res, idx) => (
              <Link
                key={`${res.chapterSlug}-${res.sectionId || idx}`}
                href={`/manual/${res.chapterSlug}${res.sectionId ? `#${res.sectionId}` : ''}`}
                className="rule-card p-6 block hover:bg-[#151515] transition-all group"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2 font-mono-tech text-xs">
                  <span className="text-[#781D24] font-bold">
                    CAPÍTULO {res.chapterNumber} // {res.category.toUpperCase()}
                  </span>
                  {res.sectionTitle && (
                    <span className="text-[#77736C]">
                      SEÇÃO: {res.sectionTitle}
                    </span>
                  )}
                </div>

                <h3 className="font-title text-xl text-[#E3DED3] group-hover:text-[#C3BBA9] tracking-wide mb-2">
                  {res.chapterTitle}
                </h3>

                <p className="text-xs text-[#C3BBA9] leading-relaxed line-clamp-2 font-body">
                  {res.snippet}
                </p>

                <div className="mt-4 pt-3 border-t border-[#252525] flex items-center justify-end font-mono-tech text-xs text-[#781D24] gap-1 group-hover:translate-x-1 transition-transform">
                  <span>ACESSAR REGRA NO MANUAL</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        ) : searchTerm.trim().length >= 2 ? (
          /* Empty Search State */
          <div className="p-12 text-center border border-[#252525] bg-[#151515] space-y-4">
            <HelpCircle className="w-8 h-8 text-[#781D24] mx-auto opacity-70" />
            <div className="font-title text-xl text-[#E3DED3]">
              NENHUM REGISTRO CORRESPONDENTE
            </div>
            <p className="text-xs text-[#77736C] max-w-md mx-auto">
              Não encontramos nenhuma menção direta ao termo &ldquo;{searchTerm}&rdquo;. Tente buscar por palavras fundamentais como &ldquo;combate&rdquo;, &ldquo;vigor&rdquo;, &ldquo;fome&rdquo; ou consulte o índice completo.
            </p>
            <div className="pt-2">
              <Link
                href="/manual"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#252525] hover:bg-[#414141] text-[#E3DED3] font-mono-tech text-xs tracking-wider"
              >
                <BookOpen className="w-4 h-4 text-[#781D24]" />
                CONSULTAR ÍNDICE GERAL
              </Link>
            </div>
          </div>
        ) : (
          /* Initial Hint */
          <div className="p-8 border border-[#252525] bg-[#151515]/50 text-center text-xs font-mono-tech text-[#77736C]">
            DIGITE AO MENOS 2 CARACTERES OU CLIQUE NUMA DAS SUGESTÕES ACIMA PARA PESQUISAR.
          </div>
        )}
      </div>
    </div>
  );
}
