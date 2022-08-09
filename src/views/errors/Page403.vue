<template lang="pug">
main.errorpage
  h1 403
  .text
    h4 Oops! 
    p 無瀏覽頁面權限。
    router-link.icon-arrow-thin-left(to="/login") 回登入頁
</template>

<script>
import { onMounted } from 'vue'
export default {
  name: 'Page403',
  setup() {
    onMounted(() => {
      localStorage.clear()
    })
    return {}
  },
}
</script>
