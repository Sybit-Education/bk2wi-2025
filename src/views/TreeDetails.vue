<script setup lang="ts">
import type { TreeInfo } from '@/models/treeInfo'
import { TreeInfoService } from '@/services/treeInfoService'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()


const treeInfoService = new TreeInfoService()
let tree: TreeInfo
const loading = ref(true)
const error = ref<string | null>(null)

async function loadTree(treeId: string) {
  loading.value = true
  error.value = null

  try {
    const response = await treeInfoService.getTreeById(treeId)
    tree = response
  } catch (err) {
    console.error('Fehler beim Laden der Bäume:', err)
    error.value =
      'Die Baumdaten konnten nicht geladen werden. Bitte versuchen Sie es später erneut.'
  } finally {
    loading.value = false
      console.log('Ladide Baum mit ID:', )
      console.log('Baumdaten:', tree)
  }
}

onMounted(() => {
  const id = route.params.id as string
  loadTree(id)
})


watch(
  () => route.params.id,
  (newId) => {
    if (typeof newId === 'string') loadTree(newId)
  }
)
const hasImage = computed(() => {
  return tree.picture && tree.picture.length > 0 && tree.picture[0]?.signedUrl
})

const imageUrl = computed((): string => {
  return hasImage.value ? (tree?.picture[0]?.signedUrl as string) : ''
})

</script>

<template>
  <main>
    <div v-if="loading">
      <p>Lade Baumdaten...</p>
    </div>

    <div v-else-if="error">
      <p class="text-red-500">{{ error }}</p>
    </div>

    <div v-else-if="tree" class="mx-5 md:mx-10">
      <h1 class="text-4xl font-bold text-gray-800 mb-8 mt-6 md:mb-4">Über {{ tree.name }}</h1>

      <div class="md:flex md:flex-row space-x-8">
        <img :src="imageUrl" :alt="tree.name" class="mt-4 md:max-w-md  h-full rounded-lg shadow-lg w-auto " />
        <p class="mt-10 md:mt-2 text-lg text-gray-700 text-justify whitespace-pre-line">{{ tree.description }}</p>
      </div>

    </div>
  </main>
</template>
