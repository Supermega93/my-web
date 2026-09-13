import React, { useState } from 'react';
import { 
  Play, 
  RotateCw, 
  CheckCircle2, 
  Minus, 
  Square, 
  X, 
  Folder, 
  Save, 
  FileCode2, 
  Terminal,
  Search,
  BookOpen,
  HelpCircle,
  FolderOpen,
  ArrowLeft,
  ArrowRight,
  Maximize2
} from 'lucide-react';

export function MetaEditorWindow() {
  const [activeTab, setActiveTab] = useState<number>(3); // 3 is "INSTITUTIONAL Adaptive Liquidity Pro 1.mq5"
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileSuccess, setCompileSuccess] = useState(true);
  const [activeToolboxTab, setActiveToolboxTab] = useState('Errors');

  const tabs = [
    'Adaptive_Liquidity_Pro_V12 gem.mq5',
    'Adaptive_Liquidity_Pro_V12 (1).mq5',
    'Adaptive_Liquidity_Pro_V12.mq5',
    'INSTITUTIONAL Adaptive Liquidity Pro 1.mq5',
    'INSTITUTIONAL Adaptive Liquidity Pro 11.mq5'
  ];

  const handleCompile = () => {
    setIsCompiling(true);
    setTimeout(() => {
      setIsCompiling(false);
      setCompileSuccess(true);
    }, 450);
  };

  return (
    <div className="w-full rounded-xl bg-[#F0F2F5] text-slate-800 shadow-2xl border border-slate-700/80 overflow-hidden font-sans select-none text-[11px] leading-tight">
      {/* 1. Windows Window Header Bar */}
      <div className="bg-[#EAECEF] border-b border-slate-300/90 px-2 py-1 flex items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-hidden">
          {/* MT5 MetaEditor Yellow Icon */}
          <div className="w-3.5 h-3.5 rounded-[3px] bg-amber-500 flex items-center justify-center text-[10px] font-black text-white shadow-xs shrink-0 font-serif leading-none">
            5
          </div>
          <span className="font-medium text-[10px] sm:text-[11px] text-slate-700 truncate">
            MetaEditor - [INSTITUTIONAL Adaptive Liquidity Pro 1.mq5]
          </span>
        </div>

        {/* Window controls (Min, Max, Close) */}
        <div className="flex items-center gap-0.5 text-slate-600 shrink-0">
          <button className="w-5 h-4 flex items-center justify-center hover:bg-slate-300 rounded text-slate-600 transition-colors">
            <Minus className="w-2.5 h-2.5" />
          </button>
          <button className="w-5 h-4 flex items-center justify-center hover:bg-slate-300 rounded text-slate-600 transition-colors">
            <Square className="w-2 h-2" />
          </button>
          <button className="w-5 h-4 flex items-center justify-center hover:bg-rose-500 hover:text-white rounded text-slate-600 transition-colors">
            <X className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>

      {/* 2. Menu Bar */}
      <div className="bg-[#F8F9FA] px-2 py-0.5 border-b border-slate-200 text-[10px] text-slate-700 flex items-center gap-2.5 font-normal overflow-x-auto whitespace-nowrap scrollbar-none">
        <span className="hover:bg-blue-100 px-1 py-0.5 rounded cursor-pointer">File</span>
        <span className="hover:bg-blue-100 px-1 py-0.5 rounded cursor-pointer">Edit</span>
        <span className="hover:bg-blue-100 px-1 py-0.5 rounded cursor-pointer">Git</span>
        <span className="hover:bg-blue-100 px-1 py-0.5 rounded cursor-pointer">Search</span>
        <span className="hover:bg-blue-100 px-1 py-0.5 rounded cursor-pointer">View</span>
        <span className="hover:bg-blue-100 px-1 py-0.5 rounded cursor-pointer font-semibold text-slate-900">Build</span>
        <span className="hover:bg-blue-100 px-1 py-0.5 rounded cursor-pointer">Debug</span>
        <span className="hover:bg-blue-100 px-1 py-0.5 rounded cursor-pointer">Tools</span>
        <span className="hover:bg-blue-100 px-1 py-0.5 rounded cursor-pointer">Window</span>
        <span className="hover:bg-blue-100 px-1 py-0.5 rounded cursor-pointer">Help</span>
      </div>

      {/* 3. Toolbar Row with Compile Button */}
      <div className="bg-[#F3F4F6] px-2 py-1 border-b border-slate-300 flex items-center justify-between gap-1 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1">
          {/* New */}
          <button className="px-1.5 py-0.5 hover:bg-slate-200 rounded border border-transparent hover:border-slate-300 text-slate-700 flex items-center gap-1 text-[10px]">
            <span className="text-emerald-600 font-bold">+</span>
            <span className="font-semibold">New</span>
          </button>

          <div className="h-3.5 w-[1px] bg-slate-300 mx-0.5" />

          {/* Folder Open / Save Icons */}
          <div className="flex items-center gap-0.5 text-amber-600">
            <button className="p-0.5 hover:bg-slate-200 rounded text-amber-500" title="Open Folder">
              <FolderOpen className="w-3 h-3" />
            </button>
            <button className="p-0.5 hover:bg-slate-200 rounded text-blue-600" title="Save">
              <Save className="w-3 h-3" />
            </button>
          </div>

          <div className="h-3.5 w-[1px] bg-slate-300 mx-0.5" />

          {/* Interactive Compile Button */}
          <button 
            onClick={handleCompile}
            className={`px-2 py-0.5 rounded border flex items-center gap-1 text-[10px] font-semibold transition-all cursor-pointer shadow-xs ${
              isCompiling 
                ? 'bg-amber-100 border-amber-300 text-amber-900' 
                : 'bg-gradient-to-b from-white to-slate-100 hover:from-slate-50 hover:to-slate-200 border-slate-300 text-slate-800 active:scale-95'
            }`}
            title="Compile (F7)"
          >
            <RotateCw className={`w-3 h-3 text-emerald-600 ${isCompiling ? 'animate-spin' : ''}`} />
            <span>Compile</span>
          </button>

          {/* Run / Debug */}
          <button className="p-0.5 hover:bg-slate-200 rounded text-emerald-600" title="Start on Chart">
            <Play className="w-3 h-3 fill-emerald-600" />
          </button>

          <div className="h-3.5 w-[1px] bg-slate-300 mx-0.5 hidden sm:block" />

          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-blue-600 px-1 py-0.5 rounded hover:bg-slate-200">
            History
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-emerald-700 px-1 py-0.5 rounded hover:bg-slate-200">
            Realtime
          </span>
        </div>

        {/* Right Welcome link */}
        <div className="text-[10px] text-slate-500 font-mono hidden md:flex items-center gap-1">
          <BookOpen className="w-3 h-3 text-blue-500" />
          <span>MQL5 Reference</span>
        </div>
      </div>

      {/* 4. Document Tabs Bar */}
      <div className="bg-[#E4E7EB] border-b border-slate-300 flex items-center overflow-x-auto whitespace-nowrap scrollbar-none px-1 pt-1 gap-0.5 text-[10px]">
        {tabs.map((tab, idx) => {
          const isActive = activeTab === idx;
          return (
            <div
              key={tab}
              onClick={() => setActiveTab(idx)}
              className={`px-2 py-1 rounded-t-sm border-t border-l border-r cursor-pointer flex items-center gap-1.5 transition-colors ${
                isActive 
                  ? 'bg-white border-slate-300 text-slate-900 font-bold shadow-xs' 
                  : 'bg-[#E5E9EE] hover:bg-[#EDF0F3] border-transparent text-slate-600 font-normal'
              }`}
            >
              <span className="truncate max-w-[140px] sm:max-w-[180px]">{tab}</span>
              <button 
                onClick={(e) => { e.stopPropagation(); }}
                className="hover:text-red-500 p-0.2 rounded-full hover:bg-slate-200"
              >
                <X className="w-2.5 h-2.5 text-slate-400 hover:text-slate-700" />
              </button>
            </div>
          );
        })}
      </div>

      {/* 5. Main Code Editor Workspace Area */}
      <div className="bg-white p-2.5 font-mono text-[10px] sm:text-[11px] leading-snug overflow-x-auto border-b border-slate-300 text-slate-900">
        <div className="flex font-mono min-w-[340px]">
          {/* Gutter Line Numbers */}
          <div className="select-none text-slate-400 text-right pr-3 border-r border-slate-200 w-7 shrink-0 space-y-[2px]">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* Actual Code Lines with authentic MQL5 syntax coloring */}
          <div className="pl-3 space-y-[2px] whitespace-pre text-left font-mono">
            {/* Lines 1-6 Comments */}
            <div className="text-[#008000] font-normal">//+------------------------------------------------------------------+</div>
            <div className="text-[#008000] font-normal">//|                   INSTITUTIONAL Adaptive Liquidity Pro 13.mq5 |</div>
            <div className="text-[#008000] font-normal">//|                                Copyright 2024, Developed by M. Dinga |</div>
            <div className="text-[#008000] font-normal">//|                                    https://www.fxstrategytobot.co.za |</div>
            <div className="text-[#008000] font-normal">//|       WEEKLY SQUEEZE MEAN-REVERSION + PROFIT RECYCLING + GUI    |</div>
            <div className="text-[#008000] font-normal">//+------------------------------------------------------------------+</div>
            
            {/* Lines 7-10 Properties */}
            <div>
              <span className="text-[#0000FF] font-semibold">#property</span> <span className="text-slate-700">copyright</span> <span className="text-[#A31515]">"Copyright 2024, Developed by M. Dinga"</span>
            </div>
            <div>
              <span className="text-[#0000FF] font-semibold">#property</span> <span className="text-slate-700">link</span>      <span className="text-[#A31515]">"https://www.fxstrategytobot.co.za"</span>
            </div>
            <div>
              <span className="text-[#0000FF] font-semibold">#property</span> <span className="text-slate-700">version</span>   <span className="text-[#A31515]">"13.00"</span>
            </div>
            <div>
              <span className="text-[#0000FF] font-semibold">#property</span> <span className="text-slate-700">description</span> <span className="text-[#A31515]">"ADAPTIVE LIQUIDITY PRO EA V13 - Weekly Squeeze Reversal"</span>
            </div>
            
            {/* Line 11 Empty */}
            <div>&nbsp;</div>

            {/* Lines 12-16 Includes */}
            <div>
              <span className="text-[#0000FF] font-semibold">#include</span> <span className="text-[#0451A5]">&lt;Trade\Trade.mqh&gt;</span>
            </div>
            <div>
              <span className="text-[#0000FF] font-semibold">#include</span> <span className="text-[#0451A5]">&lt;Trade\PositionInfo.mqh&gt;</span>
            </div>
            <div>
              <span className="text-[#0000FF] font-semibold">#include</span> <span className="text-[#0451A5]">&lt;Trade\SymbolInfo.mqh&gt;</span>
            </div>
            <div>
              <span className="text-[#0000FF] font-semibold">#include</span> <span className="text-[#0451A5]">&lt;Trade\OrderInfo.mqh&gt;</span>
            </div>
            <div>
              <span className="text-[#0000FF] font-semibold">#include</span> <span className="text-[#0451A5]">&lt;Arrays\ArrayLong.mqh&gt;</span>
            </div>

            {/* Line 17 Empty */}
            <div>&nbsp;</div>

            {/* Line 18 Object instantiation */}
            <div>
              <span className="text-[#0000FF] font-semibold">CTrade</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-900 font-medium">Trade;</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Bottom Toolbox Pane (Compilation Logs & Verification) */}
      <div className="bg-[#F8F9FA]">
        {/* Toolbox Table Header */}
        <div className="bg-[#E9ECEF] border-b border-slate-300 px-2 py-0.5 flex items-center justify-between text-[9px] sm:text-[10px] text-slate-600 font-semibold">
          <div className="flex items-center gap-4">
            <span className="text-slate-400">✕</span>
            <span>Description</span>
          </div>
          <div className="flex items-center gap-6 pr-2 text-slate-500 font-normal">
            <span className="hidden sm:inline">File</span>
            <span>Line</span>
            <span>Column</span>
          </div>
        </div>

        {/* Toolbox Items List */}
        <div className="p-1.5 font-mono text-[9px] sm:text-[10px] space-y-0.5 text-slate-600">
          <div className="flex items-center gap-1.5 text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
            <span>OrderInfo.mqh</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
            <span>PositionInfo.mqh</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
            <span>code generated</span>
          </div>
          
          {/* Successful Compilation Line */}
          <div className="flex items-center gap-1.5 text-emerald-800 font-bold bg-emerald-50/80 px-1 py-0.5 rounded border border-emerald-200/80">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
            <span className="text-emerald-900">0 errors, 0 warnings, 4018 msec elapsed, cpu='X64 Regular'</span>
          </div>
        </div>

        {/* 7. Bottom Toolbox Tabs Bar */}
        <div className="bg-[#E4E7EB] border-t border-slate-300 px-2 py-0.5 flex items-center justify-between text-[9px] text-slate-600 font-sans">
          <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap scrollbar-none">
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-300 pr-2">
              Toolbox
            </span>
            <button 
              onClick={() => setActiveToolboxTab('Errors')}
              className={`cursor-pointer ${activeToolboxTab === 'Errors' ? 'font-bold text-slate-900 border-b-2 border-blue-600' : 'text-slate-600'}`}
            >
              Errors
            </button>
            <button 
              onClick={() => setActiveToolboxTab('Search')}
              className={`cursor-pointer ${activeToolboxTab === 'Search' ? 'font-bold text-slate-900 border-b-2 border-blue-600' : 'text-slate-600'}`}
            >
              Search
            </button>
            <button 
              onClick={() => setActiveToolboxTab('Articles')}
              className="hover:text-slate-900 cursor-pointer hidden sm:inline"
            >
              Articles <span className="text-[8px] bg-slate-300 px-1 rounded-full text-slate-700">4</span>
            </button>
            <button 
              onClick={() => setActiveToolboxTab('CodeBase')}
              className="hover:text-slate-900 cursor-pointer hidden sm:inline"
            >
              Code Base
            </button>
            <button 
              onClick={() => setActiveToolboxTab('Journal')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Journal
            </button>
          </div>

          <div className="text-[8px] font-mono text-emerald-700 font-semibold shrink-0">
            BUILD VERIFIED
          </div>
        </div>
      </div>
    </div>
  );
}
