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
  Compass,
  FileText,
  Lock,
  Eye,
  Biohazard
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

      {/* Hero da Seção com espaçamento generoso para evitar sobreposição */}
      <section className="relative bg-[#090909] border-b border-[#2B2B2B] overflow-hidden py-12 sm:py-16">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#781D24]/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#131313] border border-[#781D24] text-[#E3DED3] font-mono-tech text-xs tracking-wider uppercase">
              <MapPin className="w-3.5 h-3.5 text-[#AA2830]" />
              SEÇÃO 05 // CARTOGRAFIA TÁTICA DO ERMO &amp; DOSSIÊS SECRETOS
            </div>
            <div className="flex items-center gap-2">
              <span className="stamp-topsecret text-[10px]">DOCUMENTOS CONFIDENCIAIS</span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="font-title text-3xl sm:text-5xl text-[#E3DED3] tracking-wider uppercase">
              Locais &amp; Zonas de Risco
            </h1>
            <p className="font-mono-tech text-xs sm:text-sm text-[#C3BBA9] max-w-3xl leading-relaxed">
              Catálogo de pontos de interesse com fotografias autênticas de campo e pastas de arquivos secretos resgatados de órgãos de emergência e forças militares. Passe o cursor sobre as tarjas pretas para revelar dados censurados.
            </p>
          </div>
        </div>
      </section>

      {/* Grid de Locais Catalogados */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
          {WORLD_LOCATIONS.map((loc) => {
            const isSecret = !!loc.isSecretDossier;

            return (
              <article 
                key={loc.id}
                className={`overflow-hidden flex flex-col justify-between transition-all group ${
                  isSecret 
                    ? 'dossier-folder border border-[#4A3F2C] hover:border-[#AA2830] shadow-2xl'
                    : 'border border-[#2B2B2B] bg-[#131313] hover:border-[#414141] shadow-lg'
                }`}
              >
                <div>
                  {/* Aba Tátil de Pasta Confidencial (para arquivos secretos estilo RE/TLOU) */}
                  {isSecret && (
                    <div className="bg-[#24201A] px-4 py-2 border-b border-[#3D3525] flex items-center justify-between text-xs font-mono-tech">
                      <div className="flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5 text-[#D97706]" />
                        <span className="text-[#E3DED3] font-bold tracking-wider uppercase">
                          PASTA CLASSIFICADA // {loc.code}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#D97706] font-bold bg-[#14120E] px-2 py-0.5 border border-[#3D3525]">
                        NÍVEL 4 RESTRITO
                      </span>
                    </div>
                  )}

                  {/* Fotografia de Campo com Cores Vivas e Selos Táticos */}
                  <div className="relative h-60 sm:h-72 w-full bg-[#0A0A0A] overflow-hidden">
                    <Image
                      src={loc.imagePath}
                      alt={loc.name}
                      fill
                      className="object-cover filter contrast-115 brightness-95 group-hover:brightness-105 group-hover:scale-105 transition-all duration-700"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-black/20 to-transparent" />
                    
                    {/* Selos de Risco e Categoria sobre a Imagem */}
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
                      <span className={getRiskBadgeClass(loc.riskLevel)}>
                        RISCO: {loc.riskLevel.toUpperCase()}
                      </span>
                      <span className="px-2 py-0.5 bg-[#090909]/90 border border-[#333333] text-[10px] font-mono-tech text-[#C3BBA9] uppercase">
                        {loc.category}
                      </span>
                    </div>

                    {/* Carimbo de Evidência Tática / RPD / Quarentena */}
                    {loc.evidenceStamp && (
                      <div className="absolute top-3 right-3">
                        <span className="stamp-topsecret text-[10px]">
                          {loc.evidenceStamp}
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono-tech text-[#E3DED3] bg-[#090909]/85 px-3 py-1.5 border border-[#2B2B2B] backdrop-blur-sm">
                      <span>CÓDIGO: {loc.code}</span>
                      <span className={loc.status === 'Hostil' ? 'text-[#FF4D5A] font-bold' : 'text-[#AA2830]'}>
                        STATUS: {loc.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Conteúdo do Dossiê */}
                  <div className="p-6 sm:p-8 space-y-5">
                    <div className="space-y-1">
                      <h2 className="font-title text-2xl text-[#E3DED3] tracking-wide group-hover:text-[#FF6873] transition-colors">
                        {loc.name}
                      </h2>
                      {isSecret && (
                        <div className="text-[10px] font-mono-tech text-[#AA2830] tracking-wider uppercase flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>REGISTRO CONFIDENCIAL DESCLASSIFICADO</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs font-mono-tech text-[#C3BBA9] leading-relaxed">
                      {loc.description}
                    </p>

                    {/* Dado Censurado / Tarja Preta Interativa (Hover para Revelar) */}
                    {loc.classifiedIntel && (
                      <div className="p-3 bg-[#1C1814] border border-[#52442C] space-y-1">
                        <div className="text-[10px] font-mono-tech text-[#D97706] font-bold uppercase flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>INTELIGÊNCIA MILITAR CENSURADA (PASSE O MOUSE):</span>
                        </div>
                        <div className="text-xs font-mono-tech">
                          <span className="redacted-bar">
                            {loc.classifiedIntel}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Estado Estrutural */}
                    <div className="p-3 bg-[#0A0A0A] border border-[#252525] text-xs font-mono-tech text-[#77736C]">
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
                            className="px-2 py-1 bg-[#1A1A1A] border border-[#333333] hover:border-[#AA2830] text-[11px] font-mono-tech text-[#E3DED3] transition-colors"
                          >
                            {res}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Notas Táticas de Batedores */}
                    <div className="p-4 bg-[#181512] border-l-2 border-[#AA2830] border border-[#2B2B2B] space-y-1">
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
            );
          })}
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
