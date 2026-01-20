<template>
  <div class="mx-auto max-w-2xl p-4">
    <div>
      <label for="address" class="mb-1 block font-medium">Adresse</label>
      <input
        id="address"
        v-model="address"
        type="text"
        class="w-full rounded border border-gray-300 px-3 py-2"
      />
    </div>

    <div>
      <label for="info" class="mb-1 block font-medium">Weitere Angaben bzw. Wünsche</label>
      <textarea
        id="info"
        v-model="info"
        rows="5"
        class="w-full rounded border border-gray-300 px-3 py-2 h-32"
      />
    </div>

    <div class="flex items-center gap-2 pt-2">
      <button
        type="button"
        @click="createLocation"
        class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        Speichern
      </button>
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { LocationService } from '@/services/locationService'
import { useAuthStore } from '@/stores/authStore'


const locationService = new LocationService()

const error = ref<string | null>(null)

// Form state
const submitting = ref(false)
const success = ref<string | null>(null)
const address = ref('')
const info = ref('')
const auth = useAuthStore()

async function createLocation() {
  submitting.value = true
  error.value = null
  success.value = null

  try {
    if (!auth.user) {
      throw new Error('User not authenticated')
    }

    const result = await locationService.createLocation({
      name: address.value,
      info: info.value,
      geoLocation: "47.73980909820898;8.970851784462777", // Placeholder values
    })

    await locationService.linkUserToLocation(result!.id!, auth.user.id!)

    success.value = 'Standort erfolgreich angeboten!'
    address.value = ''
    info.value = ''

    console.log('Created location:', result)

  } catch (e: Error | unknown) {
    const errorMessage = e instanceof Error ? e.message : 'Fehler beim Anbieten des Standorts.'
    error.value = errorMessage
    console.error(e)
  } finally {
    submitting.value = false
  }
}
</script>
