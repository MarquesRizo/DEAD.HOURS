'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CHAPTERS } from '@/lib/chaptersData';
import { ChevronDown, ChevronRight, BookOpen, Layers } from 'lucide-react';

interface SidebarProps {
  currentSlug?: string;
}

export default function Sidebar({ currentSlug }: SidebarProps) {
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const pathname = usePathname();

  // Categories
  const categories = Array.from(new Set(CHAPTERS.map((c) => c.category)));

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="w-full flex items-center justify-between p-3 bg-[#151515] border border-[#414141] text-[#E3DED3] font-mono-tech text-xs tracking-wider"
        >
          <span className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#781D24]" />
            {isOpenMobile ? 'OCULTAR ÍNDICE DE CAPÍTULOS' : 'EXPANDIR ÍNDICE DE CAPÍTULOS (18 CAPÍTULOS)'}
          </span>
          {isOpenMobile ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {/* Sidebar Content */}
      <aside
        className={`lg:block ${
          isOpenMobile ? 'block' : 'hidden'
        } bg-[#151515] border border-[#252525] p-4 lg:sticky lg:top-24 h-fit max-h-[calc(100vh-8rem)] overflow-y-auto`}
      >
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#252525]">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#781D24]" />
            <span className="font-title text-sm tracking-wider text-[#E3DED3]">
              ARQUIVOS DO MANUAL
            </span>
          </div>
          <span className="font-mono-tech text-[10px] text-[#77736C]">v1.0</span>
        </div>

        <div className="space-y-6">
          {categories.map((category) => {
            const catChapters = CHAPTERS.filter((c) => c.category === category);
            return (
              <div key={category} className="space-y-1.5">
                <div className="font-mono-tech text-[10px] font-bold tracking-widest text-[#781D24] uppercase px-2 py-0.5 border-l-2 border-[#781D24] bg-[#0B0B0B]/50">
                  {category}
                </div>
                <ul className="space-y-0.5">
                  {catChapters.map((chap) => {
                    const isActive = currentSlug === chap.slug || pathname === `/manual/${chap.slug}`;
                    return (
                      <li key={chap.slug}>
                        <Link
                          href={`/manual/${chap.slug}`}
                          onClick={() => setIsOpenMobile(false)}
                          className={`flex items-start gap-2 px-2 py-1.5 text-xs font-mono-tech transition-colors border-l-2 ${
                            isActive
                              ? 'bg-[#0B0B0B] text-[#E3DED3] border-[#781D24] font-semibold'
                              : 'text-[#C3BBA9] border-transparent hover:bg-[#0B0B0B]/60 hover:text-[#E3DED3]'
                          }`}
                        >
                          <span className={`text-[10px] ${isActive ? 'text-[#781D24]' : 'text-[#77736C]'}`}>
                            {chap.number}
                          </span>
                          <span className="line-clamp-1 leading-tight">{chap.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}
