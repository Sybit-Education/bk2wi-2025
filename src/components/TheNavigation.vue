<script setup lang="ts">
import { ref } from 'vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <nav class="bg-white shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo und Hamburger-Menü -->
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <!-- Platzhalter für Logo -->
            <div class="h-8 w-8 bg-gray-300 rounded-md flex items-center justify-center text-gray-500">
              Logo
            </div>
          </div>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex md:items-center md:space-x-4">
          <RouterLink to="/" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
            Home
          </RouterLink>
          <RouterLink to="/about" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
            About
          </RouterLink>
        </div>

        <!-- Hamburger-Menü Button (nur auf mobilen Geräten) -->
        <div class="flex items-center md:hidden">
          <button 
            @click="toggleMenu" 
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            aria-expanded="false"
          >
            <span class="sr-only">Menü öffnen</span>
            <!-- Icon wenn Menü geschlossen -->
            <svg 
              v-if="!isMenuOpen" 
              class="block h-6 w-6" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <!-- Icon wenn Menü geöffnet -->
            <svg 
              v-else 
              class="block h-6 w-6" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation (Dropdown) -->
    <div 
      v-if="isMenuOpen" 
      class="md:hidden"
    >
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <RouterLink 
          to="/" 
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
          @click="isMenuOpen = false"
        >
          Home
        </RouterLink>
        <RouterLink 
          to="/about" 
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
          @click="isMenuOpen = false"
        >
          About
        </RouterLink>
      </div>
    </div>
  </nav>
</template>
