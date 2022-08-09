<template lang="pug">
el-config-provider(:locale="locale")
  router-view
</template>

<script>
import locale from 'element-plus/lib/locale/lang/zh-tw'
import router from '@/router'
import { computed, onBeforeMount, watch } from '@vue/runtime-core'

export default {
  name: 'App',
  components: {},
  setup() {
    const access_token = computed(
      () => router.currentRoute.value.query.access_token
    )

    const setToken = (val) => {
      if (val) {
        localStorage.setItem('access_token', val)
      }
    }

    watch(access_token, (val) => {
      setToken(val)
    })

    onBeforeMount(() => {
      setToken(access_token.value)
    })

    return { locale }
  },
}
</script>
