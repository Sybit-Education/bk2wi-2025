<script setup lang="ts">
import { ref } from 'vue'

const isMenuOpen = ref(false)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <nav class="bg-white border-gray-200 dark:bg-gray-900">
    <div class="container mx-auto">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between p-4">
        <a href="/" class="flex items-center space-x-3 mr-4">
          <img src="https://flowbite.com/docs/images/logo.svg" class="h-8" alt="Flowbite Logo" />
          <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
            >Flowbite</span
          >
        </a>
        <div class="flex items-center ml-auto md:order-2">
          <button
            @click="toggleMenu"
            type="button"
            class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            :aria-expanded="isMenuOpen"
          >
            <span class="sr-only">Open main menu</span>
            <svg
              class="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          :class="{ hidden: !isMenuOpen }"
          class="w-full md:flex md:w-auto md:order-1"
          id="navbar-default"
        >
          <ul
            class="font-medium flex flex-col md:p-0 mt-4 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0"
          >
            <li>
              <a
                href="#"
                class="block py-2 px-3 text-white bg-green-700 rounded-sm md:bg-transparent md:text-green-700 md:p-0 dark:text-white md:dark:text-green-500"
                aria-current="page"
                >Home</a
              >
            </li>
            <li>
              <a
                href="#"
                class="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0 dark:text-white md:dark:hover:text-green-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >About</a
              >
            </li>
            <li>
              <a
                href="#"
                class="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0 dark:text-white md:dark:hover:text-green-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >Services</a
              >
            </li>
            <li>
              <a
                href="#"
                class="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0 dark:text-white md:dark:hover:text-green-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >Pricing</a
              >
            </li>
            <li>
              <a
                href="#"
                class="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0 dark:text-white md:dark:hover:text-green-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >Contact</a
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>
