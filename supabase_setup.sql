-- ==========================================
-- NEUROSTYLE SUPABASE SETUP SCRIPT
-- ==========================================

-- 1. Create shop_settings table
CREATE TABLE IF NOT EXISTS public.shop_settings (
    id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000001'::uuid,
    shop_name TEXT DEFAULT 'NeuroStyle Barber',
    logo_url TEXT,
    bg_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Insert default singleton record
INSERT INTO public.shop_settings (id, shop_name)
VALUES ('00000000-0000-0000-0000-000000000001'::uuid, 'NeuroStyle Barber')
ON CONFLICT (id) DO NOTHING;

-- 3. Enable Row Level Security
ALTER TABLE public.shop_settings ENABLE ROW LEVEL SECURITY;

-- 4. Policies
-- Allow anyone to read settings
DROP POLICY IF EXISTS "Allow public read of shop_settings" ON public.shop_settings;
CREATE POLICY "Allow public read of shop_settings" ON public.shop_settings
FOR SELECT USING (true);

-- Allow authenticated admins to update settings
DROP POLICY IF EXISTS "Allow authenticated update of shop_settings" ON public.shop_settings;
CREATE POLICY "Allow authenticated update of shop_settings" ON public.shop_settings
FOR UPDATE TO authenticated USING (true);

-- 5. Storage Buckets Setup
-- IMPORTANT: Run these in the 'Storage' section of your Supabase Dashboard
-- 1. Create a bucket named 'branding'
-- 2. Set the 'branding' bucket to PUBLIC
-- 3. Create a bucket named 'products'
-- 4. Set the 'products' bucket to PUBLIC
