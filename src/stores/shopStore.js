import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase, resolveTenantId, getTenantBranding } from '../services/supabase'

export const useShopStore = defineStore('shop', () => {
    const tenantId = ref(null)
    const shopName = ref('Cargando...')
    const shopDescription = ref('')
    const logoUrl = ref(null)
    const bgUrl = ref(null)
    const whatsappNumber = ref('573000000000')
    const colors = ref({
        primary: '#DAA520',
        secondary: '#050505'
    })
    const loading = ref(false)

    async function initializeTenant() {
        loading.value = true
        try {
            // 1. Resolver el Tenant ID (por Auth o Subdominio)
            const id = await resolveTenantId()
            tenantId.value = id

            if (id) {
                // 2. Cargar Branding del Tenant
                const brandingData = await getTenantBranding(id)
                if (brandingData) {
                    shopName.value = brandingData.name
                    const b = brandingData.branding || {}
                    logoUrl.value = b.logo_url
                    colors.value.primary = b.primary_color || '#DAA520'
                    colors.value.secondary = b.secondary_color || '#050505'
                    
                    // Inyectar variables CSS para Tailwind 4
                    document.documentElement.style.setProperty('--color-primary', colors.value.primary)
                }
            } else {
                shopName.value = 'NeuroStyle Barber'
            }
        } catch (err) {
            console.error('Error inicializando Tenant:', err)
            shopName.value = 'NeuroStyle Barber'
        } finally {
            loading.value = false
        }
    }

    // Mantener para compatibilidad con el panel de administración
    async function fetchSettings() {
        await initializeTenant()
    }

    async function updateSettings(updates) {
        if (!tenantId.value) return { success: false, error: 'No tenant identified' }
        try {
            const { error } = await supabase
                .from('tenants')
                .update({ 
                    name: updates.shop_name,
                    branding: {
                        primary_color: updates.primary_color || colors.value.primary,
                        logo_url: updates.logo_url || logoUrl.value
                    }
                })
                .eq('id', tenantId.value)

            if (error) throw error
            await initializeTenant() // Recargar
            return { success: true }
        } catch (err) {
            console.error('Update settings error:', err.message)
            return { success: false, error: err.message }
        }
    }

    return {
        tenantId,
        shopName,
        shopDescription,
        logoUrl,
        bgUrl,
        whatsappNumber,
        colors,
        loading,
        initializeTenant,
        fetchSettings,
        updateSettings
    }
})
