import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../services/supabase'

export const useShopStore = defineStore('shop', () => {
    const shopName = ref('Cargando...')
    const logoUrl = ref(null)
    const bgUrl = ref(null)
    const loading = ref(false)

    async function fetchSettings() {
        loading.value = true
        try {
            // Assume there's only one shop record for now
            const { data, error } = await supabase
                .from('shop_settings')
                .select('*')
                .single()

            if (!error && data) {
                shopName.value = data.shop_name
                logoUrl.value = data.logo_url
                bgUrl.value = data.bg_url
            } else if (error && error.code === 'PGRST116') {
                // Table might be there but empty, or RLS issues
                console.warn('No settings found. Using defaults.')
                shopName.value = 'Nueva Barbería'
            } else {
                console.error('Fetch settings error:', error.message)
                shopName.value = 'NeuroStyle Barber'
            }
        } catch (err) {
            console.error('Shop fetch error:', err)
        } finally {
            loading.value = false
        }
    }

    async function updateSettings(updates) {
        try {
            const { error } = await supabase
                .from('shop_settings')
                .upsert({ id: '00000000-0000-0000-0000-000000000001', ...updates }) // Use a fixed ID for the main shop

            if (error) throw error

            if (updates.shop_name) shopName.value = updates.shop_name
            if (updates.logo_url) logoUrl.value = updates.logo_url
            if (updates.bg_url) bgUrl.value = updates.bg_url

            return { success: true }
        } catch (err) {
            console.error('Update settings error:', err.message)
            return { success: false, error: err.message }
        }
    }

    return {
        shopName,
        logoUrl,
        bgUrl,
        loading,
        fetchSettings,
        updateSettings
    }
})
