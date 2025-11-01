<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { UserInfoService } from '../services/userInfoService'

const userInfoService = new UserInfoService()

const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const rememberMe = ref(false)
const loading = ref(false)

const handleLogin = async (event: Event) => {
  try {
    event.preventDefault()
    console.log('Login button clicked') // Debug-Ausgabe
    loading.value = true
    errorMessage.value = ''

    const user = await userInfoService.loginUser(email.value, password.value)
    loading.value = false

    if (user) {
      // Erfolgreiche Anmeldung
      localStorage.setItem('loggedIn', 'true')
      localStorage.setItem('user', JSON.stringify(user))
      if (rememberMe.value) {
        localStorage.setItem('rememberMe', 'true')
      }
      router.push({ name: 'home' })
    } else {
      // Ungültige Anmeldeinformationen
      errorMessage.value = 'Ungültige Anmeldedaten, bitte versuchen Sie es erneut!'
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
    <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 mx-auto mt-8">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Melden Sie sich an
            </h1>
            <form @submit="handleLogin" class="space-y-4 md:space-y-6">
                <div>
                    <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ihre E-Mail</label>
                    <input type="email" name="email" id="email" v-model="email" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="true">
                </div>
                <div>
                    <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Passwort</label>
                    <input type="password" name="password" id="password" v-model="password" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="true">
                </div>
                <div>
                    <p v-if="errorMessage" class="text-sm text-red-600 mx-auto max-w-fit">{{ errorMessage }}</p>
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex items-start">
                        <div class="flex items-center h-5">
                          <input id="remember" aria-describedby="remember" type="checkbox" v-model="rememberMe" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800">
                        </div>
                        <div class="ml-3 text-sm">
                          <label for="remember" class="text-gray-500 dark:text-gray-300">Angemeldet bleiben</label>
                        </div>
                    </div>
                    <a href="#" class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Passwort vergessen?</a>
                </div>
                <button type="submit" class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Anmelden</button>
                <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                    Haben Sie kein Konto? <a href="#" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Konto erstellen</a>
                </p>
            </form>
        </div>
    </div>
</template>
