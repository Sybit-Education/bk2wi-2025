<script setup lang="ts">
import type { TreeInfo } from '@/services/treeInfoService'

defineProps<{
  tree: TreeInfo
}>()
</script>

<template>
  <div class="tree-info-item p-5 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
    <div class="flex justify-between items-start mb-3">
      <h3 class="text-xl font-semibold text-gray-800">{{ tree.name }}</h3>
      <span 
        class="px-2 py-1 text-xs rounded-full" 
        :class="{
          'bg-green-100 text-green-800': tree.health_status === 'healthy',
          'bg-yellow-100 text-yellow-800': tree.health_status === 'attention',
          'bg-red-100 text-red-800': tree.health_status === 'critical',
          'bg-gray-100 text-gray-800': !tree.health_status || tree.health_status === 'unknown'
        }"
      >
        {{ tree.health_status || 'Unbekannt' }}
      </span>
    </div>
    
    <div class="text-gray-600">
      <p v-if="tree.species" class="mb-2"><span class="font-medium">Art:</span> {{ tree.species }}</p>
      <p v-if="tree.location" class="mb-2"><span class="font-medium">Standort:</span> {{ tree.location }}</p>
      
      <div class="flex flex-wrap gap-4 mt-3 mb-2">
        <p v-if="tree.height"><span class="font-medium">Höhe:</span> {{ tree.height }}m</p>
        <p v-if="tree.diameter"><span class="font-medium">Durchmesser:</span> {{ tree.diameter }}cm</p>
        <p v-if="tree.age"><span class="font-medium">Alter:</span> {{ tree.age }} Jahre</p>
      </div>
      
      <p v-if="tree.notes" class="mt-3 text-sm italic">{{ tree.notes }}</p>
      
      <p v-if="tree.last_inspection" class="mt-3 text-xs text-gray-500">
        Letzte Inspektion: {{ new Date(tree.last_inspection).toLocaleDateString() }}
      </p>
    </div>
  </div>
</template>
