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
ADD COLUMN IF NOT EXISTS description TEXT DEFAULT 'Elevando el arte de la barbería con precisión neural y estilo maestro.',
ADD COLUMN IF NOT EXISTS whatsapp_number TEXT DEFAULT '573000000000';

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

-- ==========================================
-- 7. Create appointments table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    service TEXT DEFAULT 'Corte General',
    status TEXT DEFAULT 'Pendiente', -- Pendiente, Confirmado, Cancelado, Completado
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Policies for appointments
DROP POLICY IF EXISTS "Allow public insert of appointments" ON public.appointments;
CREATE POLICY "Allow public insert of appointments" ON public.appointments
FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read of own appointments" ON public.appointments;
CREATE POLICY "Allow public read of own appointments" ON public.appointments
FOR SELECT USING (true); -- Simplified for public PWA

DROP POLICY IF EXISTS "Allow admin full access to appointments" ON public.appointments;
CREATE POLICY "Allow admin full access to appointments" ON public.appointments
FOR ALL TO authenticated USING (auth.jwt() ->> 'email' = 'admin@neurostyle.com'); -- Cambia esto por tu email real

-- ==========================================
-- 8. Create products table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    image_url TEXT,
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Policies for products
DROP POLICY IF EXISTS "Allow public read of products" ON public.products;
CREATE POLICY "Allow public read of products" ON public.products
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin full access to products" ON public.products;
CREATE POLICY "Allow admin full access to products" ON public.products
FOR ALL TO authenticated USING (auth.jwt() ->> 'email' = 'admin@neurostyle.com'); -- Cambia esto por tu email real

-- ==========================================
-- 9. ENABLE SUPABASE REALTIME
-- ==========================================
-- Add tables to the 'supabase_realtime' publication
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE public.appointments, public.products;
COMMIT;

-- 10. Storage Buckets (Existing)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('branding', 'branding', true), ('products', 'products', true), ('hairstyles', 'hairstyles', true)
ON CONFLICT (id) DO NOTHING;

-- Policies (Existing)
DROP POLICY IF EXISTS "Public Access Branding" ON storage.objects;
CREATE POLICY "Public Access Branding" ON storage.objects FOR SELECT USING (bucket_id = 'branding');
DROP POLICY IF EXISTS "Public Access Products" ON storage.objects;
CREATE POLICY "Public Access Products" ON storage.objects FOR SELECT USING (bucket_id = 'products');
DROP POLICY IF EXISTS "Public Access Hairstyles" ON storage.objects;
CREATE POLICY "Public Access Hairstyles" ON storage.objects FOR SELECT USING (bucket_id = 'hairstyles');
DROP POLICY IF EXISTS "Public Upload Hairstyles" ON storage.objects;
CREATE POLICY "Public Upload Hairstyles" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'hairstyles');

-- ==========================================
-- FINAL INSTRUCTIONS:
-- 1. Go to Supabase Dashboard -> SQL Editor -> Paste & Run this script.
-- 2. Verify in Database -> Replication -> supabase_realtime that 'appointments' and 'products' are active.
-- ==========================================

