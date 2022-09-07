import Rest from '@/views/rest/index.vue';
import FocusClock from '@/views/focus-clock/index.vue';
import { RouteRecordRaw } from 'vue-router';
import * as VueRouter from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/focus-clock',
  },
  {
    path: '/focus-clock',
    component: FocusClock,
  },
  {
    path: '/rest',
    component: Rest,
  },
] as RouteRecordRaw[];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
});

export default router;
