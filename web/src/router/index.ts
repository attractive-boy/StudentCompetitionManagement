import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Login.vue')
    },
    {
      path: '/',
      name: 'index',
      component: () => import('../views/Index.vue'),
      children: [
        {
          path: '/changePassword',
          name: 'changePassword',
          component: () => import('../views/ChangePassword.vue')
        },
        {
          path: '/usercenter',
          name: 'usercenter',
          component: () => import('../views/UserCenter.vue')
        },
        {
          path: '/officialnews',
          name: 'officialnews',
          component: () => import('../views/OfficialNews.vue')
        },
        {
          path: '/competition',
          name: 'competition',
          component: () => import('../views/Competition.vue')
        },
        {
          path: '/student',
          name: 'student',
          component: () => import('../views/StudentManager.vue')
        },
      ]
    }
  ]
})

export default router
