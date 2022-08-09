import { createRouter, createWebHashHistory } from 'vue-router'

const isProduction = process.env.NODE_ENV === 'production'
const resetPath = isProduction ? '/403' : '/login'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@v/login'),
  },
  {
    path: '/403',
    name: 'Page403',
    component: () => import('@v/errors/Page403.vue'),
  },
  {
    path: '/',
    name: 'MarkDown',
    component: () => import('@v/markdown'),
  },
  {
    path: '/:page',
    name: 'Page',
    component: () => import('@v/markdown'),
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
})

export default router

router.beforeEach(async (to, from, next) => {
  const pattern = /Page403|Login/ // 避免無線循環
  const isGuestRoute = pattern.test(to.name)
  const token = to.query.access_token
  if (token) {
    localStorage.setItem('access_token', token)
  }
  const accessToken = localStorage.getItem('access_token')

  const actions = to.query.actions
  const metaAction = actions
    ? JSON.parse(actions)
    : {
        create: true,
        update: true,
        delete: true,
        readSingle: true,
      }
  to.meta.actions = metaAction

  if (isGuestRoute) {
    next()
  } else {
    if (accessToken) {
      next()
    } else {
      next(resetPath)
    }
  }
})
