<template>
  <div class="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#020202] py-12 px-6 font-inter">
    <!-- Sophisticated Background -->
    <div class="absolute inset-0 z-0 pointer-events-none">
      <div class="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full animate-pulse-slow"></div>
      <div class="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-primary/5 blur-[130px] rounded-full animate-pulse-slow" style="animation-delay: 4s"></div>
      
      <!-- Micro-grid pattern -->
      <div class="absolute inset-0 opacity-[0.03]" :style="{ backgroundImage: 'radial-gradient(circle, #DAA520 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }"></div>
      
      <!-- Decorative Lines -->
      <div class="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
      <div class="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
    </div>

    <!-- Content -->
    <div class="z-10 w-full max-w-5xl text-center flex flex-col items-center">
      <!-- Premium Logo Section -->
      <div class="mb-12 group cursor-default">
        <div class="relative w-32 h-32 mx-auto transition-all duration-700 group-hover:scale-105">
          <div class="absolute inset-0 bg-primary/30 blur-3xl rounded-full opacity-40 group-hover:opacity-70 transition-opacity duration-700"></div>
          <div class="relative w-full h-full glass-panel rounded-full flex items-center justify-center shadow-2xl border-white/10 overflow-hidden p-8">
             <img :src="logoImg" class="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(218,165,32,0.4)] transition-transform duration-700 group-hover:scale-110" alt="NeuroStyle Logo" />
             <!-- Shimmer effect on logo -->
             <div class="absolute inset-x-0 top-0 h-full w-full bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer-logo"></div>
          </div>
        </div>
      </div>

      <div class="overflow-hidden mb-4">
          <h1 class="text-white text-5xl md:text-8xl font-outfit font-black tracking-[-0.05em] leading-none animate-reveal-text">
            NEURO<span class="gold-text-gradient gold-glow italic">STYLE</span>
          </h1>
      </div>
      
      <p class="text-gray-400 text-base md:text-lg max-w-xl mx-auto mb-16 font-light leading-relaxed tracking-wide animate-fade-in-up">
        Redefine tu imagen con <span class="text-white font-medium italic">Precision Intelligence</span>. 
        Biomecánica facial y mapeo estético para el visionario moderno.
      </p>

      <!-- Action Buttons -->
      <div class="flex flex-col gap-5 justify-center items-center w-full max-w-sm mb-20 animate-fade-in-up" style="animation-delay: 0.3s">
        <router-link 
          to="/scan" 
          class="group relative w-full px-8 py-5 bg-primary text-black font-black text-lg rounded-2xl transition-all duration-500 hover:scale-[1.02] active:scale-95 shadow-[0_20px_40px_rgba(218,165,32,0.25)] flex items-center justify-center overflow-hidden"
        >
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <LucideScanFace class="mr-3 group-hover:scale-110 transition-transform duration-500" :size="22" />
          <span class="font-outfit uppercase tracking-wider">INICIAR ESCANEO AI</span>
          <LucideArrowRight class="ml-auto opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" :size="20" />
        </router-link>

        <router-link 
          to="/book" 
          class="group relative w-full px-8 py-5 glass-card text-white font-bold text-lg rounded-2xl transition-all duration-500 flex items-center justify-center overflow-hidden"
        >
          <LucideCalendarCheck class="mr-3 text-primary group-hover:scale-110 transition-transform duration-500" :size="22" />
          <span class="font-outfit uppercase tracking-wider">AGENDAR CITA</span>
          <LucideArrowRight class="ml-auto opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" :size="20" />
        </router-link>

        <router-link 
          to="/store" 
          class="group relative w-full px-8 py-5 glass-card text-white font-bold text-lg rounded-2xl transition-all duration-500 border-white/5 flex items-center justify-center overflow-hidden opacity-80 hover:opacity-100"
        >
          <LucideSparkles class="mr-3 text-primary/70 group-hover:rotate-12 transition-transform duration-500" :size="22" />
          <span class="font-outfit uppercase tracking-wider text-gray-300 group-hover:text-white transition-colors">GROOMING STORE</span>
          <LucideShoppingBag class="ml-auto opacity-30 group-hover:opacity-100 transition-opacity" :size="18" />
        </router-link>

        <router-link 
          to="/login" 
          class="flex items-center space-x-2 text-gray-500 hover:text-primary transition-all duration-300 text-[10px] font-black uppercase tracking-[0.3em] mt-8 group"
        >
           <LucideUserCircle2 :size="14" class="opacity-50 group-hover:opacity-100" />
           <span>ACCESO BARBERO</span>
        </router-link>
      </div>

      <!-- Innovative Feature Badges -->
      <div class="flex flex-wrap justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700 animate-fade-in" style="animation-delay: 0.6s">
          <div class="flex flex-col items-center gap-2">
              <span class="text-[9px] font-bold tracking-[0.2em] uppercase">Mapeo 3D</span>
          </div>
          <div class="flex flex-col items-center gap-2">
              <span class="text-[9px] font-bold tracking-[0.2em] uppercase">IA Generativa</span>
          </div>
          <div class="flex flex-col items-center gap-2">
              <span class="text-[9px] font-bold tracking-[0.2em] uppercase">Estilo Maestro</span>
          </div>
      </div>
    </div>

    <!-- Bottom Footer Gradient -->
    <div class="absolute bottom-0 left-0 right-0 h-[30vh] bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-0"></div>
  </div>
</template>

<script setup>
import { 
  LucideScanFace, 
  LucideCalendarCheck, 
  LucideSparkles, 
  LucideShoppingBag, 
  LucideArrowRight,
  LucideUserCircle2 
} from 'lucide-vue-next'
import logoImg from '../assets/logo.png'
</script>

<style scoped>
@keyframes pulse-slow {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.05); }
}

.animate-pulse-slow {
  animation: pulse-slow 10s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes shimmer-logo {
    0% { transform: translateX(-100%) rotate(45deg); }
    100% { transform: translateX(200%) rotate(45deg); }
}

.group:hover .animate-shimmer-logo {
    animation: shimmer-logo 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes reveal-text {
    0% { transform: translateY(30px); opacity: 0; filter: blur(10px); }
    100% { transform: translateY(0); opacity: 1; filter: blur(0); }
}

.animate-reveal-text {
    animation: reveal-text 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fade-in-up {
    0% { transform: translateY(20px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
}

.animate-fade-in-up {
    opacity: 0;
    animation: fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 0.4; }
}

.animate-fade-in {
    opacity: 0;
    animation: fade-in 2s ease forwards;
}

.gold-text-gradient {
    background: var(--gold-gradient);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}
</style>

