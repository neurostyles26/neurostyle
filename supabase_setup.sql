-- ==========================================
-- NEUROSTYLE SUPABASE SETUP SCRIPT
-- ==========================================

-- 1. Create shop_settings table
CREATE TABLE IF NOT EXISTS public.shop_settings (
    id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000001'::uuid,
    shop_name TEXT DEFAULT 'NeuroStyle Barber',
    description TEXT DEFAULT 'Elevando el arte de la barbería con precisión neural y estilo maestro.',
    logo_url TEXT,
    bg_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.1 Add description column if it doesn't exist (Migration)
ALTER TABLE public.shop_settings 
ADD COLUMN IF NOT EXISTS description TEXT DEFAULT 'Elevando el arte de la barbería con precisión neural y estilo maestro.';

-- 2. Insert default singleton record
INSERT INTO public.shop_settings (id, shop_name, description)
VALUES ('00000000-0000-0000-0000-000000000001'::uuid, 'NeuroStyle Barber', 'Elevando el arte de la barbería con precisión neural y estilo maestro.')
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

-- 5. Storage Buckets Initialization (SQL Alternative)
-- If your workspace allows it, you can run this to create the buckets:
INSERT INTO storage.buckets (id, name, public) 
VALUES ('branding', 'branding', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Storage Policies (Allow anyone to upload if authenticated)
-- Policy for 'branding'
CREATE POLICY "Public Access Branding" ON storage.objects FOR SELECT USING (bucket_id = 'branding');
CREATE POLICY "Admin Upload Branding" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'branding');

-- Policy for 'products'
CREATE POLICY "Public Access Products" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Admin Upload Products" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'products');


-- ==========================================
-- FINAL INSTRUCTIONS:
-- 1. Go to Supabase Dashboard -> SQL Editor -> Paste & Run this script.
-- 2. If the buckets are still not visible, go to "Storage" in the left sidebar 
--    and manually create 'branding' and 'products' as PUBLIC buckets.
-- ==========================================
