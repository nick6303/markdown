<template lang="pug">
el-config-provider(:locale="locale")
  router-view
</template>

<script>
import locale from 'element-plus/lib/locale/lang/zh-tw'

export default {
  name: 'App',
  components: {},
  setup() {
    return { locale }
  },
}
</script>

<style lang="sass">
#app
  font-family: Avenir, Helvetica, Arial, sans-serif
  text-align: center
  color: #2c3e50
  margin-top: 60px
</style>
