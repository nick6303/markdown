<template lang="pug">
#RenameFolder
  el-dialog(
    custom-class="md-renamefolder-dialog"
    v-model="store.state.panels.openRenameFolder"
    @close="Close"
    title="重新命名"
    width="30%"
  )
    .content
      el-input(
        v-model="formData.new_name" placeholder="請輸入名稱" size="small"  
      )
      .btns
        el-button(
          type="primary" plain icon="el-icon-check" size="small"   
          @click="Run"
        ) 儲存
        el-button(
          type="danger" plain icon="el-icon-minus" size="small"  
          @click="Close"
        ) 取消

</template>

<script>
import { defineComponent, computed, ref, watch } from 'vue'
import mdapi from '@api/file'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'RenameFolder',
  emits: ['reload'],
  setup(props, { emit }) {
    const store = useStore()
    const select = computed(() => store.state.file.recentFolder)
    const formData = ref({
      new_name: '',
    })

    const Run = async () => {
      await mdapi.Rename(formData.value, select.value.id).then((res) => {
        ElMessage({
          type: 'success',
          message: '更新成功',
        })
        res.type = 'directory'
        res.name = formData.value.new_name
        emit('reload', { reloadtype: 'renameFolder', res: res })
      })
      Close()
    }

    const Close = () => {
      formData.value.new_name = ''
      store.commit('panels/setOpenRenameFolder', false)
    }

    watch(
      () => store.state.file.recentFolder,
      (nV) => {
        formData.value.new_name = nV.name
      },
      {
        immediate: true,
      }
    )

    return {
      Close,
      Run,
      select,
      store,
      formData,
    }
  },
})
</script>

<style lang="sass" scoped>
#RenameFolder
  :deep(.md-renamefolder-dialog)
    .content
      .btns
        display: flex
        justify-content: center
        margin-top: 1rem
    .el-input__inner
      text-align: center
</style>
