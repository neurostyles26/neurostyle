<template>
  <transition
    enter-active-class="transition opacity-0"
    leave-active-class="transition duration-[1500ms] ease-in-out"
    leave-to-class="opacity-0 scale-110 blur-2xl"
  >
    <div v-if="show" class="fixed inset-0 z-[999] bg-[#020202] flex flex-col items-center justify-center overflow-hidden">
      <!-- Background Ambience -->
      <div class="absolute inset-0 pointer-events-none">
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[150px] rounded-full animate-pulse-slow"></div>
          <!-- Fine Grain/Noise Overlap -->
          <div class="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" :style="{ backgroundImage: 'url(https://grainy-gradients.vercel.app/noise.svg)' }"></div>
      </div>

      <!-- Content Container -->
      <div class="relative z-10 flex flex-col items-center">
        <!-- Logo with Elegant Reveal -->
        <div class="relative w-56 h-56 md:w-72 md:h-72 mb-12 group">
          <!-- Subtle Glow Ring -->
          <div class="absolute -inset-6 border border-primary/10 rounded-full animate-spin-extremely-slow"></div>
          
          <div class="relative w-full h-full flex items-center justify-center p-6 md:p-8">
            <img :src="logoImg" class="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(218,165,32,0.4)] animate-logo-entrance" alt="NeuroStyle" />
            
            <!-- Shimmer effect passing over logo -->
            <div class="absolute inset-0 overflow-hidden rounded-full">
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-logo-shimmer"></div>
            </div>
          </div>
        </div>

        <!-- Minimalist Progress -->
        <div class="flex flex-col items-center space-y-6">
            <!-- Animated Loading Line -->
            <div class="w-48 h-[1px] bg-white/10 rounded-full overflow-hidden relative">
                <div class="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-primary to-transparent w-full animate-elegant-progress"></div>
            </div>
            
            <!-- Percentage Counter -->
            <div class="flex flex-col items-center space-y-1">
              <div class="text-[10px] font-medium text-primary/60 uppercase tracking-[0.5em] animate-fade-in-delayed">
                Neural Syncing
              </div>
              <div class="text-[14px] font-light text-white/40 tracking-widest tabular-nums animate-fade-in-delayed">
                {{ progress }}%
              </div>
            </div>
        </div>
      </div>

      <!-- Bottom Branding -->
      <div class="absolute bottom-12 text-[8px] font-medium text-white/20 tracking-[0.6em] uppercase animate-fade-in-slow">
          EST. 2024 &bull; MASTER BARBERING &bull; NEURAL TECH
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import logoImg from '../assets/logo.png'

const show = ref(true)
const progress = ref(0)

onMounted(() => {
  // Smoothly increment progress
  const duration = 4000
  const interval = 40
  const step = 100 / (duration / interval)
  
  const timer = setInterval(() => {
    if (progress.value < 100) {
      progress.value = Math.min(100, Math.round(progress.value + step))
    } else {
      clearInterval(timer)
      setTimeout(() => {
        show.value = false
      }, 500)
    }
  }, interval)
})
</script>

<style scoped>
@keyframes pulse-slow {
  0%, 100% { opacity: 0.2; transform: scale(1) translate(-50%, -50%); }
  50% { opacity: 0.4; transform: scale(1.1) translate(-50%, -50%); }
}

.animate-pulse-slow {
  animation: pulse-slow 10s ease-in-out infinite;
}

@keyframes spin-extremely-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin-extremely-slow {
  animation: spin-extremely-slow 40s linear infinite;
}

@keyframes logo-entrance {
  0% { transform: scale(0.9) translateY(10px); opacity: 0; filter: blur(10px); }
  100% { transform: scale(1) translateY(0); opacity: 1; filter: blur(0); }
}

.animate-logo-entrance {
  animation: logo-entrance 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes logo-shimmer {
  0% { transform: translateX(-150%) skewX(-20deg); }
  100% { transform: translateX(150%) skewX(-20deg); }
}

.animate-logo-shimmer {
  animation: logo-shimmer 4s infinite cubic-bezier(0.4, 0, 0.2, 1) 2s;
}

@keyframes elegant-progress {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.animate-elegant-progress {
  animation: elegant-progress 4s cubic-bezier(0.65, 0, 0.35, 1) infinite;
}

@keyframes fade-in-delayed {
  0% { opacity: 0; transform: translateY(5px); }
  100% { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-delayed {
  opacity: 0;
  animation: fade-in-delayed 1.5s cubic-bezier(0.16, 1, 0.3, 1) 1.5s forwards;
}

@keyframes fade-in-slow {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.animate-fade-in-slow {
  opacity: 0;
  animation: fade-in-slow 3s ease-in 2s forwards;
}
</style>
