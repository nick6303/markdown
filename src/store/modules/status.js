import { IMG_PATH } from '@/mock/consts'

export const status = {
  namespaced: true,
  state: {
    content_status: '已儲存',
    usedVersion: '',
    ImgURl: '',
  },
  mutations: {
    setStatus(state, NewStatus) {
      state.content_status = NewStatus
    },
    setVersion(state, version) {
      state.usedVersion = version
    },
    setImgURL(state, url) {
      var fullPath = url + IMG_PATH
      state.ImgURl = fullPath
    },
  },
}
