<template>
  <div class="min-h-screen bg-[#020202] flex flex-col p-6 font-inter relative overflow-hidden">
    <!-- Background Aura -->
    <div class="absolute top-0 right-0 w-full h-[30vh] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

    <!-- Header -->
    <header class="flex items-center justify-between mb-10 z-10 px-2 lg:px-0">
      <button @click="router.push('/admin')" class="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center glass-panel rounded-xl sm:rounded-2xl hover:bg-white/10 transition-colors">
        <LucideChevronLeft class="text-primary" />
      </button>
      <div class="text-center">
          <h2 class="text-white font-outfit font-bold text-lg sm:text-xl tracking-tight">Agenda Global</h2>
          <p class="text-primary text-[8px] font-black uppercase tracking-[0.3em]">Supervisión Operacional</p>
      </div>
      <div class="w-10 sm:w-12"></div>
    </header>

    <main class="flex-1 z-10 overflow-y-auto pr-1">
      <div v-if="loading" class="flex flex-col items-center justify-center h-64">
        <div class="relative w-16 h-16 mb-6">
            <div class="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
            <div class="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p class="text-gray-500 font-black text-[10px] uppercase tracking-[0.4em] animate-pulse">Sincronizando Agenda...</p>
      </div>

      <div v-else-if="appointments.length === 0" class="text-center py-32">
        <div class="w-24 h-24 bg-white/5 rounded-[32px] flex items-center justify-center mx-auto mb-8 border border-white/5">
            <LucideCalendar class="text-gray-800" :size="40" />
        </div>
        <h3 class="text-white font-outfit font-bold text-2xl mb-2 tracking-tight">Sin registros activos</h3>
        <p class="text-gray-500 text-sm max-w-xs mx-auto">La plataforma está a la espera de nuevas conexiones de clientes.</p>
      </div>

      <div v-else class="space-y-6 mb-24 max-w-2xl mx-auto w-full">
        <div 
            v-for="appt in appointments" 
            :key="appt.id"
            class="glass-panel p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] border-white/5 relative overflow-hidden group hover:border-primary/20 transition-all duration-500 hover:translate-y-[-4px]"
        >
          <!-- Status Indicator Stripe -->
          <div :class="[
              'absolute top-0 bottom-0 left-0 w-1.5 transition-colors duration-500',
              appt.status === 'Pendiente' ? 'bg-yellow-500/50' : 'bg-green-500/50'
          ]"></div>

          <div class="flex items-start justify-between mb-8 relative z-10">
            <div class="flex items-center flex-1">
                <div class="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-primary font-outfit font-black text-xl sm:text-2xl mr-4 sm:mr-6 uppercase border border-primary/20 group-hover:bg-primary group-hover:text-black transition-all duration-500 shrink-0">
                    {{ appt.client_name?.[0] || '?' }}
                </div>
                <div class="min-w-0 flex-1">
                    <h4 class="text-white font-outfit font-bold text-lg sm:text-xl mb-1 sm:mb-2 tracking-tight truncate">{{ appt.client_name }}</h4>
                    <span :class="[
                        'text-[9px] font-black uppercase px-3 py-1 rounded-full border tracking-widest',
                        appt.status === 'Pendiente' ? 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5' : 'text-green-500 border-green-500/20 bg-green-500/5'
                    ]">
                        {{ appt.status }}
                    </span>
                </div>
            </div>
            <div class="text-right shrink-0">
                <p class="text-primary font-outfit font-black text-xl sm:text-2xl gold-glow mb-1">{{ appt.time }}</p>
                <p class="text-gray-500 text-[8px] sm:text-[10px] uppercase font-black tracking-[0.2em] font-outfit">{{ formatDate(appt.date) }}</p>
            </div>
          </div>

          <div class="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
            <div class="flex items-center text-gray-400 group-hover:text-gray-300 transition-colors">
                <div class="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center mr-3 border border-white/5">
                    <LucideScissors class="text-primary/70" :size="16" />
                </div>
                <span class="text-sm font-medium tracking-tight">{{ appt.service }}</span>
            </div>
            <button @click="deleteAppointment(appt)" class="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/5 text-red-500/30 hover:bg-red-500/10 hover:text-red-500 transition-all">
                <LucideTrash2 :size="18" />
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
    LucideChevronLeft, LucideCalendar, 
    LucideScissors, LucideTrash2 
} from 'lucide-vue-next'
import { supabase } from '../services/supabase'
import { audioService } from '../services/audioService'

const router = useRouter()

const appointments = ref([])
const loading = ref(true)

const fetchAppointments = async () => {
    loading.value = true
    try {
        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .order('date', { ascending: false })
            .order('time', { ascending: true })
        
        if (error) throw error
        appointments.value = data || []
    } catch (err) {
        console.error(err)
    } finally {
        loading.value = false
    }
}

const deleteAppointment = async (appt) => {
    if (!confirm(`¿Eliminar cita de ${appt.client_name}?`)) return
    try {
        const { error } = await supabase
            .from('appointments')
            .delete()
            .eq('id', appt.id)
        if (error) throw error
        
        audioService.playAlert()
        appointments.value = appointments.value.filter(a => a.id !== appt.id)
    } catch (err) {
        alert(err.message)
    }
}

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(fetchAppointments)
</script>

