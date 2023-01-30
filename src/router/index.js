import { createWebHistory, createRouter } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ClaimView from '../views/ClaimView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    props: true,
  },
  {
    path: '/claim',
    name: 'Claim',
    component: ClaimView,
    props: true,
  },
];
const base = process.env.NODE_ENV === 'production' ? '/' : '/';
const router = createRouter({
  history: createWebHistory(base),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
