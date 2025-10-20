<script setup lang="ts">
import FooterBar from './components/FooterBar.vue'
import TopNavigation from './components/TopNavigation.vue'
</script>

<template>
  <header>
    <TopNavigation class="fixed top-0 left-0 z-500 flex w-full" />
  </header>
  <main class="container mx-auto px-4 py-8 mt-16">
    <RouterView />
  </main>
  <footer class="bg-gray-100 py-4 mt-8">
    <FooterBar class="container mx-auto" />
  </footer>
</template>
