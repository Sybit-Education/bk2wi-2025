<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import type { PartnerSponsor } from '@/models/partnerSponsor'
import { PartnerSponsorService } from '@/services/partnerSponsorService'

const partnerService = new PartnerSponsorService()

const partners = ref<PartnerSponsor[]>([])
const isLoading = ref(false)
const hasError = ref(false)

const hasMultiple = computed(() => partners.value.length > 1)
const marqueeCopies = computed(() => (hasMultiple.value ? [0, 1] : [0]))

const animationDuration = computed(() => {
  if (!hasMultiple.value) return '0s'
  const base = 18
  const factor = partners.value.length * 2
  return `${Math.max(base, factor * 3)}s`
})

const fetchPartners = async () => {
  try {
    isLoading.value = true
    const response = await partnerService.getPartners()
    partners.value = response.list ?? []
  } catch (error) {
    console.error('Fehler beim Laden der Partner:', error)
    hasError.value = true
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchPartners)
</script>

<template>
  <section class="overflow-hidden rounded-2xl">
    <div class="py-6 md:py-8">

      <div class="mt-6 min-h-[100px]">
        <div v-if="isLoading" class="flex items-center gap-2">
          <span class="h-2.5 w-2.5 animate-ping rounded-full"></span>
          <span>Lade Partner …</span>
        </div>
        <div v-else-if="hasError" class="text-sm">Partner konnten nicht geladen werden.</div>
        <div v-else-if="partners.length === 0" class="text-sm">Aktuell keine Partner vorhanden.</div>
        <div v-else class="relative overflow-hidden">
          <div
            class="marquee-track flex items-center gap-6 md:gap-10"
            :style="hasMultiple ? { animationDuration } : {}"
            :class="['whitespace-nowrap', hasMultiple ? 'animate-marquee' : 'justify-start']"
          >
            <template v-for="copy in marqueeCopies" :key="copy">
              <RouterLink
                v-for="partner in partners"
                :key="`${partner.id}-${copy}`"
                :to="{ name: 'partner-details', params: { id: partner.id } }"
                :aria-hidden="copy > 0 ? 'true' : undefined"
                class="group flex items-center gap-3 rounded-xl bg-black/10 px-4 py-3 backdrop-blur-sm transition hover:scale-105 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20"
              >
                <div class="flex h-10 w-40 items-center justify-center">
                  <img
                    v-if="partner.displayUrl"
                    :src="partner.displayUrl"
                    :alt="partner.name"
                    class="max-h-10 max-w-full object-contain"
                    loading="lazy"
                  />
                  <span v-else class="text-sm font-semibold tracking-wide">
                    {{ partner.name }}
                  </span>
                </div>
              </RouterLink>
            </template>
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

.marquee-track {
  min-width: max-content;
}
</style>
