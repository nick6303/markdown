<template lang="pug">
main
  article.login-box
    .login-logo
      a(href="")
        img(src="" alt="")
    .login-slogan
      img(src="", alt="")
    LoginForm
</template>

<script>
import LoginForm from '@v/login/components/LoginForm.vue'

export default {
  name: 'Login',
  components: {
    LoginForm,
  },
  setup() {},
}
</script>

<style lang="sass" scoped>
main
  min-height: 100vh
  background-size: cover
  background-position: center
  +flex-center
  flex-direction: column
  .login-box
    width: 360px
    .login-logo
      margin-bottom: 3rem
      img
        margin: auto
    .login-slogan
      padding: 0 10px
      margin-bottom: 3rem
      +flex-center
      img
        width: 70%
  :deep(.el-form-item)
    display: flex
    align-items: center
    background-color: rgba(224, 224, 224, 0.2)
    height: 40px
    border-radius: 0.25rem
    border: 1px solid #d8dbe0
    .el-form-item__label
      padding: 0.375rem 0.75rem
      font-size: 0.875rem
      color: #00BFA5
      width: 90px
      letter-spacing: 0
      text-align: left
    .el-form-item__content
      flex: 1
    .el-form-item__error
      padding: 4px 15px 0
    .el-select
      width: 100%
      border-left: 1px solid #d8dbe0
    .el-input__inner
      background-color: transparent
      border: none
  :deep(.btn-12)
    +size(100%,35px)
    background-color: #00796B
    border: 1px solid rgb(50, 31, 219)
</style>
