<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import { FwbButton } from 'flowbite-vue'

const authStore = useAuthStore()
const router = useRouter()
const isMenuOpen = ref(false)
const isProfileMenuOpen = ref(false)
const profileMenuRef = ref<HTMLElement | null>(null)

const userInitial = computed(() =>
  authStore.username ? authStore.username.charAt(0).toUpperCase() : '?',
)
const userEmail = computed(() => authStore.user?.email ?? '')
const avatarUrl = computed(() =>
  userEmail.value
    ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userEmail.value)}&backgroundColor=b6e3f4,c0aede,d1d4f9&fontSize=42`
    : '',
)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function toggleProfileMenu() {
  isProfileMenuOpen.value = !isProfileMenuOpen.value
}

function openProfileMenu() {
  isProfileMenuOpen.value = true
}

function closeProfileMenu() {
  isProfileMenuOpen.value = false
}

function handleClickOutside(event: MouseEvent) {
  if (profileMenuRef.value && !profileMenuRef.value.contains(event.target as Node)) {
    closeProfileMenu()
  }
}

function goToDashboard() {
  isProfileMenuOpen.value = false
  router.push({ name: 'dashboard' })
}

function goToProfile() {
  isProfileMenuOpen.value = false
  router.push({ name: 'profile' })
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <nav class="bg-white border-gray-200 dark:bg-gray-900">
    <div class="container mx-auto">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between p-4">
        <a href="/" class="flex items-center space-x-3 mr-5">
          <img src="/img/WurzelPartner-Logo.svg" class="h-15" alt="Flowbite Logo" />
          <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
            >Wurzelpartner</span
          >
        </a>
        <div class="flex items-center ml-auto md:order-2">
          <!-- Theme Toggle -->
          <ThemeToggle class="mr-2" />
          <div class="hidden md:flex md:items-center md:space-x-3 mr-4">
            <template v-if="!authStore.isAuthenticated">
              <fwb-button
                color="green"
                size="md"
                href="/login"
                class="px-5 py-2.5 m-2 h-10 inline-flex items-center justify-center bg-brand-600 hover:bg-brand-700"
                ><span class="text-white">Anmelden</span>
              </fwb-button>
              <fwb-button
                color="alternative"
                size="md"
                class="px-5 py-2.5 m-2 h-10 inline-flex items-center justify-center"
                href="/signup"
                >Registrieren</fwb-button
              >
            </template>
            <template v-else>
              <div class="relative" @mouseenter="openProfileMenu" ref="profileMenuRef">
                <button
                  @click="toggleProfileMenu"
                  class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-brand-600 text-sm font-semibold text-white shadow-md hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                >
                  <img
                    v-if="avatarUrl"
                    :src="avatarUrl"
                    :alt="`Avatar für ${authStore.username}`"
                    class="h-full w-full object-cover"
                  />
                  <span v-else>{{ userInitial }}</span>
                </button>
                <div
                  v-if="isProfileMenuOpen"
                  class="absolute right-0 z-20 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
                >
                  <div class="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
                    <p class="text-xs text-gray-500 dark:text-gray-400">Angemeldet als</p>
                    <p class="truncate text-sm font-semibold text-gray-900 dark:text-white">
                      {{ authStore.username }}
                    </p>
                  </div>
                  <button
                    @click="goToDashboard"
                  class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
                >
                  Dashboard
                </button>
                  <button
                    @click="goToProfile"
                    class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
                  >
                    Profil
                  </button>
                  <button
                    @click="handleLogout"
                    class="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-900/40"
                  >
                    Abmelden
                  </button>
                </div>
              </div>
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
              <router-link
                to="/trees"
                class="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-brand-700 md:p-0 dark:text-white md:dark:hover:text-green-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >Baumarten</router-link
              >
            </li>
            <li>
              <router-link
                to="/map"
                class="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-brand-700 md:p-0 dark:text-white md:dark:hover:text-green-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >Karte</router-link
              >
            </li>
            <li>
              <router-link
                to="/about"
                class="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-brand-700 md:p-0 dark:text-white md:dark:hover:text-green-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >Über uns</router-link
              >
            </li>
            <li>
              <router-link
                to="/contact"
                class="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-brand-700 md:p-0 dark:text-white md:dark:hover:text-green-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >Kontakt</router-link
              >
            </li>
            <template v-if="!authStore.isAuthenticated">
              <li class="md:hidden mt-4">
                <router-link
                  to="/login"
                  class="block w-full text-center py-2 px-3 text-white bg-brand-600 rounded-lg hover:bg-brand-700"
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
                <router-link
                  to="/dashboard"
                  class="block w-full text-center py-2 px-3 text-white bg-brand-600 rounded-lg hover:bg-brand-700"
                >
                  Zum Dashboard
                </router-link>
              </li>
              <li class="md:hidden mt-2">
                <router-link
                  to="/profile"
                  class="block w-full text-center py-2 px-3 text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Profil verwalten
                </router-link>
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
