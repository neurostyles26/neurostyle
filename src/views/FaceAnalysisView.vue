<template>
  <div class="min-h-screen bg-[#0a0a0a] flex flex-col p-4 sm:p-6 font-inter overflow-hidden relative">
    <!-- Premium Gradient Background -->
    <div class="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
    
    <!-- Header -->
    <header class="flex items-center justify-between mb-6 z-10 relative">
      <button @click="handleBack" class="w-10 h-10 flex items-center justify-center bg-white/5 rounded-2xl hover:bg-white/10 transition-colors border border-white/10">
        <LucideChevronLeft class="text-primary" />
      </button>
      <div class="text-center">
          <h2 class="text-white font-outfit font-black text-xl tracking-tight uppercase">Simulador IA</h2>
          <div class="flex items-center justify-center gap-2 mt-1">
              <span class="w-1 h-1 rounded-full bg-primary animate-pulse"></span>
              <p class="text-primary text-[8px] font-black uppercase tracking-[0.4em] opacity-80">NeuroStyle Vision</p>
          </div>
      </div>
      <div class="w-10"></div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 flex flex-col relative z-10">
      
      <!-- 1. Camera / Capture Preview -->
      <div v-if="step === 'capture'" class="flex-1 flex flex-col">
        <div class="relative flex-1 rounded-[40px] overflow-hidden border border-white/10 bg-white/5 shadow-2xl mb-8 group">
            <ProfessionalCamera 
              ref="cameraRef" 
              @started="onCameraStarted"
            />
            
            <!-- Scanning Overlay Effect -->
            <div v-if="isCameraActive" class="absolute inset-0 pointer-events-none">
                <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan"></div>
                <!-- Corner Borders -->
                <div class="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-primary/50"></div>
                <div class="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-primary/50"></div>
                <div class="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-primary/50"></div>
                <div class="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-primary/50"></div>
            </div>

            <canvas ref="processCanvas" class="hidden"></canvas>
        </div>

        <div class="flex flex-col items-center gap-6">
            <button 
                @click="handleCapture" 
                :disabled="!isCameraActive"
                class="relative w-24 h-24 flex items-center justify-center group disabled:opacity-50"
            >
                <!-- Rotating Ring -->
                <div class="absolute inset-0 rounded-full border-2 border-dashed border-primary/30 animate-[spin_10s_linear_infinite]"></div>
                <!-- Button -->
                <div class="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all">
                    <div class="w-16 h-16 rounded-full border-4 border-black/5 flex items-center justify-center">
                        <div class="w-12 h-12 rounded-full bg-primary shadow-[0_0_20px_rgba(218,165,32,0.5)]"></div>
                    </div>
                </div>
            </button>
            <div class="text-center">
                <p class="text-white text-[10px] font-bold uppercase tracking-widest mb-1">Toca para capturar</p>
                <p class="text-gray-500 text-[8px] uppercase tracking-wider">La IA analizará tu tipo de rostro</p>
            </div>
        </div>
      </div>

      <!-- 2. AI Processing State -->
      <div v-if="step === 'processing'" class="flex-1 flex flex-col items-center justify-center">
          <div class="relative w-40 h-40 mb-12">
              <!-- Multiple Rings for Depth -->
              <div class="absolute inset-0 border-2 border-primary/10 rounded-full scale-110"></div>
              <div class="absolute inset-0 border-2 border-primary/20 rounded-full animate-ping"></div>
              <div class="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              
              <div class="absolute inset-0 m-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center backdrop-blur-xl">
                  <LucideSparkles class="text-primary animate-pulse" :size="48" />
              </div>

              <!-- Scanning Line -->
              <div class="absolute inset-x-0 h-[2px] bg-primary/50 shadow-[0_0_15px_rgba(218,165,32,1)] animate-loading-scan"></div>
          </div>
          <div class="text-center">
              <h3 class="text-white font-outfit font-black text-3xl uppercase tracking-widest mb-3">{{ processingStatus }}</h3>
              <div class="flex items-center justify-center gap-2">
                  <div v-for="i in 3" :key="i" class="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" :style="{ animationDelay: `${i * 0.2}s` }"></div>
                  <p class="text-gray-500 text-[10px] uppercase tracking-[0.3em] font-bold">Diseñando tu nueva imagen</p>
              </div>
          </div>

          <!-- Analysis Details Overlay (Subtle) -->
          <div class="mt-12 grid grid-cols-2 gap-4 w-full max-w-xs">
              <div class="bg-white/5 border border-white/10 p-3 rounded-2xl text-center backdrop-blur-md">
                  <p class="text-gray-500 text-[8px] uppercase font-black tracking-tighter mb-1">Estructura</p>
                  <p class="text-white text-[10px] font-bold">Analizando...</p>
              </div>
              <div class="bg-white/5 border border-white/10 p-3 rounded-2xl text-center backdrop-blur-md">
                  <p class="text-gray-500 text-[8px] uppercase font-black tracking-tighter mb-1">Simetría</p>
                  <p class="text-white text-[10px] font-bold">Buscando...</p>
              </div>
          </div>
      </div>

      <!-- 3. Catalog Recommendations -->
      <div v-if="step === 'catalog'" class="flex-1 flex flex-col h-full">
          <div class="mb-6">
              <div class="flex items-center gap-3 mb-2">
                  <div class="px-4 py-1.5 bg-primary/20 border border-primary/30 rounded-full">
                      <p class="text-primary text-[10px] font-black uppercase tracking-widest">Rostro: {{ faceShape }}</p>
                  </div>
                  <div class="flex-1 h-[1px] bg-white/10"></div>
              </div>
              <h3 class="text-white font-outfit font-black text-2xl uppercase tracking-tight">Cortes Recomendados</h3>
              <p class="text-gray-500 text-xs mt-1">Selecciona un estilo para realizar la simulación virtual</p>
          </div>

          <div class="flex-1 overflow-y-auto pr-2 space-y-4 pb-4 custom-scrollbar">
              <div 
                v-for="item in recommendations" 
                :key="item.id"
                @click="selectStyle(item)"
                class="group relative bg-[#121212] border transition-all duration-500 rounded-[32px] overflow-hidden cursor-pointer"
                :class="selectedStyle?.id === item.id ? 'border-primary shadow-[0_0_30px_rgba(218,165,32,0.15)] scale-[1.02]' : 'border-white/5 hover:border-white/20'"
              >
                  <div class="flex p-4 gap-4">
                      <!-- Image Preview -->
                      <div class="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-white/5 relative">
                          <img v-if="item.overlayImage" :src="item.overlayImage" class="w-full h-full object-cover" />
                          <div v-else class="w-full h-full flex items-center justify-center">
                              <LucideScissors class="text-white/20" :size="32" />
                          </div>
                          
                          <!-- Match Badge -->
                          <div class="absolute top-1 right-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded-lg border border-white/10">
                              <p class="text-primary text-[8px] font-black">{{ item.matchScore }}%</p>
                          </div>
                      </div>

                      <!-- Info -->
                      <div class="flex-1 flex flex-col justify-center">
                          <h4 class="text-white font-bold text-lg mb-1">{{ item.name }}</h4>
                          <p class="text-gray-500 text-[10px] leading-relaxed line-clamp-2 uppercase tracking-wide">{{ item.desc }}</p>
                          
                          <div class="flex items-center gap-2 mt-3">
                              <span class="px-2 py-0.5 rounded-md bg-white/5 text-[8px] font-bold text-gray-400 uppercase tracking-widest border border-white/10">Mantenimiento: {{ item.maintenance }}</span>
                              <div v-if="selectedStyle?.id === item.id" class="flex-1 flex justify-end">
                                  <div class="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                      <LucideCheck class="text-black" :size="12" />
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>

                  <!-- Selection Overlay Effect -->
                  <div v-if="selectedStyle?.id === item.id" class="absolute inset-0 border-2 border-primary pointer-events-none rounded-[32px]"></div>
              </div>
          </div>

          <!-- Floating Action Button -->
          <div class="pt-4 pb-2">
              <button 
                  @click="generateAIVirtual"
                  :disabled="!selectedStyle"
                  class="w-full group relative overflow-hidden bg-primary text-black font-black py-5 rounded-3xl transition-all disabled:opacity-30 disabled:grayscale"
              >
                  <span class="relative z-10 flex items-center justify-center gap-3 text-sm uppercase tracking-widest">
                      <LucideSparkles :size="20" class="group-hover:rotate-12 transition-transform" />
                      Probar con IA Real
                  </span>
                  <!-- Button Shine Effect -->
                  <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
              <p class="text-center text-gray-600 text-[9px] mt-4 uppercase tracking-[0.2em] font-bold">La generación por IA puede tardar unos segundos</p>
          </div>
      </div>

      <!-- 4. Result / Comparison -->
      <div v-if="step === 'result'" class="flex-1 flex flex-col">
          <div class="flex-1 flex flex-col gap-4 mb-6">
              <!-- Comparison Card -->
              <div class="flex-1 relative rounded-[40px] overflow-hidden border border-white/10 bg-black group shadow-2xl">
                  <!-- Swipe/Split View Placeholder - Simplified for now -->
                  <div class="absolute inset-0 flex">
                      <div class="w-1/2 relative overflow-hidden border-r border-white/20">
                          <img :src="capturedImage" class="absolute h-full w-auto max-w-none left-1/2 -translate-x-1/2 object-cover" />
                          <div class="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                              <p class="text-white text-[8px] font-black uppercase tracking-widest">Original</p>
                          </div>
                      </div>
                      <div class="w-1/2 relative overflow-hidden">
                          <img :src="resultImage" class="absolute h-full w-auto max-w-none left-1/2 -translate-x-1/2 object-cover" />
                          <div class="absolute top-4 right-4 bg-primary px-3 py-1 rounded-full shadow-lg">
                              <p class="text-black text-[8px] font-black uppercase tracking-widest">NeuroStyle IA</p>
                          </div>
                      </div>
                  </div>
                  
                  <!-- Divider Icon -->
                  <div class="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-white/30 backdrop-blur-md flex items-center justify-center">
                      <div class="w-8 h-8 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-xl">
                          <LucideArrowLeftRight class="text-white" :size="14" />
                      </div>
                  </div>
              </div>

              <!-- Info Card -->
              <div class="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-md">
                  <div class="flex items-center justify-between mb-2">
                      <h4 class="text-white font-black uppercase tracking-widest text-sm">{{ selectedStyle?.name }}</h4>
                      <div class="flex gap-1">
                          <LucideStar v-for="i in 5" :key="i" class="text-primary fill-primary" :size="10" />
                      </div>
                  </div>
                  <p class="text-gray-400 text-[10px] leading-relaxed">{{ selectedStyle?.desc }}</p>
              </div>
          </div>

          <div class="flex flex-col gap-3">
              <button 
                  @click="resetScan" 
                  class="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-5 rounded-2xl transition-all border border-white/10 uppercase tracking-widest text-xs"
              >
                  Probar otro estilo
              </button>
              <button 
                  class="w-full bg-primary text-black font-black py-5 rounded-2xl shadow-xl transition-all uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98]"
                  @click="router.push('/book')"
              >
                  Reservar Cita Ahora
              </button>
          </div>
      </div>

    </main>

    <!-- Privacy Consent Overlay -->
    <transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 translate-y-10" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-10">
        <div v-if="step === 'capture' && !isCameraActive" class="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-lg">
            <div class="bg-[#121212] w-full max-w-lg rounded-[48px] border border-white/10 p-8 shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden">
                <!-- Background Accent -->
                <div class="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[80px]"></div>
                
                <div class="relative z-10 text-center flex flex-col items-center">
                    <div class="w-20 h-20 bg-primary/10 rounded-[32px] flex items-center justify-center mb-8 border border-primary/20">
                        <LucideShieldCheck class="text-primary" :size="40" />
                    </div>
                    
                    <h2 class="text-white font-outfit font-black text-3xl uppercase tracking-tighter mb-4">Análisis Biométrico</h2>
                    <p class="text-primary/70 text-[10px] uppercase font-black tracking-[0.4em] mb-8">Privacidad Garantizada</p>
                    
                    <div class="space-y-5 text-gray-400 text-xs leading-relaxed mb-10 text-pretty">
                        <p>Para ofrecerte una simulación precisa, NeuroStyle procesará una representación matemática de tu rostro en tiempo real.</p>
                        <div class="grid grid-cols-1 gap-3">
                            <div class="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <div class="w-2 h-2 rounded-full bg-primary"></div>
                                </div>
                                <span class="text-left">Los datos **no se almacenan** permanentemente.</span>
                            </div>
                            <div class="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <div class="w-2 h-2 rounded-full bg-primary"></div>
                                </div>
                                <span class="text-left">Procesamiento local y seguro.</span>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col gap-4 w-full">
                        <button 
                            @click="startCamera" 
                            class="w-full bg-white text-black font-black py-6 rounded-[28px] uppercase tracking-widest text-sm shadow-xl hover:bg-primary transition-all duration-300"
                        >
                            Comenzar ahora
                        </button>
                        <button 
                            @click="router.push('/')" 
                            class="text-gray-500 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors py-2"
                        >
                            Volver al Inicio
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </transition>
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
        const resultUrl = await generateHairstyle(
            capturedImage.value, 
            hairMask.value, 
            selectedStyle.value.name // Using name for the prompt
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
</style>
