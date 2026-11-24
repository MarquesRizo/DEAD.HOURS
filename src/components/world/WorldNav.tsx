'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Building2, 
  GitCommit, 
  Biohazard, 
  FileSearch, 
  MapPin, 
  Layers
} from 'lucide-react';

export default function WorldNav() {
  const pathname = usePathname();

  const tabs = [
    {
      href: '/arquivos',
      label: 'Visão Geral',
      code: 'DOC-GERAL',
      icon: Layers,
      exact: true
    },
    {
      href: '/arquivos/mundo-antes',
      label: 'O Mundo Antes',
      code: 'SEC-01 // PRÉ',
      icon: Building2,
      exact: false
    },
    {
      href: '/arquivos/linha-do-tempo',
      label: 'Linha do Tempo',
      code: 'SEC-02 // CRONO',
      icon: GitCommit,
      exact: false
    },
    {
      href: '/arquivos/virus',
      label: 'O Vírus (Dossiê)',
      code: 'SEC-03 // BIO-RESTRITO',
      icon: Biohazard,
      exact: false
    },
    {
      href: '/arquivos/registros',
      label: 'Registros & Documentos',
      code: 'SEC-04 // RESGATES',
      icon: FileSearch,
      exact: false
    },
    {
      href: '/arquivos/locais',
      label: 'Locais & Zonas',
      code: 'SEC-05 // CARTOGRAFIA',
      icon: MapPin,
      exact: false
    }
  ];

  const isTabActive = (tab: typeof tabs[0]) => {
    if (tab.exact) {
      return pathname === tab.href;
    }
    return pathname === tab.href || pathname.startsWith(tab.href + '/');
  };

  return (
    <nav className="border-b border-[#2B2B2B] bg-[#0E0E0E]/95 sticky top-14 sm:top-16 z-40 backdrop-blur-md shadow-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 overflow-x-auto py-2 no-scrollbar">
          {tabs.map((tab) => {
            const active = isTabActive(tab);
            const Icon = tab.icon;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-2.5 px-3.5 py-2 text-xs font-mono-tech uppercase tracking-wider transition-all shrink-0 border-b-2 ${
                  active
                    ? 'border-[#781D24] bg-[#161616] text-[#E3DED3] font-bold shadow-sm'
                    : 'border-transparent text-[#77736C] hover:text-[#E3DED3] hover:bg-[#141414]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#AA2830]' : 'opacity-60'}`} />
                <span>{tab.label}</span>
                <span className={`text-[9px] px-1.5 py-0.2 border ${
                  active 
                    ? 'border-[#781D24] bg-[rgba(120,29,36,0.3)] text-[#FF6873]' 
                    : 'border-[#333333] text-[#555555]'
                }`}>
                  {tab.code.split('//')[0].trim()}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
