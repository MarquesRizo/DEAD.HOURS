import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CHAPTERS } from '@/lib/chaptersData';
import Sidebar from '@/components/layout/Sidebar';
import { 
  ArrowLeft, 
  ArrowRight, 
  AlertTriangle, 
  ShieldAlert, 
  BookOpen, 
  CheckCircle2, 
  ChevronRight,
  Share2,
  Layers,
  Info
} from 'lucide-react';

interface ChapterPageProps {
  params: Promise<{ chapter: string }>;
}

export async function generateStaticParams() {
  return CHAPTERS.map((c) => ({ chapter: c.slug }));
}

export async function generateMetadata({ params }: ChapterPageProps) {
  const { chapter: chapterSlug } = await params;
  const chapter = CHAPTERS.find((c) => c.slug === chapterSlug);
  if (!chapter) return { title: 'Capítulo Não Encontrado' };

  return {
    title: `Cap. ${chapter.number} — ${chapter.title} // Manual DEAD HOURS`,
    description: chapter.summary
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { chapter: chapterSlug } = await params;
  const chapterIndex = CHAPTERS.findIndex((c) => c.slug === chapterSlug);

  if (chapterIndex === -1) {
    notFound();
  }

  const chapter = CHAPTERS[chapterIndex];
  const prevChapter = chapterIndex > 0 ? CHAPTERS[chapterIndex - 1] : null;
  const nextChapter = chapterIndex < CHAPTERS.length - 1 ? CHAPTERS[chapterIndex + 1] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono-tech text-[#77736C] mb-8 pb-3 border-b border-[#252525]">
        <Link href="/" className="hover:text-[#E3DED3] transition-colors">
          INÍCIO
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#414141]" />
        <Link href="/manual" className="hover:text-[#E3DED3] transition-colors">
          MANUAL
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#414141]" />
        <span className="text-[#C3BBA9] uppercase">
          CAP. {chapter.number} ({chapter.slug})
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Sidebar (Desktop Fixed / Mobile Drawer) */}
        <div className="lg:col-span-4 xl:col-span-3">
          <Sidebar currentSlug={chapter.slug} />
        </div>

        {/* Right Main Article Area */}
        <article className="lg:col-span-8 xl:col-span-9 space-y-10">
          {/* Header Banner */}
          <div className="bg-[#151515] border border-[#252525] border-l-4 border-l-[#781D24] p-6 sm:p-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="stamp-warning">
                CAPÍTULO {chapter.number} // {chapter.category}
              </span>
              <span className="font-mono-tech text-[10px] text-[#77736C]">
                {chapter.classification}
              </span>
            </div>

            <div className="space-y-1">
              <h1 className="font-title text-3xl sm:text-5xl text-[#E3DED3] tracking-wider">
                {chapter.title}
              </h1>
              <p className="font-title text-sm sm:text-base text-[#C3BBA9] tracking-wide">
                {chapter.subtitle}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#77736C] leading-relaxed pt-2 border-t border-[#252525]">
              {chapter.summary}
            </p>
          </div>

          {/* Mobile TOC (Fast Jump) */}
          <div className="lg:hidden p-4 bg-[#111111] border border-[#2B2B2B] space-y-2">
            <div className="text-[10px] font-mono-tech text-[#77736C] uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#AA2830]" />
              SALTAR PARA SEÇÃO:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {chapter.sections.map((sec, idx) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="text-xs font-mono-tech px-2.5 py-1 bg-[#161616] border border-[#333333] hover:border-[#781D24] text-[#C3BBA9] hover:text-[#E3DED3] transition-colors"
                >
                  § {idx + 1}. {sec.title}
                </a>
              ))}
            </div>
          </div>

          {/* Chapter Content Sections */}
          <div className="space-y-10">
            {chapter.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="bg-[#151515]/50 border border-[#252525] p-6 sm:p-8 space-y-6 scroll-mt-24"
              >
                <h2 className="font-title text-2xl text-[#E3DED3] tracking-wide border-b border-[#252525] pb-2 flex items-center justify-between">
                  <span>{section.title}</span>
                  <a
                    href={`#${section.id}`}
                    className="text-xs font-mono-tech text-[#414141] hover:text-[#781D24] transition-colors"
                  >
                    #ref
                  </a>
                </h2>

                {/* Paragraphs */}
                <div className="space-y-3 text-sm text-[#C3BBA9] leading-relaxed font-body">
                  {section.content.map((para, pIdx) => {
                    const isBullet = para.startsWith('•') || para.startsWith('-');
                    const isDivider = para.startsWith('---');
                    
                    if (isDivider) {
                      return <hr key={pIdx} className="border-[#252525] my-4" />;
                    }

                    if (isBullet) {
                      return (
                        <div key={pIdx} className="flex items-start gap-2 pl-2">
                          <span className="text-[#781D24] font-bold select-none">&gt;</span>
                          <span className="flex-1">{para.replace(/^[•-]\s*/, '')}</span>
                        </div>
                      );
                    }

                    return <p key={pIdx}>{para}</p>;
                  })}
                </div>

                {/* Optional Callout / Alert */}
                {section.callout && (
                  <div
                    className={`p-4 border font-mono-tech text-xs space-y-1.5 ${
                      section.callout.type === 'danger'
                        ? 'border-[#781D24] bg-[#4B1117]/25 text-[#E3DED3]'
                        : section.callout.type === 'warning'
                        ? 'border-[#AA2830] bg-[#181818] text-[#C3BBA9]'
                        : section.callout.type === 'classified'
                        ? 'border-[#414141] bg-[#0E0E0E] text-[#C3BBA9]'
                        : 'border-[#333333] bg-[#121212] text-[#C3BBA9]'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold uppercase text-[#AA2830]">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{section.callout.title}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-[#E3DED3] pl-6 font-mono-tech">
                      {section.callout.text}
                    </p>
                  </div>
                )}

                {/* Optional Data Table */}
                {section.table && (
                  <div className="overflow-x-auto border border-[#252525] bg-[#0B0B0B] mt-4">
                    <table className="w-full text-left text-xs font-mono-tech border-collapse">
                      <thead>
                        <tr className="bg-[#151515] border-b border-[#252525] text-[#E3DED3]">
                          {section.table.headers.map((h, hIdx) => (
                            <th key={hIdx} className="p-3 font-semibold uppercase tracking-wider">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#252525]">
                        {section.table.rows.map((row, rIdx) => (
                          <tr
                            key={rIdx}
                            className="hover:bg-[#151515]/60 transition-colors text-[#C3BBA9]"
                          >
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                className={`p-3 ${cIdx === 0 ? 'text-[#E3DED3] font-medium' : ''}`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Next / Previous Chapter Navigation */}
          <div className="pt-8 border-t border-[#252525] grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevChapter ? (
              <Link
                href={`/manual/${prevChapter.slug}`}
                className="p-4 bg-[#151515] border border-[#252525] hover:border-[#414141] transition-all flex items-center gap-3 group"
              >
                <ArrowLeft className="w-4 h-4 text-[#781D24] group-hover:-translate-x-1 transition-transform" />
                <div className="text-left">
                  <div className="font-mono-tech text-[10px] text-[#77736C]">
                    CAPÍTULO ANTERIOR ({prevChapter.number})
                  </div>
                  <div className="font-title text-base text-[#E3DED3] group-hover:text-[#C3BBA9] line-clamp-1">
                    {prevChapter.title}
                  </div>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextChapter && (
              <Link
                href={`/manual/${nextChapter.slug}`}
                className="p-4 bg-[#151515] border border-[#252525] hover:border-[#414141] transition-all flex items-center justify-end gap-3 text-right group"
              >
                <div>
                  <div className="font-mono-tech text-[10px] text-[#77736C]">
                    PRÓXIMO CAPÍTULO ({nextChapter.number})
                  </div>
                  <div className="font-title text-base text-[#E3DED3] group-hover:text-[#C3BBA9] line-clamp-1">
                    {nextChapter.title}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#781D24] group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
