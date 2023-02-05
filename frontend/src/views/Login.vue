<script setup lang="ts">
import { LoginRequest } from '../api/LoginRequest';
import { saveState, useState } from '../state';
import { useRequest } from '../api/api';
import { useRouter } from 'vue-router';

const { loading, error, send, after } = useRequest(LoginRequest);
const router = useRouter();
const state = useState();

if (state.token) router.push('/');

const form = {
  usernameOrEmail: '',
  password: ''
};

function login() {
  if (loading.value) return;
  send(form);
}

after((error, result) => {
  if (error || !result) return;
  const [token, refreshToken] = result;

  state.token = {
    raw: token,
    data: JSON.parse(atob(token.split('.')[1]))
  };
  state.refreshToken = refreshToken;

  saveState();

  router.push('/');
});
</script>

<template>
  <div class="login-view">
    <div class="login-container flex-container">
      <div class="flex-container">
        <h1>Login</h1>
        <input type="text" name="username" placeholder="Username or Email" v-model="form.usernameOrEmail" />
        <input type="password" name="password" placeholder="Password" v-model="form.password" />
      </div>
      <p v-if="error != null" class="error">{{ error.data?.message || 'Request failed!' }}</p>
      <button :disabled="loading" @click="login">Sign In</button>
      <router-link to="/register">Don't have an account?</router-link>
    </div>
  </div>
</template>

<style scoped>
.login-view {
  flex-grow: 1;
  display: grid;
  place-items: center;
}

.flex-container {
  display: flex;
  flex-flow: column nowrap;
  gap: 20px;
}

h1 {
  margin: 0px;
}

input {
  font-size: 16px;
  width: 250px;
}

button {
  align-self: center;
  font-size: 16px;
}

a {
  font-size: 18px;
  align-self: center;
}

.error {
  align-self: center;
}
</style>
