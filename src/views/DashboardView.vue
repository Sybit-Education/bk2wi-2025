<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'

type TreeDonation = {
  id: string
  species: string
  count: number
  plantedAt: string
  location: string
}

type PlantingLocation = {
  id: string
  name: string
  city: string
  capacity: number
  treesPlaced: number
  status: 'geplant' | 'in Arbeit' | 'abgeschlossen'
}

const authStore = useAuthStore()

// Demo-Daten, bis die NocoDB-Anbindung steht
const donatedTrees = ref<TreeDonation[]>([
  {
    id: '1',
    species: 'Roteiche',
    count: 12,
    plantedAt: '2024-11-12',
    location: 'Bodenseekreis',
  },
  {
    id: '2',
    species: 'Ahorn',
    count: 5,
    plantedAt: '2024-09-03',
    location: 'Hegau',
  },
])

const plantingLocations = ref<PlantingLocation[]>([
  {
    id: 'A1',
    name: 'Schulgelände West',
    city: 'Radolfzell',
    capacity: 25,
    treesPlaced: 10,
    status: 'in Arbeit',
  },
  {
    id: 'A2',
    name: 'Streuobstwiese Ried',
    city: 'Singen',
    capacity: 40,
    treesPlaced: 28,
    status: 'geplant',
  },
])

const totalTreesDonated = computed(() =>
  donatedTrees.value.reduce((sum, donation) => sum + donation.count, 0),
)

const totalCapacity = computed(() =>
  plantingLocations.value.reduce((sum, spot) => sum + spot.capacity, 0),
)

const totalReserved = computed(() =>
  plantingLocations.value.reduce((sum, spot) => sum + spot.treesPlaced, 0),
)
</script>

<template>
  <section class="px-4 py-8 sm:px-6 lg:px-8 space-y-8">
    <header class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-500 dark:text-gray-300">
          Willkommen zurück, {{ authStore.username || 'Freund:in des Waldes' }}
        </p>
        <h1 class="text-3xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
        <p class="text-gray-600 dark:text-gray-300">
          Überblick über deine Baumpatenschaften und bereitgestellten Pflanzorte.
        </p>
      </div>
      <span
        class="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-900 dark:bg-amber-900/30 dark:text-amber-100"
      >
        Demo-Daten aktiv - Anbindung an NocoDB folgt
      </span>
    </header>

    <div class="grid gap-4 md:grid-cols-3">
      <div
        class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <p class="text-sm text-gray-500 dark:text-gray-400">Gespendete Bäume</p>
        <p class="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
          {{ totalTreesDonated }}
        </p>
      </div>
      <div
        class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <p class="text-sm text-gray-500 dark:text-gray-400">Pflanzplätze gesamt</p>
        <p class="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
          {{ totalCapacity }}
        </p>
      </div>
      <div
        class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <p class="text-sm text-gray-500 dark:text-gray-400">Davon reserviert</p>
        <p class="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
          {{ totalReserved }}
        </p>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <div class="mb-4 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Gespendete Bäume</h2>
            <p class="text-sm text-gray-500 dark:text-gray-300">
              Übersicht deiner Baumspenden und Pflanzorte.
            </p>
          </div>
          <span
            class="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/40 dark:text-green-100"
          >
            {{ donatedTrees.length }} Einträge
          </span>
        </div>

        <div class="space-y-3">
          <div
            v-for="donation in donatedTrees"
            :key="donation.id"
            class="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900/40"
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-300">Baumart</p>
                <p class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ donation.species }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  Standort: {{ donation.location }} · Gepflanzt am {{ donation.plantedAt }}
                </p>
              </div>
              <span
                class="rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-800 dark:bg-brand-900/40 dark:text-brand-100"
              >
                {{ donation.count }} Bäume
              </span>
            </div>
          </div>

          <p v-if="!donatedTrees.length" class="text-sm text-gray-500 dark:text-gray-300">
            Noch keine Spenden hinterlegt.
          </p>
        </div>
      </div>

      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <div class="mb-4 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              Bereitgestellte Pflanzorte
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-300">
              Plätze, die du für Pflanzungen zur Verfügung stellst.
            </p>
          </div>
          <span
            class="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900/40 dark:text-blue-100"
          >
            {{ plantingLocations.length }} Orte
          </span>
        </div>

        <div class="space-y-3">
          <div
            v-for="location in plantingLocations"
            :key="location.id"
            class="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900/40"
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-300">Ort</p>
                <p class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ location.name }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  {{ location.city }} · Kapazität: {{ location.capacity }} Bäume
                </p>
                <div class="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <span class="inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                  {{ location.treesPlaced }} bereits eingeplant
                </div>
              </div>
              <span
                class="rounded-full px-3 py-1 text-sm font-semibold"
                :class="{
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-100':
                    location.status === 'geplant',
                  'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-100':
                    location.status === 'in Arbeit',
                  'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-100':
                    location.status === 'abgeschlossen',
                }"
              >
                {{ location.status }}
              </span>
            </div>
          </div>

          <p v-if="!plantingLocations.length" class="text-sm text-gray-500 dark:text-gray-300">
            Noch keine Pflanzorte erfasst.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
