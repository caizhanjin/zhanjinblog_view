import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import articleList from '@/components/articleList'
import articleDetail from '@/components/articleDetail'
import articleCreate from '@/components/articleCreate'
import login from '@/components/login'
import articleCollection from '@/components/articleCollection'
import aboutMe from '@/components/aboutMe'
import manage from '@/components/manage'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
      // 重定向
      redirect:'/article_list'
    },
    {
      path: '/article_list',
      name: 'articleList',
      component: articleList
    },
    {
      path: '/article_detail',
      name: 'articleDetail',
      component: articleDetail
    },
    {
      path: '/article_create',
      name: 'articleCreate',
      component: articleCreate
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/about_me',
      name: 'aboutMe',
      component: aboutMe
    },
    {
      path: '/article_collection',
      name: 'articleCollection',
      component: articleCollection
    },
    {
      path: '/manage',
      name: 'manage',
      component: manage
    },

  ]
})
