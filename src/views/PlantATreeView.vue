<template>
  <div class="mx-auto max-w-2xl p-4">
    <div>
      <label for="message" class="mb-1 block font-medium">Nachricht</label>
      <input
        id="message"
        v-model="message"
        type="text"
        class="w-full rounded border border-gray-300 px-3 py-2"
      />
    </div>

    <div>
      <label for="location" class="mb-1 block font-medium">Location</label>
  <select
    id="location"
    name="location"
    v-model="selectedLocation"
    class="cursor-pointer w-full rounded border border-gray-300 px-3 py-2"
  >
    <option value="" disabled>-- Bitte wählen --</option>
    <option
      v-for="location in locations"
      :key="location.id ?? location.name"
      :value="location"
    >
      {{ location.name }}
    </option>
  </select>

</div>

<div>
      <label for="tree" class="mb-1 block font-medium">Baumart</label>
  <select
    id="tree"
    name="tree"
    v-model="selectedTree"
    class="cursor-pointer w-full rounded border border-gray-300 px-3 py-2"
  >
    <option value="" disabled>-- Bitte wählen --</option>
    <option
      v-for="tree in trees"
      :key="tree.id ?? tree.name"
      :value="tree"
    >
      {{ tree.name }}
    </option>
  </select>

</div>

<div>
      <label for="amount" class="mb-1 block font-medium">Anzahl der Bäume</label>
      <input
        id="amount"
        v-model.number="amount"
        type="number"
        min="1"
        class="w-full rounded border border-gray-300 px-3 py-2"
      />
    </div>

<div class="flex items-center gap-2 pt-2">
      <button
        type="button"
        @click="createTree"
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
import { ref, onMounted } from 'vue'
import { LocationService } from '@/services/locationService'
import type { Location } from '@/models/location'
import type { TreeInfo } from '@/models/treeInfo'
import { TreeInfoService } from '@/services/treeInfoService'
import { TreePlantingService } from '@/services/treePlantingService'
import type { PlantedTree } from '@/models/planted_tree'
import { useAuthStore } from '@/stores/authStore'

const treeInfoService = new TreeInfoService()
const trees = ref<TreeInfo[]>([])
const totalTrees = ref(0)

const locationService = new LocationService()
const locations = ref<Location[]>([])
const loading = ref(true)

const error = ref<string | null>(null)
const totalLocations = ref(0)

// Form state
const message = ref('')
const selectedLocation = ref<Location | null>(null)
const selectedTree = ref<TreeInfo | null>(null)
const amount = ref<number>(1)
const submitting = ref(false)
const success = ref<string | null>(null)

const treePlantingService = new TreePlantingService()
const auth = useAuthStore()

// Paginierung
const currentPage = ref(1)
const pageSize = ref(25)
const totalPages = ref(1)

async function loadLocation() {
  loading.value = true
  error.value = null

  try {
    // Berechne Offset für Paginierung
    const offset = (currentPage.value - 1) * pageSize.value

    // Lade Bäume mit Paginierung über den TreeInfoService
    const response = await locationService.getAllLocations(pageSize.value, offset)
    locations.value = response.list
    totalLocations.value = response.pageInfo.totalRows
    totalPages.value = Math.ceil(totalLocations.value / pageSize.value)
  } catch (err) {
    console.error('Fehler beim Laden der Locations:', err)
    error.value =
      'Die Locationdaten konnten nicht geladen werden. Bitte versuchen Sie es später erneut.'
  } finally {
    loading.value = false
  }
}

async function loadTrees() {
  loading.value = true
  error.value = null

  try {
    // Berechne Offset für Paginierung
    const offset = (currentPage.value - 1) * pageSize.value

    // Lade Bäume mit Paginierung über den TreeInfoService
    const response = await treeInfoService.getAllTrees(pageSize.value, offset)
    trees.value = response.list
    totalTrees.value = response.pageInfo.totalRows
    totalPages.value = Math.ceil(totalTrees.value / pageSize.value)
  } catch (err) {
    console.error('Fehler beim Laden der Bäume:', err)
    error.value =
      'Die Baumdaten konnten nicht geladen werden. Bitte versuchen Sie es später erneut.'
  } finally {
    loading.value = false
  }
}


onMounted(() => {
  loadLocation()
  loadTrees()
})

/**
 * Pflanzt einen Baum (oder mehrere) beim Klick auf Speichern
 */
async function createTree() {
  // Einfache Validierung
  error.value = null
  success.value = null

  if (!selectedLocation.value) {
    error.value = 'Bitte eine Location wählen.'
    return
  }

  if (!selectedTree.value) {
    error.value = 'Bitte eine Baumart wählen.'
    return
  }

  if (!amount.value || amount.value < 1) {
    error.value = 'Bitte eine gültige Anzahl (>= 1) eingeben.'
    return
  }

  submitting.value = true

  try {
    // Baumeintrag für NocoDB zusammenstellen
    const planted: Partial<PlantedTree> = {
      message: message.value || undefined,
      users: auth.user ? [auth.user] : [],
      location: selectedLocation.value as Location,
      amount: amount.value,
      created_at: new Date(),
    }

    const created = await treePlantingService.createTree(planted as unknown as PlantedTree)

    if (created) {
      success.value = 'Baum erfolgreich gespeichert.'
      // Formular zurücksetzen
      message.value = ''
      selectedLocation.value = null
      selectedTree.value = null
      amount.value = 1
      // Option: neu laden der Liste
      await loadTrees()
    } else {
      error.value = 'Beim Speichern ist ein Fehler aufgetreten.'
    }
  } catch (e) {
    console.error('Fehler beim Erstellen des Baums:', e)
    error.value = 'Beim Speichern ist ein Fehler aufgetreten.'
  } finally {
    submitting.value = false
  }
}

</script>
