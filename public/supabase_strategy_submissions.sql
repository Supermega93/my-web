-- ==============================================================================
-- SUPABASE MIGRATION: strategy_submissions
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. Create strategy_submissions table
CREATE TABLE IF NOT EXISTS public.strategy_submissions (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    submission_id TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    telegram TEXT,
    platform TEXT NOT NULL DEFAULT 'MT5',
    strategy_title TEXT NOT NULL,
    original_strategy TEXT NOT NULL,
    structured_strategy JSONB,
    clear_strategy TEXT,
    generated_prompt TEXT,
    instrument TEXT,
    timeframe TEXT,
    direction TEXT,
    entry_conditions TEXT,
    exit_conditions TEXT,
    risk_management TEXT,
    trading_conditions TEXT,
    trade_management TEXT,
    additional_rules TEXT,
    missing_information TEXT,
    status TEXT NOT NULL DEFAULT 'submitted',
    email_status TEXT NOT NULL DEFAULT 'pending',
    email_sent_at TIMESTAMPTZ,
    email_error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Indexes for fast query and lookup
CREATE INDEX IF NOT EXISTS idx_strategy_submissions_email ON public.strategy_submissions(email);
CREATE INDEX IF NOT EXISTS idx_strategy_submissions_submission_id ON public.strategy_submissions(submission_id);
CREATE INDEX IF NOT EXISTS idx_strategy_submissions_created_at ON public.strategy_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_strategy_submissions_email_status ON public.strategy_submissions(email_status);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.strategy_submissions ENABLE ROW LEVEL SECURITY;

-- 4. Policies: Allow public anonymous strategy submissions, and administrative reads
DROP POLICY IF EXISTS "Allow anonymous strategy submissions" ON public.strategy_submissions;
CREATE POLICY "Allow anonymous strategy submissions" 
ON public.strategy_submissions 
FOR INSERT 
TO public, anon, authenticated 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow users and admins to view submissions" ON public.strategy_submissions;
CREATE POLICY "Allow users and admins to view submissions" 
ON public.strategy_submissions 
FOR SELECT 
TO public, anon, authenticated 
USING (true);

DROP POLICY IF EXISTS "Allow updates to strategy submissions" ON public.strategy_submissions;
CREATE POLICY "Allow updates to strategy submissions" 
ON public.strategy_submissions 
FOR UPDATE 
TO public, anon, authenticated 
USING (true)
WITH CHECK (true);

-- Also ensure custom_dev_leads and email_logs exist for compatibility
CREATE TABLE IF NOT EXISTS public.custom_dev_leads (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT,
    phone TEXT,
    telegram TEXT,
    platform TEXT NOT NULL DEFAULT 'MetaTrader 5 (MQL5)',
    instrument TEXT DEFAULT 'All Forex / Metals',
    timeframe TEXT DEFAULT '15-Minute',
    strategy_idea TEXT NOT NULL,
    generated_prompt TEXT,
    status TEXT NOT NULL DEFAULT 'pending_review',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.custom_dev_leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public lead insert" ON public.custom_dev_leads;
CREATE POLICY "Allow public lead insert" ON public.custom_dev_leads FOR INSERT TO public, anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public lead select" ON public.custom_dev_leads FOR SELECT TO public, anon, authenticated USING (true);
