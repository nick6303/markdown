export const initial = {
  namespaced: true,
  state: {
    title: {
      Name: '',
      Tile: '',
    },
    versionList: [],
    struct: [],
  },
  mutations: {
    setTitle(state, title) {
      state.title.Name = title.Name
      state.title.Tile = title.Tile
    },
    setVersionList(state, list) {
      state.versionList = list
    },
    setStruct(state, struct) {
      state.struct = struct
    },
  },
}
