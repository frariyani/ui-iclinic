import Vue from 'vue'
import VueRouter from 'vue-router'
import DashboardView from '../components/DashboardView.vue'
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import ManageUserView from '../views/ManageUserView.vue'
import PatientView from '../views/PatientView.vue'
import ManageIllnessView from '../views/ManageIllnessView.vue'
import ManageTreatmentView from '../views/ManageTreatmentView.vue'
import ManageMedicineView from '../views/ManageMedicineView.vue'
import MedicalRecordView from '../views/PatientMedicalRecord.vue'
// import MedicalRecordView from '../views/MedicalRecordView.vue'
import ChangePasswordView from '../views/ChangePasswordView.vue'
import ReportDailyVisitor from '../views/ReportDailyVisitor.vue'
import ReportDailyIncome from '../views/ReportDailyIncome.vue'
import ReportMedicineUsage from '../views/ReportMedicineUsage.vue'
import ReportMonthly from '../views/ReportMonthly.vue'
import ManageStockView from '../views/ManageStockView.vue'
import ManageQueue from '../views/ManageQueueView.vue'
import ManagePrescriptionQueue from '../views/PrescriptionQueueView.vue'
import ManageTransactionView from '../views/ManageTransactionView.vue'

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
        path: '/manageantrian',
        name: 'ManageQueueView',
        component: ManageQueue
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
      },
      {
        path: '/dataperawatan',
        name: 'TreatmentView',
        component: ManageTreatmentView
      },
      {
        path: '/dataobat',
        name: 'ManageMedicineView',
        component: ManageMedicineView
      },
      {
        path: '/managestock/:medicineID',
        name: 'ManageStockView',
        component: ManageStockView
      },
      {
        path: '/datapasien/:patientID',
        name: 'MedicalRecordView',
        component: MedicalRecordView
      },
      {
        path: 'ubahpassword',
        name: 'ChangePasswordView',
        component: ChangePasswordView
      },
      {
        path: 'kunjunganharian',
        name: 'ReportDailyVisitor',
        component: ReportDailyVisitor
      },
      {
        path: 'pendapatanharian',
        name: 'ReportDailyIncome',
        component: ReportDailyIncome
      },
      {
        path: 'laporanobat',
        name: 'ReportMedicineUsage',
        component: ReportMedicineUsage
      },
      {
        path: 'laporanbulanan',
        name: 'ReportMonthly',
        component: ReportMonthly
      },
      {
        path: 'antrianobat',
        name: 'ManagePrescriptionQueue',
        component: ManagePrescriptionQueue
      },
      {
        path: 'transaksi',
        name: 'ManageTransactionView',
        component: ManageTransactionView
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
