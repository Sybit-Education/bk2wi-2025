<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import { FwbButton } from 'flowbite-vue'

const authStore = useAuthStore()
const router = useRouter()
const isMenuOpen = ref(false)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="bg-white border-gray-200 dark:bg-gray-900">
    <div class="container mx-auto">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between p-4">
        <a href="/" class="flex items-center space-x-3 mr-5">
          <img src="../../assets/ai-generated-tree.png" class="h-15" alt="Flowbite Logo" />
          <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
            >Wurzelpartner</span
          >
        </a>
        <div class="flex items-center ml-auto md:order-2">
          <!-- Theme Toggle -->
          <ThemeToggle class="mr-2" />
          <div class="hidden md:flex md:space-x-2 mr-4">
            <template v-if="!authStore.isAuthenticated">
              <fwb-button
                color="green"
                size="md"
                href="/login"
                class="px-5 py-2.5 m-2 h-10 inline-flex items-center justify-center"
                >Anmelden</fwb-button
              >
              <fwb-button
                color="alternative"
                size="md"
                class="px-5 py-2.5 m-2 h-10 inline-flex items-center justify-center"
                href="/signup"
                >Registrieren</fwb-button
              >
            </template>
            <template v-else>
              <span class="text-gray-900 dark:text-white mr-2"
                >Hallo, {{ authStore.username }}</span
              >
              <button
                @click="handleLogout"
                class="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
              >
                Abmelden
              </button>
            </template>
          </div>
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
            class="font-medium flex flex-col md:p-0 mt-4 ml-8 md:flex-row md:space-x-5 rtl:space-x-reverse md:mt-1"
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
              <router-link
                to="/trees"
                class="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0 dark:text-white md:dark:hover:text-green-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >Baumarten</router-link
              >
            </li>
            <li>
              <router-link
                to="/map"
                class="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0 dark:text-white md:dark:hover:text-green-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >Karte</router-link
              >
            </li>
            <li>
              <router-link
                to="/about"
                class="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0 dark:text-white md:dark:hover:text-green-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >Über uns</router-link
              >
            </li>
            <li>
              <router-link
                to="/contact"
                class="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0 dark:text-white md:dark:hover:text-green-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >Kontakt</router-link
              >
            </li>
            <template v-if="!authStore.isAuthenticated">
              <li class="md:hidden mt-4">
                <router-link
                  to="/login"
                  class="block w-full text-center py-2 px-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >Anmelden</router-link
                >
              </li>
              <li class="md:hidden mt-2">
                <router-link
                  to="/signup"
                  class="block w-full text-center py-2 px-3 text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
                  >Registrieren</router-link
                >
              </li>
            </template>
            <template v-else>
              <li class="md:hidden mt-4">
                <span class="block w-full text-center py-2 px-3 text-gray-900 dark:text-white">
                  Hallo, {{ authStore.username }}
                </span>
              </li>
              <li class="md:hidden mt-2">
                <button
                  @click="handleLogout"
                  class="block w-full text-center py-2 px-3 text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Abmelden
                </button>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>
