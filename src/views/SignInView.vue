<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import PasswordInput from '@/components/common/PasswordInput.vue'
import { UserInfoService } from '@/services/userInfoService'

const router = useRouter()
const userService = new UserInfoService()

const formData = reactive({
  email: '',
  password: '',
})

const error = ref('')
const isLoading = ref(false)

async function handleSignIn() {
  error.value = ''
  isLoading.value = true

  try {
    // Validierung
    if (!formData.email || !formData.password) {
      error.value = 'Bitte füllen Sie alle Felder aus.'
      return
    }

    // Anmeldung versuchen
    const user = await userService.loginUser(formData.email, formData.password)
    
    if (user) {
      // Erfolgreiche Anmeldung
      // Hier könnte man den Benutzer in einem Store speichern
      // oder einen Token im localStorage setzen
      
      // Weiterleitung zur Startseite
      router.push('/')
    } else {
      error.value = 'Ungültige E-Mail oder Passwort.'
    }
  } catch (e) {
    console.error('Anmeldefehler:', e)
    error.value = 'Bei der Anmeldung ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Anmelden
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="handleSignIn">
        <div v-if="error" class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
          {{ error }}
        </div>
        
        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900">E-Mail</label>
          <div class="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              v-model="formData.email"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2"
            />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Passwort</label>
            <div class="text-sm">
              <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Passwort vergessen?</a>
            </div>
          </div>
          <div class="mt-2">
            <PasswordInput
              id="password"
              v-model="formData.password"
              required
              class="block w-full"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-300"
          >
            <span v-if="isLoading">Wird angemeldet...</span>
            <span v-else>Anmelden</span>
          </button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm text-gray-500">
        Noch kein Konto?
        <router-link to="/signup" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
          Jetzt registrieren
        </router-link>
      </p>
    </div>
  </div>
</template>
