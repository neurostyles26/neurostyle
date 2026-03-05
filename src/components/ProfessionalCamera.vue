  <div class="relative w-full h-full bg-transparent overflow-hidden flex items-center justify-center">
    <!-- Camera Feed (The Bottom Layer) -->
    <video
      ref="videoRef"
      autoplay
      playsinline
      muted
      webkit-playsinline
      class="absolute inset-0 w-full h-full object-cover pointer-events-none"
      style="transform: scaleX(-1); object-position: center; z-index: 0; opacity: 1 !important;"
    ></video>

    <!-- HUD / Mesh Canvas Overlay -->
    <canvas
      ref="canvasRef"
      class="absolute inset-0 w-full h-full pointer-events-none"
      style="transform: scaleX(-1); z-index: 10;"
      :class="{ 'opacity-0': !active, 'opacity-100': active }"
    ></canvas>

    <!-- Error State -->
    <div v-if="error" class="absolute inset-0 z-50 flex flex-col items-center justify-center p-8 text-center bg-black/90">
      <div class="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
        <LucideCameraOff class="text-red-500" :size="32" />
      </div>
      <h3 class="text-white font-bold text-xl mb-2">Error de Cámara</h3>
      <p class="text-gray-400 text-sm mb-8">{{ errorMessage }}</p>
      <button @click="initCamera" class="px-8 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all font-bold">
        REINTENTAR
      </button>
    </div>

    <!-- Permission Request -->
    <div v-if="!active && !error && !loading" class="absolute inset-0 z-40 flex flex-col items-center justify-center p-8 bg-black">
        <div class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-8 animate-pulse">
            <LucideShieldCheck class="text-primary" :size="40" />
        </div>
        <h2 class="text-white text-2xl font-outfit font-bold mb-4">Acceso Requerido</h2>
        <p class="text-gray-400 text-center text-sm mb-10 max-w-xs leading-relaxed">
            Necesitamos acceso a tu cámara para realizar el escaneo biométrico 3D.
        </p>
        <button @click="initCamera" class="w-full max-w-xs bg-primary text-black font-bold py-5 rounded-2xl shadow-lg shadow-primary/20">
            CONCEDER PERMISO
        </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="absolute inset-0 z-30 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div class="flex flex-col items-center">
          <div class="relative w-20 h-20 mb-6">
              <div class="absolute inset-0 border-2 border-primary/20 rounded-full"></div>
              <div class="absolute inset-0 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p class="text-primary font-black text-[10px] tracking-[0.4em] uppercase animate-pulse">Cargando Motores Biométricos...</p>
      </div>
    </div>

    <!-- Real-time HUD UI -->
    <div v-if="active" class="absolute inset-0 pointer-events-none z-20 flex flex-col items-center justify-center">
        <!-- Visual Silhouette Guide (The Frame) -->
        <div class="absolute inset-0 flex items-center justify-center opacity-40 transition-all duration-700" :class="isQualityGood ? 'scale-100' : 'scale-[1.05]'">
            <svg width="100%" height="100%" viewBox="0 0 400 600" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full max-w-lg">
                <path 
                    d="M200 100C120 100 60 160 60 280C60 400 120 500 200 500C280 500 340 400 340 280C340 160 280 100 200 100Z" 
                    :stroke="isQualityGood ? '#DAA520' : '#ef4444'" 
                    stroke-width="2" 
                    stroke-dasharray="10 10"
                    class="transition-colors duration-500"
                />
                <circle cx="200" cy="220" r="5" :fill="isQualityGood ? '#DAA520' : '#ef4444'" class="animate-pulse" />
                <rect x="140" y="480" width="120" height="2" :fill="isQualityGood ? '#DAA520' : '#ef4444'" opacity="0.5" />
            </svg>
        </div>

        <!-- Frame Accents (Corner brackets) -->
        <div class="absolute inset-x-8 inset-y-16 border border-white/5 rounded-[60px]">
            <div :class="['absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 rounded-tl-[40px] transition-all duration-500', isQualityGood ? 'border-primary' : 'border-red-500/40']"></div>
            <div :class="['absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 rounded-tr-[40px] transition-all duration-500', isQualityGood ? 'border-primary' : 'border-red-500/40']"></div>
            <div :class="['absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 rounded-bl-[40px] transition-all duration-500', isQualityGood ? 'border-primary' : 'border-red-500/40']"></div>
            <div :class="['absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 rounded-br-[40px] transition-all duration-500', isQualityGood ? 'border-primary' : 'border-red-500/40']"></div>
        </div>

        <!-- Status Warnings (Center bottom) -->
        <div class="absolute bottom-40 w-full flex justify-center px-10">
            <transition enter-active-class="animate-bounce" leave-active-class="opacity-0">
                <div v-show="warning" class="bg-red-600/90 backdrop-blur-md text-white font-black text-[10px] px-10 py-4 rounded-full uppercase tracking-[0.3em] shadow-2xl border border-white/10 text-center">
                    {{ warning }}
                </div>
            </transition>
            <transition enter-active-class="animate-pulse" leave-active-class="opacity-0">
                <div v-show="!warning && isQualityGood" class="bg-primary text-black font-black text-[10px] px-10 py-4 rounded-full uppercase tracking-[0.3em] shadow-[0_0_50px_rgba(218,165,32,0.4)] text-center">
                    Posición Perfecta - Analizando
                </div>
                <div v-show="!warning && !isQualityGood && active" class="bg-white/10 backdrop-blur-md text-white/60 font-black text-[10px] px-10 py-4 rounded-full uppercase tracking-[0.3em] border border-white/5 text-center">
                    Encuadra tu rostro en la silueta
                </div>
            </transition>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted, nextTick } from 'vue'
import { LucideCameraOff, LucideShieldCheck } from 'lucide-vue-next'
import { FilesetResolver, FaceLandmarker } from '@mediapipe/tasks-vision'
import { calculateFaceMetrics, validateScanQuality, determineFaceShape } from '../services/biometricLogic'

const videoRef = ref(null)
const canvasRef = ref(null)
const active = ref(false)
const loading = ref(false)
const error = ref(false)
const errorMessage = ref('')
const stream = ref(null)

// Biometric States
let faceLandmarker = null
let animationId = null
const qualityScore = ref(0)
const isQualityGood = ref(false)
const warning = ref('')
const metrics = ref({})
const facePos = ref({ x: 0, y: 0 })

const emit = defineEmits(['quality-change', 'started'])

const initFaceLandmarker = async () => {
    try {
        const filesetResolver = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
        )
        const landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
            baseOptions: {
                modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
                delegate: "GPU"
            },
            outputFaceBlendshapes: true,
            runningMode: "VIDEO",
            numFaces: 1
        })
        faceLandmarker = landmarker
        return landmarker
    } catch (err) {
        console.error("FaceLandmarker Init Error:", err)
        // Non-blocking error, we can still show camera
        return null
    }
}

const initCamera = async () => {
    if (loading.value) return
    loading.value = true
    error.value = false
    errorMessage.value = ''
    
    try {
        const landmarkerPromise = initFaceLandmarker()
        
        const constraints = {
            video: {
                facingMode: 'user',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        }
        
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
        stream.value = mediaStream
        
        if (videoRef.value) {
            const video = videoRef.value
            // Force playback and wait for actual frames
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => reject(new Error("Video playback timeout")), 10000);
                
                const onPlaying = () => {
                    if (video.videoWidth > 0) {
                        clearTimeout(timeout);
                        video.removeEventListener('playing', onPlaying);
                        resolve();
                    }
                };

                video.addEventListener('playing', onPlaying);
                
                video.srcObject = mediaStream;
                video.load();
                
                // Play might return a promise
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch(err => {
                        console.error("Play error:", err);
                        // If it's a permission/interruption error, we still try to proceed
                        if (video.readyState >= 2) resolve();
                        else reject(err);
                    });
                }
            })
            
            // Landmarker is secondary
            try {
                await landmarkerPromise
            } catch (e) {
                console.warn("Face AI failed to load, basic camera mode enabled.")
            }
            
            loading.value = false
            active.value = true
            emit('started')
            nextTick(() => startScanning())
        }
    } catch (err) {
        console.error("Diagnostic Error:", err)
        error.value = true
        loading.value = false
        active.value = false
        errorMessage.value = err.message || 'Error de acceso a cámara.'
    }
}

const startScanning = () => {
    if (!videoRef.value || !canvasRef.value || !faceLandmarker) return

    const video = videoRef.value
    const canvas = canvasRef.value
    const ctx = canvas.getContext('2d')

    const update = () => {
        if (!active.value || video.paused || video.ended) return
        
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        const results = faceLandmarker.detectForVideo(video, performance.now())
        
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        if (results.faceLandmarks && results.faceLandmarks.length > 0) {
            const landmarks = results.faceLandmarks[0]
            
            // 1. Calculate Biometrics
            const currentMetrics = calculateFaceMetrics(landmarks)
            const quality = validateScanQuality(landmarks, currentMetrics)
            
            metrics.value = currentMetrics
            qualityScore.value = quality.score
            isQualityGood.value = quality.score > 85
            facePos.value = { x: landmarks[1].x, y: landmarks[1].y }

            // 2. Set Warning
            if (quality.tilted) warning.value = 'Cabecera Inclinada'
            else if (!quality.centered) warning.value = 'Centra tu Rostro'
            else if (quality.distance === 'TOO_CLOSE') warning.value = 'Aléjate un poco'
            else if (quality.distance === 'TOO_FAR') warning.value = 'Acércate un poco'
            else warning.value = ''

            emit('quality-change', { 
                isGood: isQualityGood.value, 
                score: qualityScore.value,
                warning: warning.value
            })

            // 3. Draw HUD Overlay
            drawHolographicMesh(ctx, landmarks)
            drawScanningHUD(ctx)
        } else {
            isQualityGood.value = false
            qualityScore.value = 0
            warning.value = 'Rostro no detectado'
        }

        animationId = requestAnimationFrame(update)
    }
    
    update()
}

const drawHolographicMesh = (ctx, landmarks) => {
    ctx.lineWidth = 0.5
    ctx.strokeStyle = isQualityGood.value ? 'rgba(218, 165, 32, 0.4)' : 'rgba(239, 68, 68, 0.3)'
    
    // Draw connections (Sample points for performance)
    ctx.beginPath()
    for (let i = 0; i < landmarks.length; i += 5) {
        const p = landmarks[i]
        const x = p.x * ctx.canvas.width
        const y = p.y * ctx.canvas.height
        
        // Dots
        ctx.fillStyle = isQualityGood.value ? '#DAA520' : '#ef4444'
        ctx.fillRect(x - 0.5, y - 0.5, 1, 1)
        
        if (i + 5 < landmarks.length) {
            const nextP = landmarks[i+5]
            ctx.moveTo(x, y)
            ctx.lineTo(nextP.x * ctx.canvas.width, nextP.y * ctx.canvas.height)
        }
    }
    ctx.stroke()
}

const drawScanningHUD = (ctx) => {
    const time = performance.now() / 1000
    const scanPos = (time % 2) / 2
    
    const laserY = scanPos * ctx.canvas.height
    ctx.beginPath()
    ctx.strokeStyle = '#DAA520'
    ctx.lineWidth = 1
    ctx.moveTo(0, laserY)
    ctx.lineTo(ctx.canvas.width, laserY)
    
    const gradient = ctx.createLinearGradient(0, laserY - 100, 0, laserY + 100)
    gradient.addColorStop(0, 'transparent')
    gradient.addColorStop(0.5, 'rgba(218, 165, 32, 0.1)')
    gradient.addColorStop(1, 'transparent')
    ctx.fillStyle = gradient
    ctx.fillRect(0, laserY - 100, ctx.canvas.width, 200)
    ctx.stroke()
}

onUnmounted(() => {
    cancelAnimationFrame(animationId)
    active.value = false
    if (stream.value) {
        stream.value.getTracks().forEach(track => track.stop())
    }
    if (faceLandmarker) faceLandmarker.close()
})

defineExpose({
    initCamera,
    capture: () => {
        if (!videoRef.value || !faceLandmarker) return null
        
        const video = videoRef.value
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        
        ctx.scale(-1, 1)
        ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height)
        
        const landmarksRes = faceLandmarker.detectForVideo(video, performance.now())
        if (landmarksRes.faceLandmarks && landmarksRes.faceLandmarks.length > 0) {
            const landmarks = landmarksRes.faceLandmarks[0]
            const currentMetrics = calculateFaceMetrics(landmarks)
            const result = determineFaceShape(currentMetrics)
            return {
                img: canvas.toDataURL('image/jpeg', 0.8),
                biometrics: result,
                landmarks: landmarks
            }
        }
        return null
    }
})
</script>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
</style>
