<script setup lang="ts">
import { LogoutRequest } from '../api/LogoutRequest';
import { useRoute, useRouter } from 'vue-router';
import { saveState, useState } from '../state';
import { useRequest } from '../api/api';
import { ref, watch } from 'vue';

const { loading, send, after } = useRequest(LogoutRequest);
const router = useRouter();
const route = useRoute();
const state = useState();

function redirect(path: string) {
  router.push(path);
}

function logout() {
  if (loading.value) return;
  send({ token: state.token?.raw as string });
}

after(() => {
  state.token = undefined;
  state.refreshToken = undefined;
  saveState();
  redirect('/');
});

let search = ref('');
watch([() => route.query.q], () => (search.value = route.query.q as string));

function onSearchKeyup(event: KeyboardEvent) {
  if (event.key != 'Enter') return;
  router.push({
    path: '/search',
    query: { q: search.value }
  });
}
</script>

<template>
  <div id="navbar">
    <img src="../assets/logo.png" alt="Wikit" class="logo" @click="redirect('/')" />
    <input type="text" placeholder="Search" class="search" @keyup="onSearchKeyup" v-model="search" />
    <button v-if="state.token == null" class="sign-in" @click="redirect('/login')">Sign In</button>
    <div v-if="state.token" class="right-container">
      <p :disabled="loading" class="username" @click="logout">{{ state.token.data.username }}</p>
      <button @click="redirect('/create')">Create</button>
    </div>
  </div>
</template>

<style scoped>
#navbar {
  background-color: white;
  position: sticky;
  top: 0px;
  left: 0px;
  width: 100%;
  height: var(--navbar-height);
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--foreground-accent);
  padding: 10px;
  z-index: 99;
}

.logo {
  width: 50px;
  height: 50px;
  cursor: pointer;
}

.search {
  padding: 10px 20px 10px 10px;
  border-radius: 30px;
  width: 50%;
  font-size: 16px;
}

.sign-in {
  font-size: 18px;
}

.username {
  margin: 0px;
  font-weight: bold;
  cursor: pointer;
  font-size: 20px;
  color: var(--foreground-vibrant-accent);
}

.right-container {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 20px;
}

.right-container button {
  font-size: 18px;
}
</style>
