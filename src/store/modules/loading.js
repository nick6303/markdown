export const loading = {
  namespaced: true,
  state: {
    tree_load: false,
    view_load: false,
  },
  mutations: {
    setTreeLoad(state, val) {
      state.tree_load = val
    },
    setViewLoad(state, val) {
      state.view_load = val
    },
  },
}
