<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import PasswordInput from '@/components/common/PasswordInput.vue'
import { UserInfoService } from '@/services/userInfoService'
import type { UserInfo } from '@/models/userInfo'

const router = useRouter()
const userService = new UserInfoService()

const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const error = ref('')
const isLoading = ref(false)

async function handleSignUp() {
  error.value = ''
  isLoading.value = true

  try {
    // Validierung
    if (!formData.username || !formData.email || !formData.password) {
      error.value = 'Bitte füllen Sie alle Felder aus.'
      return
    }

    if (formData.password !== formData.confirmPassword) {
      error.value = 'Die Passwörter stimmen nicht überein.'
      return
    }

    // Minimale Passwortanforderungen prüfen
    if (formData.password.length < 8) {
      error.value = 'Das Passwort muss mindestens 8 Zeichen lang sein.'
      return
    }

    // Benutzer erstellen
    const newUser: UserInfo = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    }

    const createdUser = await userService.createUser(newUser)
    
    if (createdUser) {
      // Erfolgreiche Registrierung
      // Weiterleitung zur Anmeldeseite oder direkt einloggen
      router.push('/signin')
    } else {
      error.value = 'Bei der Registrierung ist ein Fehler aufgetreten.'
    }
  } catch (e) {
    console.error('Registrierungsfehler:', e)
    error.value = 'Bei der Registrierung ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Neues Konto erstellen
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="handleSignUp">
        <div v-if="error" class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
          {{ error }}
        </div>
        
        <div>
          <label for="username" class="block text-sm font-medium leading-6 text-gray-900">Benutzername</label>
          <div class="mt-2">
            <input
              id="username"
              name="username"
              type="text"
              autocomplete="username"
              required
              v-model="formData.username"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2"
            />
          </div>
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
          <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Passwort</label>
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
          <label for="confirmPassword" class="block text-sm font-medium leading-6 text-gray-900">Passwort bestätigen</label>
          <div class="mt-2">
            <PasswordInput
              id="confirmPassword"
              v-model="formData.confirmPassword"
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
            <span v-if="isLoading">Wird registriert...</span>
            <span v-else>Registrieren</span>
          </button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm text-gray-500">
        Bereits registriert?
        <router-link to="/signin" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
          Jetzt anmelden
        </router-link>
      </p>
    </div>
  </div>
</template>
