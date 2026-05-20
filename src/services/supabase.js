import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Faltan variables de entorno de Supabase. Verifica tu archivo .env')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Resuelve el Tenant ID actual basado en el subdominio o un slug por defecto.
 * @returns {Promise<string|null>}
 */
export const resolveTenantId = async () => {
  try {
    // 1. Intentar obtener el tenant del usuario autenticado (vía JWT app_metadata)
    const { data: { session } } = await supabase.auth.getSession()
    const user = session?.user
    
    if (user?.app_metadata?.tenant_id) {
      return user.app_metadata.tenant_id
    }

    // 2. Si no hay usuario o metadata, resolver por el subdominio
    const hostname = window.location.hostname
    const subdomain = hostname.split('.')[0]
    
    // Si estamos en localhost o es el dominio principal, usamos el slug por defecto
    const slug = (subdomain === 'localhost' || subdomain === 'neurostyle' || subdomain === '127') 
      ? 'neurostyle-main' 
      : subdomain

    const { data: tenant, error } = await supabase
      .from('tenants')
      .select('id')
      .eq('slug', slug)
      .single()

    if (error) throw error
    return tenant?.id
  } catch (e) {
    console.error('Error resolviendo el Tenant:', e.message)
    return null
  }
}

/**
 * Obtiene la configuración de branding del Tenant actual.
 */
export const getTenantBranding = async (tenantId) => {
  if (!tenantId) return null
  const { data, error } = await supabase
    .from('tenants')
    .select('branding, name, slug')
    .eq('id', tenantId)
    .single()
  
  if (error) {
    console.error('Error cargando branding:', error)
    return null
  }
  return data
}

export default supabase
