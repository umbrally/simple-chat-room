import Vue from 'vue'
import VueRouter from 'vue-router'
import NotFound from './../views/NotFound.vue'
import Chat from './../views/Chat.vue'
import SignIn from './../views/SignIn.vue'
import store from './../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'root',
    redirect: '/chat'
  },
  {
    path: '/signin',
    name: 'sign-in',
    component: SignIn
  },
  {
    path: '/signup',
    name: 'sign-up',
    component: () => import('./../views/SignUp.vue')
  },
  {
    path: '/chat',
    name: 'chat',
    component: Chat
  },
  {
    path: '*',
    name: 'not-found',
    component: NotFound
  }
]



const router = new VueRouter({
  routes
})

router.beforeEach(async (to, from, next) => {

  const tokenInLocalStorage = localStorage.getItem('token')
  const tokenInStore = store.state.token
  let isAuthenticated = store.state.isAuthenticated

  // 如果有 token 的話才驗證
  // 比較 localStorage 和 store 中的 token 是否一樣
  if (tokenInLocalStorage && tokenInLocalStorage !== tokenInStore) {
    isAuthenticated = await store.dispatch('fetchCurrentUser')
  }
  // 對於不需要驗證 token 的頁面
  const pathsWithoutAuthentication = ['sign-up']
  if (pathsWithoutAuthentication.includes(to.name)) {
    next()
    return
  }

  // 如果 token 無效則轉址到登入頁
  if (!isAuthenticated && to.name !== 'sign-in') {
    next('/signin')
    return
  }
  // 如果 token 有效則轉址到餐聽首頁
  if (isAuthenticated && to.name === 'sign-in') {
    next('/chat')
    return
  }

  next()
})

export default router
