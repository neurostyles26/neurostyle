<template>
  <div class="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
    <!-- Camera Feed -->
    <video
      ref="videoRef"
      autoplay
      playsinline
      muted
      class="absolute inset-0 w-full h-full object-cover"
      style="transform: scaleX(-1);"
    ></video>

    <!-- HUD / Mesh Canvas Overlay -->
    <canvas
      ref="canvasRef"
      class="absolute inset-0 w-full h-full z-10 pointer-events-none"
      style="transform: scaleX(-1);"
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
    <div v-if="active" class="absolute inset-0 pointer-events-none z-20 flex flex-col items-center justify-center p-10">
        <!-- Frame Accents (Thicker and brighter) -->
        <div class="absolute inset-x-6 inset-y-12 border border-white/5 rounded-[60px]">
            <div :class="['absolute top-0 left-0 w-20 h-20 border-t-[8px] border-l-[8px] rounded-tl-[50px] m-1 transition-all duration-500 shadow-[0_0_15px_rgba(218,165,32,0.3)]', isQualityGood ? 'border-primary' : 'border-red-500/60']"></div>
            <div :class="['absolute top-0 right-0 w-20 h-20 border-t-[8px] border-r-[8px] rounded-tr-[50px] m-1 transition-all duration-500 shadow-[0_0_15px_rgba(218,165,32,0.3)]', isQualityGood ? 'border-primary' : 'border-red-500/60']"></div>
            <div :class="['absolute bottom-0 left-0 w-20 h-20 border-b-[8px] border-l-[8px] rounded-bl-[50px] m-1 transition-all duration-500 shadow-[0_0_15px_rgba(218,165,32,0.3)]', isQualityGood ? 'border-primary' : 'border-red-500/60']"></div>
            <div :class="['absolute bottom-0 right-0 w-20 h-20 border-b-[8px] border-r-[8px] rounded-br-[50px] m-1 transition-all duration-500 shadow-[0_0_15px_rgba(218,165,32,0.3)]', isQualityGood ? 'border-primary' : 'border-red-500/60']"></div>
        </div>

        <!-- HUD Left (Enhanced Contrast) -->
        <div class="absolute top-24 left-14 text-white/50 font-mono text-[9px] space-y-3 uppercase tracking-[0.2em] hidden md:block">
            <div class="flex items-center">
                <div :class="['w-1.5 h-1.5 mr-3 transition-colors duration-500', isQualityGood ? 'bg-primary' : 'bg-red-500']"></div>
                <span class="gold-glow">SENS_VAL: {{ metrics.heightWidthRatio ? metrics.heightWidthRatio.toFixed(2) : 'CALIBRATING' }}</span>
            </div>
            <div class="flex items-center">
                <div :class="['w-1.5 h-1.5 mr-3 transition-colors duration-500', isQualityGood ? 'bg-primary' : 'bg-red-500']"></div>
                <span class="gold-glow">BIOM_LOCK: {{ isQualityGood ? 'HIGH' : 'LOW' }}</span>
            </div>
            <div class="flex items-center">
                <div :class="['w-1.5 h-1.5 mr-3 transition-colors duration-500', isQualityGood ? 'bg-primary' : 'bg-red-500']"></div>
                <span class="gold-glow">QUALITY: {{ qualityScore }}%</span>
            </div>
        </div>

        <!-- HID Right -->
        <div class="absolute top-24 right-14 text-right text-white/30 font-mono text-[9px] space-y-3 uppercase tracking-[0.2em] hidden md:block">
            <p class="gold-glow">X: {{ Math.round(facePos.x * 100) }} Y: {{ Math.round(facePos.y * 100) }}</p>
            <p>RESOLUTION: 720P</p>
            <p class="text-primary/40">NEURAL_ENGINE: AKTIV</p>
        </div>

        <!-- Status Warnings -->
        <div class="absolute bottom-36 text-center pointer-events-none">
            <transition enter-active-class="animate-bounce" leave-active-class="opacity-0">
                <div v-if="warning" class="bg-red-600 text-white font-black text-[10px] px-8 py-3 rounded-full uppercase tracking-[0.3em] shadow-2xl border border-white/10">
                    {{ warning }}
                </div>
                <div v-else-if="isQualityGood" class="bg-primary text-black font-black text-[10px] px-8 py-3 rounded-full uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(218,165,32,0.4)] animate-pulse">
                    Centro Óptico Identificado
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
            video.srcObject = mediaStream
            
            // Wait for camera primarily
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => reject(new Error("Video timeout")), 8000)
                video.onloadedmetadata = () => {
                    clearTimeout(timeout)
                    video.play().then(resolve).catch(reject)
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
            const currentMetrics = calculateFaceMetrics(landmarksRes.faceLandmarks[0])
            const result = determineFaceShape(currentMetrics)
            return {
                img: canvas.toDataURL('image/jpeg', 0.8),
                biometrics: result
            }
        }
        return null
    }
})
</script>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
</style>
