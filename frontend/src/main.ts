import { STATE, VUE_STATE_KEY } from './state';
import { router } from './router';
import { createApp } from 'vue';
import App from './App.vue';

createApp(App).use(router).provide(VUE_STATE_KEY, STATE).mount('#app');
