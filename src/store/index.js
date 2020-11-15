import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    page: "home"
  },
  mutations: {
    setPage(state, newPage) {
      state.page = newPage
    }
  },
  actions: {
  },
  modules: {
  }
})
