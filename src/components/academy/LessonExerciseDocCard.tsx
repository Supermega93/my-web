import { useState } from 'react';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink, 
  FileCode2,
  Check,
  ShieldCheck
} from 'lucide-react';
import { Button } from '../common/Button.tsx';

interface LessonExerciseDocCardProps {
  type: 'indicator' | 'ea';
  className?: string;
}

export function LessonExerciseDocCard({ type, className = '' }: LessonExerciseDocCardProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const isIndicator = type === 'indicator';

  const docDetails = isIndicator
    ? {
        title: 'From Trading Idea to MT5 Indicator',
        subtitle: 'A Practical Step-by-Step Guide to Turning a Trading Idea Into Working MT5 Code Using AI',
        pages: '17 Pages',
        badge: 'FREE EXERCISE COMPANION PDF',
        sourceFile: 'ADR_Levels.mq5',
        downloadUrl: '/api/academy/download/indicator',
        directViewUrl: '/downloads/From_Trading_Idea_to_MT5_Indicator_Guide.pdf',
        fileName: 'From-Trading-Idea-to-MT5-Indicator-Guide.pdf',
        fileSize: '~34 KB',
        workedExample: 'Average Daily Range (ADR) Breakout Indicator for MT5',
        highlights: [
          'The complete 16-step AI automation workflow (Idea → Specification → Claude Prompt → Code → MT5)',
          'Exact prompt recipes for ChatGPT (brainstorming) & Claude (MQL5 code generation)',
          'Review & Refine rules: When to Accept, Modify, or Delete AI suggestions',
          'MetaEditor compilation steps and compiler error troubleshooting workflow',
          'Appendix A: Complete, fully tested MQL5 source code (ADR_Levels.mq5) ready to copy & paste',
        ],
      }
    : {
        title: 'From Trading Idea to MT5 EA with AI',
        subtitle: 'A Practical Step-by-Step Guide to Turning a Trading Idea Into a Working MT5 Expert Advisor',
        pages: '30 Pages',
        badge: 'FREE EXERCISE COMPANION PDF',
        sourceFile: 'PrevDayBreakoutEA.mq5',
        downloadUrl: '/api/academy/download/ea',
        directViewUrl: '/downloads/From_Trading_Idea_to_MT5_EA_Guide.pdf',
        fileName: 'From-Trading-Idea-to-MT5-EA-Guide.pdf',
        fileSize: '~61 KB',
        workedExample: 'Previous-Day High/Low Breakout EA (MQL5)',
        highlights: [
          'Full strategy design: D1 previous bar breakout logic, fixed SL/TP, max daily trades & spread filter',
          'Role separation: ChatGPT for strategy specifications, Claude for rock-solid MQL5 programming',
          'MetaEditor workflow: EA creation, template setup, F7 compilation, and debugging loop',
          'MT5 Strategy Tester guide: Visual mode inspection, tick modeling, and execution verification',
          'Appendix A: Complete, production-ready MQL5 source code (PrevDayBreakoutEA.mq5) ready to compile',
        ],
      };

  const handleDownload = () => {
    setDownloading(true);
    setDownloadSuccess(false);

    const link = document.createElement('a');
    link.href = docDetails.downloadUrl;
    link.download = docDetails.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 5000);
    }, 800);
  };

  return (
    <div
      id={`exercise-doc-${type}`}
      className={`rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all p-6 sm:p-8 text-slate-900 ${className}`}
    >
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        {/* Document Information */}
        <div className="space-y-4 max-w-3xl">
          {/* Header Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>{docDetails.badge}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-mono font-semibold">
              <FileText className="w-3 h-3 text-slate-500" />
              <span>{docDetails.pages}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-mono font-semibold">
              <FileCode2 className="w-3 h-3 text-emerald-700" />
              <span>Source: {docDetails.sourceFile}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-mono font-semibold">
              <ShieldCheck className="w-3 h-3" />
              <span>100% Free For All Students</span>
            </span>
          </div>

          {/* Title & Subtitle */}
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileText className="w-6 h-6 text-emerald-600 shrink-0" />
              <span>{docDetails.title}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
              {docDetails.subtitle}
            </p>
          </div>

          {/* Worked Example Box */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-emerald-800 font-mono font-bold uppercase text-[10px] tracking-wider bg-emerald-100/70 px-2 py-0.5 rounded">
                Worked Example
              </span>
              <span className="font-semibold text-slate-800">{docDetails.workedExample}</span>
            </div>
            <span className="text-slate-500 font-mono text-[11px]">Format: PDF ({docDetails.fileSize})</span>
          </div>

          {/* Highlights List */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold block">
              What Is Included in This Guide:
            </span>
            <ul className="grid grid-cols-1 gap-2 text-xs text-slate-600">
              {docDetails.highlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Panel */}
        <div className="lg:w-72 shrink-0 flex flex-col gap-3 justify-center pt-2 lg:pt-6 border-t lg:border-t-0 lg:border-l border-slate-200/80 lg:pl-6">
          <Button
            id={`download-${type}-exercise-btn`}
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleDownload}
            disabled={downloading}
            icon={downloadSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
            className="font-bold shadow-md hover:shadow-lg transition-all"
          >
            {downloading ? 'Preparing PDF...' : downloadSuccess ? 'Downloaded!' : 'Download Exercise Document'}
          </Button>

          <a
            id={`preview-${type}-exercise-btn`}
            href={docDetails.directViewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span>Open / Preview in New Tab</span>
          </a>

          <div className="text-[11px] text-slate-500 text-center font-mono space-y-1">
            <p>✓ Direct PDF download</p>
            <p>✓ Desktop & mobile compatible</p>
            <p>✓ Free student exercise reference</p>
          </div>
        </div>
      </div>
    </div>
  );
}
