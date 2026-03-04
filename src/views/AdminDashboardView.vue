<template>
  <div class="min-h-screen bg-[#020202] flex flex-col md:flex-row font-inter relative overflow-hidden">
    <!-- Background Accents -->
    <div class="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/5 blur-[150px] rounded-full pointer-events-none"></div>

    <!-- Sidebar / Nav -->
    <aside class="w-full md:w-80 glass-panel border-b md:border-r border-white/5 p-8 flex flex-col z-20 relative">
      <div class="flex items-center space-x-4 mb-16 px-2">
        <div class="w-14 h-14 glass-panel rounded-full flex items-center justify-center border-white/20 shadow-lg p-3">
            <img :src="shopStore.logoUrl || logoImg" class="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(218,165,32,0.5)]" alt="NS" />
        </div>
        <div>
            <span class="text-white font-outfit font-black text-2xl tracking-tighter block uppercase">NeuroStyle</span>
            <span class="text-primary text-[8px] font-black uppercase tracking-[0.4em]">Matriz de Control</span>
        </div>
      </div>

      <nav class="flex-1 space-y-4">
        <router-link to="/admin" class="group w-full flex items-center space-x-4 px-6 py-5 rounded-3xl bg-primary text-black font-black transition-all shadow-xl shadow-primary/20">
          <LucideLayoutGrid :size="22" />
          <span class="font-outfit uppercase tracking-widest text-sm">Dashboard</span>
        </router-link>
        
        <router-link to="/admin/appointments" class="group w-full flex items-center space-x-4 px-6 py-5 rounded-3xl text-gray-500 hover:bg-white/5 hover:text-white transition-all border border-transparent hover:border-white/10">
          <LucideCalendar :size="22" class="group-hover:text-primary transition-colors" />
          <span class="font-outfit uppercase tracking-widest text-sm">Citas</span>
        </router-link>

        <router-link to="/admin/products" class="group w-full flex items-center space-x-4 px-6 py-5 rounded-3xl text-gray-500 hover:bg-white/5 hover:text-white transition-all border border-transparent hover:border-white/10">
          <LucideShoppingBag :size="22" class="group-hover:text-primary transition-colors" />
          <span class="font-outfit uppercase tracking-widest text-sm">Productos</span>
        </router-link>

        <button class="group w-full flex items-center space-x-4 px-6 py-5 rounded-3xl text-gray-500 hover:bg-white/5 hover:text-white transition-all border border-transparent hover:border-white/10">
          <LucideTicket :size="22" class="group-hover:text-primary transition-colors" />
          <span class="font-outfit uppercase tracking-widest text-sm">Promos</span>
        </button>

        <router-link to="/admin/settings" class="group w-full flex items-center space-x-4 px-6 py-5 rounded-3xl text-gray-500 hover:bg-white/5 hover:text-white transition-all border border-transparent hover:border-white/10">
          <LucideSettings :size="22" class="group-hover:text-primary transition-colors" />
          <span class="font-outfit uppercase tracking-widest text-sm">Configuración</span>
        </router-link>
      </nav>

      <div class="mt-auto pt-8 border-t border-white/5">
          <button @click="handleLogout" class="group w-full flex items-center space-x-4 px-6 py-5 rounded-3xl text-red-500/70 hover:text-red-500 hover:bg-red-500/10 transition-all">
            <LucideLogOut :size="22" />
            <span class="font-outfit uppercase tracking-widest text-sm font-black">Cerrar Sesión</span>
          </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-8 md:p-16 overflow-y-auto z-10 relative">
      <header class="mb-16 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h1 class="text-white text-5xl md:text-6xl font-outfit font-black tracking-tighter mb-4">Panel de <span class="text-primary italic">Control</span></h1>
          <p class="text-gray-500 text-sm font-bold uppercase tracking-[0.3em]">Bienvenido, Comandante del Estilo</p>
        </div>
        
        <div class="flex items-center space-x-4">
          <div class="glass-panel px-8 py-4 rounded-[24px] flex items-center space-x-4 border-white/10 group cursor-default shadow-xl">
            <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_#22c55e]"></div>
            <span class="text-xs font-black text-gray-400 uppercase tracking-widest group-hover:text-white transition-colors">Sistema Neural En Línea</span>
          </div>
        </div>
      </header>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div v-for="(stat, i) in stats" :key="i" class="glass-panel p-10 rounded-[48px] border-white/5 hover:border-primary/30 transition-all duration-500 group hover:-translate-y-2 relative overflow-hidden">
          <div class="absolute -right-5 -top-5 w-24 h-24 bg-primary/5 blur-2xl rounded-full group-hover:bg-primary/20 transition-all duration-700"></div>
          
          <div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 border border-primary/20 group-hover:bg-primary group-hover:shadow-[0_0_20px_#DAA520] transition-all duration-500">
             <component :is="stat.icon" class="text-primary group-hover:text-black transition-colors" :size="28" />
          </div>
          
          <p class="text-gray-500 text-[10px] mb-2 uppercase tracking-[0.3em] font-black">{{ stat.label }}</p>
          <p class="text-white text-4xl font-outfit font-black tracking-tight group-hover:text-primary transition-colors">{{ stat.value }}</p>
        </div>
      </div>

      <!-- Specialized Admin Banner -->
      <div class="bg-primary/5 border border-primary/20 rounded-[56px] p-12 lg:p-20 relative overflow-hidden group">
        <div class="absolute -right-32 -top-32 w-96 h-96 bg-primary/10 blur-[150px] rounded-full group-hover:bg-primary/20 transition-all duration-1000"></div>
        <div class="max-w-2xl relative z-10">
            <h2 class="text-primary text-3xl font-outfit font-black mb-6 tracking-tight uppercase">Métricas de Rendimiento IA</h2>
            <p class="text-gray-400 text-lg mb-10 leading-relaxed font-light">
                Optimiza tu flujo de trabajo con nuestro motor de análisis. 
                Hemos detectado un incremento del <span class="text-white font-bold">24%</span> en la retención de clientes tras implementar las sugerencias biométricas.
            </p>
            <div class="flex flex-wrap gap-6">
                <button class="bg-primary text-black font-black px-12 py-6 rounded-3xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/30 group/btn relative overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                    <span class="font-outfit uppercase tracking-widest">CREAR PROMOCIÓN</span>
                </button>
                <router-link to="/admin/products" class="glass-panel border-white/10 text-white font-black px-12 py-6 rounded-3xl hover:bg-white/10 transition-all font-outfit uppercase tracking-widest text-sm flex items-center">
                    GIRAR INVENTARIO
                </router-link>
            </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { 
  LucideLayoutGrid, LucideCalendar, LucideShoppingBag, 
  LucideTicket, LucideLogOut, LucideUsers,
  LucideTrendingUp, LucideSettings
} from 'lucide-vue-next'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../services/supabase'
import logoImg from '../assets/logo.png'

import { useShopStore } from '../stores/shopStore'
import { useNotificationStore } from '../stores/notificationStore'

const router = useRouter()
const shopStore = useShopStore()

const notificationStore = useNotificationStore()

onMounted(() => {
  shopStore.fetchSettings()
  
  // Welcome Notification
  notificationStore.notify({
    title: 'SISTEMA NEURAL ACTIVO',
    message: 'Bienvenido a la matriz de control, Comandante.',
    type: 'info'
  })

  // Simulate user attention alert
  setTimeout(() => {
    notificationStore.notify({
        title: 'ATENCIÓN REQUERIDA',
        message: 'Hay 3 nuevos clientes esperando análisis biométrico.',
        type: 'warning',
        duration: 8000
    })
  }, 3000)
})

const stats = [
  { label: 'Citas Hoy', value: '12', icon: LucideCalendar },
  { label: 'Visitas Nuevas', value: '48', icon: LucideUsers },
  { label: 'Egresos Mes', value: '$4.2k', icon: LucideTrendingUp },
  { label: 'Unidades Stock', value: '85', icon: LucideShoppingBag }
]

const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/')
}
</script>

<style scoped>
/* Dashboard specific styles can go here */
</style>
