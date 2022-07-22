export const panels = {
  namespaced: true,
  state: {
    openAddFolder: false,
    openRenameFolder: false,
    openEditor: {
      open: false,
      editORadd: 'edit',
    },
    openAddVersion: {
      open: false,
      data: '',
    },
  },
  mutations: {
    setOpenAddFolder(state, val) {
      state.openAddFolder = val
    },
    setOpenRenameFolder(state, val) {
      state.openRenameFolder = val
    },
    setOpenEditor(state, val) {
      state.openEditor = val
    },
    setOpenVersion(state, val) {
      state.openAddVersion = val
    },
  },
  actions: {
    openDialog({ commit }, payload) {
      //panel type
      if (payload.type == 'folder') {
        commit('setOpenAddFolder', true)
      } else if (payload.type == 'file') {
        const params = {
          open: true,
          editORadd: payload.editORadd,
        }
        commit('setOpenEditor', params)
      } else if (payload.type == 'renameFolder') {
        commit('setOpenRenameFolder', true)
      } else if (payload.type === 'version') {
        const params = {
          open: true,
          data: payload.rename,
        }
        commit('setOpenVersion', params)
      }
    },
  },
}
