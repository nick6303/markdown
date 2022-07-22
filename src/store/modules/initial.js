export const initial = {
  namespaced: true,
  state: {
    title: {
      Name: '',
      Tile: '',
    },
    version: [],
    struct: [],
  },
  mutations: {
    setTitle(state, title) {
      state.title.Name = title.Name
      state.title.Tile = title.Tile
    },
    setVersion(state, version) {
      state.version = version
    },
    setStruct(state, struct) {
      state.struct = struct
    },
  },
}
