<template>
  <div class="min-h-screen bg-[#050505] flex flex-col p-4 sm:p-8 font-inter relative overflow-hidden">
    <!-- Sophisticated Background Aura -->
    <div class="absolute top-0 left-0 w-full h-[50vh] bg-primary/5 blur-[140px] rounded-full pointer-events-none"></div>
    <div class="absolute bottom-0 right-0 w-[40vw] h-[40vh] bg-primary/2 blur-[100px] rounded-full pointer-events-none"></div>

    <!-- Header -->
    <header class="flex items-center justify-between mb-12 z-10">
      <router-link to="/dashboard" class="w-12 h-12 flex items-center justify-center glass-panel rounded-2xl hover:bg-white/10 hover:border-primary/30 transition-all shadow-lg group">
        <LucideChevronLeft class="text-primary group-hover:-translate-x-1 transition-transform" />
      </router-link>
      <div class="text-center">
          <h2 class="text-white font-outfit font-black text-2xl tracking-tighter uppercase">Tu Perfil <span class="text-primary">Estético</span></h2>
          <div class="flex items-center justify-center gap-2 mt-1">
              <span class="w-1 h-1 rounded-full bg-primary animate-pulse"></span>
              <p class="text-primary text-[8px] font-black uppercase tracking-[0.4em] opacity-70 italic">Análisis Inteligente</p>
          </div>
      </div>
      <div class="w-12"></div>
    </header>

    <main class="flex-1 z-10 max-w-5xl mx-auto w-full overflow-y-auto pr-1 custom-scrollbar">
      <!-- Analysis Summary Card -->
      <div class="glass-card p-8 rounded-[48px] mb-12 relative overflow-hidden border-white/5 shadow-2xl">
        <div class="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 blur-[80px] rounded-full"></div>
        
        <div class="flex flex-col md:flex-row items-center md:items-start gap-10 relative z-10">
          <div class="w-32 h-32 rounded-[40px] overflow-hidden border border-primary/20 relative bg-black/40 shadow-inner group">
              <img v-if="scanStore.capturedImage" :src="scanStore.capturedImage" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <LucideScanFace v-else class="text-primary absolute inset-0 m-auto" :size="48" />
              <div class="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-black shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse"></div>
          </div>
          
          <div class="flex-1 text-center md:text-left">
            <span class="text-primary text-[9px] font-black uppercase tracking-[0.5em] mb-3 block opacity-80">Diagnóstico Biométrico</span>
            <h3 class="text-white text-4xl font-outfit font-black tracking-tighter uppercase mb-4">Rostro <span class="text-primary gold-glow">{{ faceShape }}</span></h3>
            
            <div class="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
                <span class="text-[9px] glass-panel bg-primary/10 text-primary px-4 py-1.5 rounded-xl font-black tracking-widest border-primary/20">PREPRECISIÓN: {{ (confidence * 100).toFixed(1) }}%</span>
                <span class="text-[9px] glass-panel bg-white/5 text-gray-400 px-4 py-1.5 rounded-xl font-black tracking-widest border-white/5">RATIO: {{ ratio }}</span>
            </div>
            
            <p class="text-gray-400 text-sm font-medium leading-relaxed max-w-lg uppercase tracking-wide opacity-80">
              Basado en tu estructura física única, recomendamos estilos que <span class="text-white font-black italic">{{ recommendationText }}</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Recommendations Section Header -->
      <div class="mb-10 flex items-center justify-between px-4">
        <h4 class="text-white text-2xl font-outfit font-black tracking-tighter uppercase">Cortes <span class="text-primary">Sugeridos</span></h4>
        <div class="flex items-center gap-3">
          <div class="h-[1px] w-12 bg-white/10"></div>
          <span class="text-gray-600 text-[10px] font-black uppercase tracking-widest">{{ filteredStyles.length }} Opciones</span>
        </div>
      </div>

      <!-- Fallback when no styles available -->
      <div v-if="filteredStyles.length === 0" class="text-center glass-panel rounded-3xl py-20 px-10">
        <LucideX class="text-gray-700 mx-auto mb-6" :size="48" />
        <p class="text-gray-500 font-bold uppercase tracking-widest text-sm">No hay estilos disponibles para esta morfología.</p>
        <button @click="router.push('/scan')" class="btn-primary mt-8">Intentar nuevo escaneo</button>
      </div>

      <div class="responsive-grid mb-40">
        <div 
          v-for="(style, index) in filteredStyles" 
          :key="style.id"
          @click="selectedStyle = style"
          :class="[
            'glass-card rounded-[40px] p-8 overflow-hidden cursor-pointer group relative',
            selectedStyle?.id === style.id ? 'border-primary shadow-2xl bg-primary/5' : 'border-white/5 opacity-80 hover:opacity-100'
          ]"
        >
          <!-- Elite Selection Badge -->
          <div v-if="index === 0" class="absolute top-0 right-0 bg-primary text-black text-[9px] font-black px-6 py-2 rounded-bl-3xl shadow-lg z-20 uppercase tracking-[0.2em]">
            Recomendación Master
          </div>

          <div class="flex flex-col h-full relative z-10">
            <div class="flex items-start justify-between mb-8">
              <div :class="[
                  'w-16 h-16 rounded-2xl flex items-center justify-center font-outfit font-black text-2xl transition-all duration-700',
                  selectedStyle?.id === style.id ? 'bg-primary text-black scale-110 shadow-xl' : 'bg-white/5 text-primary/40 border border-white/5'
              ]">
                {{ style.matchScore }}<span class="text-[10px]">%</span>
              </div>
              
              <button 
                  v-if="selectedStyle?.id === style.id"
                  @click.stop="handleTryOn(style)"
                  :disabled="isGeneratingAI"
                  class="btn-primary py-3 px-6 text-[9px] shadow-sm"
              >
                  {{ isGeneratingAI && tryingOnId === style.id ? 'IA...' : 'PROBAR IA' }}
              </button>
            </div>
            
            <div class="flex-1">
              <h5 :class="['font-outfit font-black text-2xl mb-3 tracking-tighter uppercase transition-colors duration-500', selectedStyle?.id === style.id ? 'text-primary' : 'text-white group-hover:text-primary']">
                {{ style.name }}
              </h5>
              <div class="flex items-center space-x-3 mb-6">
                  <span class="flex items-center text-[8px] text-gray-500 uppercase font-black tracking-widest">
                    <div :class="['w-1.5 h-1.5 rounded-full mr-2 shadow-[0_0_8px_rgba(255,255,255,0.2)]', maintenanceColor(style.maintenance)]"></div>
                    Mantenimiento {{ style.maintenance }}
                  </span>
              </div>
              <p class="text-gray-500 text-xs font-bold leading-relaxed uppercase tracking-wider line-clamp-3">
                {{ style.desc }}
              </p>
            </div>
          </div>
          
          <!-- Background Decoration -->
          <div class="absolute -right-10 -bottom-10 w-32 h-32 bg-primary/2 blur-2xl rounded-full group-hover:bg-primary/5 transition-colors"></div>
        </div>
      </div>
    </main>

    <!-- Try-On Result Modal -->
    <transition
        enter-active-class="transition duration-700 cubic-bezier(0.16, 1, 0.3, 1)"
        enter-from-class="opacity-0 scale-95 translate-y-10"
        leave-active-class="transition duration-500 ease-in"
        leave-to-class="opacity-0 scale-95 translate-y-10"
    >
        <div v-if="showResultModal" class="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 md:p-8">
            <div class="w-full max-w-2xl glass-card rounded-[60px] overflow-hidden shadow-2xl flex flex-col h-[90vh] md:h-[85vh] border-white/10">
                <!-- Modal Header -->
                <div class="p-8 md:p-12 pb-4 flex items-center justify-between">
                    <div>
                        <span class="text-primary text-[9px] font-black uppercase tracking-[0.5em] mb-2 block">Simulación Neural</span>
                        <h3 class="text-white text-3xl md:text-4xl font-outfit font-black tracking-tighter uppercase">{{ tryingOnStyleName }}</h3>
                    </div>
                    <button @click="showResultModal = false" class="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-white transition-all rounded-2xl glass-panel hover:border-primary/40 group">
                        <LucideX :size="24" class="group-hover:rotate-90 transition-transform" />
                    </button>
                </div>

                <!-- Comparison Area -->
                <div class="flex-1 relative bg-[#0a0a0a] m-6 md:m-10 rounded-[48px] overflow-hidden border border-white/5 shadow-inner">
                    <div class="absolute inset-0 flex">
                        <!-- Before -->
                        <div class="relative flex-1" :class="{ 'flex-none w-1/2': showComparison }">
                            <img :src="scanStore.capturedImage" class="w-full h-full object-cover grayscale opacity-40" />
                            <div class="absolute bottom-6 left-6 glass-panel px-4 py-2 rounded-xl text-[10px] font-black text-white uppercase tracking-widest border-white/10">Base Original</div>
                        </div>
                        
                        <!-- Divider Line -->
                        <div v-if="showComparison" class="w-[1px] bg-white/20 relative z-10 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                          <div class="absolute inset-y-0 -left-4 -right-4 flex items-center justify-center">
                            <div class="w-8 h-8 rounded-xl glass-panel flex items-center justify-center">
                              <LucideArrowRight :size="14" class="text-primary rotate-45" />
                            </div>
                          </div>
                        </div>

                        <!-- After -->
                        <div v-if="showComparison" class="relative flex-1 animate-reveal-ai">
                            <img :src="generatedImage" class="w-full h-full object-cover" />
                            <div class="absolute bottom-6 right-6 bg-primary px-5 py-2 rounded-xl text-[10px] font-black text-black uppercase tracking-widest shadow-xl">Resultado IA</div>
                        </div>
                    </div>

                    <!-- Loader -->
                    <div v-if="isGeneratingAI" class="absolute inset-0 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center">
                        <div class="relative w-24 h-24 mb-10">
                            <div class="absolute inset-0 border-2 border-primary/20 rounded-full animate-ping"></div>
                            <div class="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <div class="absolute inset-0 m-auto w-12 h-12 glass-panel rounded-full flex items-center justify-center">
                              <LucideSparkles class="text-primary animate-pulse" :size="24" />
                            </div>
                        </div>
                        <p class="text-primary text-[10px] font-black uppercase tracking-[0.5em] animate-pulse text-center px-12 leading-loose">
                            {{ isUsingOverlay ? 'PROCESANDO SUPERPOSICIÓN...' : 'GENERANDO ESTRUCTURA CAPILAR MEDIANTE IA...' }}
                        </p>
                    </div>
                </div>

                <!-- Actions -->
                <div class="p-10 pt-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button 
                        @click="showComparison = !showComparison"
                        :disabled="!generatedImage"
                        class="btn-secondary py-6 disabled:opacity-20"
                    >
                        {{ showComparison ? 'MODO INDIVIDUAL' : 'MODO COMPARATIVA' }}
                    </button>
                    <button 
                        @click="handleBooking"
                        class="btn-primary py-6 text-base"
                    >
                        RESERVAR ESTE LOOK
                        <LucideScissors :size="18" />
                    </button>
                </div>
            </div>
        </div>
    </transition>

    <!-- Booking CTA (Floating) -->
    <transition
        enter-active-class="transition transform duration-700 cubic-bezier(0.16, 1, 0.3, 1)"
        enter-from-class="translate-y-full opacity-0"
        enter-to-class="translate-y-0 opacity-100"
    >
        <div v-if="selectedStyle && !showResultModal" class="fixed bottom-0 left-0 right-0 p-6 sm:p-10 z-50">
            <div class="max-w-xl mx-auto glass-card p-6 md:p-8 rounded-[40px] border-primary/30 shadow-[0_-20px_50px_rgba(0,0,0,0.4)] flex flex-col sm:flex-row items-center justify-between gap-6 bg-black/60 backdrop-blur-3xl">
                <div class="text-center sm:text-left">
                    <p class="text-[9px] text-primary font-black uppercase tracking-[0.5em] mb-2">Selección Actual</p>
                    <h6 class="text-white font-outfit font-black text-3xl tracking-tighter uppercase leading-none">{{ selectedStyle.name }}</h6>
                </div>
                
                <button 
                    @click="handleBooking"
                    class="btn-primary w-full sm:w-auto px-12 py-5 group relative"
                >
                    AGENDAR CITA
                    <LucideArrowRight class="group-hover:translate-x-1 transition-transform" :size="18" />
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
  LucideArrowRight, LucideX, LucideSparkles, LucideCheck
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
    if (level === 'Bajo') return 'bg-green-500 shadow-green-500/20'
    if (level === 'Medio') return 'bg-yellow-500 shadow-yellow-500/20'
    return 'bg-red-500 shadow-red-500/20'
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
    isUsingOverlay.value = true 

    try {
        if (style.overlayImage) {
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
@keyframes reveal-ai {
  from { opacity: 0; clip-path: inset(0 0 0 100%); }
  to { opacity: 1; clip-path: inset(0 0 0 0); }
}

.animate-reveal-ai {
  animation: reveal-ai 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(218, 165, 32, 0.1);
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(218, 165, 32, 0.3);
}
</style>


