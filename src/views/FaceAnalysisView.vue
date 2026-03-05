  <div class="min-h-screen bg-transparent flex flex-col p-6 font-inter overflow-hidden relative">
    <!-- Animated background aura -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[50vh] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

    <!-- Privacy Consent Modal -->
    <transition
      enter-active-class="transition duration-500 ease-out"
      enter-from-class="opacity-0 scale-95"
      leave-active-class="transition duration-300 ease-in"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="showConsent" class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
        <div class="glass-panel max-w-md w-full p-6 md:p-8 rounded-3xl border-white/10 flex flex-col items-center text-center shadow-[0_0_50px_rgba(218,165,32,0.1)]">
          <div class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <LucideShieldCheck class="text-primary" :size="40" />
          </div>
          <h2 class="text-white font-outfit font-bold text-2xl mb-4 tracking-tight">Privacidad y Seguridad</h2>
          <p class="text-gray-400 text-sm mb-8 leading-relaxed">
            Para realizar el análisis biométrico, necesitamos acceso temporal a tu cámara. 
            <span class="text-white font-medium italic block mt-2">Tu imagen se procesa localmente en este dispositivo y nunca es almacenada ni transmitida a nuestros servidores.</span>
          </p>
          <div class="flex flex-col w-full gap-3">
            <button 
              @click="acceptConsent" 
              class="w-full bg-primary text-black font-black py-5 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs"
            >
              Acepto y Continuar
            </button>
            <router-link 
              to="/" 
              class="w-full py-4 text-gray-500 font-bold hover:text-white transition-colors text-xs uppercase tracking-widest"
            >
              Cancelar
            </router-link>
          </div>
        </div>
      </div>
    </transition>

    <!-- Header -->
    <header class="flex items-center justify-between mb-8 z-10">
      <router-link to="/" class="w-12 h-12 flex items-center justify-center glass-panel rounded-2xl hover:bg-white/10 transition-colors">
        <LucideChevronLeft class="text-primary" />
      </router-link>
      <div class="text-center">
          <h2 class="text-white font-outfit font-bold text-xl tracking-tight uppercase">Escáner Biométrico</h2>
          <p class="text-primary text-[8px] font-black uppercase tracking-[0.4em] opacity-60">Motor de Análisis de Precisión</p>
      </div>
      <div class="w-12 flex justify-end">
        <LucideLock class="text-white/20" :size="16" />
      </div>
    </header>

    <!-- Gender Selector -->
    <div class="flex glass-panel p-1.5 rounded-[24px] mb-8 z-10 relative border-white/5">
      <button 
        @click="gender = 'Caballero'"
        :class="[
          'flex-1 flex items-center justify-center py-4 rounded-xl font-bold transition-all duration-500 uppercase tracking-widest text-[10px]',
          gender === 'Caballero' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-gray-500 hover:text-primary/70'
        ]"
      >
        Caballero
      </button>
      <button 
        @click="gender = 'Dama'"
        :class="[
          'flex-1 flex items-center justify-center py-4 rounded-xl font-bold transition-all duration-500 uppercase tracking-widest text-[10px]',
          gender === 'Dama' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-gray-500 hover:text-primary/70'
        ]"
      >
        Dama
      </button>
    </div>

    <!-- Camera Container -->
    <div class="relative flex-1 rounded-[48px] overflow-hidden border border-white/10 bg-transparent shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10 transition-all duration-700">
      <ProfessionalCamera 
        ref="cameraRef" 
        @quality-change="onQualityChange"
        @started="isCameraActive = true"
      />

      <!-- Processing Overlay (Refined for visibility) -->
      <transition 
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        leave-active-class="transition-opacity duration-500"
        leave-to-class="opacity-0"
      >
        <div v-if="processing" class="absolute inset-0 bg-black/40 backdrop-blur-[4px] flex flex-col items-center justify-center z-50 text-center px-10">
            <div class="relative w-24 h-24 mb-10">
                <div class="absolute inset-0 border-[1px] border-primary/20 rounded-full"></div>
                <div class="absolute inset-0 border-[1px] border-primary border-t-transparent rounded-full animate-spin"></div>
                <div class="absolute inset-6 border-[0.5px] border-primary/40 rounded-full animate-pulse"></div>
            </div>
            
            <h3 class="text-white font-outfit font-black text-3xl mb-4 tracking-tighter uppercase gold-glow">{{ status }}</h3>
            
            <div class="w-full max-w-[200px] h-0.5 bg-white/10 rounded-full overflow-hidden mb-4">
                <div class="h-full bg-primary animate-progress-fill"></div>
            </div>
            
            <p class="text-primary/60 font-mono text-[9px] uppercase tracking-[0.3em] animate-pulse">
                Procesando malla geométrica facial...
            </p>
        </div>
      </transition>
    </div>

    <!-- Info & Controls -->
    <div class="mt-8 pb-4 z-10 flex flex-col items-center w-full">
        <div class="flex items-center space-x-3 mb-8 bg-white/5 py-2.5 px-6 rounded-full border border-white/5 backdrop-blur-md">
            <div :class="['w-1.5 h-1.5 rounded-full shadow-lg transition-colors duration-500', isCameraActive ? 'bg-green-500 shadow-green-500/50 animate-pulse' : 'bg-red-500 shadow-red-500/50']"></div>
            <p class="text-white/60 text-[9px] font-bold uppercase tracking-[0.2em]">{{ isCameraActive ? 'IA ACTIVA: ANÁLISIS EN TIEMPO REAL' : 'SISTEMA EN ESPERA' }}</p>
        </div>
        
        <button 
            @click="handleStartScan" 
            :disabled="processing"
            class="w-full max-w-sm bg-primary text-black font-black py-7 rounded-[32px] flex items-center justify-center text-xl hover:scale-[1.02] active:scale-95 disabled:opacity-30 transition-all shadow-[0_15px_40px_rgba(218,165,32,0.3)] relative overflow-hidden group"
        >
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <span class="font-outfit uppercase tracking-[0.1em] group-hover:tracking-[0.15em] transition-all duration-500">
              {{ !isCameraActive ? 'CONECTAR ESCÁNER' : (isQualityGood ? 'ANALIZAR BIOMETRÍA' : 'FORZAR ANÁLISIS') }}
            </span>
        </button>
        
        <p class="text-gray-600 text-center text-[9px] mt-8 px-10 leading-relaxed uppercase tracking-[0.3em] font-medium opacity-50">
            PROCESADO POR NEUROSTYLE ENGINE <span class="mx-1 text-primary/20">|</span> LOCAL ONLY
        </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  LucideChevronLeft, 
  LucideScanFace, 
  LucideShieldCheck, 
  LucideLock,
  LucideCheck
} from 'lucide-vue-next'
import ProfessionalCamera from '../components/ProfessionalCamera.vue'
import { useScanStore } from '../stores/scanStore'

const router = useRouter()
const scanStore = useScanStore()
const cameraRef = ref(null)
const processing = ref(false)
const status = ref('')
const gender = ref('Caballero')
const showConsent = ref(true)

const isQualityGood = ref(false)
const isCameraActive = ref(false)
const scanWarning = ref('')

const acceptConsent = () => {
    showConsent.value = false
    // Proactive camera init after consent
    setTimeout(() => {
        if (cameraRef.value) cameraRef.value.initCamera()
    }, 500)
}

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

    processing.value = true
    status.value = 'MUESTREO BIOMÉTRICO'

    const result = cameraRef.value.capture()
    if (!result) {
        processing.value = false
        return
    }

    const { img, biometrics, landmarks } = result
    scanStore.setCapturedImage(img)
    scanStore.setLandmarks(landmarks)

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
    scanStore.resetScan()
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

