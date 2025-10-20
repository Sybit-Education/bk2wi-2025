<script setup lang="ts">
import type { TreeInfo } from '@/models/treeInfo'

const props = defineProps<{
  tree: TreeInfo
}>()
</script>

<template>
  <div
    class="tree-info-item p-5 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
  >
    <div class="flex justify-between items-start mb-3">
      <h3 class="text-xl font-semibold text-gray-800">{{ tree.name }}</h3>
    </div>

    <div class="text-gray-600">
      <!-- Bilder anzeigen, falls vorhanden -->
      <div v-if="tree.picture?.length > 0" class="mt-4">
        <div class="grid grid-cols-2 gap-2">
          <div v-for="picture in tree.picture.slice(0, 2)" :key="picture.id" class="relative">
            <img
              v-if="picture.signedUrl"
              :src="picture.signedUrl"
              :alt="tree.name"
              class="w-full h-32 object-cover rounded"
            />
          </div>
        </div>
      </div>
      <p v-if="tree.description" class="mt-3 text-sm italic">{{ tree.description }}</p>
    </div>
  </div>
</template>
