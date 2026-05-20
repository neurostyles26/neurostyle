-- ==========================================================
-- NEUROSTYLE IA - ENTERPRISE MULTI-TENANT MASTER SCHEMA
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

-- 3. ESTRUCTURA DE TABLAS CORE (MONETIZACIÓN Y TENANTS)

-- Tabla de Planes (SaaS Monetization)
CREATE TABLE IF NOT EXISTS public.plans (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL UNIQUE,
    monthly_price numeric(10,2) NOT NULL,
    ai_credits_limit integer NOT NULL, -- Cuántos renders al mes
    features jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now()
);

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

-- MIGRACIÓN: Asegurar columnas de monetización si la tabla ya existía
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS plan_id uuid REFERENCES public.plans(id);
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS ai_credits_used integer DEFAULT 0;

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

-- Sistema de Citas
CREATE TABLE IF NOT EXISTS public.appointments (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    client_id uuid REFERENCES public.profiles(id),
    client_name text,
    barber_id uuid REFERENCES public.profiles(id),
    scheduled_at timestamptz NOT NULL,
    service text DEFAULT 'Corte General',
    status appointment_status DEFAULT 'pending',
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now()
);

-- Tabla de Productos
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    description text,
    price decimal(10,2),
    image_url text,
    category text,
    stock integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- Auditoría de IA
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

-- Gestión de Activos Temporales (Privacidad/TTL)
CREATE TABLE IF NOT EXISTS public.temporary_assets (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE,
    storage_path text NOT NULL,
    expires_at timestamptz NOT NULL,
    asset_type text, -- 'raw_photo', 'mask'
    created_at timestamptz DEFAULT now()
);

-- Matriz de Analytics (Business Intelligence)
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE,
    event_type text NOT NULL, -- 'scan_completed', 'style_selected', 'appointment_booked'
    style_id uuid REFERENCES public.catalog(id),
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now()
);

-- 4. LÓGICA DE AUTOMATIZACIÓN (FUNCTIONS & TRIGGERS)

-- Sincronización Auth -> Profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    default_tenant_id uuid;
BEGIN
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Resolver Tenant ID del JWT
CREATE OR REPLACE FUNCTION public.get_tenant_id()
RETURNS uuid AS $$ SELECT (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid; $$ LANGUAGE sql STABLE;

-- Función para incrementar créditos de IA (Audit Log)
CREATE OR REPLACE FUNCTION public.increment_ai_credits(tenant_uuid uuid)
RETURNS void AS $$
BEGIN
    UPDATE public.tenants
    SET ai_credits_used = COALESCE(ai_credits_used, 0) + 1
    WHERE id = tenant_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. SEGURIDAD RLS (ROW LEVEL SECURITY - RBAC REFINADO)
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_renders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.temporary_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Limpieza de políticas previas para evitar errores de duplicación
DROP POLICY IF EXISTS "Tenant Data Isolation" ON public.profiles;
DROP POLICY IF EXISTS "Tenant Data Isolation" ON public.appointments;
DROP POLICY IF EXISTS "Tenant Data Isolation" ON public.ai_renders;
DROP POLICY IF EXISTS "Tenant Data Isolation" ON public.analytics_events;
DROP POLICY IF EXISTS "Customers view active styles" ON public.catalog;
DROP POLICY IF EXISTS "Staff manage catalog" ON public.catalog;
DROP POLICY IF EXISTS "Customers view active products" ON public.products;
DROP POLICY IF EXISTS "Staff manage products" ON public.products;

-- Políticas de Aislamiento por Tenant (Global)
CREATE POLICY "Tenant Data Isolation" ON public.profiles FOR ALL TO authenticated USING (tenant_id = public.get_tenant_id());
CREATE POLICY "Tenant Data Isolation" ON public.appointments FOR ALL TO authenticated USING (tenant_id = public.get_tenant_id());
CREATE POLICY "Tenant Data Isolation" ON public.ai_renders FOR ALL TO authenticated USING (tenant_id = public.get_tenant_id());
CREATE POLICY "Tenant Data Isolation" ON public.analytics_events FOR ALL TO authenticated USING (tenant_id = public.get_tenant_id());

-- Políticas de Catálogo con RBAC (Clientes solo ven, Staff gestiona)
CREATE POLICY "Customers view active styles" ON public.catalog FOR SELECT USING (is_active = true);
CREATE POLICY "Staff manage catalog" ON public.catalog FOR ALL TO authenticated 
USING (
    tenant_id = public.get_tenant_id() AND 
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('owner', 'barber', 'super_admin')
);

-- Políticas de Productos con RBAC
CREATE POLICY "Customers view active products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Staff manage products" ON public.products FOR ALL TO authenticated 
USING (
    tenant_id = public.get_tenant_id() AND 
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('owner', 'super_admin')
);

-- 6. REALTIME & STORAGE
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE public.appointments, public.products, public.catalog;
COMMIT;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('branding', 'branding', true), ('products', 'products', true), ('hairstyles', 'hairstyles', true)
ON CONFLICT (id) DO NOTHING;

-- 7. SEED DATA (ENTORNO SaaS LISTO)

-- Planes Iniciales
INSERT INTO public.plans (name, monthly_price, ai_credits_limit, features)
VALUES 
('Basic', 29.99, 100, '{"analytics": false, "white_label": false}'),
('Premium', 59.99, 500, '{"analytics": true, "white_label": true}'),
('Enterprise', 199.99, 5000, '{"analytics": true, "white_label": true, "custom_domain": true}')
ON CONFLICT (name) DO NOTHING;

-- Barbería Principal
INSERT INTO public.tenants (name, slug, subscription_tier, plan_id)
VALUES ('NeuroStyle Studio', 'neurostyle-main', 'premium', (SELECT id FROM public.plans WHERE name = 'Premium' LIMIT 1))
ON CONFLICT (slug) DO NOTHING;

-- Catálogo Maestro
DO $$
DECLARE
    main_tenant_id uuid;
BEGIN
    SELECT id INTO main_tenant_id FROM public.tenants WHERE slug = 'neurostyle-main' LIMIT 1;
    IF NOT EXISTS (SELECT 1 FROM public.catalog WHERE tenant_id = main_tenant_id) THEN
        INSERT INTO public.catalog (tenant_id, name, gender, face_shapes, description, maintenance_level, match_score) VALUES 
        (main_tenant_id, 'Textured Crop Fade', 'Caballero', ARRAY['Ovalado', 'Redondo', 'Cuadrado'], 'Flequillo corto texturizado con laterales degradados.', 'Medio', 98),
        (main_tenant_id, 'Modern Mullet', 'Caballero', ARRAY['Diamante', 'Alargado', 'Ovalado'], 'Corto al frente y lados con capas traseras dramáticas.', 'Alto', 95),
        (main_tenant_id, 'Low Taper Fade', 'Caballero', ARRAY['Cuadrado', 'Ovalado', 'Redondo'], 'Degradado sutil concentrado en patillas y nuca.', 'Bajo', 92),
        (main_tenant_id, 'Butterfly Cut', 'Dama', ARRAY['Ovalado', 'Redondo', 'Cuadrado'], 'Capas voluminosas que enmarcan el rostro.', 'Alto', 97),
        (main_tenant_id, 'Sharp Bob', 'Dama', ARRAY['Ovalado', 'Corazón', 'Diamante'], 'Corte recto y pulido a la altura de la mandíbula.', 'Medio', 95);
    END IF;
END $$;

