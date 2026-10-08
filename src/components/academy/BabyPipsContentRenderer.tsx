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
      <div className="py-12 text-center text-slate-400 font-sans text-sm">
        No content available for this lesson.
      </div>
    );
  }

  return (
    <div className="babypips-content max-w-none text-slate-800 font-sans antialiased text-[17px] leading-[1.8]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-8 mb-4 pb-3 border-b border-slate-200">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-8 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2.5">
              <span className="w-1.5 h-5 rounded-full bg-emerald-500 inline-block shrink-0" />
              <span>{children}</span>
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-6 mb-3">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-4 mb-2">
              {children}
            </h4>
          ),
          p: ({ children }) => {
            const rawStr = typeof children === 'string' ? children : '';
            if (rawStr.includes('┌') || rawStr.includes('└') || rawStr.includes('─►') || rawStr.includes('│')) {
              return (
                <div className="my-6 p-4 sm:p-5 rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto shadow-xs">
                  <pre className="font-mono text-xs sm:text-sm text-emerald-400 leading-relaxed whitespace-pre">
                    {children}
                  </pre>
                </div>
              );
            }
            return (
              <p className="text-[17px] leading-[1.8] text-slate-700 mb-5 font-normal">
                {children}
              </p>
            );
          },
          ul: ({ children }) => (
            <ul className="space-y-2 mb-6 pl-5 list-disc marker:text-emerald-600 text-slate-700">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-2 mb-6 pl-5 list-decimal marker:text-emerald-600 marker:font-semibold text-slate-700">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-[17px] leading-relaxed text-slate-700 pl-1 font-normal">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <div className="my-6 p-5 sm:p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 border-l-4 border-l-emerald-600 text-slate-800 leading-relaxed font-sans shadow-xs">
              <div className="text-xs uppercase font-bold tracking-wider text-emerald-800 mb-1.5 flex items-center gap-1.5">
                <span>Core Concept / Educational Takeaway</span>
              </div>
              <div className="text-base sm:text-[17px] text-slate-800 leading-relaxed font-normal">
                {children}
              </div>
            </div>
          ),
          code: ({ className, children, ...props }) => {
            const isInline = !className && typeof children === 'string' && !children.includes('\n');
            if (isInline) {
              return (
                <code className="px-1.5 py-0.5 rounded bg-slate-100 text-emerald-800 font-mono text-xs sm:text-sm border border-slate-200 font-semibold">
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
            <div className="my-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-700 tracking-wider">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-slate-200 bg-white">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-slate-50/80 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 font-semibold text-slate-900 border-b border-slate-200">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-slate-700 text-sm font-normal">
              {children}
            </td>
          ),
          a: ({ href, children }) => (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-emerald-700 hover:text-emerald-800 underline underline-offset-4 inline-flex items-center gap-1 font-semibold transition-colors"
            >
              <span>{children}</span>
              <ExternalLink className="w-3 h-3 inline-block" />
            </a>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-slate-900">
              {children}
            </strong>
          ),
          hr: () => <hr className="my-8 border-slate-200" />,
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
    <div className="my-6 rounded-xl bg-slate-950 border border-slate-800 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold text-slate-300">{language ? language.toUpperCase() : 'MQL5 CODE'}</span>
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
        <pre className="font-mono text-xs sm:text-sm text-emerald-400 leading-relaxed whitespace-pre">
          <code>{children}</code>
        </pre>
      </div>
    </div>
  );
}
