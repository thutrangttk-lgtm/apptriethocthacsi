"use client";

import React from 'react';

interface FormattedMarkdownProps {
  content: string;
  className?: string;
}

export const FormattedMarkdown: React.FC<FormattedMarkdownProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Split text into paragraphs/blocks
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inList = false;
  let listItems: React.ReactNode[] = [];
  let isNumbered = false;

  const renderInlineMarkdown = (text: string): React.ReactNode[] => {
    // Process inline bold **text** and italic *text* and code `text`
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const matchedStr = match[0];
      if (matchedStr.startsWith('**') && matchedStr.endsWith('**')) {
        parts.push(
          <strong key={match.index} className="font-black text-[#172554]">
            {matchedStr.slice(2, -2)}
          </strong>
        );
      } else if (matchedStr.startsWith('*') && matchedStr.endsWith('*')) {
        parts.push(
          <em key={match.index} className="italic text-slate-800">
            {matchedStr.slice(1, -1)}
          </em>
        );
      } else if (matchedStr.startsWith('`') && matchedStr.endsWith('`')) {
        parts.push(
          <code key={match.index} className="bg-blue-50 text-[#4285F4] px-1.5 py-0.5 rounded font-mono text-xs font-bold border border-blue-200">
            {matchedStr.slice(1, -1)}
          </code>
        );
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts;
  };

  const flushList = (key: number) => {
    if (listItems.length > 0) {
      if (isNumbered) {
        elements.push(
          <ol key={`list-${key}`} className="list-decimal list-inside space-y-1.5 my-3 pl-2 text-slate-800 font-medium">
            {listItems}
          </ol>
        );
      } else {
        elements.push(
          <ul key={`list-${key}`} className="list-disc list-inside space-y-1.5 my-3 pl-2 text-slate-800 font-medium">
            {listItems}
          </ul>
        );
      }
      listItems = [];
      inList = false;
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList(idx);
      return;
    }

    // Headers
    if (trimmed.startsWith('### ')) {
      flushList(idx);
      elements.push(
        <h3 key={idx} className="text-lg font-black text-[#172554] mt-5 mb-2 flex items-center gap-2 border-b border-slate-200 pb-1">
          <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
          <span>{renderInlineMarkdown(trimmed.substring(4))}</span>
        </h3>
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      flushList(idx);
      elements.push(
        <h2 key={idx} className="text-xl font-black text-[#172554] mt-6 mb-3 pb-1 border-b-2 border-blue-200">
          {renderInlineMarkdown(trimmed.substring(3))}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith('# ')) {
      flushList(idx);
      elements.push(
        <h1 key={idx} className="text-2xl font-black text-[#172554] mt-6 mb-4">
          {renderInlineMarkdown(trimmed.substring(2))}
        </h1>
      );
      return;
    }

    // Blockquote / Callout box
    if (trimmed.startsWith('> ')) {
      flushList(idx);
      elements.push(
        <blockquote key={idx} className="p-4 my-3 bg-pastel-blue border-l-4 border-[#4285F4] rounded-r-2xl text-slate-800 font-medium italic text-sm shadow-2xs">
          {renderInlineMarkdown(trimmed.substring(2))}
        </blockquote>
      );
      return;
    }

    // Unordered List Items (- or *)
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!inList || isNumbered) {
        flushList(idx);
        inList = true;
        isNumbered = false;
      }
      listItems.push(
        <li key={idx} className="text-slate-800 leading-relaxed text-sm sm:text-base">
          {renderInlineMarkdown(trimmed.substring(2))}
        </li>
      );
      return;
    }

    // Numbered List Items (1. , 2. , etc.)
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      if (!inList || !isNumbered) {
        flushList(idx);
        inList = true;
        isNumbered = true;
      }
      listItems.push(
        <li key={idx} className="text-slate-800 leading-relaxed text-sm sm:text-base">
          {renderInlineMarkdown(numMatch[2])}
        </li>
      );
      return;
    }

    // Normal Paragraph
    flushList(idx);
    elements.push(
      <p key={idx} className="mb-3 text-slate-800 leading-relaxed font-normal text-sm sm:text-base">
        {renderInlineMarkdown(trimmed)}
      </p>
    );
  });

  flushList(lines.length);

  return <div className={`formatted-markdown-container space-y-1 ${className}`}>{elements}</div>;
};
