<template>
  <div class="min-h-screen bg-secondary text-white font-sans selection:bg-primary/30">
    <!-- Professional Preloader -->
    <AppPreloader />
    
    <router-view v-slot="{ Component }">
      <transition 
        name="page" 
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

.font-outfit {
  font-family: 'Outfit', sans-serif;
}

/* Glassmorphism utility */
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
