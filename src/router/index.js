import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
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
