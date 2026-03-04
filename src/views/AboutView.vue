<template>
  <div class="min-h-screen bg-black flex flex-col p-6 font-inter relative overflow-hidden">
    <!-- Background Aura -->
    <div class="absolute top-0 right-0 w-full h-[50vh] bg-primary/5 blur-[150px] rounded-full pointer-events-none"></div>

    <header class="flex items-center mb-16 z-10">
      <button @click="router.push('/')" class="w-12 h-12 flex items-center justify-center glass-panel rounded-2xl hover:bg-white/10 transition-colors mr-6">
        <LucideChevronLeft class="text-primary" />
      </button>
      <div>
          <h2 class="text-white font-outfit font-bold text-2xl tracking-tight uppercase">Sobre el Creador</h2>
          <p class="text-primary text-[8px] font-black uppercase tracking-[0.4em]">Devedisof Elite Developer</p>
      </div>
    </header>

    <main class="flex-1 flex flex-col items-center justify-center relative z-10 max-w-4xl mx-auto text-center px-4">
      <div class="relative mb-12 group">
        <div class="absolute inset-0 bg-primary/20 blur-[80px] rounded-full group-hover:bg-primary/40 transition-all duration-1000"></div>
        <div class="w-48 h-48 sm:w-64 sm:h-64 glass-panel rounded-full overflow-hidden border-2 border-primary/30 p-2 relative z-10">
          <div class="w-full h-full rounded-full bg-black flex items-center justify-center text-primary font-outfit font-black text-6xl">
            ED
          </div>
        </div>
      </div>

      <h1 class="text-white text-5xl sm:text-7xl font-outfit font-black mb-2 tracking-tighter uppercase gold-glow">
        EDISSON PINZA
      </h1>
      
      <!-- Digital Signature Effect -->
      <div class="mb-8 overflow-hidden">
        <span class="signature-text text-primary/60 text-3xl sm:text-4xl block animate-signature">Edisson Pinza</span>
        <div class="h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent w-full mt-2"></div>
      </div>
      
      <p class="text-gray-400 text-lg sm:text-xl font-light mb-12 leading-relaxed tracking-wide">
        Visionario tecnológico y desarrollador principal bajo la firma <span class="text-white font-black italic">Devedisof</span>. Creador de la plataforma <span class="text-primary font-black italic">NeuroStyle IA</span>, especializada en fusionar inteligencia artificial con la elegancia del mundo real.
      </p>

      <div class="flex flex-wrap justify-center gap-6 mb-16">
        <a 
          href="https://devedisof-mi-cv.netlify.app/" 
          target="_blank" 
          class="bg-primary text-black font-black px-10 py-5 rounded-2xl flex items-center hover:scale-105 active:scale-95 transition-all shadow-[0_15px_40px_rgba(218,165,32,0.3)] group"
        >
          <LucideGlobe class="mr-3" :size="20" />
          <span class="font-outfit uppercase tracking-widest text-sm">Ver Portafolio</span>
        </a>
        <button 
          class="glass-panel border-white/10 text-white font-black px-10 py-5 rounded-2xl hover:bg-white/10 transition-all font-outfit uppercase tracking-widest text-sm flex items-center"
        >
          <LucideMail class="mr-3 text-primary" :size="20" />
          CONTACTAR
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 w-full text-left">
        <div class="glass-panel p-8 rounded-3xl border-white/5">
          <h4 class="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-4">Misión</h4>
          <p class="text-gray-500 text-sm leading-relaxed">Democratizar el acceso a la estética de alta precisión mediante motores neuronales de última generación.</p>
        </div>
        <div class="glass-panel p-8 rounded-3xl border-white/5">
          <h4 class="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-4">Tecnología</h4>
          <p class="text-gray-500 text-sm leading-relaxed">Implementación de mallas biométricas 3D y algoritmos generativos para resultados visuales impecables.</p>
        </div>
        <div class="glass-panel p-8 rounded-3xl border-white/5">
          <h4 class="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-4">Filosofía</h4>
          <p class="text-gray-500 text-sm leading-relaxed">El estilo es una ciencia. La tecnología es el pincel. El usuario es la obra maestra definitiva.</p>
        </div>
      </div>
    </main>

    <footer class="mt-20 py-12 border-t border-white/5 text-center relative z-10">
      <p class="text-white/20 text-[8px] font-black uppercase tracking-[0.8em]">EDISSON PINZA <span class="mx-2 text-primary/20">|</span> DEVEDISOF ELITE DEVELOPER</p>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { LucideChevronLeft, LucideGlobe, LucideMail } from 'lucide-vue-next'

const router = useRouter()
</script>

<style scoped>
.gold-glow {
  text-shadow: 0 0 20px rgba(218, 165, 32, 0.4);
}

@font-face {
  font-family: 'Signature';
  src: url('https://fonts.googleapis.com/css2?family=Mrs+Saint+Delafield&display=swap');
}

.signature-text {
  font-family: 'Mrs Saint Delafield', cursive;
  filter: drop-shadow(0 0 10px rgba(218, 165, 32, 0.3));
}

@keyframes signature-draw {
  0% { opacity: 0; transform: translateY(10px) skewX(-10deg); filter: blur(10px); }
  100% { opacity: 1; transform: translateY(0) skewX(0); filter: blur(0); }
}

.animate-signature {
  animation: signature-draw 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
