<script setup lang="ts">
import TopNavigation from './components/TopNavigation.vue'
</script>

<template>
  <header>
    <TopNavigation class="fixed top-0 left-0 z-500 flex w-full" />
  </header>
  <main class="container mx-auto px-4 py-8 mt-10">
    <RouterView />
  </main>
</template>
