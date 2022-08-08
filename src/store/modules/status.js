export const status = {
  namespaced: true,
  state: {
    content_status: '已儲存',
    usedVersion: '',
  },
  mutations: {
    setStatus(state, NewStatus) {
      state.content_status = NewStatus
    },
    setVersion(state, version) {
      state.usedVersion = version
    },
  },
}
