<template lang="pug">
el-form(
  :model="formData"
  ref="loginForm"
  :rules="formRules"
  hide-required-asterisk
)
  el-form-item(
    prop="username"
    label="Account"
  )
    el-input(
      v-model="formData.username"
      type="text"
      @keyup.native.enter="checkValidate"
      placeholder="請填入帳號"
    )
  el-form-item(
    label="Password"
    prop="password"
  )
    el-input(
      v-model="formData.password"
      type="password"
      @keyup.native.enter="checkValidate"
      placeholder="請填入密碼"
    )
  el-button.btn-12( 
    type="success" 
    :disabled="loading"
    @click="checkValidate"
  ) 
    span 
      i.el-icon-loading(v-if="loading")
      | Welcome
    span 
      i.el-icon-loading(v-if="loading")
      | Login 
</template>
<script>
import { reactive, ref, nextTick } from 'vue'
import authApi from '@api/auth'
import router from '@/router'
import { updateLocalStorgeToken } from '@/utils'

export default {
  name: 'LoginForm',
  setup() {
    const loginForm = ref(null)
    const loading = ref(false)
    const formData = reactive({
      username: '',
      password: '',
    })

    const getRules = (formData) => {
      const rule = {}
      Object.keys(formData).forEach((key) => {
        rule[key] = [{ required: true, message: '↑此項必填' }]
      })
      return rule
    }

    const formRules = getRules(formData)

    const checkValidate = () => {
      loginForm.value.validate((valid) => {
        if (valid) {
          submit()
        }
      })
    }
    const submit = async () => {
      loading.value = true
      try {
        const response = await authApi.login(formData)
        if (response.access_token) {
          updateLocalStorgeToken(response)
          await nextTick()
          toHomepage()
        } else {
          alert('無回傳access_token')
        }
      } catch {
        //path
      } finally {
        loading.value = false
      }
    }

    const toHomepage = () => {
      router.push({ path: '/' })
    }

    return {
      loading,
      formData,
      checkValidate,
      loginForm,
      formRules,
    }
  },
}
</script>
<style lang="sass" scoped>
h3
  margin: 0 0 10px
.el-icon-info
  display: inline
  font-weight: normal
  font-style: normal
  margin: 0 0 0 5px
  cursor: pointer
.btn-12
  position: relative
  &:hover span
    &:nth-child(1)
      transform: rotateX(0deg) translate(-50%,-50%)
    &:nth-child(2)
      color: transparent
      transform: rotateX(-90deg) translate(-50%,-50%)
  span
    +size(100%,100%)
    +flex-center
    position: absolute
    top: 50%
    left: 50%
    transition: all .3s
    &:nth-child(1)
      transform: rotateX(90deg) translate(-50%,-50%)
      transform-origin: 0 0 -20px
      z-index: 1
    &:nth-child(2)
      transform: rotateX(0deg) translate(-50%,-50%)
      transform-origin: 0 0 -15px
    .el-icon-loading
      margin: 0 10px 0 0
</style>
