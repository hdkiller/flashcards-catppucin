import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CompletionView from '../views/CompletionView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/class/:classTitle',
      name: 'class',
      component: HomeView
    },
    {
      path: '/class/:classTitle/deck/:deckTitle',
      name: 'deck',
      component: HomeView
    },
    {
      path: '/completion',
      name: 'completion',
      component: CompletionView,
      props: true
    }
  ]
})

export default router
