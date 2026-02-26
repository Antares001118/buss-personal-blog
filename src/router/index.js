import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 登录页
    {
      path: '/login',
      component: () => import('@/views/login/LoginPage.vue')
    },
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/article/list',
      children:[
        {
          path: '/article/list',
          component: () => import('@/views/article/BlogList.vue')
        },
        {
          path: '/article/details/:id',
          component: () => import('@/views/article/BlogDetails.vue')
        },
        {
          path: '/article/add',
          component: () => import('@/views/article/BlogAdd.vue')
        },
        {
          path: '/article/edit/:id',
          component: () => import('@/views/article/BlogAdd.vue'),
          props: true
        },
        {
          path: '/user/change',
          component: () => import('@/views/user/UserChange.vue')
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        },
      ]
    },
  ],
})

export default router
