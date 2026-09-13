-- ==============================================================================
-- MEG.AI / SuperMegaFX — Custom EA & Project Intake Supabase Schema
-- Run this in your Supabase SQL Editor to mirror full cloud persistence.
-- ==============================================================================

-- 1. Custom Development Leads Table
CREATE TABLE IF NOT EXISTS public.custom_dev_leads (
  id TEXT PRIMARY KEY DEFAULT ('lead_' || extract(epoch from now())::bigint || '_' || substr(md5(random()::text), 1, 4)),
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  telegram TEXT,
  platform TEXT DEFAULT 'MetaTrader 5 (MQL5)',
  instrument TEXT DEFAULT 'All Forex / Metals',
  timeframe TEXT DEFAULT '15-Minute',
  strategy_idea TEXT NOT NULL,
  generated_prompt TEXT,
  status TEXT DEFAULT 'pending_review',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. EA Projects Table (Full lifecycle specification)
CREATE TABLE IF NOT EXISTS public.ea_projects (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  raw_strategy_input TEXT,
  platform TEXT DEFAULT 'MetaTrader 5 (MQL5)',
  budget_tier TEXT DEFAULT 'Standard',
  status TEXT DEFAULT 'queued',
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  customer_telegram TEXT,
  instrument TEXT,
  timeframe TEXT,
  mql5_code TEXT,
  mql4_code TEXT,
  backtest_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Email Telemetry Logs Table
CREATE TABLE IF NOT EXISTS public.email_logs (
  id TEXT PRIMARY KEY DEFAULT ('eml_' || extract(epoch from now())::bigint || '_' || substr(md5(random()::text), 1, 4)),
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  type TEXT NOT NULL,
  project_id TEXT,
  status TEXT NOT NULL,
  provider TEXT,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.custom_dev_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ea_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- 5. Policies: Allow public anonymous strategy submissions and leads
CREATE POLICY "Allow public insert for custom_dev_leads" 
  ON public.custom_dev_leads FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow read for custom_dev_leads" 
  ON public.custom_dev_leads FOR SELECT 
  TO anon, authenticated 
  USING (true);

CREATE POLICY "Allow public insert for ea_projects" 
  ON public.ea_projects FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow read for ea_projects" 
  ON public.ea_projects FOR SELECT 
  TO anon, authenticated 
  USING (true);

CREATE POLICY "Allow public insert for email_logs" 
  ON public.email_logs FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow read for email_logs" 
  ON public.email_logs FOR SELECT 
  TO anon, authenticated 
  USING (true);
