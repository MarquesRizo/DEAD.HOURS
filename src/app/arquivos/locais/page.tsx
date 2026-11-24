import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import WorldNav from '@/components/world/WorldNav';
import { WORLD_LOCATIONS } from '@/lib/worldData';
import { 
  MapPin, 
  AlertTriangle, 
  Package, 
  ShieldAlert, 
  Crosshair, 
  ArrowRight, 
  ArrowLeft,
  Compass
} from 'lucide-react';

export const metadata = {
  title: 'Locais & Zonas de Risco — Cartografia Tática // DEAD HOURS',
  description: 'Catálogo de exploração tática de pontos de interesse com fotografias de campo, status de risco e inventário de recursos conhecidos.'
};

export default function LocaisZonasPage() {
  const getRiskBadgeClass = (risk: string) => {
    switch (risk) {
      case 'Baixo':
        return 'badge-risk-low';
      case 'Moderado':
        return 'badge-risk-medium';
      case 'Crítico':
        return 'badge-risk-high';
      case 'Morte Iminente':
        return 'badge-risk-extreme';
      default:
        return 'badge-risk-medium';
    }
  };

  return (
    <div className="space-y-0 pb-16">
      <WorldNav />

      {/* Hero da Seção */}
      <section className="relative bg-[#090909] border-b border-[#2B2B2B] overflow-hidden py-12">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#131313] border border-[#781D24] text-[#E3DED3] font-mono-tech text-xs tracking-wider uppercase">
              <MapPin className="w-3.5 h-3.5 text-[#AA2830]" />
              SEÇÃO 05 // CARTOGRAFIA TÁTICA DO ERMO
            </div>
            <span className="stamp-tech">RECONHECIMENTO ATIVO</span>
          </div>

          <div className="space-y-2">
            <h1 className="font-title text-3xl sm:text-5xl text-[#E3DED3] tracking-wider uppercase">
              Locais &amp; Zonas de Risco
            </h1>
            <p className="font-mono-tech text-xs sm:text-sm text-[#C3BBA9] max-w-3xl leading-relaxed">
              Catálogo de pontos de interesse catalogados por batedores. Fotografias de campo, notas de abordagem, nível de ameaça de caminhantes e estimativa de recursos recuperáveis para expedições.
            </p>
          </div>
        </div>
      </section>

      {/* Grid de Locais Catalogados */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {WORLD_LOCATIONS.map((loc) => (
            <article 
              key={loc.id}
              className="border border-[#2B2B2B] bg-[#131313] overflow-hidden flex flex-col justify-between hover:border-[#414141] transition-all group"
            >
              <div>
                {/* Fotografia de Campo do Local */}
                <div className="relative h-56 sm:h-72 w-full bg-[#0A0A0A] overflow-hidden">
                  <Image
                    src={loc.imagePath}
                    alt={loc.name}
                    fill
                    className="object-cover filter grayscale contrast-110 brightness-85 group-hover:brightness-95 group-hover:scale-102 transition-all duration-700"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent" />
                  
                  {/* Selos de Risco e Categoria sobre a Imagem */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    <span className={getRiskBadgeClass(loc.riskLevel)}>
                      RISCO: {loc.riskLevel.toUpperCase()}
                    </span>
                    <span className="px-2 py-0.5 bg-[#090909]/90 border border-[#333333] text-[10px] font-mono-tech text-[#C3BBA9] uppercase">
                      {loc.category}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono-tech text-[#E3DED3] bg-[#090909]/80 px-3 py-1.5 border border-[#2B2B2B]">
                    <span>CÓDIGO: {loc.code}</span>
                    <span className="text-[#AA2830]">STATUS: {loc.status.toUpperCase()}</span>
                  </div>
                </div>

                {/* Conteúdo do Local */}
                <div className="p-6 sm:p-8 space-y-5">
                  <h2 className="font-title text-2xl text-[#E3DED3] tracking-wide">
                    {loc.name}
                  </h2>

                  <p className="text-xs font-mono-tech text-[#C3BBA9] leading-relaxed">
                    {loc.description}
                  </p>

                  {/* Estado Estrutural */}
                  <div className="p-3 bg-[#0A0A0A] border border-[#222222] text-xs font-mono-tech text-[#77736C]">
                    <span className="text-[#E3DED3] font-bold mr-1">Condição Estrutural:</span>
                    {loc.condition}
                  </div>

                  {/* Recursos Conhecidos */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-mono-tech text-[#77736C] uppercase tracking-wider flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-[#AA2830]" />
                      Recursos Potenciais de Saque:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {loc.knownResources.map((res, rIdx) => (
                        <span 
                          key={rIdx}
                          className="px-2 py-1 bg-[#1A1A1A] border border-[#333333] text-[11px] font-mono-tech text-[#E3DED3]"
                        >
                          {res}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Notas Táticas de Batedores */}
                  <div className="p-4 bg-[#181818] border-l-2 border-[#AA2830] border border-[#2B2B2B] space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-mono-tech font-bold text-[#AA2830] uppercase">
                      <Crosshair className="w-3.5 h-3.5" />
                      Recomendação de Abordagem Tática:
                    </div>
                    <p className="text-xs font-mono-tech text-[#C3BBA9] leading-relaxed">
                      {loc.tacticalNotes}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Rodapé de Navegação */}
        <div className="pt-8 border-t border-[#2B2B2B] flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/arquivos/registros"
            className="inline-flex items-center gap-2 text-xs font-mono-tech text-[#77736C] hover:text-[#E3DED3] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            04. REGISTROS &amp; DOCUMENTOS
          </Link>
          <Link
            href="/manual/exploracao-e-mapa"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#181818] border border-[#781D24] text-xs font-mono-tech text-[#E3DED3] hover:bg-[#781D24] transition-colors"
          >
            CONSULTAR REGRAS DE EXPLORAÇÃO (CAP. 13)
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
