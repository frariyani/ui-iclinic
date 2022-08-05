import Vue from 'vue'
import VueRouter from 'vue-router'
import DashboardView from '../components/DashboardView.vue'
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import ManageUserView from '../views/ManageUserView.vue'
import PatientView from '../views/PatientView.vue'
import ManageIllnessView from '../views/ManageIllnessView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'DashboardView',
    meta: {
      Auth: true
    },
    component: DashboardView,
    children: [
      {
        path: '/',
        name: 'HomeView',
        component: HomeView
      },
      {
        path: '/datauser',
        name: 'ManageUserView',
        component: ManageUserView
      },
      {
        path: '/datapasien',
        name: 'PatientView',
        component: PatientView
      },
      {
        path: '/datapenyakit',
        name: 'ManageIllnessView',
        component: ManageIllnessView
      }
    ]
  },
  {
    path: '/login',
    name: 'LoginView',
    component: LoginView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.Auth)){
    if(sessionStorage.getItem('token')){
      next()
    }else{
      router.replace('/login')
    }
  }else{
    next()
  }
})

export default router
