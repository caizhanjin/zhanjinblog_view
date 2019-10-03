import Vue from 'vue'
import App from './App'
import router from './router'
import "./assets/css/common.css"

Vue.config.productionTip = false

/****** 请求相关 ******/
import {get, post, patch, put, del} from './request/http'
import axios from 'axios'
// 全局注册
Vue.prototype.$axios=axios;
Vue.prototype.$post=post;
Vue.prototype.$get=get;
Vue.prototype.$patch=patch;
Vue.prototype.$put=put;
Vue.prototype.$del=del;
/****** 请求相关 ******/

/****** element引入 ******/
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);
/****** element引入 ******/

/****** markdown编辑框引入 ******/
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
Vue.use(mavonEditor)
/****** markdown编辑框引入 ******/

/****** 解决路由报错 ******/
import Router from 'vue-router'
import { format } from 'upath';
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
/****** 解决路由报错 ******/

/****** 时间格式化date-fns ******/
import { dateFilter } from "vue-date-fns";
Vue.filter("date", dateFilter);
/****** 时间格式化date-fns ******/

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
