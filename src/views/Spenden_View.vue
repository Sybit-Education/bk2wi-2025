<script setup lang="ts">
import { ref } from "vue";

const donationAmount = ref(0);

</script>

<template>
  <h1>Spenden – Übersicht</h1>

  <p>
    Wir bitten Sie, an unserem Projekt teilzunehmen, indem Sie für einen guten Zweck Geld, für unsere Natur und Klima, spenden.
  </p>

  <h4>Hier können Sie spenden!</h4>

  <input type="number" v-model.number="donationAmount" placeholder="Spendenbetrag €" />

  <p v-if="donationAmount >= 100">
    Vielen Dank an <strong>Bernd Grüngeld</strong> für die großzügige Spende!</p>

<div class="click">
  <button type="button" onclick="alert('Click_Me')">Click Me!</button>
</div>


</template>

<style>

.click{
  color: rgba(37, 173, 94, 0.849);
}

</style>





