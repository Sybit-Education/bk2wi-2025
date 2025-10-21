<script setup lang="ts">
import type { TreeInfo } from '@/models/treeInfo'
import { FwbCard } from 'flowbite-vue'

const props = defineProps<{
  tree: TreeInfo
}>()
</script>

<template>
  <fwb-card
    class="tree-info-item border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
    :img-src="tree.picture[0]?.signedUrl || ''"
    variant="horizontal"
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
  </fwb-card>
</template>
