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
    <main class="z-10 w-full max-w-6xl flex flex-col items-center pt-32 pb-20 px-6">
      <div class="flex flex-col items-center animate-fade-in-up w-full text-center">
        <!-- Sculptural Logo Lens -->
        <div class="relative w-40 h-40 sm:w-56 sm:h-56 mb-12 group">
          <div class="absolute inset-[-20px] bg-primary/20 blur-[60px] rounded-full animate-pulse-glow"></div>
          <div class="relative w-full h-full rounded-full p-[2px] bg-gradient-to-tr from-primary/40 via-white/10 to-primary/40 shadow-[0_0_50px_rgba(218,165,32,0.2)]">
            <div class="w-full h-full rounded-full bg-[#050505] flex items-center justify-center overflow-hidden p-8 border border-white/5 relative">
              <img 
                v-if="shopStore.logoUrl"
                :src="shopStore.logoUrl" 
                class="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(218,165,32,0.4)] transition-all duration-1000 group-hover:scale-110 group-hover:rotate-3" 
                :alt="shopStore.shopName" 
              />
              <img 
                v-else
                :src="logoImg" 
                class="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(218,165,32,0.4)] opacity-20" 
                alt="Placeholder" 
              />
              <!-- Shimmer effect -->
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
          </div>
          <!-- Decorative Rings -->
          <div class="absolute inset-[-10px] border border-primary/10 rounded-full animate-spin-extremely-slow"></div>
          <div class="absolute inset-[-30px] border border-white/5 rounded-full animate-spin-extremely-slow" style="animation-direction: reverse; animation-duration: 120s"></div>
        </div>

        <!-- Innovative Typography -->
        <div class="relative mb-6">
          <h1 class="text-white text-6xl sm:text-8xl md:text-9xl font-outfit font-black tracking-tighter uppercase leading-[0.85] text-glow overflow-visible px-4">
            {{ shopStore.shopName }}
          </h1>
          <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-48 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        </div>
        
        <p class="text-gray-500 text-xs sm:text-sm md:text-lg font-medium max-w-xl mb-20 leading-relaxed tracking-[0.3em] uppercase opacity-60">
          {{ shopStore.shopDescription || 'Precision Neural & Master Barbering' }}
        </p>
      </div>

      <!-- Innovative Role Selection -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl animate-reveal-actions">
        
        <!-- CLIENT CARD -->
        <div class="group relative">
          <div class="absolute inset-0 bg-primary/5 blur-2xl rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div class="relative glass-panel rounded-[40px] p-8 border-white/5 flex flex-col h-full hover:border-primary/30 transition-all duration-500 overflow-hidden">
            <div class="flex items-center justify-between mb-10">
              <div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                <LucideSparkles class="text-primary" :size="28" />
              </div>
              <span class="text-[8px] font-black tracking-[0.4em] text-primary/40 uppercase">Experiencia Cliente</span>
            </div>

            <h3 class="text-white text-3xl font-outfit font-black mb-4 tracking-tight uppercase">Tu Mejor Versión</h3>
            <p class="text-gray-500 text-xs font-medium uppercase tracking-widest leading-relaxed mb-10">
              Usa nuestra IA para encontrar el corte perfecto basado en tu biometría facial.
            </p>

            <router-link 
              to="/scan" 
              class="mt-auto w-full bg-primary text-black font-black py-5 rounded-2xl flex items-center justify-center text-sm tracking-[0.15em] uppercase hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20"
            >
              Iniciar Escaneo IA
            </router-link>

            <div class="flex gap-3 mt-4">
              <router-link to="/book" class="flex-1 py-4 glass-panel border-white/5 rounded-xl text-[9px] font-black text-white/40 hover:text-white text-center uppercase tracking-widest transition-colors hover:bg-white/5">Citas</router-link>
              <router-link to="/store" class="flex-1 py-4 glass-panel border-white/5 rounded-xl text-[9px] font-black text-white/40 hover:text-white text-center uppercase tracking-widest transition-colors hover:bg-white/5">Catálogo</router-link>
            </div>
            
            <!-- Background Decoration -->
            <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/5 blur-3xl rounded-full"></div>
          </div>
        </div>

        <!-- BARBER CARD -->
        <div class="group relative">
          <div class="absolute inset-0 bg-white/5 blur-2xl rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div class="relative glass-panel rounded-[40px] p-8 border-white/5 flex flex-col h-full hover:border-white/20 transition-all duration-500 overflow-hidden">
            <div class="flex items-center justify-between mb-10">
              <div class="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-primary/40 transition-colors">
                <LucideScissors class="text-white/40 group-hover:text-primary transition-colors" :size="28" />
              </div>
              <span class="text-[8px] font-black tracking-[0.4em] text-white/20 uppercase">Portal Maestro</span>
            </div>

            <h3 class="text-white text-3xl font-outfit font-black mb-4 tracking-tight uppercase">Gestión Elite</h3>
            <p class="text-gray-500 text-xs font-medium uppercase tracking-widest leading-relaxed mb-10">
              Panel de control avanzado para barberos y administración de tienda.
            </p>

            <router-link 
              to="/login" 
              class="mt-auto w-full bg-white/5 text-white/60 font-black py-5 rounded-2xl border border-white/10 flex items-center justify-center text-sm tracking-[0.15em] uppercase hover:bg-white/10 hover:text-white transition-all group-hover:border-primary/20"
            >
              Acceso Profesional
            </router-link>
            
            <!-- Animated Barber Pole Accent -->
            <div class="absolute right-6 top-1/2 -translate-y-1/2 w-1 h-32 opacity-10 group-hover:opacity-30 transition-opacity">
                <div class="w-full h-full bg-gradient-to-b from-primary via-blue-500 to-red-500 animate-pulse-slow"></div>
            </div>
          </div>
        </div>

      </div>

      <!-- Innovative Feature Badges -->
      <div class="mt-32 flex flex-wrap justify-center gap-4 opacity-30 hover:opacity-100 transition-all duration-1000 px-6">
          <div v-for="tag in ['Neural Mapping', 'AI Generative', 'Master Style', 'Real-time Overlay']" :key="tag" class="px-5 py-2 glass-panel border-white/5 rounded-full flex items-center space-x-2">
            <div class="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
            <span class="text-[7px] font-black tracking-[0.3em] uppercase text-white/60">{{ tag }}</span>
          </div>
      </div>
      <!-- PWA Install Prompt (Floating) -->
      <transition
        enter-active-class="transition duration-700 ease-out"
        enter-from-class="translate-y-20 opacity-0"
        leave-active-class="transition duration-500 ease-in"
        leave-to-class="translate-y-20 opacity-0"
      >
        <div v-if="deferredPrompt" class="fixed bottom-10 right-6 z-[110] md:right-12">
          <button 
            @click="installApp"
            class="group relative flex items-center space-x-4 bg-primary text-black font-black px-6 py-4 rounded-2xl shadow-[0_20px_40px_rgba(218,165,32,0.3)] hover:scale-110 active:scale-95 transition-all overflow-hidden"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <LucideDownload :size="20" class="group-hover:bounce" />
            <span class="text-[10px] uppercase tracking-[0.2em]">Instalar App</span>
          </button>
        </div>
      </transition>
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
import { LucideMenu, LucideX, LucideSparkles, LucideScissors, LucideDownload } from 'lucide-vue-next'
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
