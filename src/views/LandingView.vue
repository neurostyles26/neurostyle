<template>
  <div class="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#020202] py-12 px-6 font-inter transition-all duration-1000" :style="shopStore.bgUrl ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url(${shopStore.bgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}">
    <!-- Sophisticated Background Layering -->
    <div v-if="!shopStore.bgUrl" class="absolute inset-0 z-0 pointer-events-none">
      <!-- Deep Animated Glows -->
      <div class="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-primary/10 blur-[160px] rounded-full animate-pulse-slow"></div>
      <div class="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-primary/5 blur-[140px] rounded-full animate-pulse-slow" style="animation-delay: 5s"></div>
      
      <!-- Fine Scanning Grid -->
      <div class="absolute inset-0 opacity-[0.04]" :style="{ backgroundImage: 'linear-gradient(rgba(218,165,32,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(218,165,32,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }"></div>
      
      <!-- Scanning Beam Effect -->
      <div class="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-scanning-beam"></div>

      <!-- Noise Texture for Organic Feel -->
      <div class="absolute inset-0 opacity-[0.02] mix-blend-overlay" :style="{ backgroundImage: 'url(https://grainy-gradients.vercel.app/noise.svg)' }"></div>
    </div>

    <!-- Content Wrapper -->
    <div class="z-10 w-full max-w-5xl text-center flex flex-col items-center">
      <!-- Secondary Shop Logo (New) -->
      <div v-if="shopStore.logoUrl" class="mb-4 animate-reveal-logo opacity-60 hover:opacity-100 transition-opacity">
         <img :src="shopStore.logoUrl" class="h-12 object-contain filter drop-shadow-lg" :alt="shopStore.shopName" />
      </div>

      <!-- Premium Logo Section (NeuroStyle) -->
      <div class="mb-14 group cursor-default animate-reveal-logo">
        <div class="relative w-36 h-36 mx-auto transition-all duration-1000">
          <!-- Multi-layered Glows -->
          <div class="absolute inset-0 bg-primary/25 blur-3xl rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-1000 animate-pulse-glow"></div>
          <div class="absolute -inset-4 border border-primary/5 rounded-full animate-spin-extremely-slow"></div>
          
          <div class="relative w-full h-full glass-panel rounded-full flex items-center justify-center shadow-2xl border-white/5 overflow-hidden p-8">
             <img :src="logoImg" class="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(218,165,32,0.5)] transition-transform duration-1000 group-hover:scale-110" alt="NeuroStyle Logo" />
             
             <!-- Shimmer effect -->
             <div class="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
                <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer-fast"></div>
             </div>
          </div>
        </div>
      </div>

      <!-- Main Title -->
      <div class="overflow-hidden mb-4">
          <p class="text-primary text-[10px] font-black uppercase tracking-[0.6em] mb-4 animate-reveal-title opacity-80">Powered by</p>
          <h1 class="text-white text-6xl md:text-9xl font-outfit font-black tracking-[-0.07em] leading-none animate-reveal-title">
            NEURO<span class="gold-text-gradient italic relative inline-block">STYLE
              <!-- Subtle Underline Glow -->
              <span class="absolute bottom-2 left-0 w-full h-[2px] bg-primary/20 blur-[4px]"></span>
            </span>
          </h1>
      </div>
      
      <!-- Description / Shop Name -->
      <div class="animate-reveal-desc">
        <h2 class="text-white text-xl md:text-2xl font-outfit font-bold tracking-[0.2em] mb-4 uppercase italic">
          {{ shopStore.shopName || 'Estudio de Innovación Capilar' }}
        </h2>
        <p class="text-gray-400 text-xs md:text-sm max-w-2xl mx-auto mb-20 font-light leading-relaxed tracking-[0.2em] uppercase opacity-60">
          Master Barbering <span class="mx-2 text-primary/40">·</span> Precision Intelligence <span class="mx-2 text-primary/40">·</span> Biometría Neural
        </p>
      </div>

      <!-- Staggered Action Buttons (Icon-free) -->
      <div class="flex flex-col gap-8 justify-center items-center w-full max-w-md animate-reveal-actions">
        <!-- AI Scan Button (The Star) -->
        <router-link 
          to="/scan" 
          class="group relative w-full px-10 py-7 bg-primary text-black font-black text-xl rounded-2xl transition-all duration-700 hover:scale-[1.03] active:scale-95 shadow-[0_25px_50px_-12px_rgba(218,165,32,0.4)] flex items-center justify-center overflow-hidden"
        >
          <!-- Shimmer logic -->
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <span class="font-outfit uppercase tracking-[0.1em] relative z-10 transition-all duration-500 group-hover:tracking-[0.15em]">INICIAR ESCANEO IA</span>
        </router-link>

        <!-- Secondary Actions in Row -->
        <div class="grid grid-cols-2 gap-4 w-full">
          <router-link 
            to="/book" 
            class="group relative px-6 py-5 glass-card text-white font-bold text-base rounded-2xl transition-all duration-500 flex items-center justify-center overflow-hidden border-white/5 hover:border-primary/40"
          >
            <span class="font-outfit uppercase tracking-[0.1em] text-xs md:text-sm group-hover:text-primary transition-colors">CITAS</span>
          </router-link>

          <router-link 
            to="/store" 
            class="group relative px-6 py-5 glass-card text-white font-bold text-base rounded-2xl transition-all duration-500 border-white/5 hover:border-primary/40 flex items-center justify-center overflow-hidden"
          >
            <span class="font-outfit uppercase tracking-[0.1em] text-xs md:text-sm group-hover:text-primary transition-colors">CATÁLOGO</span>
          </router-link>
        </div>

        <!-- Professional Access -->
        <router-link 
          to="/login" 
          class="flex items-center space-x-4 text-gray-400 hover:text-primary transition-all duration-700 text-[9px] font-black uppercase tracking-[0.5em] mt-12 group opacity-80 hover:opacity-100"
        >
           <div class="w-12 h-[1px] bg-white/10 group-hover:w-16 group-hover:bg-primary/40 transition-all duration-700"></div>
           <span>ACCESO BARBERO</span>
           <div class="w-12 h-[1px] bg-white/10 group-hover:w-16 group-hover:bg-primary/40 transition-all duration-700"></div>
        </router-link>

        <!-- PWA Install Button (Conditional) -->
        <div v-if="deferredPrompt" class="mt-12 animate-reveal-actions">
          <button 
            @click="installApp"
            class="group relative px-8 py-4 glass-panel border-primary/20 text-primary font-black text-[10px] rounded-2xl transition-all duration-500 hover:bg-primary hover:text-black hover:scale-105 active:scale-95 shadow-xl shadow-primary/5 uppercase tracking-[0.2em]"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer-fast"></div>
            Instalar Aplicación
          </button>
        </div>
      </div>

      <!-- Feature Badges Section (Minimalist) -->
      <div class="mt-32 mb-12 flex flex-wrap justify-center gap-10 md:gap-14 opacity-60 hover:opacity-100 transition-all duration-1000 animate-reveal-badges">
          <div class="flex flex-col items-center">
              <span class="text-[8px] font-bold tracking-[0.4em] uppercase">NEURAL MAPPING</span>
          </div>
          <div class="flex flex-col items-center">
              <span class="text-[8px] font-bold tracking-[0.4em] uppercase">IA GENERATIVA</span>
          </div>
          <div class="flex flex-col items-center">
              <span class="text-[8px] font-bold tracking-[0.4em] uppercase">MASTER STYLE</span>
          </div>
      </div>
    </div>

    <!-- Bottom Footer Fade -->
    <div class="absolute bottom-0 left-0 right-0 h-[35vh] bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-0"></div>

    <!-- Developer Credit -->
    <div class="absolute bottom-8 z-20 animate-reveal-badges opacity-60 hover:opacity-100 transition-opacity duration-700">
      <a 
        href="https://devedisof-mi-cv.netlify.app/" 
        target="_blank" 
        class="text-[9px] font-black text-gray-500 hover:text-primary uppercase tracking-[0.4em] transition-colors flex items-center"
      >
        Developed by <span class="text-primary/60 ml-2 group-hover:text-primary transition-colors">EDISSOF</span>
      </a>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import logoImg from '../assets/logo.png'
import { useShopStore } from '../stores/shopStore'

const shopStore = useShopStore()
const deferredPrompt = ref(null)

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

@keyframes reveal-title {
    0% { transform: translateY(50px); opacity: 0; filter: blur(15px); }
    100% { transform: translateY(0); opacity: 1; filter: blur(0); }
}

.animate-reveal-title {
    animation: reveal-title 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
    opacity: 0;
}

@keyframes reveal-desc {
    0% { opacity: 0; letter-spacing: 0.3em; }
    100% { opacity: 0.8; letter-spacing: 0.1em; }
}

.animate-reveal-desc {
    animation: reveal-desc 2s cubic-bezier(0.16, 1, 0.3, 1) 0.8s forwards;
    opacity: 0;
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
