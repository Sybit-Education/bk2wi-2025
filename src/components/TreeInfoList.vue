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
const pageSize = ref(10)
const totalPages = ref(1)

// Filter
const searchQuery = ref('')
const filterHealthStatus = ref('')

const healthStatusOptions = [
  { value: '', label: 'Alle' },
  { value: 'healthy', label: 'Gesund' },
  { value: 'attention', label: 'Benötigt Aufmerksamkeit' },
  { value: 'critical', label: 'Kritisch' }
]

async function loadTrees() {
  loading.value = true
  error.value = null
  
  try {
    // Berechne Offset für Paginierung
    const offset = (currentPage.value - 1) * pageSize.value
    
    // Erstelle Filter basierend auf Suchbegriff und Gesundheitsstatus
    let whereClause = ''
    const conditions = []
    
    if (searchQuery.value) {
      conditions.push(`(name,like,%${searchQuery.value}%)~or(species,like,%${searchQuery.value}%)~or(location,like,%${searchQuery.value}%)`)
    }
    
    if (filterHealthStatus.value) {
      conditions.push(`(health_status,eq,${filterHealthStatus.value})`)
    }
    
    if (conditions.length > 0) {
      whereClause = conditions.join('~and')
    }
    
    // Lade Bäume mit Paginierung und Filtern
    const response = await treeInfoService.nocoDBService.getRecords<TreeInfo>('treeInfo', {
      limit: pageSize.value,
      offset,
      where: whereClause || undefined,
      sort: 'name'
    })
    
    trees.value = response.list
    totalTrees.value = response.pageInfo.totalRows
    totalPages.value = Math.ceil(totalTrees.value / pageSize.value)
    
    // Setze currentPage zurück, wenn wir über die maximale Seitenzahl hinaus sind
    if (currentPage.value > totalPages.value && totalPages.value > 0) {
      currentPage.value = totalPages.value
      await loadTrees()
    }
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

function applyFilters() {
  currentPage.value = 1 // Zurück zur ersten Seite bei Filteränderungen
  loadTrees()
}

onMounted(() => {
  loadTrees()
})
</script>

<template>
  <div class="tree-info-list">
    <!-- Filter und Suche -->
    <div class="mb-6 p-4 bg-gray-50 rounded-lg">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Suche</label>
          <div class="relative">
            <input
              id="search"
              v-model="searchQuery"
              type="text"
              placeholder="Nach Name, Art oder Standort suchen..."
              class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              @keyup.enter="applyFilters"
            />
            <button
              class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              @click="applyFilters"
            >
              <span class="sr-only">Suchen</span>
              🔍
            </button>
          </div>
        </div>
        
        <div class="md:w-64">
          <label for="health-status" class="block text-sm font-medium text-gray-700 mb-1">Gesundheitsstatus</label>
          <select
            id="health-status"
            v-model="filterHealthStatus"
            class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            @change="applyFilters"
          >
            <option v-for="option in healthStatusOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- Ergebnisanzeige -->
    <div v-if="loading" class="flex justify-center my-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>
    
    <div v-else-if="error" class="p-4 bg-red-50 text-red-700 rounded-lg">
      {{ error }}
    </div>
    
    <div v-else-if="trees.length === 0" class="p-8 text-center text-gray-500">
      <p class="text-lg">Keine Bäume gefunden.</p>
      <p v-if="searchQuery || filterHealthStatus" class="mt-2">
        Versuchen Sie, Ihre Filterkriterien anzupassen.
      </p>
    </div>
    
    <div v-else>
      <p class="mb-4 text-sm text-gray-600">
        {{ totalTrees }} Bäume gefunden
      </p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
