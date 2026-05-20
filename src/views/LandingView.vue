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
    <header class="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 py-4 md:px-12 glass-panel border-b border-white/5 backdrop-blur-xl transition-all duration-500">
      <div class="flex items-center space-x-4">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary/20 to-white/5 flex items-center justify-center border border-primary/20 p-2 shrink-0 shadow-lg shadow-primary/5">
          <img :src="logoImg" class="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(218,165,32,0.4)]" alt="Logo" />
        </div>
        <div class="hidden sm:block">
          <span class="text-white text-xs font-black uppercase tracking-[0.4em] block">{{ shopStore.shopName }}</span>
          <span class="text-primary text-[7px] font-black uppercase tracking-[0.2em] block opacity-70 italic">Powered by Neural Tech</span>
        </div>
      </div>
      
      <div class="flex items-center gap-4">
        <!-- Quick Booking Link (Desktop) -->
        <router-link to="/book" class="hidden md:flex text-[10px] font-black text-white/40 hover:text-primary uppercase tracking-[0.3em] transition-all py-2 px-4 rounded-full border border-white/5 hover:border-primary/20 bg-white/5">
          Reserva Directa
        </router-link>

        <!-- Hamburger Menu Button -->
        <button 
          @click="isMenuOpen = !isMenuOpen" 
          class="w-11 h-11 flex items-center justify-center glass-panel rounded-2xl hover:bg-white/10 hover:border-primary/30 transition-all pointer-events-auto shadow-lg"
        >
          <component :is="isMenuOpen ? LucideX : LucideMenu" class="text-primary" :size="22" />
        </button>
      </div>
    </header>

    <!-- Slide-over Mobile Menu -->
    <transition
      enter-active-class="transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1)"
      enter-from-class="translate-x-full opacity-0"
      leave-active-class="transition-all duration-500 ease-in"
      leave-to-class="translate-x-full opacity-0"
    >
      <div v-if="isMenuOpen" class="fixed inset-0 z-[120] flex justify-end">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-md" @click="isMenuOpen = false"></div>
        <div class="relative w-80 h-full glass-panel border-l border-white/5 p-12 flex flex-col pt-32 bg-[#050505]/95">
          <div class="space-y-12">
            <router-link to="/scan" class="group block" @click="isMenuOpen = false">
              <span class="text-white/40 group-hover:text-primary transition-colors text-xs font-black uppercase tracking-[0.3em] block mb-2">Simulador IA</span>
              <span class="text-[9px] text-gray-600 uppercase tracking-[0.2em]">Escaneo Biométrico 3D</span>
            </router-link>
            
            <router-link to="/book" class="group block" @click="isMenuOpen = false">
              <span class="text-white/40 group-hover:text-primary transition-colors text-xs font-black uppercase tracking-[0.3em] block mb-2">Citas Master</span>
              <span class="text-[9px] text-gray-600 uppercase tracking-[0.2em]">Reserva tu Experiencia</span>
            </router-link>

            <router-link to="/store" class="group block" @click="isMenuOpen = false">
              <span class="text-white/40 group-hover:text-primary transition-colors text-xs font-black uppercase tracking-[0.3em] block mb-2">Exclusive Store</span>
              <span class="text-[9px] text-gray-600 uppercase tracking-[0.2em]">Productos de Alta Gama</span>
            </router-link>
            
            <div class="h-[1px] w-full bg-white/5"></div>

            <router-link to="/about" class="group block" @click="isMenuOpen = false">
              <span class="text-white/40 group-hover:text-primary transition-colors text-xs font-black uppercase tracking-[0.3em] block mb-2">Sobre Nosotros</span>
              <span class="text-[9px] text-gray-600 uppercase tracking-[0.2em]">Nuestra Historia & Visión</span>
            </router-link>
          </div>

          <div class="mt-auto pt-20 border-t border-white/5">
             <div class="flex flex-col space-y-4 opacity-40 hover:opacity-100 transition-opacity">
              <span class="text-[8px] font-black tracking-[0.6em] text-primary uppercase">DEVELOPED BY DEVEDISOF</span>
              <p class="text-[7px] text-gray-500 leading-relaxed uppercase tracking-widest">Tecnología Neural para el Arte del Grooming</p>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Main Hero Landing -->
    <main class="z-10 w-full max-w-7xl flex flex-col items-center pt-40 pb-20 px-6">
      <div class="flex flex-col items-center animate-fade-in-up w-full text-center">
        <!-- Sculptural Logo Lens -->
        <div class="relative w-44 h-44 sm:w-64 sm:h-64 mb-16 group">
          <div class="absolute inset-[-30px] bg-primary/20 blur-[80px] rounded-full animate-pulse-glow"></div>
          <div class="relative w-full h-full rounded-[48px] p-[2px] bg-gradient-to-tr from-primary/40 via-white/10 to-primary/40 shadow-2xl rotate-3 group-hover:rotate-0 transition-all duration-1000">
            <div class="w-full h-full rounded-[46px] bg-[#050505] flex items-center justify-center overflow-hidden p-10 border border-white/5 relative">
              <img 
                v-if="shopStore.logoUrl"
                :src="shopStore.logoUrl" 
                class="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(218,165,32,0.4)] transition-all duration-1000 group-hover:scale-110" 
                :alt="shopStore.shopName" 
              />
              <img 
                v-else
                :src="logoImg" 
                class="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(218,165,32,0.4)] opacity-20 grayscale" 
                alt="Placeholder" 
              />
              <!-- Shimmer effect -->
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500"></div>
            </div>
          </div>
          <!-- Decorative UI Elements -->
          <div class="absolute -top-4 -right-4 w-12 h-12 glass-panel rounded-2xl flex items-center justify-center animate-float">
            <LucideSparkles class="text-primary" :size="16" />
          </div>
          <div class="absolute -bottom-6 -left-6 w-16 h-16 glass-panel rounded-full flex items-center justify-center animate-float" style="animation-delay: 2s">
            <LucideScissors class="text-white/20" :size="20" />
          </div>
        </div>

        <!-- Innovative Typography -->
        <div class="relative mb-8 px-4">
          <h1 class="text-white text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-outfit font-black tracking-tighter uppercase leading-[0.85] text-glow">
            {{ shopStore.shopName }}
          </h1>
          <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 w-64 h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent"></div>
        </div>
        
        <p class="text-gray-400 text-[10px] sm:text-xs md:text-sm font-bold max-w-2xl mb-24 leading-relaxed tracking-[0.4em] uppercase opacity-80">
          {{ shopStore.shopDescription || 'Innovación, Estilo & Maestría en cada detalle' }}
        </p>
      </div>

      <!-- Innovative Role Selection -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full max-w-6xl animate-reveal-actions">
        
        <!-- CLIENT CARD -->
        <div class="group relative">
          <div class="absolute inset-0 bg-primary/10 blur-[100px] rounded-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          <div class="relative glass-card rounded-[48px] p-10 md:p-14 flex flex-col h-full overflow-hidden min-h-[500px]">
            <div class="flex items-center justify-between mb-16">
              <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-inner">
                <LucideSparkles class="text-primary" :size="32" />
              </div>
              <div class="flex flex-col items-end text-right">
                <span class="text-[9px] font-black tracking-[0.4em] text-primary uppercase mb-1">Experiencia Premium</span>
                <span class="text-[7px] text-gray-500 font-bold uppercase tracking-widest">Uso para clientes</span>
              </div>
            </div>

            <h3 class="text-white text-4xl md:text-5xl font-outfit font-black mb-6 tracking-tight uppercase leading-none">Tu Perfil <br/><span class="text-primary">Perfecto</span></h3>
            <p class="text-gray-400 text-xs md:text-sm font-medium uppercase tracking-widest leading-relaxed mb-12 max-w-sm">
              Descubre el estilo que mejor se adapta a tus facciones mediante análisis de biometría facial por IA.
            </p>

            <div class="mt-auto space-y-4">
              <router-link 
                to="/scan" 
                class="btn-primary w-full group/btn"
              >
                Iniciar Escaneo 3D
                <LucideSparkles class="group-hover/btn:rotate-12 transition-transform" :size="18" />
              </router-link>

              <div class="grid grid-cols-2 gap-4">
                <router-link to="/book" class="btn-secondary py-5 px-4 text-[10px]">Agendar Cita</router-link>
                <router-link to="/store" class="btn-secondary py-5 px-4 text-[10px]">Ver Catálogo</router-link>
              </div>
            </div>
            
            <!-- Abstract Background Pattern -->
            <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px] group-hover:bg-primary/10 transition-colors"></div>
          </div>
        </div>

        <!-- BARBER CARD -->
        <div class="group relative">
          <div class="absolute inset-0 bg-white/5 blur-[100px] rounded-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          <div class="relative glass-card rounded-[48px] p-10 md:p-14 flex flex-col h-full overflow-hidden min-h-[500px]">
            <div class="flex items-center justify-between mb-16">
              <div class="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-primary/40 transition-colors shadow-inner">
                <LucideScissors class="text-white/40 group-hover:text-primary transition-colors" :size="32" />
              </div>
              <div class="flex flex-col items-end text-right">
                <span class="text-[9px] font-black tracking-[0.4em] text-white/40 uppercase mb-1 group-hover:text-primary/60 transition-colors">Gestión Maestro</span>
                <span class="text-[7px] text-gray-500 font-bold uppercase tracking-widest">Portal Administrativo</span>
              </div>
            </div>

            <h3 class="text-white text-4xl md:text-5xl font-outfit font-black mb-6 tracking-tight uppercase leading-none">Control <br/>Administrativo</h3>
            <p class="text-gray-400 text-xs md:text-sm font-medium uppercase tracking-widest leading-relaxed mb-12 max-w-sm">
              Plataforma avanzada para la gestión de citas, servicios y productos de tu negocio.
            </p>

            <div class="mt-auto">
              <router-link 
                to="/login" 
                class="btn-secondary w-full py-6 border-white/10 hover:border-primary/40 text-white/60 hover:text-white"
              >
                Acceder al Panel
              </router-link>
            </div>
            
            <!-- Barber Pole Decorative Element -->
            <div class="absolute right-0 top-0 w-2 h-full opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
              <div class="w-full h-full bg-gradient-to-b from-primary via-white to-primary animate-pulse"></div>
            </div>
          </div>
        </div>

      </div>

      <!-- Sophisticated Feature Grid -->
      <div class="mt-40 w-full max-w-5xl">
        <div class="flex flex-col items-center mb-16">
          <span class="text-primary text-[8px] font-black uppercase tracking-[0.5em] mb-4">Nuestra Tecnología</span>
          <h4 class="text-white text-2xl font-outfit font-black uppercase tracking-widest">Ecosistema Digital Elite</h4>
          <div class="w-12 h-[2px] bg-primary mt-4"></div>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
          <div v-for="(feat, idx) in [
            {t: 'Mapeo Neural', d: 'Análisis Biométrico'}, 
            {t: 'Gen IA', d: 'Simulación Realista'}, 
            {t: 'Cloud Sync', d: 'Reserva Inmediata'}, 
            {t: 'Master Tech', d: 'Grooming de Elite'}
          ]" :key="idx" class="glass-panel p-6 rounded-3xl flex flex-col items-center text-center hover:bg-white/5 transition-colors border-white/5">
            <span class="text-white font-black text-[10px] uppercase tracking-widest mb-2">{{ feat.t }}</span>
            <span class="text-gray-600 text-[8px] uppercase font-bold tracking-wider">{{ feat.d }}</span>
          </div>
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
