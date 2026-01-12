<script setup lang="ts">
import TreeInfoList from '../components/treeinfo/TreeInfoList.vue'
import SponsorMarquee from '@/components/features/SponsorMarquee.vue'
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

    <SponsorMarquee />
  </div>
</template>
