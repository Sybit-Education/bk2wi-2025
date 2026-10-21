<script setup lang="ts">
import { useTreeList } from '@/composables/useTreeList'
import TreeInfoListItem from './TreeInfoListItem.vue'

const { trees, loading, error, currentPage, totalPages, goToPage } = useTreeList()
</script>

<template>
  <div class="tree-info-list">
    <!-- Ergebnisanzeige -->
    <div v-if="loading" class="flex justify-center my-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>

    <div v-else-if="error" class="p-4 bg-red-50 text-red-700 rounded-lg">
      {{ error }}
    </div>

    <div v-else-if="trees.length === 0" class="p-8 text-center text-gray-500">
      <p class="text-lg">Keine Bäume gefunden.</p>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TreeInfoListItem v-for="tree in trees" :key="tree.id" :tree="tree" />
      </div>

      <!-- Paginierung -->
      <div v-if="totalPages > 1" class="flex justify-center mt-8">
        <nav class="flex items-center space-x-1">
          <button
            class="px-3 py-1 rounded-md border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            &laquo; Zurück
          </button>

          <button
            v-for="page in totalPages"
            :key="page"
            class="px-3 py-1 rounded-md border hover:bg-gray-100"
            :class="{ 'bg-green-500 text-white hover:bg-green-600': page === currentPage }"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>

          <button
            class="px-3 py-1 rounded-md border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          >
            Weiter &raquo;
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>
