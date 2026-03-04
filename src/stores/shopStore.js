import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../services/supabase'

export const useShopStore = defineStore('shop', () => {
    const shopName = ref('Cargando...')
    const shopDescription = ref('')
    const logoUrl = ref(null)
    const bgUrl = ref(null)
    const whatsappNumber = ref('573000000000')
    const loading = ref(false)

    async function fetchSettings() {
        loading.value = true
        try {
            const { data, error } = await supabase
                .from('shop_settings')
                .select('*')
                .single()

            if (!error && data) {
                shopName.value = data.shop_name
                shopDescription.value = data.description || ''
                logoUrl.value = data.logo_url
                bgUrl.value = data.bg_url
                whatsappNumber.value = data.whatsapp_number || '573000000000'
            } else if (error && error.code === 'PGRST116') {
                console.warn('No settings found. Using defaults.')
                shopName.value = 'Nueva Barbería'
                shopDescription.value = 'Tu descripción aquí.'
            } else {
                console.error('Fetch settings error:', error.message)
                shopName.value = 'NeuroStyle Barber'
                shopDescription.value = 'Elite Barbering & Neural Tech'
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
                .upsert({ id: '00000000-0000-0000-0000-000000000001', ...updates })

            if (error) throw error

            if (updates.shop_name) shopName.value = updates.shop_name
            if (updates.description !== undefined) shopDescription.value = updates.description
            if (updates.logo_url) logoUrl.value = updates.logo_url
            if (updates.bg_url) bgUrl.value = updates.bg_url
            if (updates.whatsapp_number) whatsappNumber.value = updates.whatsapp_number

            return { success: true }
        } catch (err) {
            console.error('Update settings error:', err.message)
            return { success: false, error: err.message }
        }
    }

    return {
        shopName,
        shopDescription,
        logoUrl,
        bgUrl,
        whatsappNumber,
        loading,
        fetchSettings,
        updateSettings
    }
})
