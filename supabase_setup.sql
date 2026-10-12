-- ============================================================================
-- Andhra Avakaya — Supabase Inventory Schema & Initial Seed
-- ============================================================================
-- Run this script in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ============================================================================

-- 1. Create the inventory table
CREATE TABLE IF NOT EXISTS public.inventory (
  id TEXT PRIMARY KEY,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  note TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Add table comments
COMMENT ON TABLE public.inventory IS 'Stores real-time stock availability and optional notes for all Andhra Avakaya products';

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- 4. Create policy: Allow public anonymous read access (for customers loading the website)
DROP POLICY IF EXISTS "Allow public read access" ON public.inventory;
CREATE POLICY "Allow public read access"
  ON public.inventory
  FOR SELECT
  TO public
  USING (true);

-- 5. Create policy: Allow service_role full access (used by serverless API endpoints)
DROP POLICY IF EXISTS "Allow service role full access" ON public.inventory;
CREATE POLICY "Allow service role full access"
  ON public.inventory
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 6. Seed all 20 official Andhra Avakaya products
INSERT INTO public.inventory (id, in_stock, note, updated_at)
VALUES
  -- -------------------------------------------------------------
  -- Vegetarian Pickles (9 products)
  -- -------------------------------------------------------------
  ('avakaya-pickle', true, '', now()),
  ('menthi-avakaya-pickle', true, '', now()),
  ('maagaya-pickle', true, '', now()),
  ('usirikaya-pickle', true, '', now()),
  ('allam-pachadi', true, '', now()),
  ('gongura-pachadi', true, '', now()),
  ('tomato-pachadi', true, '', now()),
  ('nalleru-kada-pachadi', true, '', now()),
  ('cauliflower-pachadi', true, '', now()),

  -- -------------------------------------------------------------
  -- Non-Vegetarian Pickles (11 products)
  -- -------------------------------------------------------------
  ('chicken-pickle', true, '', now()),
  ('prawns-pickle', true, '', now()),
  ('mutton-pickle', true, '', now()),
  ('fish-pickle', true, '', now()),
  ('gongura-chicken-bone-pickle', true, '', now()),
  ('gongura-chicken-boneless-pickle', true, '', now()),
  ('gongura-prawns-pickle', true, '', now()),
  ('gongura-mutton-pickle', true, '', now()),
  ('gongura-mutton-boneless-pickle', true, '', now()),
  ('country-chicken-pickle', true, '', now()),
  ('crab-pickle', true, '', now())
ON CONFLICT (id) DO NOTHING;

-- 7. Verify all 20 products are present
SELECT id, in_stock, note, updated_at FROM public.inventory ORDER BY id ASC;
