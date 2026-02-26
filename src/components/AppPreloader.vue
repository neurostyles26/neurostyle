<template>
  <transition
    enter-active-class="transition opacity-0"
    leave-active-class="transition duration-[1500ms] ease-in-out"
    leave-to-class="opacity-0 scale-125 blur-xl"
  >
    <div v-if="show" class="fixed inset-0 z-[999] bg-[#020202] flex flex-col items-center justify-center overflow-hidden">
      <!-- Background Ambience -->
      <div class="absolute inset-0 pointer-events-none">
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/10 blur-[200px] rounded-full animate-pulse-slow"></div>
          <div class="absolute inset-0 opacity-[0.05]" :style="{ backgroundImage: 'radial-gradient(circle, #DAA520 1px, transparent 1px)', backgroundSize: '60px 60px' }"></div>
          
          <!-- Moving Light Streaks -->
          <div class="absolute top-0 left-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent -translate-x-1/2 animate-shimmer-vertical"></div>
      </div>

      <!-- Center Logo Container -->
      <div class="relative z-10 flex flex-col items-center">
        <!-- Cinematic Barber Poles -->
        <div class="absolute -left-32 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center opacity-60 animate-entrance-left">
            <div class="w-6 h-56 relative overflow-hidden rounded-full border border-white/10 shadow-[0_0_30px_rgba(218,165,32,0.15)] bg-black">
                <!-- Metallic Caps -->
                <div class="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-primary/80 via-primary/40 to-transparent z-20"></div>
                <!-- Shimmering Stripes -->
                <div class="absolute inset-0 bg-barber-pole animate-barber-rotate scale-150 opacity-90"></div>
                <!-- Metallic Reflection -->
                <div class="absolute inset-y-0 left-1 w-1 bg-white/20 blur-[1px] z-10"></div>
                <div class="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-primary/80 via-primary/40 to-transparent z-20"></div>
            </div>
            <div class="mt-4 w-[1px] h-12 bg-gradient-to-b from-primary/40 to-transparent"></div>
        </div>

        <div class="absolute -right-32 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center opacity-60 animate-entrance-right">
            <div class="w-6 h-56 relative overflow-hidden rounded-full border border-white/10 shadow-[0_0_30px_rgba(218,165,32,0.15)] bg-black">
                <div class="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-primary/80 via-primary/40 to-transparent z-20"></div>
                <div class="absolute inset-0 bg-barber-pole animate-barber-rotate scale-150 opacity-90"></div>
                <div class="absolute inset-y-0 right-1 w-1 bg-white/10 blur-[1px] z-10"></div>
                <div class="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-primary/80 via-primary/40 to-transparent z-20"></div>
            </div>
            <div class="mt-4 w-[1px] h-12 bg-gradient-to-b from-primary/40 to-transparent"></div>
        </div>

        <div class="relative w-48 h-48 mb-16 animate-entrance">
          <!-- Multi-layered Outer Glows -->
          <div class="absolute inset-0 bg-primary/20 blur-[60px] rounded-full animate-pulse-glow"></div>
          <div class="absolute -inset-6 border border-primary/5 rounded-full animate-spin-slow"></div>
          <div class="absolute -inset-12 border border-white/[0.03] rounded-full animate-reverse-spin-slow"></div>
          
          <!-- Elegant Circular Logo Container -->
          <div class="relative w-full h-full bg-[#050505] border border-white/10 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(218,165,32,0.1)] p-12 overflow-hidden group">
            <img :src="logoImg" class="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(218,165,32,0.5)] animate-logo-float" alt="NeuroStyle" />
            
            <!-- Orbital Particles Simulation -->
            <div class="absolute inset-0 animate-shimmer opacity-30"></div>
          </div>
        </div>

        <!-- Welcome Message -->
        <div class="text-center space-y-6 animate-text-reveal">
          <h1 class="text-white font-outfit font-black text-4xl md:text-5xl tracking-tighter uppercase leading-none">
            NEURO<span class="gold-text-gradient italic gold-glow">STYLE</span>
          </h1>
          <div class="flex items-center justify-center space-x-4">
              <div class="h-[1px] w-8 bg-gradient-to-r from-transparent to-primary/40"></div>
              <p class="text-gray-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.6em]">
                Maestría Estética
              </p>
              <div class="h-[1px] w-8 bg-gradient-to-l from-transparent to-primary/40"></div>
          </div>
        </div>

        <!-- Progress Indicator -->
        <div class="mt-20 flex flex-col items-center space-y-4">
            <div class="w-64 h-[2px] bg-white/5 rounded-full overflow-hidden relative">
                <div class="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary to-primary/20 animate-progress-load"></div>
                <!-- Glint effect -->
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-glint"></div>
            </div>
            <div class="text-[8px] font-bold text-primary/40 uppercase tracking-[0.4em] animate-pulse">
                Escaneo Neural en Progreso
            </div>
        </div>
      </div>

      <!-- Bottom Branding -->
      <div class="absolute bottom-12 text-[7px] font-bold text-gray-800 tracking-[0.5em] uppercase animate-fade-in" style="animation-delay: 2s">
          &copy; 2024 NEUROSTYLE SISTEMAS DIGITALES
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import logoImg from '../assets/logo.png'

const show = ref(true)

onMounted(() => {
  setTimeout(() => {
    show.value = false
  }, 4500) // Slightly longer for cinematic impact
})
</script>

<style scoped>
@keyframes pulse-slow {
  0%, 100% { opacity: 0.3; transform: scale(1) translate(-50%, -50%); }
  50% { opacity: 0.6; transform: scale(1.1) translate(-50%, -50%); }
}

.animate-pulse-slow {
  animation: pulse-slow 8s ease-in-out infinite;
}

@keyframes pulse-glow {
    0%, 100% { opacity: 0.2; transform: scale(1); blur: 40px; }
    50% { opacity: 0.5; transform: scale(1.2); blur: 60px; }
}

.animate-pulse-glow {
    animation: pulse-glow 4s ease-in-out infinite;
}

@keyframes entrance {
  0% { transform: scale(0.7); opacity: 0; filter: blur(30px); }
  100% { transform: scale(1); opacity: 1; filter: blur(0); }
}

.animate-entrance {
  animation: entrance 2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes entrance-left {
    from { transform: translate(-50px, -50%); opacity: 0; }
    to { transform: translate(0, -50%); opacity: 0.6; }
}

.animate-entrance-left {
    animation: entrance-left 2s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards;
    opacity: 0;
}

@keyframes entrance-right {
    from { transform: translate(50px, -50%); opacity: 0; }
    to { transform: translate(0, -50%); opacity: 0.6; }
}

.animate-entrance-right {
    animation: entrance-right 2s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards;
    opacity: 0;
}

@keyframes text-reveal {
  0% { transform: translateY(30px); opacity: 0; filter: blur(10px); }
  100% { transform: translateY(0); opacity: 1; filter: blur(0); }
}

.animate-text-reveal {
  opacity: 0;
  animation: text-reveal 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.8s forwards;
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}

@keyframes reverse-spin-slow {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}

.animate-reverse-spin-slow {
  animation: reverse-spin-slow 25s linear infinite;
}

@keyframes logo-float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-12px) scale(1.02); }
}

.animate-logo-float {
  animation: logo-float 5s ease-in-out infinite;
}

@keyframes progress-load {
  0% { transform: translateX(-100%); width: 0%; }
  100% { transform: translateX(0); width: 100%; }
}

.animate-progress-load {
  animation: progress-load 3.5s cubic-bezier(0.65, 0, 0.35, 1) forwards;
}

@keyframes glint {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(200%); }
}

.animate-glint {
    animation: glint 2s infinite linear 0.5s;
}

@keyframes shimmer-vertical {
    0% { transform: translate(-50%, -100%); }
    100% { transform: translate(-50%, 100%); }
}

.animate-shimmer-vertical {
    animation: shimmer-vertical 4s infinite linear;
}

.bg-barber-pole {
  background: repeating-linear-gradient(
    -45deg,
    #ff0000,
    #ff0000 25px,
    #ffffff 25px,
    #ffffff 50px,
    #0000ff 50px,
    #0000ff 75px,
    #ffffff 75px,
    #ffffff 100px
  );
  background-size: 200% 200%;
}

@keyframes barber-rotate {
  from { background-position: 0 0; }
  to { background-position: 0 100%; }
}

.animate-barber-rotate {
  animation: barber-rotate 3s linear infinite;
}

.gold-glow {
  text-shadow: 0 0 25px rgba(218, 165, 32, 0.6);
}

.gold-text-gradient {
  background: linear-gradient(135deg, #DAA520 0%, #FFD700 50%, #B8860B 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
