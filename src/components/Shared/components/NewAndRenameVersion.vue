<template lang="pug">
#NewAndRenameVersion
  el-dialog(
    custom-class="md-newversion-dialog"
    v-model="store.state.panels.openAddVersion.open"
    :title="versionData === '' ? '新增版本' : '重新命名'"
    @close="closePanel"
    @closed="clearForm"
    width="25%"
  )
    el-form.lana-form(:model="formData")
      el-form-item
        el-input( 
          v-model="formData.folder_path" 
          placeholder="請輸入名稱" 
          size="small"
        )
    .btns
      el-button(
        type="primary" plain icon="el-icon-check" size="small"   
        @click="SaveDir"
      ) 儲存
      el-button(
        type="danger" plain icon="el-icon-minus" size="small"  
        @click="closePanel"
      ) 取消

</template>

<script>
import { defineComponent, ref, watch, computed } from 'vue'
import { useStore } from 'vuex'
import versionApi from '@api/version'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'NewAndRenameVersion',
  emits: ['reload'],
  setup(props, { emit }) {
    const store = useStore()
    const versionData = computed(() => store.state.panels.openAddVersion.data)
    const formData = ref({
      folder_path: '',
    })

    const ReformData = ref({
      old_folder_path: '',
      new_folder_path: '',
    })

    const SaveDir = async () => {
      let api = versionApi.AddVersion
      var type = 'success'
      var msg = '新增成功'
      var name = formData.value.folder_path
      formData.value.folder_path = 'data/markdown/' + formData.value.folder_path
      var data = Object.assign({}, formData.value)

      if (versionData.value !== '') {
        api = versionApi.RenameVersion
        ReformData.value.old_folder_path = 'data/markdown/' + versionData.value
        ReformData.value.new_folder_path = formData.value.folder_path
        data = Object.assign({}, ReformData.value)
      }

      await api(data)
        .then(() => {
          ElMessage({
            type: type,
            message: msg,
          })
          emit('reload', name)
          closePanel() // 關掉編輯視窗
        })
        .catch(() => {
          clearForm() //清空表單
        })
    }

    const closePanel = () => {
      clearForm() //清空表單
      store.commit('panels/setOpenVersion', { open: false, data: '' })
    }

    const clearForm = () => {
      formData.value.folder_path = ''
    }

    //watch
    watch(
      versionData,
      (nV) => {
        if (nV !== '') {
          formData.value.folder_path = nV
        }
      },
      {
        immediate: true,
      }
    )

    return {
      store,
      closePanel,
      formData,
      clearForm,
      SaveDir,
      versionData,
    }
  },
})
</script>

<style lang="sass" scoped>
:deep(.md-newversion-dialog)
  margin-top: 30vh !important
  margin: auto
  .btns
    margin: 1rem 0
    display: flex
    justify-content: center

  .el-input__inner
    text-align: center
</style>
