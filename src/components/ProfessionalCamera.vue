<template>
  <div class="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
    <!-- Clean Camera Feed -->
    <video
      ref="videoRef"
      autoplay
      playsinline
      muted
      class="absolute inset-0 w-full h-full object-cover pointer-events-none"
      style="transform: scaleX(-1);"
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
    console.log("ProfessionalCamera: Iniciando initCamera...");
    if (loading.value) return
    loading.value = true
    error.value = false
    errorMessage.value = ''

    try {
        console.log("ProfessionalCamera: Solicitando permisos de cámara...");
        const constraints = {
            video: {
                facingMode: 'user',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        }

        let mediaStream
        try {
            mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
        } catch (e) {
            console.warn("ProfessionalCamera: Fallo con constraints ideales, intentando básicos...", e);
            mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        }
        
        console.log("ProfessionalCamera: Stream obtenido con éxito.");
        stream.value = mediaStream

        if (videoRef.value) {
            videoRef.value.srcObject = mediaStream
            
            // Wait for video to be ready with a timeout
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    console.warn("ProfessionalCamera: Timeout esperando onloadedmetadata, intentando play directo...");
                    videoRef.value.play().then(resolve).catch(reject);
                }, 3000);

                videoRef.value.onloadedmetadata = () => {
                    clearTimeout(timeout);
                    console.log("ProfessionalCamera: Metadata cargada, iniciando play...");
                    videoRef.value.play()
                        .then(() => {
                            console.log("ProfessionalCamera: Video reproduciéndose.");
                            resolve();
                        })
                        .catch(err => {
                            console.error("ProfessionalCamera: Error en video.play():", err);
                            reject(err);
                        });
                }
            })

            loading.value = false
            active.value = true
            console.log("ProfessionalCamera: Cámara activa, emitiendo 'started'.");
            emit('started')
        }
    } catch (err) {
        console.error("ProfessionalCamera: Error crítico:", err)
        error.value = true
        loading.value = false
        active.value = false
        
        if (err.name === 'NotAllowedError') {
            errorMessage.value = 'Permiso de cámara denegado. Por favor, actívalo en la configuración de tu navegador.'
        } else if (err.name === 'NotFoundError') {
            errorMessage.value = 'No se encontró ninguna cámara en este dispositivo.'
        } else {
            errorMessage.value = `Error: ${err.message || 'No se pudo acceder a la cámara.'}`
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
