import http from '@api/http'

export default {
  //Image
  AddVersion(data) {
    //get 單一資料(md)
    return http({
      url: `/mdapi/api/utils/folder`,
      method: 'post',
      data,
    })
  },
  DeleVersion(data) {
    return http({
      url: `/mdapi/api/utils/folder`,
      method: 'delete',
      data,
    })
  },
  RenameVersion(data) {
    return http({
      url: `/mdapi/api/utils/folder`,
      method: 'patch',
      data,
    })
  },
}
