<template lang="pug">
#Helper
  el-popover(
    placement="bottom-end"
    title="MarkDown語法教學"
    trigger="hover"
    popper-class="md-helper-pop"
  )
    template(#reference)
      el-button(type="warning" circle  size="small")  ？
    template(#default)
      el-tabs(
        v-model="activeName"
        type="card"
      )
        el-tab-pane(label="MarkDown 基本語法" name="1") 
          Basic
        el-tab-pane(label="編輯器擴充語法" name="2") 
          Advance
</template>

<script>
import { defineComponent, ref } from 'vue'
import Basic from './Basic.vue'
import Advance from './Advance.vue'
export default defineComponent({
  name: 'Helper',
  components: {
    Basic,
    Advance,
  },
  setup() {
    const activeName = ref('1')

    return { activeName }
  },
})
</script>

<style lang="sass" scoped>
#Helper
  margin-left: .5rem
</style>
