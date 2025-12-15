import { computed } from 'vue'
import { useThemeStore, type ThemeMode } from '@/stores/themeStore'
import { storeToRefs } from 'pinia'

/**
 * Composable für Theme-Management in Komponenten
 *
 * Bietet eine einfache API für:
 * - Abfrage des aktuellen Theme-Zustands
 * - Wechseln zwischen Themes
 * - Setzen eines spezifischen Themes
 *
 * @example
 * ```vue
 * <script setup>
 * import { useTheme } from '@/composables/useTheme'
 *
 * const { isDark, mode, toggle, setMode } = useTheme()
 * </script>
 *
 * <template>
 *   <button @click="toggle">{{ isDark ? '🌙' : '☀️' }}</button>
 * </template>
 * ```
 */
export function useTheme() {
  const themeStore = useThemeStore()
  const { mode, isDark } = storeToRefs(themeStore)

  /**
   * Label für den aktuellen Theme-Mode (z.B. für UI-Anzeige)
   */
  const modeLabel = computed(() => {
    switch (mode.value) {
      case 'light':
        return 'Hell'
      case 'dark':
        return 'Dunkel'
      case 'system':
        return 'System'
      default:
        return 'System'
    }
  })

  /**
   * Icon-Name für den aktuellen Theme-Mode
   */
  const modeIcon = computed(() => {
    switch (mode.value) {
      case 'light':
        return 'sun'
      case 'dark':
        return 'moon'
      case 'system':
        return 'computer-desktop'
      default:
        return 'computer-desktop'
    }
  })

  /**
   * Alle verfügbaren Theme-Modes mit Labels
   */
  const availableModes: { value: ThemeMode; label: string }[] = [
    { value: 'light', label: 'Hell' },
    { value: 'dark', label: 'Dunkel' },
    { value: 'system', label: 'System' },
  ]

  return {
    // State
    mode,
    isDark,
    modeLabel,
    modeIcon,
    availableModes,

    // Actions
    toggle: themeStore.toggle,
    setMode: themeStore.setMode,
    initTheme: themeStore.initTheme,
  }
}
