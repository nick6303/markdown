import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'MarkDown',
    component: () => import('@v/markdown'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@v/login'),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

export default router

router.beforeEach(async (to, from, next) => {
  const pattern = /Page404|Page500|Login|Register|PortPage/
  const isGuestRoute = pattern.test(to.name)
  const accessToken = localStorage.getItem('access_token')

  if (isGuestRoute) {
    next()
  } else {
    if (accessToken) {
      next()
    } else {
      next('/login')
    }
  }
})
