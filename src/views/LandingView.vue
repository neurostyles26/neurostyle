<template>
  <div class="relative min-h-screen flex flex-col items-center overflow-hidden bg-[#020202] font-inter transition-all duration-1000" :style="shopStore.bgUrl ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url(${shopStore.bgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}">
    <!-- Sophisticated Background Layering -->
    <div v-if="!shopStore.bgUrl" class="absolute inset-0 z-0 pointer-events-none">
      <div class="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-primary/10 blur-[160px] rounded-full animate-pulse-slow"></div>
      <div class="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-primary/5 blur-[140px] rounded-full animate-pulse-slow" style="animation-delay: 5s"></div>
      <div class="absolute inset-0 opacity-[0.04]" :style="{ backgroundImage: 'linear-gradient(rgba(218,165,32,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(218,165,32,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }"></div>
      <div class="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-scanning-beam"></div>
    </div>

    <!-- Top Elite Header (Fixed) -->
    <header class="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 py-4 md:px-12 glass-panel border-b border-white/5 backdrop-blur-xl">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 p-1.5 shrink-0">
          <img :src="logoImg" class="w-full h-full object-contain filter drop-shadow-[0_0_5px_#DAA520]" alt="NS" />
        </div>
        <div class="min-w-0">
          <span class="text-white text-[10px] font-black uppercase tracking-[0.4em] block truncate">NeuroStyle IA</span>
          <span class="text-primary text-[6px] font-black uppercase tracking-[0.2em] block truncate">Powered by Neural Tech</span>
        </div>
      </div>
      
      <!-- Hamburger Menu Button -->
      <button 
        @click="isMenuOpen = !isMenuOpen" 
        class="w-10 h-10 flex items-center justify-center glass-panel rounded-xl hover:bg-white/10 transition-colors pointer-events-auto"
      >
        <component :is="isMenuOpen ? LucideX : LucideMenu" class="text-primary" :size="20" />
      </button>
    </header>

    <!-- Slide-over Mobile Menu -->
    <transition
      enter-active-class="transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)"
      enter-from-class="translate-x-full opacity-0"
      leave-active-class="transition-all duration-300 ease-in"
      leave-to-class="translate-x-full opacity-0"
    >
      <div v-if="isMenuOpen" class="fixed inset-0 z-[95] flex justify-end">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="isMenuOpen = false"></div>
        <div class="relative w-80 h-full glass-panel border-l border-white/5 p-12 flex flex-col pt-32 bg-black/95">
          <router-link 
            to="/about" 
            class="group mb-10"
            @click="isMenuOpen = false"
          >
            <span class="text-white/40 group-hover:text-primary transition-colors text-xs font-black uppercase tracking-[0.3em] block mb-1">Sobre el Creador</span>
            <span class="text-[8px] text-gray-600 uppercase tracking-[0.2em]">Visión & Portafolio de Edisson Pinza</span>
          </router-link>
          
          <router-link 
            to="/support" 
            class="group mb-12"
            @click="isMenuOpen = false"
          >
            <span class="text-white/40 group-hover:text-primary transition-colors text-xs font-black uppercase tracking-[0.3em] block mb-1">Soporte Maestro</span>
            <span class="text-[8px] text-gray-600 uppercase tracking-[0.2em]">Conserjería Técnica</span>
          </router-link>

          <div class="mt-auto">
             <a 
              href="https://devedisof-mi-cv.netlify.app/" 
              target="_blank" 
              class="flex flex-col space-y-3 opacity-40 hover:opacity-100 transition-opacity"
            >
              <span class="text-[8px] font-black tracking-[0.6em] text-primary uppercase">BY DEVEDISOF</span>
              <div class="w-12 h-[1px] bg-primary/20"></div>
            </a>
          </div>
        </div>
      </div>
    </transition>

    <!-- Main Hero Landing -->
    <main class="z-10 w-full max-w-5xl flex flex-col items-center pt-32 pb-20 px-6">
      <div class="flex flex-col items-center animate-fade-in-up w-full">
        <!-- Main Shop Logo -->
        <div class="w-48 h-48 sm:w-64 sm:h-64 mb-12 relative group shrink-0">
          <div class="absolute inset-0 bg-primary/25 blur-3xl rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-1000 animate-pulse-glow"></div>
          <div class="relative w-full h-full glass-panel rounded-full flex items-center justify-center shadow-2xl border-white/10 overflow-hidden p-8">
             <img 
               v-if="shopStore.logoUrl"
               :src="shopStore.logoUrl" 
               class="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(218,165,32,0.5)] transition-transform duration-1000 group-hover:scale-110" 
               :alt="shopStore.shopName" 
             />
             <img 
               v-else
               :src="logoImg" 
               class="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(218,165,32,0.5)] transition-transform duration-1000 group-hover:scale-110 opacity-20" 
               alt="Placeholder" 
             />
             <div class="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
                <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer-fast"></div>
             </div>
          </div>
        </div>

        <!-- Shop Info -->
        <h1 class="text-white text-5xl sm:text-7xl md:text-8xl font-outfit font-black tracking-tighter mb-6 uppercase text-center text-glow break-words w-full leading-[0.9]">
          {{ shopStore.shopName }}
        </h1>
        
        <p class="text-gray-400 text-sm sm:text-base md:text-xl font-light max-w-2xl text-center mb-16 leading-relaxed tracking-widest px-6 uppercase opacity-80 break-words">
          {{ shopStore.shopDescription || 'Elevando el arte de la barbería con precisión neural y estilo maestro.' }}
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col gap-8 justify-center items-center w-full max-w-md animate-reveal-actions">
        <router-link 
          to="/scan" 
          class="group relative w-full px-10 py-7 bg-primary text-black font-black text-xl rounded-2xl transition-all duration-700 hover:scale-[1.03] active:scale-95 shadow-[0_25px_50px_-12px_rgba(218,165,32,0.4)] flex items-center justify-center overflow-hidden"
        >
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <span class="font-outfit uppercase tracking-[0.1em] relative z-10 transition-all duration-500 group-hover:tracking-[0.15em] text-center">INICIAR ESCANEO IA</span>
        </router-link>

        <div class="grid grid-cols-2 gap-4 w-full">
          <router-link 
            to="/book" 
            class="group relative px-6 py-5 glass-card text-white font-bold text-base rounded-[24px] transition-all duration-500 flex items-center justify-center overflow-hidden border-white/5 hover:border-primary/40"
          >
            <span class="font-outfit uppercase tracking-[0.1em] text-[10px] group-hover:text-primary transition-colors">Agendar Cita</span>
          </router-link>

          <router-link 
            to="/store" 
            class="group relative px-6 py-5 glass-card text-white font-bold text-base rounded-[24px] transition-all duration-500 border-white/5 hover:border-primary/40 flex items-center justify-center overflow-hidden"
          >
            <span class="font-outfit uppercase tracking-[0.1em] text-[10px] group-hover:text-primary transition-colors">Ver Catálogo</span>
          </router-link>
        </div>

        <!-- Professional Access -->
        <router-link 
          to="/login" 
          class="flex items-center space-x-3 text-gray-500 hover:text-primary transition-all duration-700 text-[10px] font-black uppercase tracking-[0.4em] mt-8 group opacity-60 hover:opacity-100"
        >
           <div class="w-8 h-[1px] bg-white/10 group-hover:w-12 group-hover:bg-primary/40 transition-all duration-700"></div>
           <span>Acceso Barbero</span>
           <div class="w-8 h-[1px] bg-white/10 group-hover:w-12 group-hover:bg-primary/40 transition-all duration-700"></div>
        </router-link>
      </div>

      <!-- Feature Badges Section -->
      <div class="mt-24 flex flex-wrap justify-center gap-6 opacity-40 hover:opacity-100 transition-all duration-1000 animate-reveal-badges px-6">
          <span class="text-[8px] font-black tracking-[0.4em] uppercase border border-white/5 px-6 py-2.5 rounded-full">Neural Mapping</span>
          <span class="text-[8px] font-black tracking-[0.4em] uppercase border border-white/5 px-6 py-2.5 rounded-full">AI Generative</span>
          <span class="text-[8px] font-black tracking-[0.4em] uppercase border border-white/5 px-6 py-2.5 rounded-full">Master Style</span>
      </div>
    </main>

    <!-- Bottom Footer -->
    <footer class="mt-auto py-12 w-full text-center relative z-20 border-t border-white/5 bg-black/40 backdrop-blur-md">
        <p class="text-white/20 text-[7px] font-black uppercase tracking-[0.8em]">MARCA REGISTRADA <span class="mx-2 text-primary/20">|</span> POWERED BY NEUROSTYLE IA</p>
    </footer>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import logoImg from '../assets/logo.png'
import { LucideMenu, LucideX } from 'lucide-vue-next'
import { useShopStore } from '../stores/shopStore'

const shopStore = useShopStore()
const deferredPrompt = ref(null)
const isMenuOpen = ref(false)

onMounted(() => {
    shopStore.fetchSettings()

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault()
        // Stash the event so it can be triggered later.
        deferredPrompt.value = e
    })

    window.addEventListener('appinstalled', () => {
        deferredPrompt.value = null
        console.log('PWA was installed')
    })
})

const installApp = async () => {
    if (!deferredPrompt.value) return
    
    // Show the prompt
    deferredPrompt.value.prompt()
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.value.userChoice
    console.log(`User response to the install prompt: ${outcome}`)
    
    // We've used the prompt, and can't use it again, throw it away
    deferredPrompt.value = null
}
</script>

<style scoped>
@keyframes pulse-slow {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.05); }
}

.animate-pulse-slow {
  animation: pulse-slow 12s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

.animate-pulse-glow {
  animation: pulse-glow 4s ease-in-out infinite;
}

@keyframes scanning-beam {
  0% { top: 0; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

.animate-scanning-beam {
  animation: scanning-beam 10s linear infinite;
}

@keyframes reveal-logo {
    0% { transform: scale(0.8) translateY(-20px); opacity: 0; filter: blur(20px); }
    100% { transform: scale(1) translateY(0); opacity: 1; filter: blur(0); }
}

.animate-reveal-logo {
    animation: reveal-logo 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes reveal-actions {
    0% { transform: translateY(30px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
}

.animate-reveal-actions {
    animation: reveal-actions 1.5s cubic-bezier(0.16, 1, 0.3, 1) 1.2s forwards;
    opacity: 0;
}

@keyframes reveal-badges {
    0% { opacity: 0; }
    100% { opacity: 0.6; }
}

.animate-reveal-badges {
    animation: reveal-badges 2.5s ease 2s forwards;
    opacity: 0;
}

@keyframes shimmer-fast {
    0% { transform: translateX(-150%) skewX(-20deg); }
    100% { transform: translateX(150%) skewX(-20deg); }
}

.group:hover .animate-shimmer-fast {
    animation: shimmer-fast 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes spin-extremely-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin-extremely-slow {
  animation: spin-extremely-slow 80s linear infinite;
}

.gold-text-gradient {
    background: var(--gold-gradient);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}
</style>
