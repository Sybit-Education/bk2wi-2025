import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

/**
 * Theme Mode Type
 */
export type ThemeMode = 'light' | 'dark' | 'system'

/**
 * Theme Store für Dark Mode Management
 *
 * Verwaltet die Theme-Präferenz des Benutzers und synchronisiert sie mit:
 * - localStorage für Persistenz
 * - DOM (html class) für Tailwind CSS Dark Mode
 * - System-Präferenz als Fallback
 */
export const useThemeStore = defineStore('theme', () => {
  // State
  const mode = ref<ThemeMode>('system')
  const isDark = ref(false)

  /**
   * Prüft ob der Benutzer Dark Mode in seinem System bevorzugt
   */
  const getSystemPreference = (): boolean => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  /**
   * Wendet das aktuelle Theme auf das DOM an
   */
  const applyTheme = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    isDark.value = dark
  }

  /**
   * Initialisiert das Theme basierend auf gespeicherter Präferenz oder System-Einstellung
   */
  const initTheme = () => {
    // Prüfe localStorage für gespeicherte Präferenz
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode | null

    if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
      mode.value = savedMode
    }

    // Wende das Theme an
    updateTheme()

    // Höre auf System-Präferenz-Änderungen
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      if (mode.value === 'system') {
        applyTheme(e.matches)
      }
    })
  }

  /**
   * Aktualisiert das Theme basierend auf dem aktuellen Mode
   */
  const updateTheme = () => {
    let shouldBeDark = false

    switch (mode.value) {
      case 'dark':
        shouldBeDark = true
        break
      case 'light':
        shouldBeDark = false
        break
      case 'system':
        shouldBeDark = getSystemPreference()
        break
    }

    applyTheme(shouldBeDark)
  }

  /**
   * Setzt den Theme-Mode und speichert ihn in localStorage
   */
  const setMode = (newMode: ThemeMode) => {
    mode.value = newMode
    localStorage.setItem('theme-mode', newMode)
    updateTheme()
  }

  /**
   * Wechselt zwischen Light und Dark Mode
   */
  const toggle = () => {
    if (mode.value === 'system') {
      // Wenn aktuell System, wechsle zu explizitem Light/Dark basierend auf aktuellem Zustand
      setMode(isDark.value ? 'light' : 'dark')
    } else {
      // Wechsle zwischen Light und Dark
      setMode(mode.value === 'light' ? 'dark' : 'light')
    }
  }

  // Watch mode changes
  watch(mode, () => {
    updateTheme()
  })

  return {
    // State
    mode,
    isDark,

    // Actions
    initTheme,
    setMode,
    toggle,
    updateTheme,
  }
})
