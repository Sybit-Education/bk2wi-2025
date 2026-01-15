<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { PartnerSponsor } from '@/models/partnerSponsor'
import { PartnerSponsorService } from '@/services/partnerSponsorService'

const sponsorService = new PartnerSponsorService()

const sponsors = ref<PartnerSponsor[]>([])
const isLoading = ref(false)
const hasError = ref(false)

const hasMultiple = computed(() => sponsors.value.length > 1)

const marqueeItems = computed(() => {
  if (sponsors.value.length === 0) return []
  if (!hasMultiple.value) return sponsors.value
  return [...sponsors.value, ...sponsors.value]
})

const animationDuration = computed(() => {
  if (!hasMultiple.value) return '0s'
  const base = 18
  const factor = sponsors.value.length * 2
  return `${Math.max(base, factor * 3)}s`
})

const fetchSponsors = async () => {
  try {
    isLoading.value = true
    const response = await sponsorService.getSponsors()
    sponsors.value = response.list ?? []
  } catch (error) {
    console.error('Fehler beim Laden der Sponsoren:', error)
    hasError.value = true
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchSponsors)
</script>

<template>
  <section class="overflow-hidden rounded-2xl">
    <div class="py-6 md:py-8">
      <div class="flex items-center justify-between gap-4">
        <div>
          <p class="text-sm uppercase tracking-[0.25em]">Unterstützt von</p>
          <h2 class="text-2xl font-semibold md:text-3xl">Unsere Sponsoren</h2>
        </div>
      </div>

      <div class="mt-6 min-h-[100px]">
        <div v-if="isLoading" class="flex items-center gap-2">
          <span class="h-2.5 w-2.5 animate-ping rounded-full"></span>
          <span>Lade Sponsoren …</span>
        </div>
        <div v-else-if="hasError" class="text-sm">Sponsoren konnten nicht geladen werden.</div>
        <div v-else-if="sponsors.length === 0" class="text-sm">
          Aktuell keine Sponsoren vorhanden.
        </div>
        <div v-else class="relative">
          <div
            class="flex items-center gap-6 md:gap-10"
            :style="hasMultiple ? { animationDuration } : {}"
            :class="['whitespace-nowrap', hasMultiple ? 'animate-marquee' : 'justify-start']"
          >
            <component
              v-for="sponsor in marqueeItems"
              :is="sponsor.website ? 'a' : 'div'"
              :href="sponsor.website || undefined"
              :target="sponsor.website ? '_blank' : undefined"
              rel="noopener noreferrer"
              :key="`${sponsor.id}`"
              class="group flex items-center gap-3 rounded-xl bg-black/10 dark:bg-white/10 px-4 py-3 backdrop-blur-sm transition hover:scale-105 hover:bg-black/20 dark:hover:bg-white/20"
            >
              <div class="flex items-center justify-center w-40 h-10">
                <img
                  v-if="sponsor.displayUrl"
                  :src="sponsor.displayUrl"
                  :alt="sponsor.name"
                  class="object-contain max-h-10 max-w-full"
                  loading="lazy"
                />
                <span v-else class="text-sm font-semibold tracking-wide">
                  {{ sponsor.name }}
                </span>
              </div>
            </component>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-marquee {
  animation-name: marquee;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
</style>
