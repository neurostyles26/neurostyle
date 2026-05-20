-- ==========================================================
-- NEUROSTYLE IA - ENTERPRISE MULTI-TENANT COMPLETE SCHEMA
-- ==========================================================

-- 1. LIMPIEZA Y EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. DEFINICIÓN DE TIPOS (ENUMS)
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('super_admin', 'owner', 'barber', 'receptionist', 'customer');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE public.subscription_tier AS ENUM ('free', 'basic', 'premium', 'enterprise');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE public.appointment_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'no_show');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 3. ESTRUCTURA DE TABLAS CORE
-- Tabla de Tenants (Barberías)
CREATE TABLE IF NOT EXISTS public.tenants (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    slug text UNIQUE NOT NULL, 
    branding jsonb DEFAULT '{
        "primary_color": "#DAA520",
        "secondary_color": "#050505",
        "logo_url": null,
        "font_family": "Outfit"
    }'::jsonb,
    subscription_tier subscription_tier DEFAULT 'free',
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Tabla de Perfiles (Extensión de auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    tenant_id uuid REFERENCES public.tenants(id) ON DELETE SET NULL,
    role user_role DEFAULT 'customer',
    full_name text,
    avatar_url text,
    phone text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Catálogo de Estilos
CREATE TABLE IF NOT EXISTS public.catalog (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    gender text CHECK (gender IN ('Caballero', 'Dama')),
    face_shapes text[] DEFAULT '{}',
    description text,
    maintenance_level text,
    match_score integer DEFAULT 95,
    overlay_image_url text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- Sistema de Citas (Tenant-Aware)
CREATE TABLE IF NOT EXISTS public.appointments (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    client_id uuid REFERENCES public.profiles(id),
    client_name text, -- Para citas rápidas sin perfil
    barber_id uuid REFERENCES public.profiles(id),
    scheduled_at timestamptz NOT NULL,
    service text DEFAULT 'Corte General',
    status appointment_status DEFAULT 'pending',
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now()
);

-- Tabla de Productos (Tenant-Aware)
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    description text,
    price decimal(10,2),
    image_url text,
    category text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- Registro de IA (Inference Tracking)
CREATE TABLE IF NOT EXISTS public.ai_renders (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES public.profiles(id),
    style_id uuid REFERENCES public.catalog(id),
    provider text DEFAULT 'huggingface',
    cost numeric(10, 4) DEFAULT 0.0,
    result_url text,
    created_at timestamptz DEFAULT now()
);

-- 4. LÓGICA DE AUTOMATIZACIÓN (FUNCTIONS & TRIGGERS)
-- Función para sincronizar perfiles al crear usuario en Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    default_tenant_id uuid;
BEGIN
  -- Buscamos el ID de la barbería principal por defecto (neurostyle-main)
  SELECT id INTO default_tenant_id FROM public.tenants WHERE slug = 'neurostyle-main' LIMIT 1;

  INSERT INTO public.profiles (id, full_name, avatar_url, tenant_id, role)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    default_tenant_id,
    COALESCE((new.raw_user_meta_data->>'role')::public.user_role, 'customer')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para ejecutar la función anterior
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Función para extraer Tenant ID del JWT (Utilizado en RLS)
CREATE OR REPLACE FUNCTION public.get_tenant_id()
RETURNS uuid AS $$
    SELECT (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid;
$$ LANGUAGE sql STABLE;

-- 5. SEGURIDAD RLS (ROW LEVEL SECURITY)
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_renders ENABLE ROW LEVEL SECURITY;

-- Políticas de Aislamiento Genéricas
CREATE POLICY "Tenant Isolation Catalog" ON public.catalog FOR ALL TO authenticated USING (tenant_id = public.get_tenant_id());
CREATE POLICY "Tenant Isolation Profiles" ON public.profiles FOR ALL TO authenticated USING (tenant_id = public.get_tenant_id());
CREATE POLICY "Tenant Isolation Appointments" ON public.appointments FOR ALL TO authenticated USING (tenant_id = public.get_tenant_id());
CREATE POLICY "Tenant Isolation Products" ON public.products FOR ALL TO authenticated USING (tenant_id = public.get_tenant_id());
CREATE POLICY "Tenant Isolation AI Renders" ON public.ai_renders FOR ALL TO authenticated USING (tenant_id = public.get_tenant_id());

-- Permisos Públicos (Lectura de catálogo y productos por barbería)
CREATE POLICY "Allow public read catalog" ON public.catalog FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public insert appointments" ON public.appointments FOR INSERT WITH CHECK (true);

-- 6. ENABLE SUPABASE REALTIME
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE 
    public.appointments, 
    public.products, 
    public.catalog;
COMMIT;

-- 7. STORAGE CONFIGURATION
INSERT INTO storage.buckets (id, name, public) 
VALUES ('branding', 'branding', true), ('products', 'products', true), ('hairstyles', 'hairstyles', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
DROP POLICY IF EXISTS "Public Access Branding" ON storage.objects;
CREATE POLICY "Public Access Branding" ON storage.objects FOR SELECT USING (bucket_id = 'branding');
DROP POLICY IF EXISTS "Public Access Products" ON storage.objects;
CREATE POLICY "Public Access Products" ON storage.objects FOR SELECT USING (bucket_id = 'products');
DROP POLICY IF EXISTS "Public Access Hairstyles" ON storage.objects;
CREATE POLICY "Public Access Hairstyles" ON storage.objects FOR SELECT USING (bucket_id = 'hairstyles');
DROP POLICY IF EXISTS "Public Upload Hairstyles" ON storage.objects;
CREATE POLICY "Public Upload Hairstyles" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'hairstyles');

-- 8. SEED DATA (INSTALACIÓN INICIAL)
-- Crear Barbería Maestra
INSERT INTO public.tenants (name, slug, subscription_tier)
VALUES ('NeuroStyle Studio', 'neurostyle-main', 'premium')
ON CONFLICT (slug) DO NOTHING;

-- Poblar Catálogo Inicial
DO $$
DECLARE
    main_tenant_id uuid;
BEGIN
    SELECT id INTO main_tenant_id FROM public.tenants WHERE slug = 'neurostyle-main' LIMIT 1;

    -- Solo insertar si el catálogo está vacío
    IF NOT EXISTS (SELECT 1 FROM public.catalog WHERE tenant_id = main_tenant_id) THEN
        -- Caballero
        INSERT INTO public.catalog (tenant_id, name, gender, face_shapes, description, maintenance_level, match_score)
        VALUES 
        (main_tenant_id, 'Textured Crop Fade', 'Caballero', ARRAY['Ovalado', 'Redondo', 'Cuadrado'], 'Flequillo corto texturizado con laterales degradados.', 'Medio', 98),
        (main_tenant_id, 'Modern Mullet', 'Caballero', ARRAY['Diamante', 'Alargado', 'Ovalado'], 'Corto al frente y lados con capas traseras dramáticas.', 'Alto', 95),
        (main_tenant_id, 'Low Taper Fade', 'Caballero', ARRAY['Cuadrado', 'Ovalado', 'Redondo'], 'Degradado sutil concentrado en patillas y nuca.', 'Bajo', 92);

        -- Dama
        INSERT INTO public.catalog (tenant_id, name, gender, face_shapes, description, maintenance_level, match_score)
        VALUES 
        (main_tenant_id, 'Butterfly Cut', 'Dama', ARRAY['Ovalado', 'Redondo', 'Cuadrado'], 'Capas voluminosas que enmarcan el rostro.', 'Alto', 97),
        (main_tenant_id, 'Sharp Bob', 'Dama', ARRAY['Ovalado', 'Corazón', 'Diamante'], 'Corte recto y pulido a la altura de la mandíbula.', 'Medio', 95);
    END IF;
END $$;

