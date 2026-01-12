<template>
  <div class="contact">
    <h1>Hallo</h1>
  </div>
  <div class="form">

    <form action="">
      <input type="text" id="vorname" name="vorname" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg-500 block w-full p-2.5" placeholder="Max" required>
      <br>
      <input type="text" id="nachname" name="nachname" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg-500 block w-full p-2.5" placeholder="Mustermann" required>
      <br>
      <input type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg-500 block w-full p-2.5" placeholder="name@mail.com" required>
      <br>
      
<label for="message" class="block mb-2.5 text-sm font-medium text-heading">Ihre Nachricht</label>
<textarea id="message" rows="4" class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full p-3.5 shadow-xs placeholder:text-body" placeholder="Write your thoughts here..."></textarea>
<br>
      <div>
      <button type="submit" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Send message</button>
        </div>

    </form>
  </div>
</template>



<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
.button{
  background-color: blue;
}

</style>
