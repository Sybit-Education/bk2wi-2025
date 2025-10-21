<script setup lang="ts">
import type { TreeInfo } from '@/models/treeInfo'
import { FwbCard } from 'flowbite-vue'
import { computed } from 'vue'

const props = defineProps<{
  tree: TreeInfo
}>()

const hasImage = computed(() => {
  return props.tree.picture && props.tree.picture.length > 0 && props.tree.picture[0]?.signedUrl
})

const imageUrl = computed(() => {
  return hasImage.value ? props.tree?.picture[0]?.signedUrl : ''
})
</script>

<style scoped>
.tree-info-item :deep(img) {
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
}

.tree-info-item.image-card :deep(img) {
  border-top-right-radius: 0;
  border-bottom-left-radius: 0.5rem;
}
</style>

<template>
  <fwb-card
    :class="['tree-info-item w-sd hover:shadow-md transition-shadow bg-white rounded-lg overflow-hidden', { 'image-card': hasImage }]"
    :img-src="imageUrl"
    :img-alt="tree.name"
    :variant="hasImage ? 'image' : 'default'"
  >
    <div class="p-5">
      <div class="flex justify-between items-start mb-3">
        <h3 class="text-xl font-semibold text-gray-800">{{ tree.name }}</h3>
      </div>

      <div class="text-gray-600">
        <p v-if="tree.description" class="mt-3 text-sm italic">{{ tree.description }}</p>
      </div>
    </div>
  </fwb-card>
</template>
