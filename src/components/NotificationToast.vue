<template>
  <div class="fixed top-6 right-6 z-[1000] flex flex-col gap-4 pointer-events-none w-full max-w-[320px]">
    <transition-group 
      enter-active-class="transition duration-500 ease-out"
      enter-from-class="translate-x-full opacity-0 scale-90"
      enter-to-class="translate-x-0 opacity-100 scale-100"
      leave-active-class="transition duration-300 ease-in"
      leave-to-class="opacity-0 scale-95"
    >
      <div 
        v-for="n in notificationStore.notifications" 
        :key="n.id"
        class="pointer-events-auto"
      >
        <div class="glass-panel border-primary/20 p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative group">
          <!-- Type Accent -->
          <div :class="[
            'absolute left-0 top-0 bottom-0 w-1',
            typeColor(n.type)
          ]"></div>
          
          <!-- Glossy effect -->
          <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

          <div class="flex items-start gap-4 ring-offset-background">
            <div :class="['p-2 rounded-xl bg-primary/5', typeTextColor(n.type)]">
               <component :is="typeIcon(n.type)" :size="20" />
            </div>
            
            <div class="flex-1 min-w-0">
               <h4 class="text-white font-outfit font-black text-xs uppercase tracking-[0.2em] mb-1 line-clamp-1">
                 {{ n.title }}
               </h4>
               <p class="text-gray-400 text-[10px] leading-relaxed font-medium">
                 {{ n.message }}
               </p>
            </div>

            <button @click="notificationStore.remove(n.id)" class="text-gray-600 hover:text-primary transition-colors">
               <LucideX :size="16" />
            </button>
          </div>

          <!-- Progress bar -->
          <div 
            v-if="n.duration > 0"
            class="absolute bottom-0 left-0 h-[2px] bg-primary/40 animate-progress"
            :style="{ animationDuration: `${n.duration}ms` }"
          ></div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useNotificationStore } from '../stores/notificationStore'
import { 
  LucideInfo, LucideCheckCircle, LucideAlertTriangle, 
  LucideXCircle, LucideX, LucideBell 
} from 'lucide-vue-next'

const notificationStore = useNotificationStore()

const typeColor = (type) => {
  switch(type) {
    case 'success': return 'bg-green-500'
    case 'warning': return 'bg-yellow-500'
    case 'error': return 'bg-red-500'
    default: return 'bg-primary'
  }
}

const typeTextColor = (type) => {
  switch(type) {
    case 'success': return 'text-green-500'
    case 'warning': return 'text-yellow-500'
    case 'error': return 'text-red-500'
    default: return 'text-primary'
  }
}

const typeIcon = (type) => {
  switch(type) {
    case 'success': return LucideCheckCircle
    case 'warning': return LucideAlertTriangle
    case 'error': return LucideXCircle
    default: return LucideBell
  }
}
</script>

<style scoped>
@keyframes progress {
  from { width: 100%; }
  to { width: 0%; }
}

.animate-progress {
  animation-name: progress;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

.glass-panel {
    background: rgba(10, 10, 10, 0.8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(218, 165, 32, 0.1);
}
</style>
