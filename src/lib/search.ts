import { CHAPTERS, Chapter, ChapterSection } from './chaptersData';

export interface SearchResult {
  chapterSlug: string;
  chapterNumber: string;
  chapterTitle: string;
  category: string;
  sectionId?: string;
  sectionTitle?: string;
  snippet: string;
  matchScore: number;
}

export function searchManual(query: string): SearchResult[] {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const cleanQuery = query.toLowerCase().trim();
  const queryTerms = cleanQuery.split(/\s+/).filter(Boolean);
  const results: SearchResult[] = [];

  for (const chapter of CHAPTERS) {
    let bestScore = 0;
    let bestSnippet = '';
    let bestSection: ChapterSection | undefined;

    // Check title & summary
    const titleLower = chapter.title.toLowerCase();
    const summaryLower = chapter.summary.toLowerCase();
    const subtitleLower = chapter.subtitle.toLowerCase();

    for (const term of queryTerms) {
      if (titleLower.includes(term)) bestScore += 10;
      if (subtitleLower.includes(term)) bestScore += 6;
      if (summaryLower.includes(term)) bestScore += 4;
    }

    if (bestScore > 0) {
      bestSnippet = chapter.summary;
    }

    // Check sections
    for (const section of chapter.sections) {
      let sectionScore = 0;
      const secTitleLower = section.title.toLowerCase();

      for (const term of queryTerms) {
        if (secTitleLower.includes(term)) sectionScore += 8;
      }

      // Check content paragraphs
      for (const para of section.content) {
        const paraLower = para.toLowerCase();
        let matchesInPara = 0;
        for (const term of queryTerms) {
          if (paraLower.includes(term)) {
            matchesInPara++;
            sectionScore += 3;
          }
        }

        if (matchesInPara > 0 && !bestSnippet) {
          // Extract snippet
          const matchIndex = paraLower.indexOf(queryTerms[0]);
          const start = Math.max(0, matchIndex - 40);
          const end = Math.min(para.length, matchIndex + 120);
          bestSnippet = (start > 0 ? '...' : '') + para.slice(start, end) + (end < para.length ? '...' : '');
        }
      }

      // Check callout
      if (section.callout) {
        const calloutText = `${section.callout.title} ${section.callout.text}`.toLowerCase();
        for (const term of queryTerms) {
          if (calloutText.includes(term)) {
            sectionScore += 4;
            if (!bestSnippet) {
              bestSnippet = section.callout.text.slice(0, 140) + '...';
            }
          }
        }
      }

      if (sectionScore > bestScore) {
        bestScore = sectionScore;
        bestSection = section;
      }
    }

    if (bestScore > 0) {
      results.push({
        chapterSlug: chapter.slug,
        chapterNumber: chapter.number,
        chapterTitle: chapter.title,
        category: chapter.category,
        sectionId: bestSection?.id,
        sectionTitle: bestSection?.title,
        snippet: bestSnippet || chapter.summary,
        matchScore: bestScore
      });
    }
  }

  // Sort by score descending
  return results.sort((a, b) => b.matchScore - a.matchScore);
}
