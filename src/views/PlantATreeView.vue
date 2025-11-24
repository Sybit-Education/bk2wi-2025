<template>
  <div class="mx-auto max-w-2xl p-4">
    <div>
      <label for="message" class="mb-1 block font-medium">Nachricht</label>
      <input id="message" type="tel" class="w-full rounded border border-gray-300 px-3 py-2" />
    </div>

    <div>
      <label for="location" class="mb-1 block font-medium">Location</label>
  <select
    id="location"
    name="location"
    class="cursor-pointer w-full rounded border border-gray-300 px-3 py-2"
  >
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
    class="cursor-pointer w-full rounded border border-gray-300 px-3 py-2"
  >
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
      <input id="amount" type="tel" class="w-full rounded border border-gray-300 px-3 py-2" />
    </div>

<div class="flex items-center gap-2 pt-2">
      <button
        type="submit"
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

const treeInfoService = new TreeInfoService()
const trees = ref<TreeInfo[]>([])
const totalTrees = ref(0)

const locationService = new LocationService()
const locations = ref<Location[]>([])
const loading = ref(true)

const error = ref<string | null>(null)
const totalLocations = ref(0)

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

</script>
