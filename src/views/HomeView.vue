<script setup lang="ts">
import TreeInfoList from '../components/treeinfo/TreeInfoList.vue'
import SponsorMarquee from '@/components/sponsor/SponsorMarquee.vue'
import PartnerMarquee from '@/components/partner/PartnerMarquee.vue'
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-10 flex flex-col gap-6">
      <div>
        <h1>Baumarten</h1>
        <p class="mt-5 text-xl text-gray-600 max-w-fit">
          Entdecken Sie die Vielfalt unserer regionalen Bäume und erfahren Sie mehr über ihre Arten.
        </p>
      </div>
    </div>

    <TreeInfoList />
  </div>
  <div class="flex items-center justify-between gap-4">
    <div>
      <p class="text-sm uppercase tracking-[0.25em]">Gemeinsam mit</p>
      <h2 class="text-2xl font-semibold md:text-3xl">Unsere Partner</h2>
    </div>
  </div>

  <PartnerMarquee />

  <div class="flex items-center justify-between gap-4">
    <div>
      <p class="text-sm uppercase tracking-[0.25em]">Unterstützt von</p>
      <h2 class="text-2xl font-semibold md:text-3xl">Unsere Sponsoren</h2>
    </div>
  </div>
  <SponsorMarquee />
</template>

<style scoped>
.full-bleed {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
}
</style>
