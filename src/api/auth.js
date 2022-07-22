import http from '@api/http'
import axios from 'axios'
import { assemblyParams } from '@/utils'
export default {
  autoRefresh() {
    const data = {
      access_token: localStorage.getItem('access_token'),
    }
    return http({
      url: `/esmanageapi/auth/auto_refresh/`,
      method: 'post',
      data,
    })
  },
  jwtCheck(token) {
    return http({
      url: `/esmanageapi/auth/jwt_auth/${token}/`,
      method: 'get',
    })
  },
  login(data) {
    return http({
      url: '/esmanageapi/auth/login/',
      method: 'post',
      data,
    })
  },
  outerLogin(data) {
    return axios({
      method: 'post',
      url: '/esmanageapi/auth/login/',
      data,
    })
  },
  logout() {
    return http({
      url: 'esmanageapi/auth/logout/',
      method: 'post',
    })
  },
  refreshToken() {
    return http({
      url: '/esmanageapi/auth/refresh_token/',
      method: 'post',
      headers: {
        withOutAuthorization: true,
      },
    })
  },
  getLogList(params) {
    const queryString = params ? `?${assemblyParams(params)}` : ''
    return http({
      url: `/esmanageapi/access-logs/${queryString}`,
      method: 'get',
    })
  },
}
