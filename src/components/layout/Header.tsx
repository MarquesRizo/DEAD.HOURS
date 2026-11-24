'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  Search, 
  UserCheck, 
  ShieldAlert, 
  BookOpen, 
  Database,
  Radio
} from 'lucide-react';
import RadioWidget from '@/components/layout/RadioWidget';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Início', icon: ShieldAlert },
    { href: '/manual', label: 'Manual Oficial', icon: BookOpen },
    { href: '/cadastro', label: 'Ficha de Sobrevivente', icon: UserCheck },
    { href: '/arquivos', label: 'Arquivos do Mundo', icon: Database },
    { href: '/busca', label: 'Pesquisa', icon: Search },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B0B0B]/95 backdrop-blur-md border-b border-[#252525]">
      {/* Faixa Tática Superior com Frequência de Rádio */}
      <div className="bg-[#781D24] text-[#E3DED3] text-[10px] font-mono-tech py-0.5 px-4 text-center tracking-widest font-semibold flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E3DED3] animate-ping" />
          <span className="hidden sm:inline">FREQ: 142.8 MHz // TERMINAL DE EMERGÊNCIA ATIVO</span>
          <span className="sm:hidden">FREQ: 142.8 MHz</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden lg:inline opacity-90">ARQUIVO DE SOBREVIVÊNCIA PERSISTENTE // EDIÇÃO 1.0</span>
          <RadioWidget />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-[#151515] border border-[#781D24] flex items-center justify-center font-title font-bold text-lg text-[#E3DED3] group-hover:border-[#E3DED3] transition-colors">
              DH
            </div>
            <div>
              <div className="font-title text-xl tracking-wider text-[#E3DED3] group-hover:text-[#C3BBA9] transition-colors">
                DEAD HOURS
              </div>
              <div className="font-mono-tech text-[9px] text-[#77736C] tracking-widest uppercase">
                TERMINAL DE SOBREVIVÊNCIA // RPG WHATSAPP
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono-tech uppercase tracking-wider transition-all border ${
                    active
                      ? 'bg-[#151515] text-[#E3DED3] border-[#781D24] shadow-inner font-bold'
                      : 'text-[#77736C] hover:text-[#E3DED3] hover:bg-[#151515]/60 border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#AA2830]' : 'opacity-70'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile hamburger button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 border border-[#414141] bg-[#151515] text-[#E3DED3] hover:border-[#781D24] transition-colors"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#781D24]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B0B0B] border-b border-[#414141] px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-mono-tech uppercase tracking-wider border ${
                  active
                    ? 'bg-[#151515] text-[#E3DED3] border-[#781D24] font-bold'
                    : 'text-[#C3BBA9] border-transparent hover:bg-[#151515]'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-[#AA2830]' : 'text-[#77736C]'}`} />
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
