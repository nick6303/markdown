<template lang="pug">
#AdvanceOptions
  el-popover(
    placement="bottom-end"
    title="本檔案設定"
    trigger="click"
    popper-class="md-advance-pop"
    :width="320"
  )
    template(#reference)
      el-button(type="info" icon="el-icon-setting" circle  size="small" )  
    .conent
      .switch
        .key 
          span 加密內文 
          span.note (僅此檔案)
          el-switch(
            v-model="tmp_encode"
            @change="handleEncode"
          )
      .switch
        .key 
          span 覆寫所有檔名相同之圖片
          el-switch(
            v-model="rewrite"
            @change="setImgOverwrite"
          )
      .switch
        .key 
          .top
            span 開啟自動儲存模式 
            span.note (僅限編輯模式)
            el-switch(
              v-model="store.state.advance.auto_save.open"
            )
          .down
            el-input-number.inputer(
              v-if="store.state.advance.auto_save.open"
              v-model="store.state.advance.auto_save.time"
              :step="AUTO_SAVE_TIME_STEP" step-strictly 
              size="small"
              :min="AUTO_SAVE_TIME_MIN"
            )
            span.unit(v-if="store.state.advance.auto_save.open") (單位：秒/s)
</template>

<script>
import { defineComponent, computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { AUTO_SAVE_TIME_MIN, AUTO_SAVE_TIME_STEP } from '@mock/consts'

export default defineComponent({
  name: 'AdvanceOptions',
  props: {
    encodeSwitch: {
      type: Boolean,
    },
    encode: {
      type: Boolean,
    },
  },
  emits: ['close', 'changeEncode'],
  setup(props, { emit }) {
    const store = useStore()
    const propEncode = computed(() => (props.encode ? true : false))
    const tmp_encode = ref(propEncode.value)
    const img_overwrite = computed(() => store.state.advance.img_overwrite)
    const rewrite = ref(img_overwrite.value)

    const setImgOverwrite = (bool) => {
      store.dispatch('advance/setImgOverwrite', bool)
    }

    const handleEncode = (bool) => {
      emit('changeEncode', bool)
    }

    watch(img_overwrite, (bool) => {
      rewrite.value = bool
    })

    watch(propEncode, (bool) => {
      tmp_encode.value = bool
    })

    return {
      store,
      tmp_encode,
      handleEncode,
      AUTO_SAVE_TIME_MIN,
      AUTO_SAVE_TIME_STEP,
      rewrite,
      setImgOverwrite,
    }
  },
})
</script>

<style lang="sass">
.md-advance-pop
  .el-popover__title
    width: 100%
    text-align: center
  .switch
    margin: 1rem .5rem
    .key
      span
        font-weight: 600
      .note
        color: #1890ff
      .unit
        font-weight: 400
        font-size: smaller
    .el-switch
      margin-left: .5rem
    .inputer
      margin: 0 .5rem
</style>
