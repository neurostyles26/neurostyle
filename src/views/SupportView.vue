<template>
  <div class="min-h-screen bg-black flex flex-col p-6 font-inter relative overflow-hidden">
    <!-- Background Aura -->
    <div class="absolute top-0 left-0 w-full h-[50vh] bg-primary/5 blur-[150px] rounded-full pointer-events-none"></div>

    <header class="flex items-center mb-16 z-10">
      <button @click="router.push('/')" class="w-12 h-12 flex items-center justify-center glass-panel rounded-2xl hover:bg-white/10 transition-colors mr-6">
        <LucideChevronLeft class="text-primary" />
      </button>
      <div>
          <h2 class="text-white font-outfit font-bold text-2xl tracking-tight uppercase">Soporte Maestro</h2>
          <p class="text-primary text-[8px] font-black uppercase tracking-[0.4em]">Conserjería Técnica 24/7</p>
      </div>
    </header>

    <main class="flex-1 flex flex-col items-center justify-center relative z-10 max-w-4xl mx-auto w-full px-4">
      <div class="text-center mb-16">
        <h1 class="text-white text-4xl sm:text-6xl font-outfit font-black mb-6 tracking-tighter uppercase">¿Cómo podemos <span class="text-primary italic">Ayudarte?</span></h1>
        <p class="text-gray-400 text-lg font-light leading-relaxed max-w-2xl mx-auto">
          Nuestra red neural está siempre activa. Si tienes problemas con el escaneo, la agenda o tu cuenta, nuestro equipo de élite está listo para intervenir.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-16">
        <div class="glass-panel p-10 rounded-[40px] border-white/5 hover:border-primary/20 transition-all group">
          <div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 border border-primary/20 group-hover:bg-primary transition-all">
            <LucideMessageSquare class="text-primary group-hover:text-black" :size="28" />
          </div>
          <h3 class="text-white text-2xl font-outfit font-black mb-4 uppercase">Chat en Vivo</h3>
          <p class="text-gray-500 text-sm mb-8 leading-relaxed">Habla directamente con un analista técnico para resolver dudas en tiempo real.</p>
          <button class="w-full py-4 text-primary font-black uppercase tracking-widest text-[10px] border border-primary/20 rounded-xl hover:bg-primary/5 transition-all">INICIAR SESIÓN</button>
        </div>

        <div class="glass-panel p-10 rounded-[40px] border-white/5 hover:border-primary/20 transition-all group">
          <div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 border border-primary/20 group-hover:bg-primary transition-all">
            <LucideBookOpen class="text-primary group-hover:text-black" :size="28" />
          </div>
          <h3 class="text-white text-2xl font-outfit font-black mb-4 uppercase">Documentación</h3>
          <p class="text-gray-500 text-sm mb-8 leading-relaxed">Guías detalladas sobre cómo optimizar tus escaneos y gestionar tu catálogo maestro.</p>
          <button class="w-full py-4 text-primary font-black uppercase tracking-widest text-[10px] border border-primary/20 rounded-xl hover:bg-primary/5 transition-all">EXPLORAR GUÍAS</button>
        </div>
      </div>

      <div class="w-full glass-panel p-12 rounded-[48px] border-primary/10 bg-primary/5 relative overflow-hidden">
        <div class="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 blur-[80px] rounded-full"></div>
        <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div class="text-center md:text-left">
            <h4 class="text-white text-xl font-outfit font-black mb-2 uppercase">Ticket de Prioridad</h4>
            <p class="text-gray-400 text-sm font-light">Para fallos críticos en la matriz de control administrativo.</p>
          </div>
          <button class="bg-primary text-black font-black px-12 py-5 rounded-2xl hover:scale-105 transition-all font-outfit uppercase tracking-widest text-sm shadow-xl shadow-primary/20">
            ABRIR TICKET
          </button>
        </div>
      </div>
    </main>

    <footer class="mt-20 py-12 text-center relative z-10 opacity-30">
      <p class="text-gray-600 text-[9px] font-black uppercase tracking-[0.5em]">NeuroStyle Support Center <span class="mx-2 text-primary/20">|</span> Precision Excellence</p>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { LucideChevronLeft, LucideMessageSquare, LucideBookOpen } from 'lucide-vue-next'

const router = useRouter()
</script>

<style scoped>
</style>
