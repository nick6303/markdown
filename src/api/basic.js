import http from '@api/http'
import store from '@/store'

export default {
  //Image
  UploadImg(data) {
    //get 單一資料(md)
    var rewrite = store.state.advance.img_overwrite ? 1 : 0
    return http({
      url: `/mdapi/api/markdown/file/img/?rewrite=${rewrite}`,
      method: 'post',
      data,
      // header: {
      //   'Content-Type': 'multipart/form-data',
      // },
    })
  },
  GetVersion() {
    return http({
      url: '/mdapi/api/markdown/',
      method: 'get',
    })
  },
  initFile() {
    //initial
    const usedVersion = store.state.status.usedVersion
    return http({
      url: `/mdapi/api/markdown/${usedVersion}`,
      method: 'get',
    })
  },
  GetStruct() {
    return http({
      url: '/mdapi/api/markdown/file/',
      method: 'get',
    })
  },
  GetTitle(index) {
    return http({
      url: `/mdapi/api/markdown/title?index=${index}`,
      method: 'get',
    })
  },
}
