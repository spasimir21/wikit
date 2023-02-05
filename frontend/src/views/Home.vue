<script setup lang="ts"></script>

<template>
  <div class="home-view">
    <div class="home-container">
      <h1>Wikit</h1>
      <p>Search, Learn, Contribute!</p>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  flex-grow: 1;
  display: grid;
  place-items: center;
}

.home-container {
  display: flex;
  flex-flow: column nowrap;
  justify-items: start;
  align-items: center;
  gap: 10px;
}

h1 {
  font-size: 48px;
  margin: 0px;
}

p {
  font-size: 24px;
  margin: 0px;
}
</style>
