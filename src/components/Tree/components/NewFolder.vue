<template lang="pug">
#NewFolder
  el-dialog(
    custom-class="md-newfolder-dialog"
    v-model="store.state.panels.openAddFolder"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="closePanel"
    @close="closePanel"
    @closed="clearForm"
  )
    template(#title)
      span() 新增資料夾
    .form
      el-form.md-newfloder-form(:model="formData" )
        .item
          #prefix(:class="validStyle")
            span 所屬目錄
          el-form-item( prop="parentId" :class="validStyle")
            el-cascader(
              :options="DirObj" 
              :props="cascaderSetting"  
              :show-all-levels="false"
              size="small" 
              v-model="formData.parentId" 
              filterable
            )
          span#warn(v-if="validStyle == 'notok'") ←必填
        .item
          #prefix()
            span 資料夾名稱
          el-form-item
            el-input( v-model="formData.foldername" placeholder="請輸入名稱" size="small")
    .btns
      el-button(
        type="primary" plain icon="el-icon-check" size="small"   
        @click="checkValidate"
      ) 儲存
      el-button(
        type="danger" plain icon="el-icon-minus" size="small"  
        @click="closePanel"
      ) 取消

</template>

<script>
import { defineComponent, watch, ref } from 'vue'
import { useStore } from 'vuex'
import folderapi from '@api/folder'
import { ElMessage } from 'element-plus'
import { DirObj } from '@/utils/hooks'
//components

export default defineComponent({
  name: 'NewFolder',
  emits: ['reload'],
  setup(props, { emit }) {
    const store = useStore()
    const validStyle = ref('ok')
    const runRename = ref(false)
    const encode = ref(false)
    const rename = ref([''])
    const formData = ref({
      foldername: '',
      parentId: 0,
    })

    const cascaderSetting = {
      checkStrictly: true,
      value: 'id',
      label: 'name',
    }

    const SaveDir = async () => {
      let api = folderapi.AddFolder
      var id = formData.value.parentId
      //因為el-cascader會聯集成一組Object, 要取最後一個id(被選中那個)
      var len = Object.keys(id).length
      if (len > 1) id = id[len - 1]
      await api(formData.value, id).then((res) => {
        ElMessage({
          type: 'success',
          message: '新增成功',
        })
        res.type = 'directory'
        res.name = formData.value.foldername

        closePanel() // 關掉編輯視窗
        emit('reload', { reloadtype: 'addFolder', res: res })
      })
    }

    const closePanel = () => {
      clearForm() //清空表單
      store.commit('panels/setOpenAddFolder', false)
    }

    const Validater = () => {
      if (!formData.value.parentId) return false
      return true
    }

    const checkValidate = () => {
      var valid = Validater()
      if (valid) {
        SaveDir()
      } else {
        validStyle.value = 'notok'
      }
    }

    const clearForm = () => {
      formData.value.foldername = ''
      validStyle.value = ''
    }

    //發現點擊其他目錄時(目錄有異動)
    watch(
      () => store.state.file.recentFolder,
      (nV) => {
        if (nV.type == 'file') {
          rename.value = nV
          //
          if (store.state.panels.openEditor.editORadd == 'add') {
            encode.value = store.state.advance.encoding
          } else {
            if (nV.encoding) encode.value = nV.encoding
          }
        }
      },
      {
        immediate: true,
      }
    )

    //更動表單的parent
    watch(
      () => store.state.file.recentClick.fileParent,
      (nV) => {
        formData.value.parentId = nV
      },
      {
        immediate: true,
      }
    )

    return {
      store,
      validStyle,
      closePanel,
      formData,
      cascaderSetting,
      checkValidate,
      clearForm,
      DirObj,
      SaveDir,
      rename,
      runRename,
      encode,
    }
  },
})
</script>

<style lang="sass" scoped>
#NewFolder
  :deep(.md-newfolder-dialog)
    margin-top: 15% !important
    width: 30% !important
    height: 30% !important
    margin: auto
    .el-dialog__header
      display: flex
      justify-content: space-between
    .el-dialog__body
      height: 90%
      padding: .5rem 1rem
  :deep(.md-newfloder-form)
    display: flex
    flex-direction: column
    margin-right: 1rem
    .el-form-item
      margin-bottom: 0px
      flex-direction: column
      align-items: flex-start
      margin-right: 0.2rem
    .el-form-item__label
      line-height: 0
      margin: .1rem .1rem
    .el-form-item__content
      display: flex

    .el-input__inner
      text-align: center
  .item
    display: flex
    width: 100%
    height: 20%
    margin: .5rem 0
    justify-content: center
  #prefix
    background: #f5f7fa
    width: 30%
    border: 1px solid #dcdfe6
    display: flex
    justify-content: center
    align-items: center
    position: relative
    right: -3px
    z-index: 2
    span
      color: #909399
      font-size: 13px
  #warn
    font-size: .5rem
    color: red
    width: 10%
    display: flex
    align-items: center
  .notok
    border-bottom: 1px solid red
  .btns
    display: flex
    justify-content: center
    margin: 1rem 0
    align-items: center
</style>
