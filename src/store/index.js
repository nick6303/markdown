import { createStore } from 'vuex'
import { status } from './modules/status'
import { loading } from './modules/loading'
import { advance } from './modules/advance'
import { panels } from './modules/panels'
import { file } from './modules/file'
export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    status,
    loading,
    file,
    panels,
    advance,
  },
})
