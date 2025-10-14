<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import TheNavigation from './components/TheNavigation.vue'
</script>

<template>
  <TheNavigation />
  
  <div class="container mx-auto px-4 py-8">
    <header class="leading-normal max-h-screen mt-4">
      <img alt="Vue logo" class="block mx-auto mb-8 md:mx-0 md:mr-8" src="@/assets/logo.svg" width="125" height="125" />

      <div class="md:flex md:items-start md:flex-wrap">
        <HelloWorld msg="You did it!" />
      </div>
    </header>

    <main class="mt-8">
      <RouterView />
    </main>
  </div>
</template>
