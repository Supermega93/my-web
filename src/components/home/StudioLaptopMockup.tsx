import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Play, 
  ArrowRight, 
  TrendingUp, 
  Activity, 
  ShieldCheck, 
  Cpu, 
  Wifi, 
  ExternalLink,
  CheckCircle2,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { MegAiLogoIcon } from '../common/MegAiLogo.tsx';
import { MetaEditorWindow } from './MetaEditorWindow.tsx';
import { ActiveView } from '../../types.ts';

interface StudioLaptopMockupProps {
  onStartFreeLesson: () => void;
  onNavigate: (view: ActiveView, extraId?: string) => void;
}

export function StudioLaptopMockup({ onStartFreeLesson, onNavigate }: StudioLaptopMockupProps) {
  return (
    <div className="relative w-full max-w-5xl mx-auto select-none">
      {/* 1. Ambient Warm Desk Lamp Glow on Top Right */}
      <div className="absolute -top-16 -right-16 w-80 h-80 sm:w-96 sm:h-96 bg-gradient-to-bl from-emerald-600/10 via-teal-500/10 to-transparent rounded-full blur-[100px] pointer-events-none -z-0" />
      <div className="absolute top-10 right-4 w-48 h-48 bg-emerald-400/10 rounded-full blur-[70px] pointer-events-none -z-0" />

      {/* 2. Soft Emerald Ambient Glow behind laptop */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-72 bg-gradient-to-r from-emerald-600/15 via-teal-500/15 to-emerald-700/10 blur-[120px] pointer-events-none -z-0" />

      {/* 3. Desk Atmosphere Container */}
      <div className="relative pt-6 pb-4">
        
        {/* Desk Accessories: Left Coffee Mug & Potted Plant */}
        <div className="hidden md:flex absolute left-0 bottom-12 items-end gap-3 pointer-events-none z-20">
          {/* Coffee Mug on Saucer */}
          <div className="relative group">
            {/* Steam animation */}
            <div className="absolute -top-6 left-3 w-4 h-6 opacity-40">
              <motion.div 
                animate={{ y: [-2, -10], opacity: [0.6, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
                className="w-1.5 h-4 bg-gradient-to-t from-slate-300 to-transparent rounded-full blur-[1px]"
              />
            </div>
            <div className="w-12 h-10 rounded-b-xl rounded-t-sm bg-gradient-to-b from-slate-200 to-slate-400 border border-slate-300 shadow-[0_12px_24px_rgba(0,0,0,0.8)] relative flex items-center justify-center">
              {/* Mug Handle */}
              <div className="absolute -left-2.5 top-1.5 w-3 h-6 border-2 border-slate-300 rounded-l-full" />
              {/* Coffee Liquid */}
              <div className="w-9 h-2 bg-gradient-to-r from-amber-950 to-stone-900 rounded-full border border-stone-800" />
            </div>
            {/* Saucer */}
            <div className="w-16 h-2 bg-slate-300 rounded-full -mt-0.5 shadow-md border border-slate-400/80" />
          </div>

          {/* Small Minimalist Potted Desk Plant */}
          <div className="relative -mb-1">
            <div className="relative flex justify-center items-end">
              {/* Plant Leaves */}
              <div className="absolute -top-8 flex gap-1 items-end">
                <div className="w-2 h-7 bg-emerald-600 rounded-full -rotate-25 origin-bottom shadow-sm" />
                <div className="w-2.5 h-9 bg-emerald-500 rounded-full -rotate-6 origin-bottom shadow-sm" />
                <div className="w-2 h-8 bg-teal-500 rounded-full rotate-15 origin-bottom shadow-sm" />
                <div className="w-2 h-6 bg-emerald-600 rounded-full rotate-30 origin-bottom shadow-sm" />
              </div>
              {/* Ceramic Pot */}
              <div className="w-9 h-8 bg-gradient-to-b from-slate-100 to-slate-300 rounded-b-lg border border-slate-300 shadow-[0_10px_20px_rgba(0,0,0,0.7)]" />
            </div>
          </div>
        </div>

        {/* Desk Accessories: Right Smartphone, Optical Mouse & Notebook */}
        <div className="hidden md:flex absolute right-0 bottom-10 items-end gap-4 pointer-events-none z-20">
          {/* Smartphone lying flat with live telemetry */}
          <div className="relative w-16 h-28 rounded-xl bg-slate-950 border-2 border-slate-700/80 shadow-[0_15px_30px_rgba(0,0,0,0.9)] p-1 overflow-hidden rotate-6">
            <div className="w-full h-full rounded-lg bg-[#070D18] flex flex-col justify-between p-1.5 border border-cyan-500/30">
              <div className="flex justify-between items-center text-[7px] font-mono text-cyan-400">
                <span>MT5 LIVE</span>
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              {/* Mini glowing graph */}
              <div className="h-10 w-full flex items-end">
                <svg className="w-full h-8" viewBox="0 0 50 30">
                  <path d="M 0 25 Q 15 20, 25 12 T 48 4" fill="none" stroke="#38bdf8" strokeWidth="1.8" />
                </svg>
              </div>
              <div className="text-[7px] font-mono text-emerald-400 font-bold">
                +$1,280.40
              </div>
            </div>
          </div>

          {/* Minimalist Wireless Mouse */}
          <div className="w-9 h-14 rounded-full bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 border border-slate-400 shadow-[0_12px_22px_rgba(0,0,0,0.8)] relative -rotate-6">
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-1 h-3 bg-slate-600 rounded-full" />
          </div>

          {/* Executive Notebook & Metallic Pen */}
          <div className="relative w-14 h-20 rounded bg-slate-900 border border-slate-700 shadow-xl -rotate-12 flex items-center justify-center">
            <div className="text-[6px] font-mono text-slate-500 text-center uppercase tracking-widest">
              QUANT<br/>LOGS
            </div>
            {/* Metallic Pen */}
            <div className="absolute -right-1.5 top-1 w-1 h-18 bg-gradient-to-b from-amber-200 via-slate-300 to-amber-300 rounded-full shadow-md" />
          </div>
        </div>

        {/* 4. THE LAPTOP CHASSIS (Centered, 3D Elevation & Screen Reflection) */}
        <div className="relative mx-auto max-w-4xl px-2 sm:px-4">
          
          {/* Screen Lid Frame */}
          <div className="relative rounded-2xl p-[3px] bg-gradient-to-b from-slate-400/90 via-slate-600/70 to-slate-800/90 shadow-[0_30px_90px_rgba(0,0,0,0.95)]">
            
            {/* Inner Black Screen Bezel */}
            <div className="relative rounded-[13px] bg-[#0A0E17] border border-slate-950 p-2 sm:p-3 overflow-hidden">
              
              {/* Top Camera Dot */}
              <div className="absolute top-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                  <div className="w-0.5 h-0.5 rounded-full bg-blue-500/80" />
                </div>
              </div>

              {/* 5. LAPTOP DISPLAY SOFTWARE (Matching webs.png laptop screen content) */}
              <div className="rounded-lg bg-gradient-to-b from-[#0B0F1C] via-[#090D18] to-[#070A14] border border-slate-800/80 overflow-hidden text-slate-100">
                
                {/* Screen Top Header Bar */}
                <div className="bg-[#0D1322]/90 px-3 sm:px-5 py-2.5 border-b border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Logo in screen */}
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-md bg-gradient-to-b from-slate-900 via-[#0A101D] to-slate-950 border border-slate-700/60 flex items-center justify-center shadow-[0_0_8px_rgba(56,189,248,0.3)]">
                        <MegAiLogoIcon size={14} />
                      </div>
                      <span className="font-extrabold text-xs tracking-tight text-white font-sans">
                        MEG<span className="text-cyan-400">.</span>AI <span className="text-slate-400 font-semibold text-[10px]">LABS</span>
                      </span>
                    </div>

                    {/* Nav tabs inside laptop screen */}
                    <div className="hidden sm:flex items-center gap-2.5 text-[11px] font-medium text-slate-400 ml-4">
                      <span className="text-white font-semibold">Home</span>
                      <span className="hover:text-slate-200 cursor-pointer" onClick={() => onNavigate('academy')}>Free Academy</span>
                      <span className="hover:text-slate-200 cursor-pointer" onClick={() => onNavigate('eas')}>Trading EAs</span>
                      <span className="hover:text-slate-200 cursor-pointer" onClick={() => onNavigate('custom-ea')}>Custom Dev</span>
                    </div>
                  </div>

                  {/* Right Header Status in Screen */}
                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      MT5 VPS: 4.2ms
                    </span>
                    <button 
                      onClick={() => onNavigate('login')}
                      className="px-2.5 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-sans transition-colors cursor-pointer"
                    >
                      Sign In
                    </button>
                  </div>
                </div>

                {/* Screen Main Dashboard Area */}
                <div className="p-3 sm:p-5 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-center">
                  
                  {/* Left Hero Column inside Screen */}
                  <div className="lg:col-span-5 space-y-3.5">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-cyan-300 text-[10px] font-mono uppercase tracking-wider">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>Free Institutional Academy Included</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl lg:text-3.5xl font-black text-white tracking-tight leading-tight">
                      Grow Your Trading <br className="hidden sm:inline" />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300 drop-shadow-[0_0_20px_rgba(56,189,248,0.4)]">
                        Edge Online
                      </span>
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed max-w-md">
                      We deliver verified algorithmic trading systems, plain-English code education, and custom MQL5 robot architecture.
                    </p>

                    {/* Action Buttons in screen */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-1">
                      <button
                        onClick={onStartFreeLesson}
                        className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 text-white font-extrabold text-xs shadow-md shadow-emerald-950/30 hover:shadow-lg hover:shadow-emerald-950/40 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Start Free Lesson</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onNavigate('free-ebook')}
                        className="px-3.5 py-2 sm:py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-xs border border-slate-700/80 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Get free eBook</span>
                      </button>
                    </div>
                  </div>

                  {/* Right MetaEditor Window inside Screen (Matching attached mql5.png) */}
                  <div className="lg:col-span-7">
                    <MetaEditorWindow />
                  </div>
                </div>

                {/* Bottom Trusted Bar inside Screen (Matching webs.png bottom logos) */}
                <div className="bg-[#080C16] px-4 sm:px-6 py-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-[10px] text-slate-400">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400">
                    Trusted by 500+ Traders & Prop Firms
                  </span>

                  <div className="flex items-center gap-4 sm:gap-6 font-mono text-[10px] text-slate-300">
                    <span className="hover:text-white transition-colors">MetaTrader 5</span>
                    <span className="hover:text-white transition-colors">Google Cloud</span>
                    <span className="hover:text-white transition-colors">FTMO</span>
                    <span className="hover:text-white transition-colors hidden sm:inline">FundedNext</span>
                    <span className="hover:text-white transition-colors">MQL5.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Laptop Hinge */}
            <div className="h-2 w-32 mx-auto bg-gradient-to-r from-slate-700 via-slate-500 to-slate-700 rounded-b-md shadow-inner" />
          </div>

          {/* Laptop Base / Keyboard Deck & Trackpad */}
          <div className="relative -mt-1 mx-auto max-w-4xl h-5 sm:h-6 rounded-b-2xl bg-gradient-to-b from-slate-400 via-slate-600 to-slate-800 shadow-[0_20px_40px_rgba(0,0,0,0.9)] border-t border-slate-300/40">
            {/* Center Thumb Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-slate-800 rounded-b-md" />
          </div>

          {/* Desk Surface Reflection Underneath the Laptop */}
          <div className="h-10 w-full max-w-3xl mx-auto bg-gradient-to-b from-blue-500/10 via-slate-900/40 to-transparent blur-md -mt-2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
