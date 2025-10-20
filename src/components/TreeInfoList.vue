<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { TreeInfo } from '@/services/treeInfoService'
import { useTreeInfoService } from '@/services/treeInfoService'
import TreeInfoListItem from './TreeInfoListItem.vue'

const treeInfoService = useTreeInfoService()
const trees = ref<TreeInfo[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const totalTrees = ref(0)

// Paginierung
const currentPage = ref(1)
const pageSize = ref(12)
const totalPages = ref(1)

async function loadTrees() {
  loading.value = true
  error.value = null
  
  try {
    // Berechne Offset für Paginierung
    const offset = (currentPage.value - 1) * pageSize.value
    
    // Lade Bäume mit Paginierung
    const response = await treeInfoService.nocoDBService.getRecords<TreeInfo>('treeInfo', {
      limit: pageSize.value,
      offset,
      sort: 'name'
    })
    
    trees.value = response.list
    totalTrees.value = response.pageInfo.totalRows
    totalPages.value = Math.ceil(totalTrees.value / pageSize.value)
  } catch (err) {
    console.error('Fehler beim Laden der Bäume:', err)
    error.value = 'Die Baumdaten konnten nicht geladen werden. Bitte versuchen Sie es später erneut.'
  } finally {
    loading.value = false
  }
}

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    loadTrees()
  }
}

onMounted(() => {
  loadTrees()
})
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
        <TreeInfoListItem 
          v-for="tree in trees" 
          :key="tree.id" 
          :tree="tree" 
        />
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
