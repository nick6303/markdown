import http from '@api/http'
import { removeEmpty } from '@/utils'
import store from '@/store'

export default {
  AddFolder(data, catlog_id) {
    //get 單一資料(md)
    return http({
      url: `/mdapi/api/markdown/folder/${catlog_id}`,
      method: 'post',
      data: removeEmpty(data),
    })
  },
  DeleFolder(id) {
    //get 單一資料(md)
    var mandatory = store.state.advance.deleAll_file_dir ? 1 : 0
    return http({
      url: `/mdapi/api/markdown/folder/${id}?mandatory=${mandatory}`,
      method: 'delete',
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
  Move(data) {
    //get 單一資料(md)
    return http({
      url: `/mdapi/api/markdown/move`,
      method: 'post',
      data: removeEmpty(data),
    })
  },
}
