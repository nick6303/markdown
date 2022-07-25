<template lang="pug">
#BreadCrumb(:class="bread.length === 0 ? 'no' : 'breadTag'")
  el-breadcrumb(separator="/")
    el-breadcrumb-item(
      v-for="item in bread" 
      :key="item"
    ) 
      span.inner {{item}}
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'BreadCrumb',
  setup() {
    const store = useStore()
    const bread = computed(() => {
      var list = store.state.file.BreadCurmb
      list = list.slice(3)
      return list
    })
    return {
      bread,
    }
  },
})
</script>

<style lang="sass" scoped>
#BreadCrumb
  height: 100%
  width: fit-content
  max-width: 90%
  display: flex
  align-items: center
  padding: 0 20px
  .inner
    color: #4d4d4d
  :deep(.el-breadcrumb)
    font-size: 16px
    .el-breadcrumb__separator
      color: #b3b3b3
  &.breadTag
    border-radius: 10px 10px 0 0
    box-shadow: 3px 0 3px #9d9d9d
    background: var(--tree_BG)
</style>
