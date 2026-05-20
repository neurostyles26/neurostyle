<template>
  <div class="min-h-screen bg-[#050505] flex flex-col p-6 font-inter relative overflow-hidden">
    <!-- Sophisticated Background Aura -->
    <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[160px] rounded-full pointer-events-none"></div>

    <!-- Header -->
    <header class="flex items-center justify-between mb-12 z-10">
      <button @click="$router.back()" class="w-12 h-12 flex items-center justify-center glass-panel rounded-2xl hover:bg-white/10 hover:border-primary/30 transition-all shadow-lg group">
        <LucideChevronLeft class="text-primary group-hover:-translate-x-1 transition-transform" />
      </button>
      <div class="text-center">
          <h2 class="text-white font-outfit font-black text-2xl tracking-tighter uppercase">Agendar <span class="text-primary">Cita</span></h2>
          <p class="text-primary text-[8px] font-black uppercase tracking-[0.4em] opacity-70 italic">Exclusive Booking</p>
      </div>
      <div class="w-12"></div>
    </header>

    <main class="flex-1 z-10 max-w-2xl mx-auto w-full overflow-y-auto pr-1 custom-scrollbar">
      <!-- Service Info Card -->
      <div class="glass-card p-8 rounded-[40px] mb-12 border-primary/20 flex items-center justify-between shadow-2xl relative overflow-hidden group">
        <div class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div class="relative z-10">
          <span class="text-primary text-[9px] font-black uppercase tracking-[0.4em] mb-2 block opacity-80">Servicio Seleccionado</span>
          <h3 class="text-white font-outfit font-black text-3xl uppercase tracking-tighter leading-none">{{ selectedService }}</h3>
        </div>
        <div class="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 relative z-10">
          <LucideCheckCircle class="text-black" :size="24" />
        </div>
      </div>

      <!-- Step 1: Date Selection -->
      <section class="mb-12">
        <div class="flex items-center gap-4 mb-8">
            <div class="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-black font-outfit text-lg shadow-inner">1</div>
            <h4 class="text-white font-outfit font-black text-xl uppercase tracking-widest">Selecciona el Día</h4>
        </div>

        <div class="flex space-x-4 overflow-x-auto pb-6 custom-scrollbar no-scrollbar">
          <button 
            v-for="date in availableDates" 
            :key="date.fullDate"
            @click="selectedDate = date.fullDate"
            :class="[
              'flex-shrink-0 w-24 h-32 rounded-[32px] border flex flex-col items-center justify-center transition-all duration-500 relative overflow-hidden',
              selectedDate === date.fullDate ? 'bg-primary border-primary scale-105 shadow-2xl' : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'
            ]"
          >
            <span class="text-[9px] font-black uppercase mb-2 tracking-widest" :class="selectedDate === date.fullDate ? 'text-black/60' : 'text-gray-500'">{{ date.month }}</span>
            <span class="text-3xl font-black mb-2 font-outfit leading-none" :class="selectedDate === date.fullDate ? 'text-black' : 'text-white'">{{ date.dayNumber }}</span>
            <span class="text-[9px] font-black uppercase tracking-[0.2em]" :class="selectedDate === date.fullDate ? 'text-black/60' : 'text-gray-500'">{{ date.dayName }}</span>
            
            <div v-if="selectedDate === date.fullDate" class="absolute bottom-2 w-1.5 h-1.5 bg-black/40 rounded-full"></div>
          </button>
        </div>
      </section>

      <!-- Step 2: Time Selection -->
      <section v-if="selectedDate" class="mb-12 animate-fade-in">
        <div class="flex items-center gap-4 mb-8">
            <div class="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-black font-outfit text-lg shadow-inner">2</div>
            <h4 class="text-white font-outfit font-black text-xl uppercase tracking-widest">Elige tu Horario</h4>
        </div>

        <div v-if="loadingSlots" class="flex justify-center py-12">
            <div class="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
        
        <div v-else class="grid grid-cols-3 sm:grid-cols-4 gap-4">
          <button 
            v-for="slot in timeSlots" 
            :key="slot"
            @click="selectedTime = slot"
            :disabled="isBooked(slot)"
            :class="[
              'py-5 rounded-2xl font-black transition-all text-xs tracking-widest border font-outfit uppercase shadow-sm',
              isBooked(slot) ? 'bg-white/2 border-transparent opacity-10 cursor-not-allowed grayscale' :
              selectedTime === slot ? 'bg-primary border-primary text-black shadow-xl shadow-primary/20 scale-[1.02]' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20'
            ]"
          >
            {{ slot }}
          </button>
        </div>
      </section>

      <!-- Step 3: Client Details -->
      <section v-if="selectedTime" class="mb-20 animate-fade-in">
        <div class="flex items-center gap-4 mb-8">
            <div class="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-black font-outfit text-lg shadow-inner">3</div>
            <h4 class="text-white font-outfit font-black text-xl uppercase tracking-widest">Confirma tus Datos</h4>
        </div>

        <div class="glass-card p-10 rounded-[48px] border-white/10 shadow-2xl relative overflow-hidden">
            <div class="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/5 blur-[80px] rounded-full"></div>
            
            <div class="relative z-10 space-y-10">
                <div class="space-y-4">
                    <label class="block text-gray-500 text-[9px] font-black uppercase tracking-[0.4em] ml-2 opacity-80">Identificación del Cliente</label>
                    <div class="relative group">
                        <div class="absolute left-5 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors duration-500">
                          <LucideUser :size="24" />
                        </div>
                        <input 
                            v-model="clientName"
                            type="text" 
                            placeholder="TU NOMBRE COMPLETO"
                            class="w-full bg-[#0a0a0a] border border-white/5 rounded-3xl py-6 pl-16 pr-6 text-white text-sm focus:outline-none focus:border-primary/40 transition-all font-outfit font-bold uppercase tracking-widest shadow-inner placeholder:text-gray-800"
                        >
                    </div>
                </div>
                
                <button 
                    @click="confirmBooking"
                    :disabled="!clientName || submitting"
                    class="btn-primary w-full py-7 text-lg group/btn"
                >
                    <template v-if="submitting">
                        <div class="w-8 h-8 border-4 border-black/20 border-t-black rounded-full animate-spin"></div>
                    </template>
                    <template v-else>
                        <span class="flex items-center gap-4">
                          CONFIRMAR CITA MASTER
                          <LucideCalendar class="group-hover/btn:scale-110 transition-transform" :size="22" />
                        </span>
                    </template>
                </button>
                
                <p class="text-center text-gray-600 text-[8px] font-black uppercase tracking-[0.6em] opacity-60">Al confirmar, aceptas nuestras políticas de reserva</p>
            </div>
        </div>
      </section>
    </main>

    <!-- Footer Credit -->
    <footer class="py-10 text-center z-10 opacity-30">
      <p class="text-[7px] font-black text-white uppercase tracking-[0.8em]">SYSTEM SECURE <span class="mx-2">|</span> NEURAL RESERVATION</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
    LucideChevronLeft, LucideCheckCircle, LucideUser,
    LucideCalendar
} from 'lucide-vue-next'
import { supabase } from '../services/supabase'
import { audioService } from '../services/audioService'
import { useShopStore } from '../stores/shopStore'

const route = useRoute()
const router = useRouter()
const shopStore = useShopStore()

const selectedService = ref(route.query.style || 'Corte General')
const selectedDate = ref(null)
const selectedTime = ref(null)
const clientName = ref('')
const loadingSlots = ref(false)
const submitting = ref(false)

const availableDates = ref([])
const timeSlots = ref([])
const bookedSlots = ref([])

const generateDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 0; i < 14; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)
        dates.push({
            fullDate: date.toISOString().split('T')[0],
            dayName: date.toLocaleDateString('es-ES', { weekday: 'short' }),
            dayNumber: date.getDate(),
            month: date.toLocaleDateString('es-ES', { month: 'short' })
        })
    }
    availableDates.value = dates
    selectedDate.value = dates[0].fullDate
}

const generateTimeSlots = () => {
    const slots = []
    for (let hour = 10; hour < 20; hour++) {
        slots.push(`${hour}:00`)
        slots.push(`${hour}:30`)
    }
    timeSlots.value = slots
}

const fetchBookedSlots = async (date) => {
    if (!shopStore.tenantId) return
    loadingSlots.value = true
    try {
        // Consultar usando el nuevo esquema tenant-aware
        const { data, error } = await supabase
            .from('appointments')
            .select('scheduled_at')
            .gte('scheduled_at', `${date}T00:00:00Z`)
            .lte('scheduled_at', `${date}T23:59:59Z`)
            .neq('status', 'cancelled')
        
        if (error) throw error
        
        // Extraer solo la hora para comparar
        bookedSlots.value = data.map(i => {
            const d = new Date(i.scheduled_at)
            return `${d.getHours()}:${d.getMinutes() === 0 ? '00' : '30'}`
        })
    } catch (err) {
        console.error("Error al cargar cupos:", err)
    } finally {
        loadingSlots.value = false
    }
}

const isBooked = (time) => bookedSlots.value.includes(time)

const confirmBooking = async () => {
    if (!clientName.value || !shopStore.tenantId) return
    
    submitting.value = true
    try {
        // Combinar fecha y hora para scheduled_at
        const scheduledDateTime = new Date(`${selectedDate.value}T${selectedTime.value}:00`).toISOString()

        const { error } = await supabase
            .from('appointments')
            .insert([{
                tenant_id: shopStore.tenantId,
                client_name: clientName.value,
                scheduled_at: scheduledDateTime,
                service: selectedService.value,
                status: 'pending'
            }])
        
        if (error) throw error
        
        audioService.playSuccess()
        alert("¡Cita Agendada con éxito!")
        router.push('/')
    } catch (err) {
        alert("Error al agendar: " + err.message)
    } finally {
        submitting.value = false
    }
}

watch(selectedDate, (newDate) => {
    if (newDate) {
        fetchBookedSlots(newDate)
        selectedTime.value = null
    }
})

onMounted(() => {
    generateDates()
    generateTimeSlots()
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
