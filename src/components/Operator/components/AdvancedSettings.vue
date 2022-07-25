<template lang="pug">
#AdvancedSettings
  el-dialog(
    v-model="open"
    @close="closeDialog"
    title="進階設定"
    center 
    width="35%"
  )
    .switch
      .key 
        span 加密內文
        el-switch(
          v-model="encoding"
          @change="setEncoding"
        )
    .switch
      .key 
        span 覆寫所有檔名相同之圖片
        el-switch(
          v-model="img_overwrite"
          @change="setImgOverwrite"
        )
    .switch
      .key 
        span 可刪除非空資料夾 
        span#note (連同底下檔案一併刪除)
        el-switch(
          v-model="deleAll_file_dir"
          @change="setDeleAllFile"
        )
    .switch
      .key 
        span 開啟自動儲存模式 
        span#note (僅限編輯模式)
        el-switch(
          v-model="auto_save.open"
          @change="setAutoSave({open:$event,time:auto_save.time})"
        )
        el-input-number.inputer(
          v-if="auto_save.open"
          v-model="auto_save.time"
          @change="setAutoSave({open:auto_save.open,time:$event})"
          :step="AUTO_SAVE_TIME_STEP" step-strictly 
          size="small"
          :min="AUTO_SAVE_TIME_MIN"
        )
        span#unit(v-if="auto_save.open") (單位：秒/s)
</template>

<script>
import { defineComponent, ref, reactive } from 'vue'
import { useStore } from 'vuex'
import {
  AUTO_SAVE_TIME_MIN,
  AUTO_SAVE_TIME_STEP,
  DEFAULT_IMG_OVERWRITE,
  DEFAULT_DELETE_FILE_WITH_DIR,
  DEFAULT_ENCODING,
  DEFAULT_AUTO_STORE_TIME,
} from '@mock/consts'

export default defineComponent({
  name: 'DialogAdvancedSettings',
  emits: ['close'],
  setup() {
    const store = useStore()
    const open = ref(false)
    const auto_switch = ref(false)
    const encoding = ref(DEFAULT_ENCODING)
    const img_overwrite = ref(DEFAULT_IMG_OVERWRITE)
    const deleAll_file_dir = ref(DEFAULT_DELETE_FILE_WITH_DIR)
    const auto_save = reactive(DEFAULT_AUTO_STORE_TIME)

    const closeDialog = () => {
      open.value = false
    }

    const openDialog = () => {
      open.value = true
    }

    const setImgOverwrite = (val) => {
      store.dispatch('advance/setImgOverwrite', val)
    }

    const setDeleAllFile = (val) => {
      store.dispatch('advance/setDeleAllFile', val)
    }

    const setEncoding = (val) => {
      store.dispatch('advance/setEncoding', val)
    }

    const setAutoSave = (val) => {
      store.dispatch('advance/setAutoSave', val)
    }

    return {
      closeDialog,
      store,
      auto_switch,
      AUTO_SAVE_TIME_MIN,
      AUTO_SAVE_TIME_STEP,
      encoding,
      img_overwrite,
      deleAll_file_dir,
      auto_save,
      setImgOverwrite,
      setDeleAllFile,
      setEncoding,
      setAutoSave,
      openDialog,
      open,
    }
  },
})
</script>

<style lang="sass" scoped>
#AdvancedSettings
  .switch
    margin: 1rem .5rem
    .key
      span
        font-weight: 600
      #note
        color: #1890ff
      #unit
        font-weight: 400
        font-size: smaller
    .el-switch
      margin-left: .5rem
    :deep(.inputer)
      margin: 0 .5rem
</style>
