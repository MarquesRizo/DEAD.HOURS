'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { searchManual, SearchResult } from '@/lib/search';
import HighlightText from '@/components/HighlightText';
import { tacticalAudio } from '@/lib/audioSynthesis';
import { 
  Search as SearchIcon, 
  ArrowRight, 
  BookOpen, 
  Tag, 
  HelpCircle, 
  Filter, 
  SlidersHorizontal,
  CornerDownLeft
} from 'lucide-react';

type CategoryFilter = 'TODAS' | 'Regras' | 'Combate' | 'Sobrevivência' | 'Criação' | 'Operação';

const CATEGORY_MAP: Record<CategoryFilter, string[]> = {
  TODAS: [],
  Regras: ['Regras de Jogo'],
  Combate: ['Ameaças e Combate'],
  Sobrevivência: ['O Mundo', 'Introdução'],
  Criação: ['Personagem'],
  Operação: ['Operação', 'Apêndices']
};

export default function BuscaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('TODAS');
  const inputRef = useRef<HTMLInputElement>(null);

  const quickTerms = [
    'Infecção',
    'Fome',
    'Agilidade',
    'Pontos de ação',
    'Ruído',
    'Armas',
    'Ferimentos',
    'Morte',
    'Especializações',
    'Exploração',
    'Créditos CS',
    'Vigor'
  ];

  // Atalho global do teclado: tecla '/' foca o input; 'Escape' limpa/desfoca
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        const tag = document.activeElement?.tagName.toLowerCase();
        if (tag !== 'input' && tag !== 'textarea') {
          e.preventDefault();
          inputRef.current?.focus();
        }
      }
      if (e.key === 'Escape') {
        if (document.activeElement === inputRef.current) {
          if (searchTerm) {
            setSearchTerm('');
          } else {
            inputRef.current?.blur();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchTerm]);

  // Todos os resultados encontrados pela consulta
  const allResults: SearchResult[] = useMemo(() => {
    return searchManual(searchTerm);
  }, [searchTerm]);

  // Contagem por categoria para as abas de filtro
  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryFilter, number> = {
      TODAS: allResults.length,
      Regras: 0,
      Combate: 0,
      Sobrevivência: 0,
      Criação: 0,
      Operação: 0
    };

    allResults.forEach((res) => {
      (Object.keys(CATEGORY_MAP) as CategoryFilter[]).forEach((cat) => {
        if (cat !== 'TODAS' && CATEGORY_MAP[cat].includes(res.category)) {
          counts[cat]++;
        }
      });
    });

    return counts;
  }, [allResults]);

  // Resultados filtrados pela aba ativa
  const filteredResults = useMemo(() => {
    if (activeCategory === 'TODAS') {
      return allResults;
    }
    const targetCategories = CATEGORY_MAP[activeCategory];
    return allResults.filter((res) => targetCategories.includes(res.category));
  }, [allResults, activeCategory]);

  const handleSelectTerm = (term: string) => {
    tacticalAudio.playTacticalClick();
    setSearchTerm(term);
    inputRef.current?.focus();
  };

  const handleCategoryChange = (cat: CategoryFilter) => {
    tacticalAudio.playTacticalClick();
    setActiveCategory(cat);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Search Header */}
      <div className="border-b border-[#252525] pb-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="stamp-classified">
            SISTEMA DE BUSCA LOCAL // MANUAL OFICIAL
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono-tech text-[#77736C]">
            <kbd className="px-1.5 py-0.5 border border-[#414141] bg-[#151515] text-[#C3BBA9] font-bold">/</kbd>
            <span>foca busca</span>
            <span className="mx-1">•</span>
            <kbd className="px-1.5 py-0.5 border border-[#414141] bg-[#151515] text-[#C3BBA9] font-bold">ESC</kbd>
            <span>limpa</span>
          </div>
        </div>
        <h1 className="font-title text-4xl sm:text-5xl text-[#E3DED3] tracking-wider">
          PESQUISA DE DIRETRIZES &amp; REGRAS
        </h1>
        <p className="text-sm text-[#C3BBA9] max-w-2xl leading-relaxed">
          Consulte instantaneamente termos mecânicos, regras de combate, condições fisiológicas e tabelas do manual sem necessidade de conexão externa.
        </p>
      </div>

      {/* Search Bar Input */}
      <div className="space-y-4">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Digite um termo (ex: infecção, armas, pontos de ação, fome)..."
            className="w-full bg-[#151515] border-2 border-[#414141] focus:border-[#781D24] text-[#E3DED3] placeholder-[#77736C] px-5 py-4 pl-12 pr-28 font-mono-tech text-sm outline-none transition-colors"
            autoFocus
          />
          <SearchIcon className="w-5 h-5 text-[#77736C] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />

          {/* Atalho ou Botão Limpar */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {searchTerm ? (
              <button
                onClick={() => {
                  setSearchTerm('');
                  inputRef.current?.focus();
                }}
                className="text-xs font-mono-tech text-[#77736C] hover:text-[#E3DED3] px-2.5 py-1 bg-[#252525] border border-[#414141] hover:border-[#781D24] transition-colors"
              >
                LIMPAR
              </button>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono-tech text-[#77736C] border border-[#333333] px-1.5 py-0.5 bg-[#1e1e1e]">
                <span>PRESSIONE</span>
                <kbd className="text-[#E3DED3] font-bold">/</kbd>
              </span>
            )}
          </div>
        </div>

        {/* Filtros por Categoria Tática */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-1.5 text-xs font-mono-tech text-[#77736C]">
            <Filter className="w-3.5 h-3.5 text-[#781D24]" />
            <span>Filtro por categoria tática:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(['TODAS', 'Regras', 'Combate', 'Sobrevivência', 'Criação', 'Operação'] as CategoryFilter[]).map((cat) => {
              const active = activeCategory === cat;
              const count = categoryCounts[cat];
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`text-xs font-mono-tech px-3 py-1.5 border transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-[#781D24] border-[#AA2830] text-white font-bold shadow-sm'
                      : 'bg-[#151515] border-[#252525] hover:border-[#414141] text-[#C3BBA9] hover:text-[#E3DED3]'
                  }`}
                >
                  <span className="uppercase">{cat}</span>
                  {searchTerm.trim().length >= 2 && (
                    <span className={`text-[10px] px-1 py-0.2 rounded ${
                      active ? 'bg-[#4B1117] text-white' : 'bg-[#252525] text-[#77736C]'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#252525]/60">
          <span className="text-xs font-mono-tech text-[#77736C] flex items-center gap-1">
            <Tag className="w-3 h-3 text-[#781D24]" />
            Sugestões rápidas:
          </span>
          {quickTerms.map((term) => (
            <button
              key={term}
              onClick={() => handleSelectTerm(term)}
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
          <div className="font-mono-tech text-xs text-[#77736C] border-b border-[#252525] pb-2 flex flex-wrap items-center justify-between gap-2">
            <span>
              {filteredResults.length} {filteredResults.length === 1 ? 'resultado encontrado' : 'resultados encontrados'} para &ldquo;<span className="text-[#E3DED3]">{searchTerm}</span>&rdquo;
              {activeCategory !== 'TODAS' && (
                <span className="text-[#AA2830] font-bold ml-1">
                  [FILTRO: {activeCategory.toUpperCase()}]
                </span>
              )}
            </span>
            <span className="text-[#C3BBA9]">
              ORDENADO POR RELEVÂNCIA TÁTICA
            </span>
          </div>
        )}

        {/* Results List */}
        {filteredResults.length > 0 ? (
          <div className="space-y-4">
            {filteredResults.map((res, idx) => (
              <Link
                key={`${res.chapterSlug}-${res.sectionId || idx}`}
                href={`/manual/${res.chapterSlug}${res.sectionId ? `#${res.sectionId}` : ''}`}
                className="rule-card p-6 block hover:bg-[#151515] transition-all group"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2 font-mono-tech text-xs">
                  <span className="text-[#AA2830] font-bold">
                    CAPÍTULO {res.chapterNumber} // {res.category.toUpperCase()}
                  </span>
                  {res.sectionTitle && (
                    <span className="text-[#77736C]">
                      SEÇÃO: <HighlightText text={res.sectionTitle} query={searchTerm} />
                    </span>
                  )}
                </div>

                <h3 className="font-title text-xl text-[#E3DED3] group-hover:text-[#C3BBA9] tracking-wide mb-2">
                  <HighlightText text={res.chapterTitle} query={searchTerm} />
                </h3>

                <p className="text-xs text-[#C3BBA9] leading-relaxed line-clamp-3 font-body">
                  <HighlightText text={res.snippet} query={searchTerm} />
                </p>

                <div className="mt-4 pt-3 border-t border-[#252525] flex items-center justify-end font-mono-tech text-xs text-[#AA2830] gap-1 group-hover:translate-x-1 transition-transform">
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
            <p className="text-xs text-[#77736C] max-w-md mx-auto leading-relaxed">
              Não encontramos menção direta ao termo &ldquo;{searchTerm}&rdquo;
              {activeCategory !== 'TODAS' ? ` na categoria ${activeCategory}. Tente alternar para a categoria 'TODAS' ou pesquisar por outro termo.` : '. Tente buscar por palavras fundamentais como "combate", "vigor", "fome" ou consulte o índice completo.'}
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              {activeCategory !== 'TODAS' && (
                <button
                  onClick={() => setActiveCategory('TODAS')}
                  className="px-4 py-2 bg-[#781D24] hover:bg-[#AA2830] text-white font-mono-tech text-xs tracking-wider transition-colors"
                >
                  REMOVER FILTRO ({activeCategory.toUpperCase()})
                </button>
              )}
              <Link
                href="/manual"
                className="inline-flex items-center gap-2 px-5 py-2 bg-[#252525] hover:bg-[#414141] text-[#E3DED3] font-mono-tech text-xs tracking-wider transition-colors"
              >
                <BookOpen className="w-4 h-4 text-[#781D24]" />
                CONSULTAR ÍNDICE GERAL
              </Link>
            </div>
          </div>
        ) : (
          /* Initial Hint */
          <div className="p-8 border border-[#252525] bg-[#151515]/50 text-center text-xs font-mono-tech text-[#77736C] space-y-1">
            <p>DIGITE AO MENOS 2 CARACTERES OU CLIQUE NUMA DAS SUGESTÕES ACIMA PARA PESQUISAR.</p>
            <p className="text-[10px] text-[#55524B]">DICA: Pressione a tecla <kbd className="text-[#C3BBA9] font-bold">/</kbd> a qualquer momento para focar a barra de busca.</p>
          </div>
        )}
      </div>
    </div>
  );
}
