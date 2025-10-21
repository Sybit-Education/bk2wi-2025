<script setup lang="ts">
import TreeInfoList from '../components/treeinfo/TreeInfoList.vue'
</script>

<template>
  <main>
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-800">Übersicht der Baumarten</h1>
        <p class="mt-3 text-xl text-gray-600 max-w-3xl mx-auto">
          Entdecken Sie die Vielfalt unserer regionalen Bäume und erfahren Sie mehr über ihre Arten.
        </p>
      </div>

      <TreeInfoList class="mx-auto" />
    </div>
  </main>
</template>
