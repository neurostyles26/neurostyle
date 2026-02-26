<template>
  <div class="min-h-screen bg-black flex flex-col p-6 font-inter overflow-hidden relative">
    <!-- Animated background aura -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[50vh] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

    <!-- Header -->
    <header class="flex items-center justify-between mb-8 z-10">
      <router-link to="/" class="w-12 h-12 flex items-center justify-center glass-panel rounded-2xl hover:bg-white/10 transition-colors">
        <LucideChevronLeft class="text-primary" />
      </router-link>
      <div class="text-center">
          <h2 class="text-white font-outfit font-bold text-xl tracking-tight">Escáner Biométrico</h2>
          <p class="text-primary text-[8px] font-black uppercase tracking-[0.3em]">Motor de Análisis de Precisión</p>
      </div>
      <div class="w-12"></div>
    </header>

    <!-- Gender Selector -->
    <div class="flex glass-panel p-1.5 rounded-[24px] mb-8 z-10 relative">
      <button 
        @click="gender = 'Caballero'"
        :class="[
          'flex-1 flex items-center justify-center py-4 rounded-xl font-bold transition-all duration-500',
          gender === 'Caballero' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-gray-500 hover:text-primary/70'
        ]"
      >
        <LucideUser class="mr-2" :size="20" />
        Caballero
      </button>
      <button 
        @click="gender = 'Dama'"
        :class="[
          'flex-1 flex items-center justify-center py-4 rounded-xl font-bold transition-all duration-500',
          gender === 'Dama' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-gray-500 hover:text-primary/70'
        ]"
      >
        <LucideUserCircle class="mr-2" :size="20" />
        Dama
      </button>
    </div>

    <!-- Camera Container -->
    <div class="relative flex-1 rounded-[48px] overflow-hidden border border-white/10 bg-[#050505] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10">
      <ProfessionalCamera 
        ref="cameraRef" 
        @quality-change="onQualityChange"
      />

      <!-- Processing Overlay -->
      <transition 
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        leave-active-class="transition-opacity duration-500"
        leave-to-class="opacity-0"
      >
        <div v-if="processing" class="absolute inset-0 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center z-50 text-center px-10">
            <div class="relative w-24 h-24 mb-10">
                <div class="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                <div class="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <div class="absolute inset-4 border-2 border-primary/10 rounded-full animate-pulse"></div>
            </div>
            
            <h3 class="text-white font-outfit font-bold text-3xl mb-4 tracking-tighter">{{ status }}</h3>
            
            <div class="w-full max-w-[200px] h-1 bg-white/5 rounded-full overflow-hidden mb-4">
                <div class="h-full bg-primary animate-progress-fill"></div>
            </div>
            
            <p class="text-gray-500 font-mono text-[10px] uppercase tracking-[0.2em] animate-pulse">
                Procesando malla geométrica facial...
            </p>
        </div>
      </transition>
    </div>

    <!-- Info & Controls -->
    <div class="mt-8 pb-4 z-10 flex flex-col items-center">
        <div class="flex items-center space-x-3 mb-8 bg-white/5 py-2 px-4 rounded-full border border-white/5">
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
            <p class="text-gray-400 text-[10px] font-bold uppercase tracking-widest">IA Lista para Análisis</p>
        </div>
        
        <button 
            @click="handleStartScan" 
            :disabled="processing"
            class="w-full bg-primary text-black font-black py-6 rounded-[28px] flex items-center justify-center text-xl hover:scale-[1.02] active:scale-95 disabled:opacity-30 transition-all shadow-[0_15px_30px_rgba(218,165,32,0.3)] relative overflow-hidden group"
        >
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <LucideScanFace class="mr-3" :size="24" />
            <span class="font-outfit">{{ !isQualityGood ? (isCameraActive ? 'ALINEA TU ROSTRO' : 'INICIAR CÁMARA') : 'INICIAR ESCANEO 3D' }}</span>
            <div v-if="!isQualityGood && isCameraActive && !processing" class="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                <span class="text-[10px] uppercase tracking-widest">{{ scanWarning || 'Ajustando Cámara' }}</span>
            </div>
        </button>
        
        <p class="text-gray-600 text-center text-[10px] mt-6 px-10 leading-relaxed uppercase tracking-widest font-bold">
            Tu privacidad es prioridad. El escaneo se procesa localmente y de forma segura.
        </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { LucideChevronLeft, LucideUser, LucideUserCircle, LucideScanFace } from 'lucide-vue-next'
import ProfessionalCamera from '../components/ProfessionalCamera.vue'
import { useScanStore } from '../stores/scanStore'

const router = useRouter()
const scanStore = useScanStore()
const cameraRef = ref(null)
const processing = ref(false)
const status = ref('')
const gender = ref('Caballero')

const isQualityGood = ref(false)
const isCameraActive = ref(false)
const scanWarning = ref('')

const onQualityChange = (q) => {
    isQualityGood.value = q.isGood
    scanWarning.value = q.warning
    isCameraActive.value = true
}

const handleStartScan = async () => {
    if (!cameraRef.value) return
    
    if (!isCameraActive.value) {
        await cameraRef.value.initCamera()
        return
    }

    if (!isQualityGood.value) return

    processing.value = true
    status.value = 'MUESTREO BIOMÉTRICO'

    const result = cameraRef.value.capture()
    if (!result) {
        processing.value = false
        return
    }

    const { img, biometrics } = result
    scanStore.setCapturedImage(img)

    setTimeout(() => {
        status.value = 'MAPEO GEOMÉTRICO'
        setTimeout(() => {
            status.value = 'ANALIZANDO SIMETRÍA'
            setTimeout(() => {
                scanStore.setScanResult(biometrics.shape, gender.value)
                
                router.push({ 
                    name: 'StyleSuggestions',
                    query: { 
                        shape: biometrics.shape, 
                        gen: gender.value,
                        conf: biometrics.confidence,
                        ratio: biometrics.metrics.ratio
                    } 
                })
            }, 1200)
        }, 1000)
    }, 800)
}

onMounted(() => {
    // Reset store on new scan
    scanStore.resetScan()
    
    // We remove the auto-start to avoid permission deadlocks
    // The user will click the button or the camera overlay to start
})
</script>


<style scoped>
@keyframes progress-fill {
    0% { width: 0%; }
    100% { width: 100%; }
}

.animate-progress-fill {
    animation: progress-fill 4s ease-out forwards;
}
</style>

