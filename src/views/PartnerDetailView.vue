<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import type { PartnerSponsor } from '@/models/partnerSponsor'
import { PartnerSponsorService } from '@/services/partnerSponsorService'

const route = useRoute()
const partnerService = new PartnerSponsorService()

const partner = ref<PartnerSponsor | null>(null)
const isLoading = ref(false)
const hasError = ref(false)

const partnerId = computed(() => route.params.id as string)

const fetchPartner = async () => {
  try {
    isLoading.value = true
    hasError.value = false
    partner.value = await partnerService.getPartnerById(partnerId.value)
    if (!partner.value) {
      hasError.value = true
    }
  } catch (error) {
    console.error('Fehler beim Laden des Partners:', error)
    hasError.value = true
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchPartner)
</script>

<template>
  <section class="mx-auto max-w-5xl px-4 py-8 md:py-12">
    <div class="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
      <RouterLink to="/" class="font-medium text-primary-600 hover:underline">
        ← Zurück
      </RouterLink>
      <span class="text-xs uppercase tracking-[0.18em]">Partnerprofil</span>
    </div>

    <div class="mt-6">
      <div v-if="isLoading" class="text-sm">Partner wird geladen …</div>
      <div v-else-if="hasError" class="text-sm text-red-500">Partner konnte nicht geladen werden.</div>
      <div v-else-if="!partner" class="text-sm">Kein Partner gefunden.</div>
      <div v-else class="grid gap-8 md:grid-cols-[260px_1fr] md:items-start">
        <div class="flex h-52 w-full items-center justify-center rounded-2xl bg-black/5 p-6 backdrop-blur-sm dark:bg-white/5">
          <img
            v-if="partner.displayUrl"
            :src="partner.displayUrl"
            :alt="partner.name"
            class="max-h-40 max-w-full object-contain"
          />
          <span v-else class="text-lg font-semibold">{{ partner.name }}</span>
        </div>

        <div class="space-y-5">
          <div>
            <p class="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Partner</p>
            <h1 class="text-3xl font-semibold md:text-4xl">{{ partner.name }}</h1>
          </div>

          <p v-if="partner.description" class="text-base leading-relaxed text-slate-700 dark:text-slate-200">
            {{ partner.description }}
          </p>

          <div class="flex flex-wrap gap-3">
            <a
              v-if="partner.website"
              :href="partner.website"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-white transition hover:bg-primary-700"
            >
              Website öffnen
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
