<template>
  <div class="min-h-screen bg-[#020202] flex flex-col p-6 font-inter relative overflow-hidden">
    <!-- Background Aura -->
    <div class="absolute top-0 left-0 w-full h-[40vh] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

    <!-- Header -->
    <header class="flex items-center justify-between mb-10 z-10">
      <router-link to="/dashboard" class="w-12 h-12 flex items-center justify-center glass-panel rounded-2xl hover:bg-white/10 transition-colors">
        <LucideChevronLeft class="text-primary" />
      </router-link>
      <div class="text-center">
          <h2 class="text-white font-outfit font-bold text-xl tracking-tight">Tu Perfil Estético</h2>
          <p class="text-primary text-[8px] font-black uppercase tracking-[0.3em]">Recomendaciones IA</p>
      </div>
      <div class="w-12"></div>
    </header>

    <main class="flex-1 z-10 overflow-y-auto pr-1">
      <!-- Analysis Summary Card -->
      <div class="glass-panel p-6 md:p-8 rounded-3xl mb-10 relative group overflow-hidden border-primary/20">
        <div class="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 blur-3xl rounded-full group-hover:bg-primary/20 transition-all duration-700"></div>
        
        <div class="flex items-center space-x-6 relative z-10 text-left">
          <div class="w-24 h-24 rounded-[32px] overflow-hidden border border-primary/30 relative bg-black/40">
              <img v-if="scanStore.capturedImage" :src="scanStore.capturedImage" class="w-full h-full object-cover opacity-80" />
              <LucideScanFace v-else class="text-primary absolute inset-0 m-auto" :size="40" />
              <div class="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black animate-pulse"></div>
          </div>
          <div>
            <p class="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-2 font-outfit">Resultado Biométrico</p>
            <h3 class="text-white text-3xl font-outfit font-black tracking-tight uppercase">Rostro <span class="text-primary gold-glow">{{ faceShape }}</span></h3>
            <div class="flex items-center space-x-3 mt-1 mb-2">
                <span class="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-lg font-black tracking-widest">CONF: {{ (confidence * 100).toFixed(0) }}%</span>
                <span class="text-[10px] bg-white/5 text-gray-400 px-2 py-0.5 rounded-lg font-black tracking-widest">R_IDX: {{ ratio }}</span>
            </div>
            <p class="text-gray-500 text-sm mt-1 max-w-[200px] leading-relaxed">
              Basado en tu estructura física, recomendamos estilos que <span class="text-gray-300 font-bold italic">{{ recommendationText }}</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Recommendations Section -->
      <div class="mb-8 flex items-baseline justify-between px-2">
  <h4 class="text-white text-xl font-outfit font-bold tracking-tight">Cortes Sugeridos</h4>
  <div class="h-[1px] flex-1 bg-white/5 mx-4"></div>
  <span class="text-primary text-[10px] font-bold uppercase tracking-widest">{{ filteredStyles.length }} Opciones</span>
</div>
<!-- Fallback when no styles available -->
<div v-if="filteredStyles.length === 0" class="text-center text-gray-400 py-8">
  No hay estilos disponibles para la forma de rostro detectada. Ajusta la posición o prueba con otra forma.
</div>

      <div class="space-y-6 mb-32">
        <div 
          v-for="(style, index) in filteredStyles" 
          :key="style.id"
          @click="selectedStyle = style"
          :class="[
            'p-8 glass-panel rounded-3xl transition-all duration-500 cursor-pointer group relative overflow-hidden',
            selectedStyle?.id === style.id ? 'border-primary/50 bg-primary/5 shadow-[0_15px_30px_rgba(218,165,32,0.1)]' : 'border-white/5 opacity-70 hover:opacity-100'
          ]"
        >
          <div v-if="index === 0" class="absolute -top-1 -right-1 bg-primary text-black text-[8px] font-black px-4 py-1.5 rounded-bl-3xl shadow-lg z-20 uppercase tracking-[0.2em]">
            Elección Elite
          </div>

          <div class="flex items-center space-x-6 relative z-10 text-left">
            <div :class="[
                'w-20 h-20 rounded-2xl flex items-center justify-center font-outfit font-black text-2xl transition-all duration-700',
                selectedStyle?.id === style.id ? 'bg-primary text-black scale-110 shadow-lg shadow-primary/20' : 'bg-white/5 text-primary/50 border border-white/10'
            ]">
              {{ style.matchScore }}%
            </div>
            
            <div class="flex-1">
              <h5 :class="['font-outfit font-bold text-2xl mb-1 tracking-tight transition-colors duration-500', selectedStyle?.id === style.id ? 'text-primary' : 'text-white group-hover:text-primary']">
                {{ style.name }}
              </h5>
              <div class="flex items-center space-x-3">
                  <span class="flex items-center text-[9px] text-gray-500 uppercase font-black tracking-widest">
                    <div :class="['w-1.5 h-1.5 rounded-full mr-2', maintenanceColor(style.maintenance)]"></div>
                    Mantenimiento {{ style.maintenance }}
                  </span>
              </div>
            </div>
            
            <button 
                v-if="selectedStyle?.id === style.id"
                @click.stop="handleTryOn(style)"
                :disabled="isGeneratingAI"
                class="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-primary uppercase tracking-wider hover:bg-primary hover:text-black transition-all"
            >
                {{ isGeneratingAI && tryingOnId === style.id ? 'GENERANDO...' : 'PROBAR' }}
            </button>
          </div>
          
          <p v-if="selectedStyle?.id === style.id" class="mt-8 pt-8 border-t border-white/10 text-gray-400 text-sm leading-relaxed animate-fade-in text-left">
            {{ style.desc }}
          </p>
        </div>
      </div>
    </main>

    <!-- Try-On Result Modal -->
    <transition
        enter-active-class="transition duration-500 ease-out"
        enter-from-class="opacity-0 scale-95"
        leave-active-class="transition duration-300 ease-in"
        leave-to-class="opacity-0 scale-95"
    >
        <div v-if="showResultModal" class="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 md:p-6">
            <div class="w-full max-w-lg glass-panel border-white/10 rounded-[32px] md:rounded-[56px] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] flex flex-col h-[85vh] md:h-[80vh]">
                <!-- Header -->
                <div class="p-6 md:p-8 pb-4 flex items-center justify-between">
                    <div>
                        <h3 class="text-white text-2xl md:text-3xl font-outfit font-black tracking-tighter uppercase mb-1">Previsualización {{ isUsingOverlay ? 'Instantánea' : 'IA' }}</h3>
                        <p class="text-primary text-[8px] font-black uppercase tracking-[0.4em]">Experiencia {{ tryingOnStyleName }}</p>
                    </div>
                    <button @click="showResultModal = false" class="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-gray-500 hover:text-primary transition-all rounded-2xl bg-white/5">
                        <LucideX :size="20" />
                    </button>
                </div>

                <!-- Comparison Area -->
                <div class="flex-1 relative bg-black/20 m-4 md:m-6 rounded-3xl overflow-hidden border border-white/5">
                    <div class="absolute inset-0 flex">
                        <!-- Before -->
                        <div class="relative flex-1 group" :class="{ 'flex-none w-1/2': showComparison }">
                            <img :src="scanStore.capturedImage" class="w-full h-full object-cover" />
                            <div class="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black text-white uppercase">Original</div>
                        </div>
                        
                        <!-- Splitter -->
                        <div v-if="showComparison" class="w-1 bg-primary relative z-10 shadow-[0_0_15px_#DAA520]"></div>

                        <!-- After -->
                        <div v-if="showComparison" class="relative flex-1">
                            <img :src="generatedImage" class="w-full h-full object-cover" />
                            <div class="absolute bottom-4 right-4 bg-primary px-3 py-1 rounded-lg text-[10px] font-black text-black uppercase shadow-lg">NeuroStyle IA</div>
                        </div>
                    </div>

                    <!-- Loader while generating -->
                    <div v-if="isGeneratingAI" class="absolute inset-0 bg-black/60 backdrop-blur-lg flex flex-col items-center justify-center">
                        <div class="w-16 h-16 relative mb-6">
                            <div class="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                            <div class="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <p class="text-primary text-[10px] font-black uppercase tracking-[0.4em] animate-pulse text-center px-10">
                            {{ isUsingOverlay ? 'Renderizando superposición instantánea...' : 'Moldeando tu nuevo estilo con inteligencia neural...' }}
                        </p>
                    </div>
                </div>

                <!-- Actions -->
                <div class="p-8 pt-2 grid grid-cols-2 gap-4">
                    <button 
                        @click="showComparison = !showComparison"
                        :disabled="!generatedImage"
                        class="glass-panel py-6 rounded-3xl text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all disabled:opacity-20"
                    >
                        {{ showComparison ? 'VER SOLO IA' : 'COMPARAR' }}
                    </button>
                    <button 
                        @click="handleBooking"
                        class="bg-primary py-6 rounded-3xl text-black font-black text-xs uppercase tracking-wider hover:scale-105 transition-all shadow-xl shadow-primary/20"
                    >
                        RESERVAR ESTE LOOK
                    </button>
                </div>
            </div>
        </div>
    </transition>

    <!-- Booking CTA (Animated Footer) -->
    <transition
        enter-active-class="transition transform duration-500 ease-out"
        enter-from-class="translate-y-full opacity-0"
        enter-to-class="translate-y-0 opacity-100"
    >
        <div v-if="selectedStyle && !showResultModal" class="fixed bottom-0 left-0 right-0 p-8 glass-panel border-t border-white/10 rounded-t-[48px] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] z-50">
            <div class="max-w-md mx-auto">
                <div class="flex justify-between items-center mb-6">
                    <div>
                        <p class="text-[10px] text-primary font-black uppercase tracking-[0.3em] mb-1">Membresía Elite</p>
                        <h6 class="text-white font-outfit font-bold text-2xl tracking-tight">{{ selectedStyle.name }}</h6>
                    </div>
                </div>
                
                <button 
                    @click="handleBooking"
                    class="w-full bg-primary text-black font-black py-6 rounded-3xl flex items-center justify-center text-xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/30 group relative overflow-hidden"
                >
                    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <span class="font-outfit uppercase tracking-wider">AGENDAR AHORA</span>
                    <LucideScissors class="ml-3 group-hover:rotate-45 transition-transform" />
                </button>
            </div>
        </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  LucideChevronLeft, LucideScanFace, LucideScissors, 
  LucideArrowRight, LucideX 
} from 'lucide-vue-next'
import { useScanStore } from '../stores/scanStore'
import aiService from '../services/aiService'
import overlayService from '../services/overlayService'
import { haircutCatalog } from '../data/haircutCatalog'

const route = useRoute()
const router = useRouter()
const scanStore = useScanStore()

const faceShape = ref(route.query.shape || 'Ovalado')
const gender = ref(route.query.gen || 'Caballero')
const confidence = ref(parseFloat(route.query.conf) || 0.95)
const ratio = ref(route.query.ratio || '1.35')
const selectedStyle = ref(null)

// AI Try-On States
const isGeneratingAI = ref(false)
const tryingOnId = ref(null)
const tryingOnStyleName = ref('')
const generatedImage = ref(null)
const isUsingOverlay = ref(false)
const showResultModal = ref(false)
const showComparison = ref(true)

// stylesDb removed, using imported haircutCatalog

const filteredStyles = computed(() => {
    return haircutCatalog
        .filter(s => s.gender === gender.value && s.faceShapes.includes(faceShape.value))
        .sort((a, b) => b.matchScore - a.matchScore)
})

const recommendationText = computed(() => {
    switch(faceShape.value) {
        case 'Redondo': return 'añadan altura y ángulos para alargar visualmente el rostro.';
        case 'Cuadrado': return 'suavicen la línea de la mandíbula con capas o volumen superior.';
        case 'Alargado': return 'añadan volumen lateral para equilibrar las proporciones.';
        default: return 'mantengan el equilibrio natural y armónico de tus facciones.';
    }
})

const maintenanceColor = (level) => {
    if (level === 'Bajo') return 'bg-green-500'
    if (level === 'Medio') return 'bg-yellow-500'
    return 'bg-red-500'
}

const handleTryOn = async (style) => {
    if (!scanStore.capturedImage) {
        alert("No hay imagen capturada para el análisis.")
        return
    }

    tryingOnId.value = style.id
    tryingOnStyleName.value = style.name
    isGeneratingAI.value = true
    showResultModal.value = true
    generatedImage.value = null
    showComparison.value = false
    isUsingOverlay.value = true // We prioritize the free overlay

    try {
        if (style.overlayImage) {
            // Use FREE instant overlay
            console.log("Using Free Overlay for:", style.name)
            const resultUrl = await overlayService.applyHairstyleOverlay(
                scanStore.capturedImage,
                scanStore.landmarks,
                style.overlayImage
            )
            generatedImage.value = resultUrl
            showComparison.value = true
            isGeneratingAI.value = false
        } else {
            // Fallback to AI (or show message)
            isUsingOverlay.value = false
            console.log("No overlay asset. Using AI for:", style.name)
            
            const res = await fetch(scanStore.capturedImage)
            const blob = await res.blob()
            
            const resultUrl = await aiService.generateHairstyle(blob, style.name)
            generatedImage.value = resultUrl
            showComparison.value = true
        }
    } catch (error) {
        console.error("Try-On Error:", error)
        alert(`ERROR TÉCNICO: ${error.message}`)
        showResultModal.value = false
    } finally {
        isGeneratingAI.value = false
        tryingOnId.value = null
    }
}

const handleBooking = () => {
    router.push({ 
        path: '/book', 
        query: { style: selectedStyle.value.name } 
    })
}

onMounted(() => {
    if (filteredStyles.value.length > 0) {
        selectedStyle.value = filteredStyles.value[0]
    }
})
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>


