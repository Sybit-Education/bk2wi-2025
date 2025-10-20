<script setup lang="ts">
import TreeInfoList from '../components/TreeInfoList.vue'
</script>

<template>
  <main>
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8 text-center">
        <h1 class="text-4xl font-bold text-gray-800">Unser Baumbestand</h1>
        <p class="mt-3 text-xl text-gray-600 max-w-3xl mx-auto">
          Entdecken Sie die Vielfalt unserer Bäume und erfahren Sie mehr über ihre Arten, 
          Standorte und Gesundheitszustände.
        </p>
      </div>
      
      <TreeInfoList />
    </div>
  </main>
</template>
