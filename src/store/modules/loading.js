export const loading = {
  namespaced: true,
  state: {
    view_load: false,
  },
  mutations: {
    setViewLoad(state, val) {
      state.view_load = val
    },
  },
}
