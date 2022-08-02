<template lang="pug">
el-config-provider(:locale="locale")
  router-view
</template>

<script>
import locale from 'element-plus/lib/locale/lang/zh-tw'
import router from '@/router'

export default {
  name: 'App',
  components: {},
  setup() {
    const access_token = router.currentRoute.value.query.access_token
    if (access_token) {
      localStorage.setItem('access_token', access_token)
    }
    return { locale }
  },
}
</script>
