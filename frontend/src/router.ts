import Register from './views/Register.vue';
import * as VueRouter from 'vue-router';
import Create from './views/Create.vue';
import Search from './views/Search.vue';
import Login from './views/Login.vue';
import Home from './views/Home.vue';
import Add from './views/Add.vue';

const routes: VueRouter.RouteRecordRaw[] = [
  { path: '/', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/search', name: 'Search', component: Search },
  { path: '/create', name: 'Create', component: Create },
  { path: '/add', name: 'Add', component: Add },
  { path: '/:pathMatch(.*)*', redirect: '/' } // Fallback Page
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes
});

router.beforeEach((to, _from, next) => {
  document.title = to.name ? `Wikit - ${to.name as string}` : 'Wikit';
  next();
});

export { router };
