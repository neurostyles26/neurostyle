<template>
  <div class="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
    <!-- Clean Camera Feed -->
    <video
      ref="videoRef"
      autoplay
      playsinline
      muted
      class="absolute inset-0 w-full h-full object-cover z-0"
      style="transform: scaleX(-1); background-color: transparent;"
    ></video>

    <!-- UI Overlay / Face Guide -->
    <div v-if="active" class="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center">
      <!-- Simple Face Guide Circle -->
      <div class="relative w-72 h-72 md:w-80 md:h-80 border-4 border-dashed border-primary/40 rounded-full flex items-center justify-center">
        <div class="absolute inset-0 bg-primary/5 rounded-full blur-2xl"></div>
        <div class="w-2 h-2 bg-primary rounded-full opacity-40"></div>
      </div>
      
      <!-- Instructional Text -->
      <div class="mt-12 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
        <p class="text-white text-xs font-bold uppercase tracking-widest">Ubica tu rostro en el círculo</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="absolute inset-0 z-50 flex flex-col items-center justify-center p-8 text-center bg-black/95">
      <div class="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
        <LucideCameraOff class="text-red-500" :size="32" />
      </div>
      <h3 class="text-white font-bold text-xl mb-2">Error de Acceso</h3>
      <p class="text-gray-400 text-sm mb-8">{{ errorMessage }}</p>
      <button @click="initCamera" class="px-10 py-4 bg-primary text-black rounded-2xl font-black uppercase text-xs tracking-widest">
        REINTENTAR
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="absolute inset-0 z-40 flex items-center justify-center bg-black">
      <div class="flex flex-col items-center">
        <div class="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p class="text-primary font-bold text-[10px] tracking-widest uppercase animate-pulse">Iniciando Cámara...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { LucideCameraOff } from 'lucide-vue-next'

const videoRef = ref(null)
const active = ref(false)
const loading = ref(false)
const error = ref(false)
const errorMessage = ref('')
const stream = ref(null)

const emit = defineEmits(['started'])

const initCamera = async () => {
    console.log("ProfessionalCamera: Iniciando proceso...");
    if (loading.value) return
    loading.value = true
    error.value = false
    errorMessage.value = ''

    try {
        const constraints = {
            video: {
                facingMode: 'user',
                width: { ideal: 640 }, // Using lower ideal resolution for better compatibility
                height: { ideal: 480 }
            },
            audio: false
        }

        let mediaStream
        try {
            console.log("Tentativa 1: MediaDevices con constraints...");
            mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
        } catch (e) {
            console.warn("Tentativa 2: Fallo constraints, usando genéricos...", e);
            mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
        }
        
        stream.value = mediaStream

        if (videoRef.value) {
            console.log("Cámara: Configurando elemento video...");
            const video = videoRef.value

            // Asegurar que el stream tiene tracks activos
            const videoTracks = mediaStream.getVideoTracks()
            if (videoTracks.length > 0) {
                console.log(`Cámara: Track encontrado - ${videoTracks[0].label}`);
                videoTracks[0].enabled = true
            }

            video.srcObject = mediaStream
            
            // Forzar atributos para máxima compatibilidad
            video.setAttribute('muted', '')
            video.setAttribute('playsinline', '')
            video.setAttribute('autoplay', '')
            video.muted = true
            
            const onStreamStarted = () => {
                if (video.readyState >= 2) { // HAVE_CURRENT_DATA
                    console.log("Cámara: Video reproduciendo con datos suficientes.");
                    loading.value = false
                    active.value = true
                    emit('started')
                    cleanup()
                }
            }

            const cleanup = () => {
                video.removeEventListener('playing', onStreamStarted)
                video.removeEventListener('canplay', onStreamStarted)
                video.removeEventListener('loadeddata', onStreamStarted)
            }

            video.addEventListener('playing', onStreamStarted)
            video.addEventListener('canplay', onStreamStarted)
            video.addEventListener('loadeddata', onStreamStarted)

            // Intentar reproducir con varios intentos
            const tryPlay = async (attempt = 1) => {
                try {
                    await video.play()
                    console.log(`Cámara: Play exitoso en intento ${attempt}`);
                    // En algunos navegadores play() resuelve pero el video no se ve de inmediato
                    if (video.readyState >= 2) onStreamStarted()
                } catch (err) {
                    console.warn(`Cámara: Intento ${attempt} de play() falló:`, err);
                    if (attempt < 3) {
                        setTimeout(() => tryPlay(attempt + 1), 500)
                    } else {
                        // Último recurso: si el usuario interactúa, suele desbloquear el video
                        console.error("Cámara: Todos los intentos de play() fallaron.");
                        errorMessage.value = "Toca aquí para activar la cámara manualmente si no te ves."
                        error.value = true
                        loading.value = false
                    }
                }
            }

            tryPlay()
            
            // Safety timeout
            setTimeout(() => {
                if (loading.value && !error.value) {
                    console.log("Cámara: Timeout alcanzado, forzando visibilidad.");
                    onStreamStarted()
                }
            }, 5000)
        }
    } catch (err) {
        console.error("Error crítico de cámara:", err)
        error.value = true
        loading.value = false
        active.value = false
        
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            errorMessage.value = 'Permiso de cámara denegado. Por favor, habilítalo en tu navegador.'
        } else {
            errorMessage.value = `Error: ${err.message || 'No se puede acceder a la cámara.'}`
        }
    }
}

const capture = () => {
    if (!videoRef.value || !active.value) return null

    const video = videoRef.value
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')

    // Mirror horizontal for natural capture
    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    return canvas.toDataURL('image/jpeg', 0.9)
}

const stopCamera = () => {
    if (stream.value) {
        stream.value.getTracks().forEach(track => track.stop())
        stream.value = null
    }
    active.value = false
}

onMounted(() => {
    // We don't auto-init here as the parent view handles the flow after consent
})

onUnmounted(() => {
    stopCamera()
})

defineExpose({
    initCamera,
    capture,
    stopCamera
})
</script>
