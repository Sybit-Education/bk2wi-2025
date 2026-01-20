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

const imageUrl = computed((): string => {
  return hasImage.value ? (props.tree?.picture[0]?.signedUrl as string) : ''
})

const getLink = computed((): string => {
  return 'tree/' + props.tree.id
})
</script>

<template>
  <fwb-card
    class="tree-info-item w-sd hover:shadow-xl transition-shadow rounded-lg overflow-hidden p-0"
    :img-src="imageUrl"
    :img-alt="tree.name"
    :variant="hasImage ? 'image' : 'default'"
    :href="getLink"
  >
    <div class="p-5">
      <h3>{{ tree.name }}</h3>

      <p v-if="tree.abstract" class="mt-3 text-sm italic">{{ tree.abstract }}</p>
    </div>
  </fwb-card>
</template>

<style scoped>
/* scoped-Override: zielt auf das interne <img> der fwb-card-Instanz (temp fix) */
.tree-info-item :deep(img) {
  padding: 0;
  margin: 0;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  width: 100%;
  max-height: 50%;
  overflow: hidden;
}
a:hover {
  text-decoration: none;
}
</style>
