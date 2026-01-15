<script setup lang="ts">
import FooterBar from './components/common/FooterBar.vue'
import TopNavigation from './components/common/TopNavigation.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const hideLayout = computed(() => route.meta.hideLayout === true)
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
    <header v-if="!hideLayout">
      <TopNavigation class="top-0 left-0 z-500 flex w-full" />
    </header>
    <main class="container mx-auto px-4">
      <RouterView />
    </main>
    <footer v-if="!hideLayout" class="bg-gray-100 dark:bg-gray-800 py-4 mt-8">
      <FooterBar class="container mx-auto" />
    </footer>
  </div>
</template>
