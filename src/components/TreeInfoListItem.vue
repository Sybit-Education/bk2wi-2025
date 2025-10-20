<script setup lang="ts">
import type { TreeInfo } from '@/models/treeInfo'

defineProps<{
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

      <p v-if="tree.description" class="mt-3 text-sm italic">{{ tree.description }}</p>

    </div>
  </div>
</template>
