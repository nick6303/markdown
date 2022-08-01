export const file = {
  namespaced: true,
  state: {
    recentFile: {},
    recentFolder: {},
    recentClick: {},
    editingFile: '',
    BreadCurmb: [],
  },
  mutations: {
    setFolder(state, val) {
      state.recentFolder = val
    },
    setFile(state, val) {
      state.recentFile = val
    },
    setCilck(state, val) {
      state.recentClick = val
    },
    setEditingFile(state, val) {
      state.editingFile = val
    },
    setBreadCurmb(state, list) {
      state.BreadCurmb = list
    },
  },
  actions: {
    clickFile({ commit }, payload) {
      var fileParent
      //file vs floder
      if (payload.type == 'file') {
        fileParent = payload.parent_id //取父層id
        payload.fileParent = payload.parent_id
        commit('setFile', payload)
        commit('setBreadCurmb', payload.breadcrumb) //breadcrumb
      } else {
        fileParent = payload.id //是目錄，取自己id
        payload.fileParent = payload.id
        commit('setFolder', payload)
      }
      payload.fileParent = fileParent
      commit('setCilck', payload)
    },
  },
}
