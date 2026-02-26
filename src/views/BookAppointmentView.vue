<template>
  <div class="min-h-screen bg-black flex flex-col p-6">
    <!-- Header -->
    <header class="flex items-center border-b border-white/5 pb-6 mb-8">
      <button @click="$router.back()" class="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full mr-4 hover:bg-white/10 transition-colors">
        <LucideChevronLeft class="text-primary" />
      </button>
      <h2 class="text-white font-outfit font-bold text-xl">Agendar Cita</h2>
    </header>

    <main class="flex-1 overflow-y-auto pr-1">
      <!-- Service Info -->
      <div class="glass p-6 rounded-[32px] mb-8 border-white/5 flex items-center justify-between">
        <div>
          <p class="text-gray-500 text-xs font-bold uppercase mb-1">Servicio</p>
          <h3 class="text-white font-bold text-lg">{{ selectedService }}</h3>
        </div>
        <LucideCheckCircle class="text-primary" />
      </div>

      <!-- Date Selection -->
      <section class="mb-10">
        <h4 class="text-white font-bold text-lg mb-6 flex items-center">
            <span class="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3 text-sm">1</span>
            Elige el Día
        </h4>
        <div class="flex space-x-4 overflow-x-auto pb-4 no-scrollbar">
          <button 
            v-for="date in availableDates" 
            :key="date.fullDate"
            @click="selectedDate = date.fullDate"
            :class="[
              'flex-shrink-0 w-20 h-28 rounded-3xl border flex flex-col items-center justify-center transition-all duration-300',
              selectedDate === date.fullDate ? 'bg-primary border-primary scale-105 shadow-lg shadow-primary/20' : 'bg-white/5 border-white/10 text-gray-400'
            ]"
          >
            <span class="text-[10px] font-bold uppercase mb-1" :class="selectedDate === date.fullDate ? 'text-black/60' : 'text-gray-500'">{{ date.month }}</span>
            <span class="text-2xl font-black mb-1" :class="selectedDate === date.fullDate ? 'text-black' : 'text-white'">{{ date.dayNumber }}</span>
            <span class="text-[10px] font-bold uppercase" :class="selectedDate === date.fullDate ? 'text-black/60' : 'text-gray-500'">{{ date.dayName }}</span>
          </button>
        </div>
      </section>

      <!-- Time Selection -->
      <section v-if="selectedDate" class="mb-10">
        <h4 class="text-white font-bold text-lg mb-6 flex items-center">
            <span class="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3 text-sm">2</span>
            Elige la Hora
        </h4>
        <div v-if="loadingSlots" class="flex justify-center py-8">
            <div class="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
        <div v-else class="grid grid-cols-3 gap-4">
          <button 
            v-for="slot in timeSlots" 
            :key="slot"
            @click="selectedTime = slot"
            :disabled="isBooked(slot)"
            :class="[
              'py-4 rounded-2xl font-bold border transition-all text-sm',
              isBooked(slot) ? 'bg-white/5 border-transparent opacity-20 cursor-not-allowed' :
              selectedTime === slot ? 'bg-primary border-primary text-black' : 'bg-white/5 border-white/10 text-white hover:border-white/20'
            ]"
          >
            {{ slot }}
          </button>
        </div>
      </section>

      <!-- Client Details -->
      <section v-if="selectedTime" class="mb-20">
        <h4 class="text-white font-bold text-lg mb-6 flex items-center">
            <span class="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3 text-sm">3</span>
            Tus Datos
        </h4>
        <div class="glass p-8 rounded-[40px] border-white/10 space-y-6">
            <div>
                <label class="block text-gray-500 text-xs font-bold uppercase mb-3 ml-1">Tu Nombre Completo</label>
                <div class="relative group">
                    <LucideUser class="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within:text-primary transition-colors" :size="20" />
                    <input 
                        v-model="clientName"
                        type="text" 
                        placeholder="Juan Pérez"
                        class="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 transition-all font-outfit"
                    >
                </div>
            </div>
            
            <button 
                @click="confirmBooking"
                :disabled="!clientName || submitting"
                class="w-full bg-primary text-black font-bold py-5 rounded-2xl flex items-center justify-center text-xl hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all shadow-lg"
            >
                <template v-if="submitting">
                    <div class="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                </template>
                <template v-else>
                    CONFIRMAR CITA
                </template>
            </button>
        </div>
      </section>
    </main>
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

const route = useRoute()
const router = useRouter()

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
    loadingSlots.value = true
    try {
        const { data, error } = await supabase
            .from('appointments')
            .select('time')
            .eq('date', date)
            .neq('status', 'Cancelado')
        
        if (error) throw error
        bookedSlots.value = data.map(i => i.time)
    } catch (err) {
        console.error(err)
    } finally {
        loadingSlots.value = false
    }
}

const isBooked = (time) => bookedSlots.value.includes(time)

const confirmBooking = async () => {
    if (!clientName.value) return
    
    submitting.value = true
    try {
        const { error } = await supabase
            .from('appointments')
            .insert([{
                client_name: clientName.value,
                date: selectedDate.value,
                time: selectedTime.value,
                service: selectedService.value,
                status: 'Pendiente'
            }])
        
        if (error) throw error
        
        alert("¡Cita Agendada con éxito!")
        router.push('/dashboard')
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
