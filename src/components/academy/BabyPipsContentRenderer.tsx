import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Copy, 
  Check, 
  Terminal,
  ExternalLink
} from 'lucide-react';

interface BabyPipsContentRendererProps {
  content: string;
}

/**
 * Directly displays the raw 'content' field from Supabase exactly as formatted in the database,
 * with full Markdown and GitHub-Flavored Markdown support, without any truncation, summarization,
 * formula rewriting, or AI filtering.
 */
export function BabyPipsContentRenderer({ content }: BabyPipsContentRendererProps) {
  if (!content) {
    return (
      <div className="py-12 text-center text-slate-500 font-mono text-sm">
        No content available for this lesson.
      </div>
    );
  }

  return (
    <div className="babypips-content max-w-none text-slate-200 font-sans antialiased">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-8 mb-4 pb-3 border-b border-slate-800">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-8 mb-4 pb-2 border-b border-slate-800/80 flex items-center gap-2">
              <span className="w-1.5 h-5 rounded-full bg-emerald-500 inline-block shrink-0" />
              <span>{children}</span>
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg sm:text-xl font-semibold text-emerald-300 mt-6 mb-3">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base sm:text-lg font-semibold text-slate-200 mt-4 mb-2">
              {children}
            </h4>
          ),
          p: ({ children }) => {
            const rawStr = typeof children === 'string' ? children : '';
            if (rawStr.includes('┌') || rawStr.includes('└') || rawStr.includes('─►') || rawStr.includes('│')) {
              return (
                <div className="my-6 p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl overflow-x-auto">
                  <pre className="font-mono text-xs sm:text-sm text-emerald-300 leading-relaxed whitespace-pre">
                    {children}
                  </pre>
                </div>
              );
            }
            return (
              <p className="text-base sm:text-lg leading-[1.85] text-slate-300 mb-5 font-normal">
                {children}
              </p>
            );
          },
          ul: ({ children }) => (
            <ul className="space-y-2.5 mb-6 pl-4 list-disc marker:text-emerald-400">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-2.5 mb-6 pl-5 list-decimal marker:text-emerald-400 marker:font-bold">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-base sm:text-lg leading-relaxed text-slate-300 pl-1">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-6 p-4 sm:p-5 rounded-xl bg-slate-950/70 border-l-4 border-emerald-500 border-y border-r border-slate-800/70 text-slate-200 italic leading-relaxed font-sans">
              {children}
            </blockquote>
          ),
          code: ({ className, children, ...props }) => {
            const isInline = !className && typeof children === 'string' && !children.includes('\n');
            if (isInline) {
              return (
                <code className="px-1.5 py-0.5 rounded bg-slate-800/90 text-emerald-300 font-mono text-xs sm:text-sm border border-slate-700/60 font-medium">
                  {children}
                </code>
              );
            }
            return (
              <CodeBlock language={className?.replace('language-', '') || ''}>
                {String(children).replace(/\n$/, '')}
              </CodeBlock>
            );
          },
          pre: ({ children }) => <div className="my-6">{children}</div>,
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/50 shadow-md">
              <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-900/90 font-mono text-xs uppercase text-emerald-400">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-slate-900/40 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 font-bold border-b border-slate-800">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-slate-300 font-mono text-xs sm:text-sm">
              {children}
            </td>
          ),
          a: ({ href, children }) => (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4 inline-flex items-center gap-1 font-medium transition-colors"
            >
              <span>{children}</span>
              <ExternalLink className="w-3 h-3 inline-block" />
            </a>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-white">
              {children}
            </strong>
          ),
          hr: () => <hr className="my-8 border-slate-800" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

/**
 * Formatted Code Block rendering the raw code or ASCII verbatim with copy functionality
 */
function CodeBlock({ children, language }: { children: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span>{language ? language.toUpperCase() : 'CODE'}</span>
        </div>
        <button
          onClick={handleCopy}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Copy Code"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <div className="p-4 sm:p-5 overflow-x-auto">
        <pre className="font-mono text-xs sm:text-sm text-emerald-300 leading-relaxed whitespace-pre">
          <code>{children}</code>
        </pre>
      </div>
    </div>
  );
}
