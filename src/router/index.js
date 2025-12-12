import Vue from 'vue'
import Router from 'vue-router'
import ReviewAuth from '../views/ReviewAuth.vue'
import TransactionProgress from '../views/TransactionProgress.vue'
import FilterTest from '../views/FilterTest.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/review-auth'
    },
    {
      path: '/review-auth',
      name: 'ReviewAuth',
      component: ReviewAuth
    },
    {
      path: '/transaction-progress',
      name: 'TransactionProgress',
      component: TransactionProgress
    },
    {
      path: '/filter-test',
      name: 'FilterTest',
      component: FilterTest
    }
  ]
})
