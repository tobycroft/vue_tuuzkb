import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('../pages/index/index.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../pages/settings/settings.vue')
    }
  ]
})

export default router
