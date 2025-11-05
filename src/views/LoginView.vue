<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import PasswordInput from '../components/common/PasswordInput.vue'
import { useAuthStore } from '@/stores/authStore'
import { RateLimiter } from '@/utils/rateLimiter'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const rememberMe = ref(false)
const loading = ref(false)

const route = useRoute()
const loginAttempts = ref(0)
const isRateLimited = ref(false)
const rateLimitTimeRemaining = ref(0)

// Timer für Rate Limit Countdown
let rateLimitTimer: number | null = null

onMounted(() => {
  // Redirect-Parameter aus der URL holen (für geschützte Routen)
  const redirect = route.query.redirect as string
  if (redirect) {
    errorMessage.value = 'Bitte melden Sie sich an, um auf diese Seite zuzugreifen.'
  }
})

const handleLogin = async (event: Event) => {
  try {
    event.preventDefault()
    
    // Rate Limiting prüfen
    const key = email.value.toLowerCase()
    if (!RateLimiter.isAllowed(key)) {
      isRateLimited.value = true
      rateLimitTimeRemaining.value = Math.ceil(RateLimiter.getTimeRemaining(key) / 1000 / 60)
      errorMessage.value = `Zu viele Anmeldeversuche. Bitte versuchen Sie es in ${rateLimitTimeRemaining.value} Minuten erneut.`
      return
    }
    
    loading.value = true
    errorMessage.value = ''
    loginAttempts.value++

    const success = await authStore.login(email.value, password.value)

    if (success) {
      // Erfolgreiche Anmeldung - Rate Limiter zurücksetzen
      RateLimiter.reset(key)
      
      if (rememberMe.value) {
        localStorage.setItem('rememberMe', 'true')
      }
      
      // Zu geschützter Route weiterleiten, falls vorhanden
      const redirect = route.query.redirect as string
      router.push(redirect || { name: 'home' })
    } else {
      // Ungültige Anmeldeinformationen
      errorMessage.value =
        authStore.error || 'Ungültige Anmeldedaten, bitte versuchen Sie es erneut!'
        
      // Bei zu vielen fehlgeschlagenen Versuchen Rate Limit anzeigen
      if (loginAttempts.value >= 3) {
        const timeRemaining = RateLimiter.getTimeRemaining(key)
        if (timeRemaining > 0) {
          isRateLimited.value = true
          rateLimitTimeRemaining.value = Math.ceil(timeRemaining / 1000 / 60)
          errorMessage.value = `Zu viele Anmeldeversuche. Bitte versuchen Sie es in ${rateLimitTimeRemaining.value} Minuten erneut.`
          
          // Timer für Countdown starten
          if (rateLimitTimer) clearInterval(rateLimitTimer)
          rateLimitTimer = setInterval(() => {
            rateLimitTimeRemaining.value = Math.ceil(RateLimiter.getTimeRemaining(key) / 1000 / 60)
            if (rateLimitTimeRemaining.value <= 0) {
              isRateLimited.value = false
              clearInterval(rateLimitTimer as number)
            }
          }, 60000) as unknown as number
        }
      }
    }
  } catch (error) {
    console.error('Fehler bei der Anmeldung:', error)
    errorMessage.value = 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    class="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 mx-auto mt-8"
  >
    <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
      <h1
        class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
      >
        Melden Sie sich an
      </h1>
      <form @submit="handleLogin" class="space-y-4 md:space-y-6">
        <div>
          <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Ihre E-Mail</label
          >
          <input
            type="email"
            name="email"
            id="email"
            v-model="email"
            class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required="true"
          />
        </div>
        <div>
          <PasswordInput
            v-model="password"
            id="password"
            name="password"
            label="Passwort"
            :required="true"
            autocomplete="current-password"
          />
        </div>
        <div>
          <p v-if="errorMessage" class="text-sm text-red-600 mx-auto max-w-fit">
            {{ errorMessage }}
          </p>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="remember"
                aria-describedby="remember"
                type="checkbox"
                v-model="rememberMe"
                class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="remember" class="text-gray-500 dark:text-gray-300"
                >Angemeldet bleiben</label
              >
            </div>
          </div>
          <a
            href="#"
            class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
            >Passwort vergessen?</a
          >
        </div>
        <button
          type="submit"
          :disabled="isRateLimited || loading"
          class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <span v-if="loading">Wird angemeldet...</span>
          <span v-else-if="isRateLimited">Gesperrt ({{ rateLimitTimeRemaining }} min)</span>
          <span v-else>Anmelden</span>
        </button>
        <p class="text-sm font-light text-gray-500 dark:text-gray-400">
          Haben Sie kein Konto?
          <router-link
            to="/signup"
            class="font-medium text-primary-600 hover:underline dark:text-primary-500"
            >Konto erstellen</router-link
          >
        </p>
      </form>
    </div>
  </div>
</template>
