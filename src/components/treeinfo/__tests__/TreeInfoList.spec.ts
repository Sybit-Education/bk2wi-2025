import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import type { TreeInfo } from '@/models/treeInfo'
import type { ListResponse } from '@/services/nocodbService'
import { TreeInfoService } from '@/services/treeInfoService'
import TreeInfoList from '../TreeInfoList.vue'

const oak: TreeInfo = { id: 1, name: 'Eiche', picture: [] }
const chestnut: TreeInfo = { id: 26, name: 'Kastanie', picture: [] }

function treePage(trees: TreeInfo[], totalRows = trees.length, page = 1): ListResponse<TreeInfo> {
  return {
    list: trees,
    pageInfo: {
      totalRows,
      page,
      pageSize: 25,
      isFirstPage: page === 1,
      isLastPage: page * 25 >= totalRows,
    },
  }
}

describe('TreeInfoList', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    vi.spyOn(TreeInfoService.prototype, 'getAllTrees').mockResolvedValue(treePage([oak]))
  })

  afterEach(() => {
    wrapper?.unmount()
  })

  it('shows a loading indicator until the trees arrive', async () => {
    wrapper = mount(TreeInfoList)

    expect(wrapper.find('.animate-spin').exists()).toBe(true)
    expect(wrapper.find('h3').exists()).toBe(false)

    await flushPromises()

    expect(wrapper.find('.animate-spin').exists()).toBe(false)
    expect(wrapper.get('h3').text()).toBe('Eiche')
    expect(TreeInfoService.prototype.getAllTrees).toHaveBeenCalledWith(25, 0)
  })

  it('shows an empty state without pagination when there are no trees', async () => {
    vi.mocked(TreeInfoService.prototype.getAllTrees).mockResolvedValue(treePage([]))
    wrapper = mount(TreeInfoList)
    await flushPromises()

    expect(wrapper.text()).toContain('Keine Bäume gefunden.')
    expect(wrapper.find('nav').exists()).toBe(false)
  })

  it('shows a helpful error instead of an empty state when loading fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(TreeInfoService.prototype.getAllTrees).mockRejectedValue(new Error('Offline'))
    wrapper = mount(TreeInfoList)
    await flushPromises()

    expect(wrapper.text()).toContain('Die Baumdaten konnten nicht geladen werden.')
    expect(wrapper.text()).not.toContain('Keine Bäume gefunden.')
    expect(wrapper.find('.animate-spin').exists()).toBe(false)
  })

  it('does not show pagination for exactly one page', async () => {
    vi.mocked(TreeInfoService.prototype.getAllTrees).mockResolvedValue(treePage([oak], 25))
    wrapper = mount(TreeInfoList)
    await flushPromises()

    expect(wrapper.find('nav').exists()).toBe(false)
    expect(wrapper.get('h3').text()).toBe('Eiche')
  })

  it('loads the next page with the correct offset and disables the last-page button', async () => {
    vi.mocked(TreeInfoService.prototype.getAllTrees)
      .mockResolvedValueOnce(treePage([oak], 26))
      .mockResolvedValueOnce(treePage([chestnut], 26, 2))
    wrapper = mount(TreeInfoList)
    await flushPromises()

    expect(wrapper.get('button:first-child').attributes('disabled')).toBeDefined()
    await wrapper.get('button:last-child').trigger('click')
    await flushPromises()

    expect(TreeInfoService.prototype.getAllTrees).toHaveBeenLastCalledWith(25, 25)
    expect(wrapper.get('h3').text()).toBe('Kastanie')
    expect(wrapper.get('button:last-child').attributes('disabled')).toBeDefined()
  })

  it('can return to the first page', async () => {
    vi.mocked(TreeInfoService.prototype.getAllTrees)
      .mockResolvedValueOnce(treePage([oak], 26))
      .mockResolvedValueOnce(treePage([chestnut], 26, 2))
      .mockResolvedValueOnce(treePage([oak], 26))
    wrapper = mount(TreeInfoList)
    await flushPromises()

    await wrapper.get('button:last-child').trigger('click')
    await flushPromises()
    await wrapper.get('button:first-child').trigger('click')
    await flushPromises()

    expect(TreeInfoService.prototype.getAllTrees).toHaveBeenLastCalledWith(25, 0)
    expect(wrapper.get('h3').text()).toBe('Eiche')
    expect(wrapper.get('button:first-child').attributes('disabled')).toBeDefined()
  })

  it('does not reload when the active page is clicked', async () => {
    vi.mocked(TreeInfoService.prototype.getAllTrees).mockResolvedValue(treePage([oak], 26))
    wrapper = mount(TreeInfoList)
    await flushPromises()

    const activePage = wrapper.findAll('button').find((button) => button.text() === '1')
    if (!activePage) throw new Error('Page 1 button is missing')
    await activePage.trigger('click')

    expect(wrapper.find('.animate-spin').exists()).toBe(false)
    expect(TreeInfoService.prototype.getAllTrees).toHaveBeenCalledTimes(1)
  })
})
