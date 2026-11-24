import React from 'react';

interface HighlightTextProps {
  text: string;
  query: string;
  className?: string;
}

export default function HighlightText({ text, query, className = '' }: HighlightTextProps) {
  if (!text) return null;
  if (!query || !query.trim()) {
    return <span className={className}>{text}</span>;
  }

  const terms = query
    .trim()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2);

  if (terms.length === 0) {
    return <span className={className}>{text}</span>;
  }

  // Escape special regex characters
  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, idx) => {
        const isMatch = terms.some((t) => t.toLowerCase() === part.toLowerCase());
        if (isMatch) {
          return (
            <mark
              key={idx}
              className="bg-[#781D24]/40 text-[#E3DED3] border-b-2 border-[#AA2830] px-0.5 rounded-none font-semibold"
            >
              {part}
            </mark>
          );
        }
        return part;
      })}
    </span>
  );
}
