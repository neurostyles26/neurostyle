<template>
  <div class="min-h-screen bg-black text-white font-inter selection:bg-primary/30 overflow-x-hidden">
    <!-- Professional Preloader -->
    <AppPreloader />
    
    <router-view v-slot="{ Component }">
      <transition 
        name="page-fade" 
        mode="out-in"
      >
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import AppPreloader from './components/AppPreloader.vue'
</script>


<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800&display=swap');

/* Global Page Transitions */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(15px) scale(0.98);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-15px) scale(1.02);
}

/* Custom Selection Color */
::selection {
  background: rgba(218, 165, 32, 0.2);
  color: #fff;
}
</style>
