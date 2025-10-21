<script setup lang="ts">
import TreeInfoList from '../components/treeinfo/TreeInfoList.vue'
</script>

<template>
  <main>
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-800">Baumarten</h1>
        <p class="mt-5 text-xl text-gray-600 max-w-3xl">
          Entdecken Sie die Vielfalt unserer regionalen Bäume und erfahren Sie mehr über ihre Arten.
        </p>
      </div>

      <h2>Baumarten</h2>
      <TreeInfoList />
      <div class="mt-4 flex gap-4">
        <RouterLink to="/trees" class="text-green-700 hover:underline"
          >Zur Baumartenübersicht</RouterLink
        >
        <RouterLink to="/map" class="text-blue-700 hover:underline"
          >Zur Kartenansicht</RouterLink
        >
      </div>
    </div>
  </main>
</template>
