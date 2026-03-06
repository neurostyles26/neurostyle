<template>
  <div class="min-h-screen bg-[#0a0a0a] flex flex-col p-6 font-inter overflow-hidden relative">
    <!-- Header -->
    <header class="flex items-center justify-between mb-8 z-10">
      <router-link to="/" class="w-12 h-12 flex items-center justify-center bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
        <LucideChevronLeft class="text-primary" />
      </router-link>
      <div class="text-center">
          <h2 class="text-white font-outfit font-black text-2xl tracking-tight uppercase">Simulador IA</h2>
          <p class="text-primary text-[9px] font-black uppercase tracking-[0.4em] opacity-80 mt-1">Transformación en Tiempo Real</p>
      </div>
      <div class="w-12"></div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 flex flex-col relative">
      
      <!-- 1. Camera / Capture Preview -->
      <div v-if="step === 'capture'" class="flex-1 flex flex-col">
        <div class="relative flex-1 rounded-[40px] overflow-hidden border border-white/10 bg-white/5 shadow-2xl mb-8">
            <ProfessionalCamera 
              ref="cameraRef" 
              @started="onCameraStarted"
            />
            
            <!-- Hidden Canvas for FaceMesh Processing -->
            <canvas ref="processCanvas" class="hidden"></canvas>
        </div>

        <div class="flex flex-col items-center gap-6">
            <button 
                @click="handleCapture" 
                :disabled="!isCameraActive"
                class="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-90 transition-all disabled:opacity-20"
            >
                <div class="w-16 h-16 rounded-full border-4 border-black/5 flex items-center justify-center">
                    <div class="w-12 h-12 rounded-full bg-primary shadow-lg"></div>
                </div>
            </button>
            <p class="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Toca para capturar tu foto</p>
        </div>
      </div>

      <!-- 2. AI Processing State -->
      <div v-if="step === 'processing'" class="flex-1 flex flex-col items-center justify-center">
          <div class="relative w-32 h-32 mb-8">
              <div class="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
              <div class="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <LucideSparkles class="absolute inset-0 m-auto text-primary animate-pulse" :size="40" />
          </div>
          <h3 class="text-white font-black text-2xl uppercase tracking-widest mb-2">{{ processingStatus }}</h3>
          <p class="text-gray-500 text-xs uppercase tracking-[0.2em] animate-pulse">La IA está diseñando tu nuevo estilo...</p>
      </div>

      <!-- 3. Result / Comparison -->
      <div v-if="step === 'result'" class="flex-1 flex flex-col">
          <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <!-- Original -->
              <div class="relative rounded-3xl overflow-hidden border border-white/10 group">
                  <img :src="capturedImage" class="w-full h-full object-cover" />
                  <div class="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                      <p class="text-white text-[10px] font-bold uppercase tracking-widest">Original</p>
                  </div>
              </div>
              <!-- Result -->
              <div class="relative rounded-3xl overflow-hidden border border-primary/30 shadow-[0_0_30px_rgba(218,165,32,0.1)]">
                  <img :src="resultImage" class="w-full h-full object-cover" />
                  <div class="absolute bottom-4 left-4 bg-primary px-3 py-1 rounded-full shadow-lg">
                      <p class="text-black text-[10px] font-black uppercase tracking-widest">Nuevo Estilo</p>
                  </div>
              </div>
          </div>

          <div class="flex flex-col gap-4">
              <button 
                  @click="resetScan" 
                  class="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-5 rounded-2xl transition-all border border-white/10 uppercase tracking-widest text-xs"
              >
                  Probar otro estilo
              </button>
              <button 
                  class="w-full bg-primary text-black font-black py-5 rounded-2xl shadow-lg transition-all uppercase tracking-widest text-xs"
                  @click="router.push('/book')"
              >
                  Reservar este corte
              </button>
          </div>
      </div>

    </main>

    <!-- Privacy Consent Overlay -->
    <transition enter-active-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="opacity-0 scale-95">
        <div v-if="step === 'capture' && !isCameraActive" class="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div class="bg-[#121212] w-full max-w-lg rounded-[40px] border border-white/10 p-8 shadow-2xl">
                <div class="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mb-6">
                    <LucideShieldCheck class="text-primary" :size="32" />
                </div>
                
                <h2 class="text-white font-outfit font-black text-2xl uppercase tracking-tight mb-4">Aviso de Privacidad y Derechos</h2>
                
                <div class="space-y-4 text-gray-400 text-sm leading-relaxed mb-8">
                    <p>
                        Para ofrecerte una simulación precisa, NeuroStyle procesará una representación matemática de tu rostro (Face Mesh) en tiempo real. 
                    </p>
                    <ul class="space-y-2">
                        <li class="flex items-start gap-3">
                            <div class="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
                            <span>Tus datos biométricos **no se almacenan** de forma permanente.</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <div class="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
                            <span>La imagen se utiliza únicamente para el análisis de estilo por IA.</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <div class="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
                            <span>Al continuar, otorgas permiso para acceder a tu cámara y procesar tu imagen.</span>
                        </li>
                    </ul>
                </div>

                <div class="flex flex-col gap-3">
                    <button 
                        @click="startCamera" 
                        class="w-full bg-primary text-black font-black py-5 rounded-2xl uppercase tracking-widest text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        Aceptar y Continuar
                    </button>
                    <button 
                        @click="router.push('/')" 
                        class="w-full bg-white/5 text-white/50 font-bold py-4 rounded-2xl uppercase tracking-widest text-[10px] hover:text-white transition-colors"
                    >
                        Cancelar
                    </button>
                </div>

                <p class="text-[9px] text-center text-gray-600 mt-6 uppercase tracking-wider">
                    Powered by NeuroStyle AI • Protegemos tu privacidad
                </p>
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
  LucideCamera,
  LucideShieldCheck
} from 'lucide-vue-next'
import { FilesetResolver, FaceLandmarker } from '@mediapipe/tasks-vision'
import ProfessionalCamera from '../components/ProfessionalCamera.vue'
import { generateHairstyle, getHairstyleRecommendations } from '../services/aiService'
import { createHairMask } from '../services/maskService'

const router = useRouter()
const cameraRef = ref(null)
const processCanvas = ref(null)

const step = ref('capture') // capture, processing, result
const isCameraActive = ref(false)
const capturedImage = ref(null)
const resultImage = ref(null)
const processingStatus = ref('')

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
    console.log("FaceAnalysisView: Llamando a initCamera()");
    if (cameraRef.value) cameraRef.value.initCamera()
}

const onCameraStarted = () => {
    console.log("FaceAnalysisView: Evento 'started' recibido");
    isCameraActive.value = true
}

const handleCapture = async () => {
    console.log("FaceAnalysisView: Iniciando captura...");
    const img = cameraRef.value.capture()
    if (!img) return

    capturedImage.value = img
    step.value = 'processing'
    processingStatus.value = 'Detectando Rostro'

    try {
        // 1. Detect Face Landmarks for Mask
        const htmlImg = new Image()
        htmlImg.src = img
        await new Promise(r => htmlImg.onload = r)

        const detection = faceLandmarker.detect(htmlImg)
        if (!detection || detection.faceLandmarks.length === 0) {
            throw new Error("No se detectó el rostro. Por favor, intenta de nuevo.")
        }

        processingStatus.value = 'Generando Máscara'
        const landmarks = detection.faceLandmarks[0]
        const mask = createHairMask(landmarks, htmlImg.width, htmlImg.height)

        processingStatus.value = 'IA Procesando'
        // For now using classic fade as default recommendation
        const styles = getHairstyleRecommendations('Ovalado') 
        const resultUrl = await generateHairstyle(img, mask, styles[0].prompt)

        resultImage.value = resultUrl
        step.value = 'result'
    } catch (e) {
        alert(e.message)
        step.value = 'capture'
    }
}

const resetScan = () => {
    step.value = 'capture'
    capturedImage.value = null
    resultImage.value = null
    isCameraActive.value = false
}

onMounted(() => {
    initFaceAI()
})
</script>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
</style>

