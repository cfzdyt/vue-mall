// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import {currency} from './until/currency'
Vue.use(infiniteScroll)
Vue.use(Vuex)
Vue.config.productionTip = false

Vue.use(VueLazyload,{
	loading:'./../static/loading/loading-spinning-bubbles.svg'
	
})

const store =new Vuex.store({
	state:{
		nickName:'',
		cartCount:'',
	},
	mutations:{
		update(state,nickname){
			state.nickName=nickname
		}
		
	}
})
Vue.filter('currency',currency)
/* eslint-disable no-new */
new Vue({
	store,
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
