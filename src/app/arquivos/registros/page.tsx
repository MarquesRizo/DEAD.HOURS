import React from 'react';
import Link from 'next/link';
import WorldNav from '@/components/world/WorldNav';
import { DOCUMENT_RECORDS } from '@/lib/worldData';
import { 
  FileSearch, 
  MapPin, 
  Calendar, 
  Radio, 
  ArrowRight, 
  ArrowLeft,
  FileText,
  AlertCircle
} from 'lucide-react';

export const metadata = {
  title: 'Registros & Documentos Resgatados // DEAD HOURS',
  description: 'Fichário de documentos físicos recuperados no ermo: despachos de evacuação, relatórios de patrulha, cartas de familiares e transcrições de rádio.'
};

export default function RegistrosDocumentosPage() {
  return (
    <div className="space-y-0 pb-16">
      <WorldNav />

      {/* Hero da Seção */}
      <section className="relative bg-[#090909] border-b border-[#2B2B2B] overflow-hidden py-12">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#131313] border border-[#781D24] text-[#E3DED3] font-mono-tech text-xs tracking-wider uppercase">
              <FileSearch className="w-3.5 h-3.5 text-[#AA2830]" />
              SEÇÃO 04 // FICHÁRIO DE REGISTROS RESGATADOS
            </div>
            <span className="stamp-classified">ACERVO DE CAMPO</span>
          </div>

          <div className="space-y-2">
            <h1 className="font-title text-3xl sm:text-5xl text-[#E3DED3] tracking-wider uppercase">
              Registros &amp; Documentos Encontrados
            </h1>
            <p className="font-mono-tech text-xs sm:text-sm text-[#C3BBA9] max-w-3xl leading-relaxed">
              Cartas pessoais, comunicados de evacuação fixados em estruturas públicas, despachos militares de reconhecimento e transcrições de transmissões de rádio resgatadas por patrulhas de sobreviventes.
            </p>
          </div>
        </div>
      </section>

      {/* Catálogo de Documentos Físicos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {DOCUMENT_RECORDS.map((doc) => {
            const isFragmented = doc.condition === 'Fragmentado';
            const isStained = doc.condition === 'Manchado';

            return (
              <article 
                key={doc.id}
                className="border border-[#2B2B2B] bg-[#131313] p-6 sm:p-8 space-y-6 flex flex-col justify-between hover:border-[#414141] transition-all"
              >
                <div className="space-y-4">
                  {/* Cabeçalho do Documento */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2B2B2B] pb-3">
                    <span className="font-mono-tech text-xs text-[#AA2830] font-bold">
                      {doc.catalogCode}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono-tech text-[10px] text-[#77736C] uppercase">
                        {doc.type}
                      </span>
                      <span className={`text-[10px] font-mono-tech px-2 py-0.5 border ${
                        isFragmented 
                          ? 'border-[#8C6D3B] text-[#D4AF37] bg-[#8C6D3B]/10' 
                          : isStained
                          ? 'border-[#781D24] text-[#FF6873] bg-[#781D24]/10'
                          : 'border-[#3F5E46] text-[#6BBF7A] bg-[#3F5E46]/10'
                      }`}>
                        ESTADO: {doc.condition.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <h2 className="font-title text-2xl text-[#E3DED3] tracking-wide">
                    {doc.title}
                  </h2>

                  {/* Metadados de Resgate */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono-tech text-[#77736C] bg-[#0A0A0A] p-3 border border-[#222222]">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#AA2830]" />
                      <span>{doc.dateRecovered}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#AA2830]" />
                      <span className="truncate">{doc.originLocation}</span>
                    </div>
                  </div>

                  {/* Trecho / Transcrição Transcrita */}
                  <div className="p-4 bg-[#0F0F0F] border-l-2 border-[#AA2830] border border-[#222222] space-y-3 font-mono-tech text-xs text-[#E3DED3] leading-relaxed">
                    {doc.excerpt.map((line, lIdx) => (
                      <p key={lIdx} className="italic">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Nota do Arquivista de Campo */}
                <div className="pt-4 border-t border-[#222222] text-[11px] font-mono-tech text-[#77736C]">
                  <span className="text-[#AA2830] font-bold uppercase mr-1">Nota de Campo:</span>
                  {doc.archivistNotes}
                </div>
              </article>
            );
          })}
        </div>

        {/* Rodapé de Navegação */}
        <div className="pt-8 border-t border-[#2B2B2B] flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/arquivos/virus"
            className="inline-flex items-center gap-2 text-xs font-mono-tech text-[#77736C] hover:text-[#E3DED3] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            03. O VÍRUS (DOSSIÊ)
          </Link>
          <Link
            href="/arquivos/locais"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#181818] border border-[#781D24] text-xs font-mono-tech text-[#E3DED3] hover:bg-[#781D24] transition-colors"
          >
            AVANÇAR: 05. LOCAIS &amp; ZONAS DE RISCO
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
