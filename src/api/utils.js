import http from '@api/http'

export default {
  uploadImg(data) {
    return http({
      url: '/esmanageapi/utils/upload/',
      method: 'post',
      data,
      header: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  uploadAny(data) {
    return http({
      url: '/esmanageapi/utils/upload-any/',
      method: 'post',
      data,
      header: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  uploadExcel(data) {
    return http({
      url: '/esmanageapi/utils/upload-xlxs/',
      method: 'post',
      data,
      header: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}
