<script setup lang="ts">
import NavBar from './components/NavBar.vue';
</script>

<template>
  <div class="app">
    <NavBar />
    <router-view></router-view>
  </div>
</template>

<style>
:root {
  --foreground-darker-vibrant-accent: #4169e1;
  --foreground-vibrant-accent: #1e90ff;
  --foreground-error-accent: tomato;
  --foreground-accent: gray;

  --navbar-height: 71px;
}

* {
  box-sizing: border-box;
  font-family: 'Nunito', sans-serif;
  font-family: 'Nunito Sans', sans-serif;
  user-select: none;
}

.text {
  user-select: text !important;
}

html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0px;
}

.app {
  display: flex;
  flex-flow: column nowrap;
  min-width: 100%;
  min-height: 100%;
}

[disabled='true'] {
  filter: grayscale(0.5);
  cursor: default;
}

button[disabled] {
  filter: grayscale(0.5);
  cursor: default;
}

button {
  background-color: var(--foreground-vibrant-accent);
  border-radius: 5px;
  padding: 10px 20px 10px 20px;
  font-family: 'Nunito', sans-serif;
  font-family: 'Nunito Sans', sans-serif;
  font-weight: bold;
  color: white;
  border: none;
  outline: none;
  cursor: pointer;
}

input {
  font-family: 'Nunito', sans-serif;
  font-family: 'Nunito Sans', sans-serif;
  padding: 5px 10px 5px 10px;
  border-radius: 10px;
  border: 1px solid var(--foreground-accent);
  outline: none;
}

a {
  text-decoration: none;
  font-family: 'Nunito', sans-serif;
  font-family: 'Nunito Sans', sans-serif;
  color: var(--foreground-darker-vibrant-accent);
}

.error {
  color: var(--foreground-error-accent);
  margin: 0px;
  font-size: 20px;
}
</style>
