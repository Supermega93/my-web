import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Trash2, 
  Minimize2, 
  ArrowRight, 
  ChevronRight,
  HelpCircle,
  Code2,
  BookOpen,
  Wrench,
  Cpu
} from 'lucide-react';
import Markdown from 'react-markdown';
import { ActiveView } from '../../types.ts';
import { generateLocalMegaAiResponse, MegaAiMessage } from '../../data/megaAiPrompt.ts';

interface MegaAiChatProps {
  currentView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  onTriggerBuildMyEa: (strategyData?: any) => void;
}

const STARTER_PROMPTS = [
  { text: "I don't know where to start.", icon: HelpCircle },
  { text: "I want to build a trading bot but I don't know how to code.", icon: Code2 },
  { text: "Can you build my EA?", icon: Cpu },
  { text: "I want to build an app or website.", icon: Sparkles },
  { text: "What book should I start with?", icon: BookOpen },
];

export const MegaAiChat: React.FC<MegaAiChatProps> = ({
  currentView,
  onNavigate,
  onTriggerBuildMyEa,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<MegaAiMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am **MEGA AI**, your intelligent guide to the MEG.AI and SuperMegaFX ecosystem.

Whether you want to **learn** algorithmic trading, turn a trading idea into a **structured strategy specification**, have a **custom EA developed**, or build a **custom web application or AI automation**, I'm here to help you take the next step.

How can I help you today?`,
      timestamp: Date.now(),
      actions: [
        { label: 'Explore Free Academy', actionType: 'navigate', target: 'academy' },
        { label: 'Try AI Strategy Builder', actionType: 'navigate', target: 'prompt-architect' },
        { label: 'Build My EA', actionType: 'build-ea' },
      ],
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMessage: MegaAiMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // 1. Try server-side API with Master System Prompt & Gemini 2.5 Flash
      const response = await fetch('/api/mega-ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-8),
          currentView,
        }),
      });

      const data = await response.json();

      if (data && data.success && data.reply) {
        // Derive appropriate action chips based on content
        const lower = (text + ' ' + data.reply).toLowerCase();
        const actions: MegaAiMessage['actions'] = [];

        if (lower.includes('strategy builder') || lower.includes('prompt architect')) {
          actions.push({ label: 'Open AI Strategy Builder', actionType: 'navigate', target: 'prompt-architect' });
        }
        if (lower.includes('build my ea') || lower.includes('custom ea')) {
          actions.push({ label: 'Start Build My EA', actionType: 'build-ea' });
        }
        if (lower.includes('academy') || lower.includes('lesson')) {
          actions.push({ label: 'Explore Free Academy', actionType: 'navigate', target: 'academy' });
        }
        if (lower.includes('book') || lower.includes('vol 1') || lower.includes('vol 2') || lower.includes('handbook')) {
          actions.push({ label: 'View Books', actionType: 'navigate', target: 'ebooks' });
        }

        const assistantMessage: MegaAiMessage = {
          id: `asst_${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          timestamp: Date.now(),
          actions: actions.length > 0 ? actions : undefined,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        // 2. Use embedded deterministic reasoning engine
        const fallbackResult = generateLocalMegaAiResponse(text, currentView);
        const assistantMessage: MegaAiMessage = {
          id: `asst_${Date.now()}`,
          role: 'assistant',
          content: fallbackResult.content,
          timestamp: Date.now(),
          actions: fallbackResult.actions,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (err) {
      console.warn('Network request failed, using local reasoning:', err);
      const fallbackResult = generateLocalMegaAiResponse(text, currentView);
      const assistantMessage: MegaAiMessage = {
        id: `asst_${Date.now()}`,
        role: 'assistant',
        content: fallbackResult.content,
        timestamp: Date.now(),
        actions: fallbackResult.actions,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: NonNullable<MegaAiMessage['actions']>[number]) => {
    if (action.actionType === 'navigate' && action.target) {
      onNavigate(action.target as ActiveView);
    } else if (action.actionType === 'build-ea') {
      onTriggerBuildMyEa(action.payload);
    } else if (action.actionType === 'quick-reply' && action.payload) {
      handleSendMessage(action.payload);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        role: 'assistant',
        content: `Chat history cleared. I am **MEGA AI**, ready to guide you through the ecosystem. What can I help you learn, build, or explore?`,
        timestamp: Date.now(),
        actions: [
          { label: 'Explore Free Academy', actionType: 'navigate', target: 'academy' },
          { label: 'Try AI Strategy Builder', actionType: 'navigate', target: 'prompt-architect' },
          { label: 'Build My EA', actionType: 'build-ea' },
        ],
      },
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom-Right) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <button
              onClick={() => {
                setIsOpen(true);
                setIsMinimized(false);
              }}
              className="group relative flex items-center gap-2.5 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white px-4 py-3 rounded-full shadow-[0_12px_30px_-5px_rgba(6,78,59,0.35),0_4px_10px_rgba(0,0,0,0.15)] border border-emerald-500/40 hover:border-emerald-400/80 hover:shadow-[0_14px_35px_-4px_rgba(16,185,129,0.4)] transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
              aria-label="Open MEGA AI Assistant"
            >
              {/* Pulsing indicator */}
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>

              <div className="flex items-center gap-1.5">
                <Bot className="w-5 h-5 text-emerald-400 group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-bold tracking-tight text-sm text-white">Ask MEGA AI</span>
              </div>

              <span className="hidden sm:inline-block text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                Guide
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : undefined 
            }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className={`fixed bottom-5 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] max-w-[440px] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.06)] flex flex-col overflow-hidden backdrop-blur-xl ${
              isMinimized ? 'h-auto' : 'h-[620px] max-h-[85vh]'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 select-none">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-inner border border-emerald-400/40">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-sm tracking-tight">MEGA AI</span>
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Assistant
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">Guide to MEG.AI & Trading Ecosystem</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearHistory}
                  title="Clear history"
                  className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  title={isMinimized ? "Expand" : "Minimize"}
                  className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content Body (Visible when not minimized) */}
            {!isMinimized && (
              <>
                {/* Message Log */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm font-sans bg-slate-900/95 scrollbar-thin scrollbar-thumb-slate-700">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.role === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      {/* Avatar / Sender */}
                      <div className="flex items-center gap-1.5 mb-1 px-1">
                        {msg.role === 'assistant' ? (
                          <>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                              MEGA AI
                            </span>
                            <span className="text-[9px] text-slate-500 font-mono">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </>
                        ) : (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                            You
                          </span>
                        )}
                      </div>

                      {/* Bubble */}
                      <div
                        className={`max-w-[88%] rounded-2xl px-4 py-3 leading-relaxed shadow-sm ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-xs'
                            : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-xs'
                        }`}
                      >
                        <div className="prose prose-invert prose-sm max-w-none text-slate-200">
                          <Markdown>{msg.content}</Markdown>
                        </div>

                        {/* Interactive Context Action Chips */}
                        {msg.actions && msg.actions.length > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex flex-wrap gap-1.5">
                            {msg.actions.map((act, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleActionClick(act)}
                                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-800 hover:text-white transition-colors cursor-pointer group shadow-xs"
                              >
                                <span>{act.label}</span>
                                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Loading indicator */}
                  {isLoading && (
                    <div className="flex flex-col items-start">
                      <div className="flex items-center gap-1.5 mb-1 px-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                          MEGA AI is thinking...
                        </span>
                      </div>
                      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl rounded-tl-xs px-4 py-3 text-slate-400 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}

                  {/* Starter Suggestions (Shown if only welcome message exists) */}
                  {messages.length === 1 && !isLoading && (
                    <div className="pt-2">
                      <p className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 px-1 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        Common Starting Points:
                      </p>
                      <div className="flex flex-col gap-1.5">
                        {STARTER_PROMPTS.map((prompt, idx) => {
                          const IconComp = prompt.icon;
                          return (
                            <button
                              key={idx}
                              onClick={() => handleSendMessage(prompt.text)}
                              className="text-left text-xs bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white p-2.5 rounded-xl border border-slate-700/60 hover:border-emerald-500/50 transition-all flex items-center justify-between group cursor-pointer"
                            >
                              <span className="flex items-center gap-2 font-medium">
                                <IconComp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                {prompt.text}
                              </span>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Footer Input */}
                <div className="p-3 bg-slate-950 border-t border-slate-800">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask MEGA AI anything about our ecosystem..."
                      disabled={isLoading}
                      className="flex-1 bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 disabled:opacity-60"
                    />
                    <button
                      type="submit"
                      disabled={!inputValue.trim() || isLoading}
                      className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer shrink-0"
                      aria-label="Send message"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                  <p className="text-[10px] text-slate-500 text-center mt-2 leading-tight">
                    MEGA AI guide • Past performance does not guarantee future results.
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
