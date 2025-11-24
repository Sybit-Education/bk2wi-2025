import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TreeDetails from '@/views/TreeDetails.vue'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/trees',
      name: 'trees',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/TreeOverviewView.vue'),
    },
    {
      path: '/tree/:id',
      name: 'tree-details',
      component: TreeDetails,
      props: true,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/map',
      name: 'map',
      component: () => import('../views/MapView.vue'),
    },
    {
      path: '/createtree',
      name: 'Create a tree',
      component: () => import('../views/PlantATreeView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: {
        //hideLayout: true
      },
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignUpView.vue'),
      meta: {
        //hideLayout: true
      },
    },
  ],
})

// Navigation Guard für geschützte Routen
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  // Wenn die Route keine Authentifizierung erfordert, weiter zur Route
  if (!requiresAuth) {
    return next()
  }

  // Prüfen, ob der Benutzer authentifiziert ist
  const isAuthenticated = authStore.isAuthenticated

  // Wenn nicht authentifiziert, zur Login-Seite umleiten
  if (!isAuthenticated) {
    // Token überprüfen und ggf. erneuern
    const tokenValid = await authStore.checkAndRefreshToken()

    if (!tokenValid) {
      return next({
        path: '/login',
        query: { redirect: to.fullPath },
      })
    }
  }

  // Benutzer ist authentifiziert, weiter zur Route
  next()
})

export default router
