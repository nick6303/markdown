import {
  DEFAULT_IMG_OVERWRITE,
  DEFAULT_DELETE_FILE_WITH_DIR,
  DEFAULT_ENCODING,
  DEFAULT_AUTO_STORE_TIME,
} from '@/mock/consts'

const SET_IMG_OVERWRITE = 'SET_IMG_OVERWRITE'
const SET_DELE_ALL_FILE = 'SET_DELE_ALL_FILE'
const SET_ENCODING = 'SET_ENCODING'
const SET_AUTO_SAVE = 'SET_AUTO_SAVE'

export const advance = {
  namespaced: true,
  state: {
    img_overwrite: DEFAULT_IMG_OVERWRITE,
    deleAll_file_dir: DEFAULT_DELETE_FILE_WITH_DIR,
    encoding: DEFAULT_ENCODING,
    auto_save: DEFAULT_AUTO_STORE_TIME,
  },
  mutations: {
    [SET_IMG_OVERWRITE](state, val) {
      state.img_overwrite = val
    },
    [SET_DELE_ALL_FILE](state, val) {
      state.deleAll_file_dir = val
    },
    [SET_ENCODING](state, val) {
      state.encoding = val
    },
    [SET_AUTO_SAVE](state, val) {
      state.auto_save = val
    },
  },
  actions: {
    setImgOverwrite({ commit }, val) {
      commit(SET_IMG_OVERWRITE, val)
    },
    setDeleAllFile({ commit }, val) {
      commit(SET_DELE_ALL_FILE, val)
    },
    setEncoding({ commit }, val) {
      commit(SET_ENCODING, val)
    },
    setAutoSave({ commit }, val) {
      commit(SET_AUTO_SAVE, val)
    },
  },
}
