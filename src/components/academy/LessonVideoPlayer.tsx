import React from 'react';
import { Play, ExternalLink, MonitorPlay, Sparkles } from 'lucide-react';

interface LessonVideoPlayerProps {
  videoUrl?: string;
  videoId?: string;
  title?: string;
  subtitle?: string;
  badgeText?: string;
  footerHint?: string;
  footerSubtext?: string;
}

export function LessonVideoPlayer({
  videoUrl = 'https://www.youtube.com/watch?v=MzNUHEDPWPs',
  videoId = 'MzNUHEDPWPs',
  title = 'Build Your First MT5 Indicator: Average Daily Range (ADR)',
  subtitle = 'Full visual walkthrough: from initial trading idea to ChatGPT specifications, Claude coding prompt, MetaEditor compilation, and MT5 chart validation.',
  badgeText = 'Video Lesson Version',
  footerHint,
  footerSubtext,
}: LessonVideoPlayerProps) {
  // Extract video ID if full URL provided
  let extractedId = videoId;
  if (videoUrl && !videoId) {
    const match = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match && match[1]) {
      extractedId = match[1];
    }
  }

  const embedUrl = `https://www.youtube-nocookie.com/embed/${extractedId}?rel=0&modestbranding=1`;
  const directWatchUrl = videoUrl || `https://www.youtube.com/watch?v=${extractedId}`;

  return (
    <div className="rounded-2xl bg-gradient-to-b from-slate-900/95 via-slate-950/90 to-slate-950 border border-slate-800 p-4 sm:p-6 shadow-2xl transition-all">
      {/* Header bar: Video Lesson Version metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-800/80">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0 shadow-[0_0_15px_rgba(239,68,68,0.15)] mt-0.5">
            <Play className="w-5 h-5 fill-red-400 text-red-400 ml-0.5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase tracking-wider bg-red-500/15 border border-red-500/30 text-red-300">
                {badgeText}
              </span>
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                <MonitorPlay className="w-3.5 h-3.5 text-slate-400" />
                <span>Full Workshop Edition</span>
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-300 font-sans mt-1 max-w-3xl leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Quality & External Link actions */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>1080p HD</span>
          </span>
          <a
            href={directWatchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-all group"
          >
            <span>Watch on YouTube</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
          </a>
        </div>
      </div>

      {/* Responsive 16:9 Player Container */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-slate-800/90 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <iframe
          className="absolute inset-0 w-full h-full"
          src={embedUrl}
          title={`${title} — ${badgeText}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      {/* Complementary Guide Navigation Hint */}
      <div className="mt-3.5 pt-3 border-t border-slate-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-400">
        <span className="flex items-center gap-1.5 text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
          <span>{footerHint || 'Follow along with the video or use the interactive 8-step workbench and verified source code below.'}</span>
        </span>
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider shrink-0">
          {footerSubtext || 'Written Manual & Answer Key Below ↓'}
        </span>
      </div>
    </div>
  );
}
