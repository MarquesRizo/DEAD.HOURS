import React from 'react';
import Link from 'next/link';
import { Skull, ArrowLeft, BookOpen } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-[#151515] border-2 border-[#781D24] p-8 text-center space-y-6">
        <div className="w-12 h-12 bg-[#4B1117] border border-[#781D24] flex items-center justify-center mx-auto text-[#FFFFFF]">
          <Skull className="w-6 h-6 text-[#E3DED3]" />
        </div>

        <div className="space-y-2">
          <div className="stamp-warning">
            ERRO 404 // ARQUIVO NÃO LOCALIZADO
          </div>
          <h1 className="font-title text-3xl sm:text-4xl text-[#E3DED3] tracking-wider">
            REGISTRO DESTRUÍDO
          </h1>
          <p className="text-xs text-[#C3BBA9] leading-relaxed font-body">
            O documento ou setor que você tentou acessar foi perdido nas cinzas do colapso, saqueado ou nunca existiu nesta base de dados.
          </p>
        </div>

        <div className="pt-4 border-t border-[#252525] flex flex-col sm:flex-row gap-3 justify-center text-xs font-mono-tech">
          <Link
            href="/"
            className="px-4 py-2.5 bg-[#0B0B0B] hover:bg-[#252525] border border-[#414141] text-[#E3DED3] flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#781D24]" />
            RETORNAR AO INÍCIO
          </Link>
          <Link
            href="/manual"
            className="px-4 py-2.5 bg-[#781D24] hover:bg-[#4B1117] text-[#FFFFFF] flex items-center justify-center gap-2 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            CONSULTAR MANUAL
          </Link>
        </div>
      </div>
    </div>
  );
}
