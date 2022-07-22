import http from '@api/http'
import { removeEmpty } from '@/utils'

export default {
  //File (.md)
  GetFile(file_id) {
    //get 單一資料(md)
    return http({
      url: `/mdapi/api/markdown/file/${file_id}`,
      method: 'get',
    })
  },
  UpdateFile(data, file_id, encoding) {
    //get 單一資料(md)
    var encode = encoding ? 1 : 0
    return http({
      url: `/mdapi/api/markdown/file/md/${file_id}?encoding=${encode}`,
      method: 'patch',
      data: removeEmpty(data),
    })
  },
  AddFile(data, catlog_id, encoding) {
    //get 單一資料(md)
    var encode = encoding ? 1 : 0
    return http({
      url: `/mdapi/api/markdown/file/md/${catlog_id}?encoding=${encode}`,
      method: 'post',
      data: removeEmpty(data),
    })
  },
  DeleFile(id) {
    //get 單一資料(md)
    return http({
      url: `/mdapi/api/markdown/file/md&img/${id}`,
      method: 'delete',
    })
  },
  DownloadFile(id) {
    //get 單一資料(md)
    return http({
      url: `/mdapi/api/markdown/file/md&img/${id}`,
      method: 'get',
      // header: {
      //   'Content-Type': 'multipart/form-data',
      // },
    })
  },
  Rename(data, id) {
    //get 單一資料(md)
    return http({
      url: `/mdapi/api/markdown/rename/${id}`,
      method: 'post',
      data: removeEmpty(data),
    })
  },
  //
  GetFileId(path) {
    return http({
      url: `/mdapi/api/markdown/check/name?name=${path}`,
      method: 'get',
    })
  },
  GetFilePath(id) {
    return http({
      url: `/mdapi/api/markdown/check/id?id=${id}`,
      method: 'get',
    })
  },
}
