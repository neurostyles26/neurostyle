<template>
  <div class="min-h-screen bg-[#0a0a0a] flex flex-col p-4 sm:p-6 font-inter overflow-hidden relative">
    <!-- Premium Gradient Background -->
    <div class="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
    
    <!-- Header -->
    <header class="flex items-center justify-between mb-8 z-10 relative px-2">
      <button @click="handleBack" class="w-12 h-12 flex items-center justify-center glass-panel rounded-2xl hover:bg-white/10 hover:border-primary/40 transition-all shadow-lg group">
        <LucideChevronLeft class="text-primary group-hover:-translate-x-1 transition-transform" />
      </button>
      <div class="text-center">
          <h2 class="text-white font-outfit font-black text-2xl tracking-tighter uppercase">Studio <span class="text-primary gold-glow">Vision</span></h2>
          <div class="flex items-center justify-center gap-2 mt-1">
              <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(218,165,32,1)]"></span>
              <p class="text-primary text-[8px] font-black uppercase tracking-[0.5em] opacity-80 italic">Neural Diagnostic</p>
          </div>
      </div>
      <div class="w-12"></div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 flex flex-col relative z-10 max-w-5xl mx-auto w-full">
      
      <!-- 1. Camera / Capture Preview -->
      <div v-if="step === 'capture'" class="flex-1 flex flex-col min-h-[500px] animate-fade-in">
        <div class="relative flex-1 rounded-[48px] overflow-hidden border border-white/5 bg-[#050505] shadow-2xl mb-10 group min-h-[400px]">
            <ProfessionalCamera 
              ref="cameraRef" 
              @started="onCameraStarted"
            />
            
            <!-- Scanning Overlay Effect -->
            <div v-if="isCameraActive" class="absolute inset-0 pointer-events-none overflow-hidden">
                <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan shadow-[0_0_20px_rgba(218,165,32,0.8)]"></div>
                
                <!-- Corner Borders (High-tech) -->
                <div class="absolute top-10 left-10 w-12 h-12 border-t-2 border-l-2 border-primary/40 rounded-tl-2xl"></div>
                <div class="absolute top-10 right-10 w-12 h-12 border-t-2 border-r-2 border-primary/40 rounded-tr-2xl"></div>
                <div class="absolute bottom-10 left-10 w-12 h-12 border-b-2 border-l-2 border-primary/40 rounded-bl-2xl"></div>
                <div class="absolute bottom-10 right-10 w-12 h-12 border-b-2 border-r-2 border-primary/40 rounded-br-2xl"></div>

                <!-- Biometric UI Hints -->
                <div class="absolute top-1/2 left-6 -translate-y-1/2 flex flex-col gap-4 opacity-40">
                  <div v-for="i in 5" :key="i" class="w-1 h-1 bg-white rounded-full"></div>
                </div>
            </div>

            <canvas ref="processCanvas" class="hidden"></canvas>
        </div>

        <div class="flex flex-col items-center gap-8 pb-10">
            <button 
                @click="handleCapture" 
                :disabled="!isCameraActive"
                class="relative group disabled:opacity-50"
            >
                <!-- Outer Glowing Rings -->
                <div class="absolute inset-[-15px] rounded-full border border-primary/20 animate-[spin_8s_linear_infinite]"></div>
                <div class="absolute inset-[-25px] rounded-full border border-dashed border-white/5 animate-[spin_15s_linear_infinite_reverse]"></div>
                
                <!-- Button -->
                <div class="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:scale-110 active:scale-90 transition-all duration-500">
                    <div class="w-20 h-20 rounded-full border-2 border-black/5 flex items-center justify-center p-1">
                        <div class="w-full h-full rounded-full bg-primary shadow-inner flex items-center justify-center">
                          <LucideScissors class="text-black/40" :size="24" />
                        </div>
                    </div>
                </div>
            </button>
            <div class="text-center space-y-2">
                <p class="text-white text-[10px] font-black uppercase tracking-[0.4em]">Captura Biométrica</p>
                <p class="text-gray-500 text-[8px] uppercase tracking-widest opacity-60 italic">La IA analizará tu estructura ósea en tiempo real</p>
            </div>
        </div>
      </div>

      <!-- 2. AI Processing State -->
      <div v-if="step === 'processing'" class="flex-1 flex flex-col items-center justify-center animate-fade-in">
          <div class="relative w-56 h-56 mb-16">
              <!-- Geometric Orbitals -->
              <div class="absolute inset-0 border border-primary/10 rounded-full scale-125 animate-pulse-soft"></div>
              <div class="absolute inset-0 border border-white/5 rounded-full scale-150"></div>
              <div class="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              
              <div class="absolute inset-0 m-auto w-32 h-32 glass-panel rounded-full flex items-center justify-center shadow-2xl">
                  <LucideSparkles class="text-primary animate-pulse" :size="48" />
              </div>

              <!-- Scanning Line -->
              <div class="absolute inset-x-0 h-[2px] bg-primary shadow-[0_0_25px_rgba(218,165,32,1)] animate-loading-scan"></div>
          </div>

          <div class="text-center space-y-4">
              <h3 class="text-white font-outfit font-black text-4xl uppercase tracking-tighter">{{ processingStatus }}</h3>
              <div class="flex items-center justify-center gap-3">
                  <div v-for="i in 3" :key="i" class="w-1.5 h-1.5 rounded-full bg-primary animate-bounce shadow-[0_0_8px_rgba(218,165,32,0.6)]" :style="{ animationDelay: `${i * 0.2}s` }"></div>
              </div>
              <p class="text-gray-500 text-[10px] uppercase tracking-[0.4em] font-black opacity-60">Optimizando parámetros estéticos</p>
          </div>
      </div>

      <!-- 3. Catalog Recommendations -->
      <div v-if="step === 'catalog'" class="flex-1 flex flex-col h-full animate-fade-in px-2">
          <div class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div class="flex items-center gap-3 mb-3">
                    <div class="px-4 py-1.5 glass-panel border-primary/30 rounded-full bg-primary/5">
                        <p class="text-primary text-[9px] font-black uppercase tracking-widest">Morfología: {{ faceShape }}</p>
                    </div>
                    <span class="text-[8px] text-gray-600 font-black uppercase tracking-widest">Match Biométrico</span>
                </div>
                <h3 class="text-white font-outfit font-black text-4xl uppercase tracking-tighter">Estilos <span class="text-primary">Elite</span></h3>
                <p class="text-gray-500 text-xs mt-2 uppercase tracking-widest font-bold opacity-60">Selección curada basada en tu estructura facial</p>
              </div>
              
              <div class="hidden md:block text-right">
                <p class="text-white/20 text-[8px] font-black uppercase tracking-[0.5em]">Powered by Neural Logic</p>
              </div>
          </div>

          <div class="flex-1 overflow-y-auto pr-2 space-y-6 pb-20 custom-scrollbar">
              <div 
                v-for="item in recommendations" 
                :key="item.id"
                @click="selectStyle(item)"
                class="group relative glass-card transition-all duration-700 rounded-[40px] overflow-hidden cursor-pointer"
                :class="selectedStyle?.id === item.id ? 'border-primary shadow-2xl scale-[1.01] bg-primary/5' : 'border-white/5 opacity-80 hover:opacity-100'"
              >
                  <div class="flex flex-col md:flex-row p-6 md:p-8 gap-8">
                      <!-- Image Preview -->
                      <div class="w-full md:w-32 h-40 md:h-32 rounded-3xl overflow-hidden flex-shrink-0 bg-white/5 relative shadow-inner">
                          <img v-if="item.overlayImage" :src="item.overlayImage" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                          <div v-else class="w-full h-full flex items-center justify-center">
                              <LucideScissors class="text-white/10" :size="40" />
                          </div>
                          
                          <!-- Match Badge -->
                          <div class="absolute top-3 right-3 glass-panel px-3 py-1 rounded-xl border-primary/20">
                              <p class="text-primary text-[10px] font-black tracking-tighter">{{ item.matchScore }}%</p>
                          </div>
                      </div>

                      <!-- Info -->
                      <div class="flex-1 flex flex-col justify-center">
                          <div class="flex items-center justify-between mb-3">
                            <h4 class="text-white font-black text-2xl tracking-tight uppercase group-hover:text-primary transition-colors">{{ item.name }}</h4>
                            <div v-if="selectedStyle?.id === item.id" class="w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/40 animate-pulse-soft">
                                <LucideCheck class="text-black" :size="14" />
                            </div>
                          </div>
                          <p class="text-gray-500 text-xs leading-relaxed uppercase tracking-wider font-bold mb-6 line-clamp-2 md:line-clamp-none">{{ item.desc }}</p>
                          
                          <div class="flex flex-wrap items-center gap-3">
                              <span class="px-4 py-1.5 rounded-xl bg-white/5 text-[9px] font-black text-gray-400 uppercase tracking-widest border border-white/5">
                                Mantenimiento: {{ item.maintenance }}
                              </span>
                              <span class="px-4 py-1.5 rounded-xl bg-primary/10 text-[9px] font-black text-primary uppercase tracking-widest border border-primary/10">
                                Recomendado
                              </span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <!-- Bottom Actions -->
          <div class="fixed bottom-8 left-0 right-0 px-6 z-50 md:relative md:bottom-auto md:px-0 md:pt-10">
              <button 
                  @click="generateAIVirtual"
                  :disabled="!selectedStyle"
                  class="btn-primary w-full py-6 text-base group"
              >
                  <LucideSparkles :size="20" class="group-hover:rotate-12 transition-transform" />
                  Visualizar con IA Generativa
              </button>
              <p class="text-center text-gray-600 text-[8px] mt-4 uppercase tracking-[0.3em] font-black opacity-60">El renderizado neural puede demorar unos segundos</p>
          </div>
      </div>

      <!-- 4. Result / Comparison -->
      <div v-if="step === 'result'" class="flex-1 flex flex-col animate-fade-in">
          <div class="flex-1 flex flex-col lg:flex-row gap-8 mb-10 min-h-[500px]">
              <!-- Comparison Card -->
              <div class="flex-1 relative rounded-[48px] overflow-hidden border border-white/5 bg-[#050505] shadow-2xl group">
                  <div class="absolute inset-0 flex">
                      <div class="w-1/2 relative overflow-hidden border-r border-white/10">
                          <img :src="capturedImage" class="absolute h-full w-auto max-w-none left-1/2 -translate-x-1/2 object-cover grayscale opacity-50" />
                          <div class="absolute top-6 left-6 glass-panel px-4 py-2 rounded-2xl">
                              <p class="text-white text-[9px] font-black uppercase tracking-[0.2em]">Actual</p>
                          </div>
                      </div>
                      <div class="w-1/2 relative overflow-hidden">
                          <img :src="resultImage" class="absolute h-full w-auto max-w-none left-1/2 -translate-x-1/2 object-cover" />
                          <div class="absolute top-6 right-6 bg-primary px-4 py-2 rounded-2xl shadow-xl">
                              <p class="text-black text-[9px] font-black uppercase tracking-[0.2em]">Nuevo Look</p>
                          </div>
                      </div>
                  </div>
                  
                  <!-- Divider Icon -->
                  <div class="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <div class="w-10 h-10 rounded-2xl glass-panel flex items-center justify-center shadow-2xl border-white/20">
                          <LucideArrowLeftRight class="text-white" :size="16" />
                      </div>
                  </div>
              </div>

              <!-- Info & Booking -->
              <div class="lg:w-80 flex flex-col gap-6">
                  <div class="glass-card rounded-[40px] p-8 flex-1">
                      <div class="mb-6">
                        <span class="text-primary text-[8px] font-black uppercase tracking-[0.4em] mb-2 block">Estilo Seleccionado</span>
                        <h4 class="text-white font-black uppercase tracking-tight text-3xl mb-4 leading-tight">{{ selectedStyle?.name }}</h4>
                        <div class="flex gap-1.5 mb-8">
                            <LucideStar v-for="i in 5" :key="i" class="text-primary fill-primary" :size="12" />
                        </div>
                        <p class="text-gray-400 text-xs leading-relaxed uppercase tracking-wider font-bold">{{ selectedStyle?.desc }}</p>
                      </div>

                      <div class="space-y-4 pt-6 border-t border-white/5">
                        <div class="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                          <span>Mantenimiento</span>
                          <span class="text-primary">{{ selectedStyle?.maintenance }}</span>
                        </div>
                        <div class="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                          <span>Confianza IA</span>
                          <span class="text-primary">98.4%</span>
                        </div>
                      </div>
                  </div>

                  <div class="flex flex-col gap-4">
                      <button 
                          @click="resetScan" 
                          class="btn-secondary w-full"
                      >
                          Probar otro
                      </button>
                      <button 
                          @click="router.push('/book')"
                          class="btn-primary w-full"
                      >
                          Reservar Sesión
                      </button>
                  </div>
              </div>
          </div>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  LucideChevronLeft, 
  LucideSparkles,
  LucideShieldCheck,
  LucideScissors,
  LucideCheck,
  LucideArrowLeftRight,
  LucideStar
} from 'lucide-vue-next'
import { FilesetResolver, FaceLandmarker } from '@mediapipe/tasks-vision'
import ProfessionalCamera from '../components/ProfessionalCamera.vue'
import { 
  generateHairstyle, 
  getHairstyleRecommendations, 
  detectFaceShape,
  FACE_SHAPES 
} from '../services/aiService'
import { createHairMask } from '../services/maskService'

const router = useRouter()
const cameraRef = ref(null)
const processCanvas = ref(null)

const step = ref('capture') // capture, processing, catalog, result
const isCameraActive = ref(false)
const capturedImage = ref(null)
const resultImage = ref(null)
const processingStatus = ref('')
const faceShape = ref('')
const recommendations = ref([])
const selectedStyle = ref(null)
const hairMask = ref(null)

let faceLandmarker = null

// Initialize FaceMesh
const initFaceAI = async () => {
    try {
        const filesetResolver = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm")
        faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
            baseOptions: {
                modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
                delegate: "GPU"
            },
            runningMode: "IMAGE",
            numFaces: 1
        })
    } catch (e) {
        console.error("Face AI failure:", e)
    }
}

const startCamera = () => {
    if (cameraRef.value) cameraRef.value.initCamera()
}

const onCameraStarted = () => {
    isCameraActive.value = true
}

const handleBack = () => {
    if (step.value === 'catalog') {
        step.value = 'capture'
        selectedStyle.value = null
    } else if (step.value === 'result') {
        step.value = 'catalog'
    } else {
        router.push('/')
    }
}

const handleCapture = async () => {
    const img = cameraRef.value.capture()
    if (!img) return

    capturedImage.value = img
    step.value = 'processing'
    processingStatus.value = 'Analizando Rostro'

    try {
        const htmlImg = new Image()
        htmlImg.src = img
        await new Promise(r => htmlImg.onload = r)

        const detection = faceLandmarker.detect(htmlImg)
        if (!detection || detection.faceLandmarks.length === 0) {
            throw new Error("No se detectó el rostro. Por favor, intenta de nuevo.")
        }

        const landmarks = detection.faceLandmarks[0]
        
        // 1. Detect Face Shape
        processingStatus.value = 'Definiendo Estructura'
        faceShape.value = detectFaceShape(landmarks)
        
        // 2. Get Recommendations from Catalog
        recommendations.value = getHairstyleRecommendations(faceShape.value)
        
        // 3. Create Mask (save for later AI gen)
        processingStatus.value = 'Creando Mapa Digital'
        hairMask.value = createHairMask(landmarks, htmlImg.width, htmlImg.height)

        // Show Catalog immediately
        setTimeout(() => {
            step.value = 'catalog'
        }, 800)
    } catch (e) {
        alert(e.message)
        step.value = 'capture'
    }
}

const selectStyle = (style) => {
    selectedStyle.value = style
}

const generateAIVirtual = async () => {
    if (!selectedStyle.value) return
    
    step.value = 'processing'
    processingStatus.value = 'IA Generando Estilo'

    try {
        const aiPrompt = `${selectedStyle.value.name}: ${selectedStyle.value.desc}`
        
        const resultUrl = await generateHairstyle(
            capturedImage.value, 
            hairMask.value, 
            aiPrompt
        )

        resultImage.value = resultUrl
        step.value = 'result'
    } catch (e) {
        alert("La IA está saturada. Intenta de nuevo en unos momentos o elige otro corte.")
        step.value = 'catalog'
    }
}

const resetScan = () => {
    step.value = 'capture'
    capturedImage.value = null
    resultImage.value = null
    selectedStyle.value = null
    isCameraActive.value = false
}

onMounted(() => {
    initFaceAI()
})
</script>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }

.animate-scan {
    animation: scan 3s ease-in-out infinite;
}

@keyframes scan {
    0%, 100% { top: 0%; opacity: 0; }
    50% { top: 100%; opacity: 1; }
}

@keyframes loading-scan {
    0% { transform: translateY(-80px); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translateY(80px); opacity: 0; }
}

.animate-loading-scan {
    animation: loading-scan 2s ease-in-out infinite;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(218, 165, 32, 0.2);
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(218, 165, 32, 0.4);
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
