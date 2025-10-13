<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <header class="leading-normal max-h-screen">
    <img alt="Vue logo" class="block mx-auto mb-8 md:mx-0 md:mr-8" src="@/assets/logo.svg" width="125" height="125" />

    <div class="md:flex md:items-start md:flex-wrap">
      <HelloWorld msg="You did it!" />

      <nav class="w-full text-xs text-center mt-8 md:text-left md:-ml-4 md:text-base md:py-4 md:mt-4">
        <RouterLink to="/" class="inline-block px-4 border-l border-[var(--color-border)] first:border-0">Home</RouterLink>
        <RouterLink to="/about" class="inline-block px-4 border-l border-[var(--color-border)] router-link-exact-active:text-[var(--color-text)] router-link-exact-active:hover:bg-transparent">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>
