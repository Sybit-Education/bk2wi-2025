<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const profileForm = reactive({
  username: '',
  email: '',
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})
const showPassword = reactive({
  current: false,
  new: false,
  confirm: false,
})

const loadingProfile = ref(false)
const loadingPassword = ref(false)
const profileMessage = ref('')
const profileError = ref('')
const passwordMessage = ref('')
const passwordError = ref('')

const userInitial = computed(() =>
  authStore.username ? authStore.username.charAt(0).toUpperCase() : '?',
)

async function loadUser() {
  const user = (await authStore.refreshUser()) ?? authStore.user
  if (user) {
    profileForm.username = user.username
    profileForm.email = user.email
  }
}

async function saveProfile() {
  profileMessage.value = ''
  profileError.value = ''
  if (!profileForm.username || !profileForm.email) {
    profileError.value = 'Bitte Benutzername und E-Mail ausfüllen.'
    return
  }

  loadingProfile.value = true
  try {
    const updatedUser = await authStore.updateProfile({
      username: profileForm.username.trim(),
      email: profileForm.email.trim(),
    })

    if (updatedUser) {
      profileMessage.value = 'Profil erfolgreich aktualisiert.'
    } else {
      profileError.value = 'Profil konnte nicht gespeichert werden.'
    }
  } catch (error) {
    console.error(error)
    profileError.value = 'Beim Speichern ist ein Fehler aufgetreten.'
  } finally {
    loadingProfile.value = false
  }
}

async function savePassword() {
  passwordMessage.value = ''
  passwordError.value = ''

  if (!passwordForm.currentPassword || !passwordForm.newPassword) {
    passwordError.value = 'Bitte aktuelles und neues Passwort angeben.'
    return
  }

  if (passwordForm.newPassword.length < 8) {
    passwordError.value = 'Das neue Passwort muss mindestens 8 Zeichen lang sein.'
    return
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = 'Das neue Passwort und die Bestätigung stimmen nicht überein.'
    return
  }

  loadingPassword.value = true
  try {
    const success = await authStore.changePassword(
      passwordForm.currentPassword,
      passwordForm.newPassword,
    )

    if (success) {
      passwordMessage.value = 'Passwort erfolgreich geändert.'
      passwordForm.currentPassword = ''
      passwordForm.newPassword = ''
      passwordForm.confirmPassword = ''
    } else {
      passwordError.value = 'Passwort konnte nicht geändert werden. Bitte Eingaben prüfen.'
    }
  } catch (error) {
    console.error(error)
    passwordError.value = 'Beim Ändern des Passworts ist ein Fehler aufgetreten.'
  } finally {
    loadingPassword.value = false
  }
}

onMounted(() => {
  void loadUser()
})
</script>

<template>
  <section class="px-4 py-8 sm:px-6 lg:px-8 space-y-8">
    <header class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-3">
        <div
          class="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-lg font-semibold text-white"
        >
          {{ userInitial }}
        </div>
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-300">Dein Profil</p>
          <h1 class="text-3xl font-semibold text-gray-900 dark:text-white">
            {{ authStore.username || 'Profil' }}
          </h1>
          <p class="text-gray-600 dark:text-gray-300">
            Verwalte deine Zugangsdaten und passe dein Konto an.
          </p>
        </div>
      </div>
      <div class="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/40 dark:text-green-100">
        Gesichert mit CSRF-Token & JWT
      </div>
    </header>

    <div class="grid gap-6 lg:grid-cols-2">
      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div class="mb-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Profilangaben</h2>
          <p class="text-sm text-gray-500 dark:text-gray-300">
            Benutzername und E-Mail, die wir für dein Konto verwenden.
          </p>
        </div>

        <form class="space-y-4" @submit.prevent="saveProfile">
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
              >Benutzername</label
            >
            <input
              v-model="profileForm.username"
              type="text"
              class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              placeholder="Dein Anzeigename"
              autocomplete="username"
            />
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
              >E-Mail</label
            >
            <input
              v-model="profileForm.email"
              type="email"
              class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              placeholder="du@example.com"
              autocomplete="email"
            />
          </div>

          <div class="flex items-center gap-2">
            <button
              type="submit"
              class="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
              :disabled="loadingProfile"
            >
              <svg
                v-if="loadingProfile"
                class="mr-2 h-4 w-4 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Änderungen speichern
            </button>
            <p v-if="profileMessage" class="text-sm text-green-700 dark:text-green-300">
              {{ profileMessage }}
            </p>
            <p v-if="profileError" class="text-sm text-red-600 dark:text-red-400">
              {{ profileError }}
            </p>
          </div>
        </form>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div class="mb-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Passwort ändern</h2>
          <p class="text-sm text-gray-500 dark:text-gray-300">
            Stelle sicher, dass dein Passwort mindestens 8 Zeichen hat.
          </p>
        </div>

        <form class="space-y-4" @submit.prevent="savePassword">
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
              >Aktuelles Passwort</label
            >
            <div class="relative">
              <input
                v-model="passwordForm.currentPassword"
                :type="showPassword.current ? 'text' : 'password'"
                class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 pr-12 text-gray-900 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                autocomplete="current-password"
              />
              <button
                type="button"
                @click="showPassword.current = !showPassword.current"
                class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                :aria-label="showPassword.current ? 'Passwort verbergen' : 'Passwort anzeigen'"
              >
                <svg
                  v-if="!showPassword.current"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7Z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 0 0 1.458 12C2.732 16.057 6.523 19 11 19c1.53 0 2.978-.306 4.287-.86m3.733-2.513A10.45 10.45 0 0 0 20.543 12 10.45 10.45 0 0 0 18.7 8.387M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.879"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m3 3 18 18"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
                >Neues Passwort</label
              >
              <div class="relative">
                <input
                  v-model="passwordForm.newPassword"
                  :type="showPassword.new ? 'text' : 'password'"
                  class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 pr-12 text-gray-900 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  autocomplete="new-password"
                />
                <button
                  type="button"
                  @click="showPassword.new = !showPassword.new"
                  class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                  :aria-label="showPassword.new ? 'Passwort verbergen' : 'Passwort anzeigen'"
                >
                  <svg
                    v-if="!showPassword.new"
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="1.8"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7Z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="1.8"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.458 12C2.732 16.057 6.523 19 11 19c1.53 0 2.978-.306 4.287-.86m3.733-2.513A10.45 10.45 0 0 0 20.543 12 10.45 10.45 0 0 0 18.7 8.387M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.879"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m3 3 18 18"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
                >Neues Passwort bestätigen</label
              >
              <div class="relative">
                <input
                  v-model="passwordForm.confirmPassword"
                  :type="showPassword.confirm ? 'text' : 'password'"
                  class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 pr-12 text-gray-900 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  autocomplete="new-password"
                />
                <button
                  type="button"
                  @click="showPassword.confirm = !showPassword.confirm"
                  class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                  :aria-label="showPassword.confirm ? 'Passwort verbergen' : 'Passwort anzeigen'"
                >
                  <svg
                    v-if="!showPassword.confirm"
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="1.8"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7Z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="1.8"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.458 12C2.732 16.057 6.523 19 11 19c1.53 0 2.978-.306 4.287-.86m3.733-2.513A10.45 10.45 0 0 0 20.543 12 10.45 10.45 0 0 0 18.7 8.387M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.879"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m3 3 18 18"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="submit"
              class="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
              :disabled="loadingPassword"
            >
              <svg
                v-if="loadingPassword"
                class="mr-2 h-4 w-4 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Passwort aktualisieren
            </button>
            <p v-if="passwordMessage" class="text-sm text-green-700 dark:text-green-300">
              {{ passwordMessage }}
            </p>
            <p v-if="passwordError" class="text-sm text-red-600 dark:text-red-400">
              {{ passwordError }}
            </p>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
