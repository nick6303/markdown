import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { refreshToken } from '@/utils'

const http = axios.create({
  baseURL: window.location.origin,
})

axios.defaults.withCredentials = true

http.interceptors.request.use(
  (config) => {
    const access_token = localStorage.getItem('access_token')
    const csrftoken = localStorage.getItem('csrftoken')
    if (
      access_token &&
      access_token !== '' &&
      !config.headers.withOutAuthorization
    ) {
      config.headers['Authorization'] = 'Basic ' + access_token
    }
    if (csrftoken && csrftoken !== '') {
      config.headers['x-csrftoken'] = csrftoken
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

http.interceptors.response.use(
  (response) => {
    const hasDisposition = response.request.getResponseHeader(
      'Content-Disposition'
    )
    if (hasDisposition && hasDisposition.indexOf("utf-8''") > -1) {
      const data = response.data
      data.fileName = decodeURIComponent(
        hasDisposition.split("utf-8''")[1].split('.')[0]
      )
      return data
    }
    return response.data
  },
  async (error) => {
    const { response } = error
    let withouterrormsg = response.config.headers['without-error-msg']
    let originalRequest
    const errorMsg = {
      message: response.data.detail,
      type: 'error',
      duration: 3000,
      showClose: true,
    }
    const isLiginPage = router.currentRoute.value.path === '/login'
    const parten401 = /access_token_invalid|access token is expired/

    switch (response.status) {
      case 304: // API:refreshtoken 甚麼都不做
        return false
      case 400:
        errorMsg.message = JSON.stringify(response.data)
        break
      case 401: // token 過期
        if (parten401.test(errorMsg.message)) {
          originalRequest = error.config
          const refresh = await refreshToken()
          if (refresh) {
            const access_token = localStorage.getItem('access_token')
            const csrftoken = localStorage.getItem('csrftoken')
            originalRequest.headers = {
              Authorization: 'Basic ' + access_token,
              'x-csrftoken': csrftoken,
            }
            const newRes = await axios(originalRequest)

            return newRes.data
          } else {
            withouterrormsg = true
          }
        }

        localStorage.clear()
        router.push({ path: '/login' })

        if (isLiginPage) {
          errorMsg.message = '帳號/密碼輸入錯誤'
        }
        break
      case 403:
        localStorage.clear()
        router.push({ path: '/login' })
        break
      case 429: // 429 too many request dont trigger error message
        errorMsg.duration = 0
        errorMsg.showClose = true
        break

      default:
        break
    }

    if (!withouterrormsg && errorMsg.message) {
      ElMessage(errorMsg)
    }
    const parse = JSON.stringify({ status: response.status })
    return Promise.reject(new Error(parse), response)
  }
)
export default http
