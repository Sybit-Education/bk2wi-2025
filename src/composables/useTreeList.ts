import { computed, onMounted, ref } from 'vue'
import type { TreeInfo } from '@/models/treeInfo'
import { TreeInfoService } from '@/services/treeInfoService'

const PAGE_SIZE = 25

export function useTreeList() {
  const treeInfoService = new TreeInfoService()
  const trees = ref<TreeInfo[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const totalTrees = ref(0)

  const totalPages = computed(() => Math.max(1, Math.ceil(totalTrees.value / PAGE_SIZE)))

  async function loadTrees() {
    loading.value = true
    error.value = null

    try {
      const offset = (currentPage.value - 1) * PAGE_SIZE
      const response = await treeInfoService.getAllTrees(PAGE_SIZE, offset)
      trees.value = response.list
      totalTrees.value = response.pageInfo.totalRows
    } catch (err) {
      console.error('Fehler beim Laden der Bäume:', err)
      error.value =
        'Die Baumdaten konnten nicht geladen werden. Bitte versuchen Sie es später erneut.'
    } finally {
      loading.value = false
    }
  }

  async function goToPage(page: number) {
    if (
      !Number.isInteger(page) ||
      page < 1 ||
      page > totalPages.value ||
      page === currentPage.value
    ) {
      return
    }

    currentPage.value = page
    await loadTrees()
  }

  onMounted(loadTrees)

  return { trees, loading, error, currentPage, totalPages, goToPage }
}
