<script setup lang="ts">
import { RegisterRequest } from '../api/RegisterRequest';
import { saveState, useState } from '../state';
import { useRequest } from '../api/api';
import { useRouter } from 'vue-router';

const { loading, error, send, after } = useRequest(RegisterRequest);
const router = useRouter();
const state = useState();

if (state.token) router.push('/');

const form = {
  email: '',
  username: '',
  password: ''
};

function register() {
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
  <div class="register-view">
    <div class="register-container flex-container">
      <div class="flex-container" style="align-self: center">
        <h1>Register</h1>
        <input type="text" name="email" placeholder="Email" v-model="form.email" />
        <input type="text" name="username" placeholder="Username" v-model="form.username" />
        <input type="password" name="password" placeholder="Password" v-model="form.password" />
      </div>
      <p v-if="error != null" class="error">{{ error.data?.message || 'Request failed!' }}</p>
      <button :disabled="loading" @click="register">Register</button>
      <router-link to="/login">Already have an account?</router-link>
    </div>
  </div>
</template>

<style scoped>
.register-view {
  height: 100vh;
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
