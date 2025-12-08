<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

const { isDark, mode, toggle, setMode, availableModes, modeLabel } = useTheme()

/**
 * Props für optionale Anpassungen
 */
defineProps<{
  /** Zeigt ein Dropdown-Menü mit allen Modi statt nur einem Toggle */
  showDropdown?: boolean
  /** Zusätzliche CSS-Klassen für den Button */
  buttonClass?: string
}>()
</script>

<template>
  <!-- Einfacher Toggle Button -->
  <button
    v-if="!showDropdown"
    type="button"
    :class="[
      'inline-flex items-center justify-center rounded-lg p-2.5 text-sm',
      'text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200',
      'dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700',
      buttonClass,
    ]"
    :title="`Aktuell: ${modeLabel}. Klicken zum Wechseln.`"
    @click="toggle"
  >
    <!-- Sun Icon (Light Mode) -->
    <svg
      v-if="!isDark"
      class="h-5 w-5"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
        clip-rule="evenodd"
      />
    </svg>

    <!-- Moon Icon (Dark Mode) -->
    <svg
      v-else
      class="h-5 w-5"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
    </svg>

    <span class="sr-only">Theme wechseln</span>
  </button>

  <!-- Dropdown mit allen Modi -->
  <div v-else class="relative inline-block text-left">
    <div class="group">
      <button
        type="button"
        :class="[
          'inline-flex items-center justify-center rounded-lg p-2.5 text-sm',
          'text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200',
          'dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700',
          buttonClass,
        ]"
      >
        <!-- Sun Icon -->
        <svg
          v-if="mode === 'light'"
          class="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clip-rule="evenodd"
          />
        </svg>

        <!-- Moon Icon -->
        <svg
          v-else-if="mode === 'dark'"
          class="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>

        <!-- Computer Desktop Icon (System) -->
        <svg
          v-else
          class="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z"
            clip-rule="evenodd"
          />
        </svg>

        <span class="sr-only">Theme wählen</span>
      </button>

      <!-- Dropdown Menu -->
      <div
        class="invisible absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-lg bg-white opacity-0 shadow-lg ring-1 ring-black ring-opacity-5 transition-all group-focus-within:visible group-focus-within:opacity-100 dark:bg-gray-700"
      >
        <div class="py-1">
          <button
            v-for="themeMode in availableModes"
            :key="themeMode.value"
            type="button"
            :class="[
              'flex w-full items-center gap-2 px-4 py-2 text-left text-sm',
              mode === themeMode.value
                ? 'bg-gray-100 text-gray-900 dark:bg-gray-600 dark:text-white'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600',
            ]"
            @click="setMode(themeMode.value)"
          >
            <!-- Sun Icon -->
            <svg
              v-if="themeMode.value === 'light'"
              class="h-4 w-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clip-rule="evenodd"
              />
            </svg>

            <!-- Moon Icon -->
            <svg
              v-else-if="themeMode.value === 'dark'"
              class="h-4 w-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>

            <!-- Computer Desktop Icon -->
            <svg v-else class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z"
                clip-rule="evenodd"
              />
            </svg>

            {{ themeMode.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
