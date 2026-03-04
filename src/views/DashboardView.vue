<template>
  <div class="min-h-screen bg-[#020202] flex flex-col p-6 font-inter relative overflow-hidden">
    <!-- Background Accents -->
    <div class="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

    <!-- Header -->
    <header class="flex items-center justify-between mb-12 z-10">
      <div class="flex items-center space-x-5">
        <div class="w-16 h-16 glass-panel rounded-2xl flex items-center justify-center overflow-hidden border-white/20">
          <LucideUser class="text-primary" :size="28" />
        </div>
        <div>
          <p class="text-primary text-[10px] font-black uppercase tracking-[0.1em] mb-1">Membresía Elite</p>
          <h1 class="text-white text-3xl font-outfit font-bold tracking-tight">Hola, Explorador</h1>
        </div>
      </div>
      <router-link to="/login" class="w-14 h-14 glass-panel rounded-2xl flex items-center justify-center text-primary hover:bg-white/10 transition-all duration-500 hover:rotate-90">
        <LucideSettings :size="28" />
      </router-link>
    </header>

    <!-- Main Content -->
    <main class="flex-1 z-10">
      <div class="mb-12">
        <h2 class="text-white text-4xl md:text-5xl font-outfit font-black leading-tight tracking-tighter">
            TU PRÓXIMA <br/><span class="text-primary gold-glow">EVOLUCIÓN</span>
        </h2>
      </div>

      <!-- Services Grid -->
      <div class="space-y-6">
        <router-link 
          v-for="service in services" 
          :key="service.id"
          :to="service.route"
          class="group flex items-center p-8 glass-panel rounded-[36px] hover:border-primary/40 transition-all duration-500 hover:translate-x-3 relative overflow-hidden"
        >
          <!-- Hover Glow -->
          <div class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div class="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mr-8 group-hover:bg-primary group-hover:shadow-[0_0_30px_#DAA520] transition-all duration-700">
            <component :is="service.icon" class="text-primary group-hover:text-black transition-colors duration-500" :size="36" />
          </div>
          
          <div class="flex-1">
            <h3 class="text-white font-outfit font-bold text-2xl mb-2 tracking-tight transition-colors group-hover:text-primary">{{ service.title }}</h3>
            <p class="text-gray-500 text-sm leading-relaxed max-w-[200px]">{{ service.desc }}</p>
          </div>
          
          <LucideArrowRight class="text-gray-800 group-hover:text-primary transition-all duration-300 group-hover:translate-x-2" :size="24" />
        </router-link>
      </div>

      <!-- Specialized Promo Card -->
      <div class="mt-12 p-10 rounded-[48px] glass-card border-primary/20 relative overflow-hidden group">
        <div class="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 blur-[100px] rounded-full group-hover:bg-primary/20 transition-all duration-700"></div>
        <div class="relative z-10">
            <h4 class="text-primary font-black text-sm uppercase tracking-[0.2em] mb-3 font-outfit">Estado Prioritario</h4>
            <h5 class="text-white text-2xl font-outfit font-bold mb-4 tracking-tight">Reserva Personalizada</h5>
            <p class="text-gray-400 text-base mb-8 leading-relaxed max-w-xs">Tu historial estético nos permite asignar al maestro barbero ideal para tu tipo de rostro.</p>
            <router-link 
              to="/book" 
              class="inline-flex items-center bg-primary text-black font-black px-10 py-5 rounded-2xl hover:scale-105 transition-all shadow-xl shadow-primary/20 text-sm uppercase tracking-wider font-outfit"
            >
              AGENDAR AHORA
              <LucideCalendar class="ml-3" :size="18" />
            </router-link>
        </div>
      </div>
    </main>

    <!-- Developer Credit -->
    <footer class="mt-auto py-8 text-center z-10 opacity-60">
      <a 
        href="https://devedisof-mi-cv.netlify.app/" 
        target="_blank" 
        class="text-[8px] font-black text-gray-500 hover:text-primary uppercase tracking-[0.5em] transition-colors"
      >
        Developed by EDISSOF
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

