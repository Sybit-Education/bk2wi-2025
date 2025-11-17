<script setup lang="ts">
import FooterBar from './components/common/FooterBar.vue'
import TopNavigation from './components/common/TopNavigation.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const hideLayout = computed(() => route.meta.hideLayout === true)

</script>

<template>
  <header v-if="!hideLayout">
    <TopNavigation class="fixed top-0 left-0 z-500 flex w-full" />
  </header>
  <main class="container mx-auto px-4 py-8 mt-16">
    <RouterView />
  </main>
  <footer v-if="!hideLayout" class="bg-gray-100 py-4 mt-8">
    <FooterBar class="container mx-auto" />
  </footer>
</template>
