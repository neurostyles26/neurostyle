<template>
  <div class="min-h-screen bg-[#020202] flex flex-col p-6 font-inter relative overflow-hidden">
    <!-- Background Aura -->
    <div class="absolute top-0 right-0 w-full h-[30vh] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

    <!-- Header -->
    <header class="flex items-center justify-between z-10 mb-10">
      <div class="flex items-center">
        <button @click="$router.push('/admin')" class="w-12 h-12 flex items-center justify-center glass-panel rounded-2xl hover:bg-white/10 transition-colors mr-6">
          <LucideChevronLeft class="text-primary" />
        </button>
        <div>
            <h2 class="text-white font-outfit font-bold text-xl tracking-tight uppercase">Configuración de Marca</h2>
            <p class="text-primary text-[8px] font-black uppercase tracking-[0.3em]">Identidad Neural & Branding</p>
        </div>
      </div>
      
      <button 
        @click="saveAll" 
        :disabled="saving"
        class="bg-primary text-black font-black px-10 py-4 rounded-2xl flex items-center hover:scale-[1.05] active:scale-95 transition-all shadow-xl shadow-primary/20 group relative overflow-hidden disabled:opacity-50"
      >
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        <LucideSave v-if="!saving" class="mr-2" :size="20" />
        <div v-else class="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin mr-2"></div>
        <span class="font-outfit uppercase tracking-widest text-sm">Guardar Cambios</span>
      </button>
    </header>

    <main class="flex-1 z-10 max-w-4xl mx-auto w-full pb-20 overflow-y-auto">
      <div class="grid grid-cols-1 gap-10">
        <!-- Identity Section -->
        <section class="glass-panel p-10 rounded-[48px] border-white/5">
            <h3 class="text-white text-2xl font-outfit font-black mb-10 tracking-tight uppercase border-b border-white/5 pb-6">Identidad de la Peluquería</h3>
            
            <div class="space-y-8">
                <div class="space-y-3">
                    <label class="block text-primary text-[9px] font-black uppercase tracking-[0.4em] ml-2">Nombre Comercial</label>
                    <input 
                      v-model="shopName" 
                      type="text" 
                      class="w-full bg-white/[0.03] border border-white/5 rounded-3xl py-6 px-10 text-white focus:outline-none focus:border-primary/50 transition-all font-outfit text-2xl font-black placeholder:text-gray-800" 
                      placeholder="Ej: Golden Masters Barber"
                    >
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <!-- Logo Upload -->
                    <div class="space-y-4">
                        <label class="block text-primary text-[9px] font-black uppercase tracking-[0.4em] ml-2">Logo de la Barbería</label>
                        <div 
                          class="relative aspect-square bg-white/[0.03] border-2 border-dashed border-white/10 rounded-[40px] flex flex-col items-center justify-center transition-all hover:bg-white/5 hover:border-primary/30 overflow-hidden group/upload cursor-pointer"
                          @click="$refs.logoInput.click()"
                        >
                            <img v-if="logoPreview || shopStore.logoUrl" :src="logoPreview || shopStore.logoUrl" class="absolute inset-0 w-full h-full object-contain p-12 transition-all duration-700" :class="{'opacity-40 group-hover/upload:opacity-100': !logoPreview}" />
                            <div v-if="!logoPreview && !shopStore.logoUrl" class="relative z-10 flex flex-col items-center">
                                <LucideImage class="text-primary/40 mb-4" :size="48" />
                                <span class="text-gray-500 font-bold text-[10px] uppercase tracking-widest">Subir Logo</span>
                            </div>
                            <div class="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/upload:opacity-100 transition-opacity">
                                <LucideUpload class="text-primary" :size="32" />
                            </div>
                            <input type="file" ref="logoInput" class="hidden" accept="image/*" @change="e => handleFileChange(e, 'logo')">
                        </div>
                        <p class="text-gray-600 text-[8px] uppercase tracking-widest text-center px-4">Se recomienda fondo transparente (PNG)</p>
                    </div>

                    <!-- BG Upload -->
                    <div class="space-y-4">
                        <label class="block text-primary text-[9px] font-black uppercase tracking-[0.4em] ml-2">Fondo Personalizado</label>
                        <div 
                          class="relative aspect-square bg-white/[0.03] border-2 border-dashed border-white/10 rounded-[40px] flex flex-col items-center justify-center transition-all hover:bg-white/5 hover:border-primary/30 overflow-hidden group/upload cursor-pointer"
                          @click="$refs.bgInput.click()"
                        >
                            <img v-if="bgPreview || shopStore.bgUrl" :src="bgPreview || shopStore.bgUrl" class="absolute inset-0 w-full h-full object-cover transition-all duration-700" :class="{'opacity-30 group-hover/upload:opacity-60': !bgPreview}" />
                            <div v-if="!bgPreview && !shopStore.bgUrl" class="relative z-10 flex flex-col items-center">
                                <LucideImage class="text-primary/40 mb-4" :size="48" />
                                <span class="text-gray-500 font-bold text-[10px] uppercase tracking-widest">Subir Fondo</span>
                            </div>
                            <div class="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/upload:opacity-100 transition-opacity">
                                <LucideUpload class="text-primary" :size="32" />
                            </div>
                            <input type="file" ref="bgInput" class="hidden" accept="image/*" @change="e => handleFileChange(e, 'bg')">
                        </div>
                        <p class="text-gray-600 text-[8px] uppercase tracking-widest text-center px-4">Texturas oscuras cinematográficas preferidas</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Brand Engine Section -->
        <section class="bg-primary/5 border border-primary/20 rounded-[56px] p-12 lg:p-16 relative overflow-hidden group">
            <div class="absolute -right-32 -top-32 w-96 h-96 bg-primary/10 blur-[150px] rounded-full"></div>
            <div class="flex flex-col lg:flex-row items-center gap-12 relative z-10">
                <div class="w-32 h-32 glass-panel rounded-full flex items-center justify-center p-6 border-white/20">
                    <img :src="logoImg" class="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(218,165,32,0.5)]" />
                </div>
                <div class="flex-1 text-center lg:text-left">
                    <h4 class="text-white text-xl font-outfit font-black mb-4 tracking-tighter uppercase">Powered by NeuroStyle Inteligence</h4>
                    <p class="text-gray-400 text-sm leading-relaxed max-w-xl font-light">
                        Tu barbería ahora opera con el motor de análisis más avanzado del mercado. Al personalizar tu marca, mantendremos la etiqueta <span class="text-primary font-bold">"Powered by NeuroStyle"</span> para garantizar a tus clientes que cuentan con el respaldo de nuestra tecnología neural.
                    </p>
                </div>
            </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { 
  LucideChevronLeft, LucideSave, 
  LucideUpload, LucideImage 
} from 'lucide-vue-next'
import { useShopStore } from '../stores/shopStore'
import { supabase } from '../services/supabase'
import logoImg from '../assets/logo.png'

const shopStore = useShopStore()
const saving = ref(false)
const shopName = ref('')

const logoFile = ref(null)
const logoPreview = ref(null)
const bgFile = ref(null)
const bgPreview = ref(null)

onMounted(async () => {
    await shopStore.fetchSettings()
    shopName.value = shopStore.shopName
})

const handleFileChange = (e, type) => {
    const file = e.target.files[0]
    if (file) {
        if (type === 'logo') {
            logoFile.value = file
            logoPreview.value = URL.createObjectURL(file)
        } else {
            bgFile.value = file
            bgPreview.value = URL.createObjectURL(file)
        }
    }
}

const uploadToStorage = async (file, folder, type) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${type}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    const { error: uploadError } = await supabase.storage
        .from('branding')
        .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data: urlData } = supabase.storage
        .from('branding')
        .getPublicUrl(filePath)

    return urlData.publicUrl
}

const saveAll = async () => {
    saving.value = true
    try {
        let logoUrl = shopStore.logoUrl
        let bgUrl = shopStore.bgUrl

        if (logoFile.value) {
            logoUrl = await uploadToStorage(logoFile.value, 'logos', 'logo')
        }
        if (bgFile.value) {
            bgUrl = await uploadToStorage(bgFile.value, 'backgrounds', 'bg')
        }

        const res = await shopStore.updateSettings({
            shop_name: shopName.value,
            logo_url: logoUrl,
            bg_url: bgUrl
        })

        if (!res.success) throw new Error(res.error)
        
        alert('Configuración guardada correctamente.')
        logoFile.value = null
        bgFile.value = null
    } catch (err) {
        alert('Error al guardar: ' + err.message)
    } finally {
        saving.value = false
    }
}
</script>
