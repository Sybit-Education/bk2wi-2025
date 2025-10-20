<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { TreeInfo } from '@/models/treeInfo'
import type { Picture } from '@/models/picture'
import { useTreeInfoService } from '@/services/treeInfoService'

const props = defineProps<{
  tree: TreeInfo
}>()

const treeService = useTreeInfoService()
const pictures = ref<Picture[]>([])
const loadingPictures = ref(false)

async function loadPictures() {
  if (props.tree.id) {
    loadingPictures.value = true
    try {
      pictures.value = await treeService.getTreePictures(props.tree.id)
    } catch (error) {
      console.error('Fehler beim Laden der Bilder:', error)
    } finally {
      loadingPictures.value = false
    }
  }
}

onMounted(() => {
  loadPictures()
})
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

      <!-- Bilder anzeigen, falls vorhanden -->
      <div v-if="pictures.length > 0" class="mt-4">
        <div class="grid grid-cols-2 gap-2">
          <div v-for="picture in pictures.slice(0, 2)" :key="picture.id" class="relative">
            <img
              v-if="picture.url"
              :src="picture.url"
              :alt="picture.title || 'Baumbild'"
              class="w-full h-32 object-cover rounded"
            />
          </div>
        </div>
        <p v-if="pictures.length > 2" class="text-xs text-right mt-1 text-gray-500">
          +{{ pictures.length - 2 }} weitere Bilder
        </p>
      </div>

      <div v-else-if="loadingPictures" class="mt-4 text-center text-sm text-gray-400">
        Lade Bilder...
      </div>
    </div>
  </div>
</template>
