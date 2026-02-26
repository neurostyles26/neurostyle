<template>
  <div class="relative min-h-screen flex items-center justify-center bg-[#020202] p-6 font-inter overflow-hidden">
    <!-- Background Accents -->
    <div class="absolute top-0 left-0 w-[60%] h-[60%] bg-primary/5 blur-[150px] rounded-full"></div>
    <div class="absolute bottom-0 right-0 w-[50%] h-[50%] bg-primary/5 blur-[130px] rounded-full"></div>

    <div class="w-full max-w-md z-10">
      <div class="text-center mb-12">
        <router-link to="/" class="inline-block mb-10 group">
          <div class="relative w-28 h-28 mx-auto transition-transform duration-500 group-hover:scale-110">
             <div class="absolute inset-0 bg-primary/30 blur-2xl rounded-full"></div>
             <div class="relative w-full h-full glass-panel rounded-full flex items-center justify-center border-white/20 p-6">
                <img :src="logoImg" class="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(218,165,32,0.5)]" alt="NeuroStyle" />
             </div>
          </div>
        </router-link>
        <h1 class="text-white text-4xl font-outfit font-bold tracking-tight mb-2">Acceso <span class="text-primary italic">Elite</span></h1>
        <p class="text-gray-500 text-[10px] uppercase tracking-[0.3em] font-black">Consola de Gestión Administrativa</p>
      </div>

      <div class="glass-panel p-10 rounded-[40px] border-white/10 shadow-2xl relative overflow-hidden group">
        <!-- Inner glow -->
        <div class="absolute -inset-1 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

        <form @submit.prevent="handleLogin" class="space-y-8 relative z-10">
          <div>
            <label class="block text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-4 ml-2">Identificación de Usuario</label>
            <div class="relative group/input">
              <LucideMail class="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within/input:text-primary transition-colors" :size="20" />
              <input 
                v-model="email" 
                type="email" 
                required
                class="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-12 pr-6 text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-gray-700 font-medium"
                placeholder="admin@neurostyle.com"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-4 ml-2">Clave de Acceso Segura</label>
            <div class="relative group/input">
              <LucideLock class="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within/input:text-primary transition-colors" :size="20" />
              <input 
                v-model="password" 
                type="password" 
                required
                class="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-12 pr-6 text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-gray-700 font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div class="flex justify-end">
            <button type="button" class="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">Recuperar Acceso</button>
          </div>

          <button 
            type="submit" 
            :disabled="loading"
            class="w-full bg-primary text-black font-black py-6 rounded-3xl flex items-center justify-center text-lg hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all shadow-[0_15px_30px_rgba(218,165,32,0.2)] group overflow-hidden"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <span v-if="loading" class="animate-pulse">VERIFICANDO...</span>
            <span v-else class="font-outfit uppercase tracking-widest">INGRESAR AL SISTEMA</span>
            <LucideLogIn v-if="!loading" class="ml-3" :size="20" />
          </button>
        </form>
      </div>

      <div class="mt-12 text-center flex flex-col items-center space-y-6">
          <button @click="handleSignUp" class="text-gray-600 hover:text-primary transition-colors text-[10px] font-black uppercase tracking-[0.2em] group">
            ¿NUEVO SOCIO? <span class="bg-primary/10 text-primary px-2 py-1 rounded-md ml-2 group-hover:bg-primary group-hover:text-black transition-colors">REGISTRAR LOCAL</span>
          </button>
          
          <router-link to="/" class="text-gray-500 hover:text-white transition-colors text-[9px] font-bold uppercase tracking-[0.4em] flex items-center">
             <LucideChevronLeft class="mr-1" :size="12" /> VOLVER AL PORTAL DEL CLIENTE
          </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { LucideChevronLeft, LucideMail, LucideLock, LucideLogIn } from 'lucide-vue-next'
import { supabase } from '../services/supabase'
import logoImg from '../assets/logo.png'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)

const handleLogin = async () => {
  if (!email.value || !password.value) return
  
  loading.value = true
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (error) throw error
    router.push('/admin')
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}

const handleSignUp = () => {
    alert("Para registrar un nuevo negocio, por favor contacta a elite-business@neurostyle.ai")
}
</script>

