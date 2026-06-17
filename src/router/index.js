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
    },
    {
      path: '/connection',
      name: 'connection',
      component: () => import('../pages/connection/connection.vue')
    }
  ]
})

export default router
