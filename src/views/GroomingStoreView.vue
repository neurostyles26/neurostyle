<template>
  <div class="min-h-screen bg-[#020202] flex flex-col p-6 font-inter relative overflow-hidden pb-24">
    <!-- Background Aura -->
    <div class="absolute top-0 right-0 w-full h-[30vh] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

    <!-- Header -->
    <header class="flex items-center justify-between z-10 mb-10">
      <div class="flex items-center">
        <button @click="$router.push('/')" class="w-12 h-12 flex items-center justify-center glass-panel rounded-2xl hover:bg-white/10 transition-colors mr-6">
          <LucideChevronLeft class="text-primary" />
        </button>
        <div>
            <h2 class="text-white font-outfit font-bold text-xl tracking-tight">Grooming <span class="text-primary italic">Elite</span></h2>
            <p class="text-primary text-[8px] font-black uppercase tracking-[0.3em]">Selección de Productos Neurales</p>
        </div>
      </div>
      <div class="w-12 h-12 glass-panel rounded-2xl flex items-center justify-center border-white/20">
          <LucideShoppingBag class="text-primary" :size="20" />
      </div>
    </header>

    <main class="flex-1 z-10">
      <!-- Welcome Section -->
      <div class="mb-12">
        <h1 class="text-white text-4xl font-outfit font-black tracking-tighter leading-none mb-4 uppercase">
            Potencia Tu <br/><span class="text-primary gold-glow">Impacto</span>
        </h1>
        <p class="text-gray-500 text-sm font-light leading-relaxed max-w-xs">
            Productos de alto rendimiento curados por maestros para el hombre visionario.
        </p>
      </div>

      <div v-if="loading" class="flex flex-col items-center justify-center h-64">
        <div class="relative w-16 h-16 mb-6">
            <div class="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
            <div class="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>

      <div v-else-if="products.length === 0" class="text-center py-20">
        <p class="text-gray-600 font-bold uppercase tracking-[0.2em]">Próximamente Colección 2026</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div 
          v-for="product in products" 
          :key="product.id"
          class="group glass-panel rounded-[48px] border-white/5 overflow-hidden transition-all duration-700 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 relative"
        >
          <div class="aspect-[4/5] bg-white/5 relative overflow-hidden">
            <img 
              v-if="product.image_url" 
              :src="product.image_url" 
              class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            >
            <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/5 to-transparent">
                <LucidePackage class="text-white/10" :size="64" />
            </div>

            <!-- Price Tag -->
            <div class="absolute bottom-6 left-6 bg-black/80 backdrop-blur-md px-5 py-2 rounded-2xl border border-white/10 shadow-xl">
                <p class="text-primary font-outfit font-black text-lg leading-none">{{ formatPrice(product.price) }}</p>
            </div>
            
            <!-- Category Tag -->
            <div class="absolute top-6 left-6">
                <span class="bg-primary/20 text-primary text-[10px] font-black uppercase px-4 py-1.5 rounded-full backdrop-blur-md border border-primary/30 tracking-widest shadow-lg">
                    {{ product.category }}
                </span>
            </div>
          </div>

          <div class="p-10">
            <h3 class="text-white font-outfit font-bold text-2xl mb-4 tracking-tight group-hover:text-primary transition-colors">{{ product.name }}</h3>
            <p class="text-gray-500 text-xs mb-8 leading-relaxed line-clamp-2">Optimizado para una fijación duradera y nutrición folicular avanzada.</p>
            
            <button 
              @click="handleWhatsAppOrder(product)"
              class="w-full bg-primary text-black font-black py-5 rounded-3xl flex items-center justify-center space-x-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 relative overflow-hidden"
            >
              <LucideMessageCircle :size="20" />
              <span class="font-outfit uppercase tracking-widest text-sm">PEDIR POR WHATSAPP</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { 
  LucideChevronLeft, LucideShoppingBag, LucidePackage, 
  LucideMessageCircle, LucideArrowRight
} from 'lucide-vue-next'
import { supabase } from '../services/supabase'
import { useShopStore } from '../stores/shopStore'

const shopStore = useShopStore()

const products = ref([])
const loading = ref(true)

const fetchProducts = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    products.value = data || []
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const formatPrice = (p) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(p)
}

const handleWhatsAppOrder = (product) => {
  const phoneNumber = shopStore.whatsappNumber || "573000000000"
  const priceFormatted = formatPrice(product.price)
  
  let message = `¡Hola! 👋 Me interesa adquirir este producto de su catálogo:\n\n`
  message += `*Producto:* ${product.name}\n`
  message += `*Valor:* ${priceFormatted}\n`
  message += `*Categoría:* ${product.category}\n\n`
  
  if (product.image_url) {
    message += `📸 Ver referencia: ${product.image_url}\n\n`
  }
  
  message += `¿Tienen disponibilidad inmediata? Quedo atento, gracias.`
  
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
  window.open(url, '_blank')
}

onMounted(async () => {
  await shopStore.fetchSettings()
  fetchProducts()
})
</script>

<style scoped>
.gold-glow {
  text-shadow: 0 0 20px rgba(218, 165, 32, 0.4);
}
</style>
