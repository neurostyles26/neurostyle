<template>
  <div class="min-h-screen bg-[#050505] flex flex-col p-6 sm:p-10 font-inter relative overflow-hidden">
    <!-- Sophisticated Background Accents -->
    <div class="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[160px] rounded-full pointer-events-none"></div>
    <div class="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

    <!-- Header -->
    <header class="flex items-center justify-between mb-16 z-10">
      <div class="flex items-center space-x-6">
        <div class="w-20 h-20 glass-panel rounded-3xl flex items-center justify-center overflow-hidden border-white/20 shadow-xl group">
          <LucideUser class="text-primary group-hover:scale-110 transition-transform duration-500" :size="32" />
        </div>
        <div>
          <span class="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-2 block opacity-80">Membresía Elite</span>
          <h1 class="text-white text-3xl font-outfit font-black tracking-tighter uppercase leading-none">Hola, <span class="text-white/60">Explorador</span></h1>
        </div>
      </div>
      <router-link to="/login" class="w-14 h-14 glass-panel rounded-2xl flex items-center justify-center text-primary hover:bg-white/10 hover:border-primary/40 transition-all duration-700 hover:rotate-90 shadow-lg">
        <LucideSettings :size="28" />
      </router-link>
    </header>

    <!-- Main Content -->
    <main class="flex-1 z-10 max-w-5xl mx-auto w-full">
      <div class="mb-16">
        <span class="text-gray-600 text-[10px] font-black uppercase tracking-[0.6em] mb-4 block">Experiencia Personalizada</span>
        <h2 class="text-white text-5xl md:text-6xl font-outfit font-black leading-[0.9] tracking-tighter uppercase">
            TU PRÓXIMA <br/><span class="text-primary gold-glow">EVOLUCIÓN</span>
        </h2>
        <div class="w-20 h-[2px] bg-primary mt-8"></div>
      </div>

      <!-- Services Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <router-link 
          v-for="service in services" 
          :key="service.id"
          :to="service.route"
          class="group flex flex-col p-10 glass-card rounded-[48px] hover:border-primary/40 relative overflow-hidden"
        >
          <!-- Hover Glow -->
          <div class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div class="flex items-start justify-between mb-12">
            <div class="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center group-hover:bg-primary group-hover:shadow-[0_0_40px_rgba(218,165,32,0.4)] transition-all duration-700 shadow-inner">
              <component :is="service.icon" class="text-primary group-hover:text-black transition-colors duration-500" :size="36" />
            </div>
            <LucideArrowRight class="text-gray-800 group-hover:text-primary transition-all duration-500 group-hover:translate-x-2" :size="28" />
          </div>
          
          <div>
            <h3 class="text-white font-outfit font-black text-3xl mb-3 tracking-tighter uppercase transition-colors group-hover:text-primary leading-none">{{ service.title }}</h3>
            <p class="text-gray-500 text-xs font-bold uppercase tracking-widest leading-relaxed opacity-80">{{ service.desc }}</p>
          </div>

          <!-- Abstract Decoration -->
          <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/2 blur-3xl rounded-full group-hover:bg-primary/5 transition-colors"></div>
        </router-link>
      </div>

      <!-- Specialized Promo Card -->
      <div class="mt-12 p-12 md:p-16 rounded-[60px] glass-card border-primary/20 relative overflow-hidden group shadow-2xl">
        <div class="absolute -right-40 -top-40 w-96 h-96 bg-primary/10 blur-[140px] rounded-full group-hover:bg-primary/20 transition-all duration-1000"></div>
        
        <div class="relative z-10 flex flex-col md:flex-row md:items-center gap-12">
            <div class="flex-1">
              <span class="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-4 block font-outfit opacity-80">Estado Prioritario</span>
              <h5 class="text-white text-4xl md:text-5xl font-outfit font-black mb-6 tracking-tighter uppercase leading-none">Reserva <span class="text-white/40">Personalizada</span></h5>
              <p class="text-gray-400 text-sm font-medium uppercase tracking-widest leading-loose mb-10 max-w-md">Nuestro algoritmo de mapeo neural nos permite asignar al maestro barbero ideal según tu morfología facial detectada.</p>
            </div>

            <router-link 
              to="/book" 
              class="btn-primary py-6 px-12 text-base md:w-auto w-full group/btn"
            >
              AGENDAR AHORA
              <LucideCalendar class="group-hover/btn:rotate-12 transition-transform" :size="20" />
            </router-link>
        </div>
      </div>
    </main>

    <!-- Developer Credit -->
    <footer class="mt-20 py-10 text-center z-10">
      <div class="h-[1px] w-20 bg-white/5 mx-auto mb-10"></div>
      <a 
        href="https://devedisof-mi-cv.netlify.app/" 
        target="_blank" 
        class="text-[9px] font-black text-gray-700 hover:text-primary uppercase tracking-[0.6em] transition-all hover:opacity-100 opacity-40"
      >
        DEVELOPED BY DEVEDISOF
      </a>
    </footer>
  </div>
</template>


<script setup>
import { 
  LucideScanFace, LucideScissors, LucideCalendar, 
  LucideShoppingBag, LucideUser, LucideSettings,
  LucideArrowRight 
} from 'lucide-vue-next'

import { useNotificationStore } from '../stores/notificationStore'
import { onMounted } from 'vue'

const notificationStore = useNotificationStore()

onMounted(() => {
  // Promo Notification
  setTimeout(() => {
    notificationStore.notify({
      title: 'PROMOCIÓN EXCLUSIVA',
      message: 'Nuevos estilos de tendencia cargados en el catálogo. ¡Revísalos!',
      type: 'info',
      duration: 7000
    })
  }, 2000)
})

const services = [
  { id: 1, title: 'Análisis Facial IA', desc: 'Mapeo biométrico avanzado para tu rostro.', icon: LucideScanFace, route: '/scan' },
  { id: 2, title: 'Estilos Maestro', desc: 'Cortes exclusivos curados por expertos.', icon: LucideScissors, route: '/styles' },
  { id: 3, title: 'Mis Reservas', desc: 'Control total de tu agenda estética.', icon: LucideCalendar, route: '/dashboard' },
  { id: 4, title: 'Grooming Tools', desc: 'Productos de alto rendimiento premium.', icon: LucideShoppingBag, route: '/store' }
]
</script>

