<template lang="pug">
#Editor 
  el-dialog(
    custom-class='md-editor-dialog'
    v-model="open"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="noSave"
    @closed="handleClosed"
  )
    template(#title)
      FilenameNTag(
        :loading="statusLoading"
        :run="runRename"
        @renameOver="runRename = false"
        @emitRolad="emitReload"
      )
      .right
        el-form(
          v-if="editORadd === 'add'"
          :model="formData"
          hide-required-asterisk
        )
          el-form-item(
            label="所屬目錄" 
            prop="parentId" 
            :class="validStyle" 
            :rules="[{ required: true, message: '必填'}]"
          )
            el-cascader(
              :options="DirObj"
              :props="cascaderSetting"
              :show-all-levels="false"
              size="small"
              v-model="formData.parentId"
              filterable
            )
              template(#append) .md
          el-form-item
            el-input( 
              v-model="formData.filename"
              placeholder="請輸入檔名" 
              size="small"
            )
              template(#append) .md
        .popouts
          AdvanceOptions(
            :encode="encode" 
            @changeEncode="changeEncode"
          )
          Helper
        el-button(
          type="primary" plain 
          icon="el-icon-check" 
          size="small"   
          @click="checkValidate"
        ) 儲存
        el-button(
          type="danger" plain 
          icon="el-icon-minus" 
          size="small"  
          @click="noSave"
        ) 取消
    
    Previewer(
      mode="editable" 
      :cancleEdit="cancleEdit" 
      @clearOver="cancleEdit = false"
    )

</template>

<script>
import { defineComponent, watch, ref, onBeforeUnmount, computed } from 'vue'
import { useStore } from 'vuex'
import mdapi from '@api/file'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ImgProcessor, DirObj } from '@/utils/hooks'

import FilenameNTag from './components/FilenameNTag.vue'
import Helper from './components/Helper.vue'
import AdvanceOptions from './components/AdvanceOptions.vue'

import Previewer from '@c/Previewer'

export default defineComponent({
  name: 'DialogEditor',
  components: {
    FilenameNTag,
    Previewer,
    Helper,
    AdvanceOptions,
  },
  emits: ['reload'],
  setup(props, { emit }) {
    const store = useStore()
    const editORadd = computed(() => store.state.panels.openEditor.editORadd)
    const open = computed(() => store.state.panels.openEditor.open)

    const validStyle = ref('ok')
    const runRename = ref(false)
    const encode = ref(false)
    const cancleEdit = ref(false)
    const statusLoading = ref(false)
    let timer = null

    const formData = ref({
      filename: '',
      parentId: 0,
      content: '',
    })

    const folderData = ref({
      foldername: '',
    })
    const cascaderSetting = {
      checkStrictly: true,
      value: 'id',
      label: 'name',
    }

    //有更動/新增但未儲存就點取消/X
    const noSave = () => {
      const ifSave =
        store.state.status.content_status === '已儲存' ? false : true
      if (ifSave) {
        ElMessageBox.confirm(
          '確定不儲存此次編輯?這將會取消所有更動',
          '更動尚未儲存',
          {
            confirmButtonText: '確認',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
          .then(() => {
            //確定
            ElMessage({
              message: '取消儲存',
            })
            closePanel()
            cancleEdit.value = true
          })
          .catch(() => {
            //取消
          })
      } else {
        closePanel()
      }
    }

    const closePanel = () => {
      store.commit('panels/setOpenEditor', { open: false, editORadd: 'edit' }) //改為Edit Preview會讀回原本的md content
    }

    const Save = async () => {
      formData.value.content = await ImgProcessor(
        store.state.file.editingFile,
        'removeHttp'
      )
      //編輯
      let msg = '更新成功'
      let api = mdapi.UpdateFile
      let id = store.state.file.recentFile.id
      let encoding = encode.value
      //新增
      if (editORadd.value === 'add') {
        msg = '新增成功'
        api = mdapi.AddFile
        id = formData.value.parentId
        formData.value.filename += '.md' //後綴
        //因為el-cascader會聯集成一組Object, 要取最後一個id(被選中那個)
        const len = Object.keys(id).length
        if (len > 1) id = id[len - 1]
      }
      await api(formData.value, id, encoding).then((res) => {
        ElMessage({
          type: 'success',
          message: msg,
        })
        let reloadtype
        let resData
        if (editORadd.value === 'add') {
          resData = res
          resData.name = formData.value.filename
          resData.type = 'file'
          reloadtype = 'addFile'
        } else {
          reloadtype = 'editFile'
          resData = store.state.file.recentFile
        }

        emit('reload', { reloadtype: reloadtype, res: resData })
        closePanel()
        clearForm() //清空表單
      })
    }

    const Validater = () => {
      if (!formData.value.parentId) return false
      return true
    }

    const checkValidate = () => {
      const valid = Validater()
      if (valid) {
        validStyle.value = 'ok'
        Save()
        runRename.value = true
      } else {
        validStyle.value = 'notok'
      }
    }

    const handleClosed = () => {
      clearForm()
      closePanel()
      clearInterval()
    }

    const clearForm = () => {
      formData.value.filename = ''
      formData.value.content = ''
      folderData.value.foldername = ''
      validStyle.value = ''
    }

    const emitReload = (obj) => {
      emit('reload', obj)
    }

    const changeEncode = (val) => {
      encode.value = val
    }

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

    //發現點擊其他目錄時(目錄有異動)
    watch(
      editORadd,
      (nV) => {
        if (nV === 'add') {
          encode.value = store.state.advance.encoding
        } else {
          encode.value = store.state.file.recentFile.encoding
        }
      },
      {
        immediate: true,
      }
    )

    //自動儲存
    const autoSave = async () => {
      if (store.state.advance.auto_save.open) {
        timer = setInterval(async () => {
          if (editORadd.value === 'edit' && open.value) {
            formData.value.content = await ImgProcessor(
              store.state.file.editingFile,
              'removeHttp'
            )
            let id = store.state.file.recentFile.id
            let encoding = encode.value

            statusLoading.value = true
            await mdapi.UpdateFile(formData.value, id, encoding).then(() => {
              const reloadtype = 'editFile'
              const resData = store.state.file.recentFile
              emit('reload', { reloadtype, res: resData })
            })
            statusLoading.value = false
          }
        }, store.state.advance.auto_save.time * 1000)
      }
    }

    const restartTimer = async () => {
      clearInterval(timer)
      autoSave()
    }

    watch(
      () => store.state.file.recentFile.content,
      () => {
        if (editORadd.value === 'add') {
          encode.value = store.state.advance.encoding ? true : false
        } else {
          encode.value = store.state.file.recentFile.encoding ? true : false
        }
      },
      {
        immediate: true,
      }
    )

    watch(
      () => store.state.advance.auto_save,
      (nV) => {
        clearInterval(timer)
        if (nV.open && open.value) restartTimer()
        if (!nV.open) {
          clearInterval(timer)
        }
      },
      {
        immediate: true,
        deep: true,
      }
    )

    watch(
      open,
      (nV) => {
        //打開頁面發現有設定自動儲存的話
        if (nV && store.state.advance.auto_save.open) {
          restartTimer(timer)
        }
      },
      {
        immediate: true,
        deep: true,
      }
    )

    //離開頁面時關掉
    onBeforeUnmount(() => {
      clearInterval(timer)
    })

    return {
      store,
      Save,
      validStyle,
      noSave,
      formData,
      cascaderSetting,
      checkValidate,
      handleClosed,
      DirObj,
      emitReload,
      runRename,
      encode,
      cancleEdit,
      closePanel,
      statusLoading,
      changeEncode,
      editORadd,
      open,
    }
  },
})
</script>

<style lang="sass" scoped>

#Editor
  display: flex
  justify-content: space-between
  :deep(.md-editor-dialog)
    margin-top: 3vh !important
    width: 93% !important
    height: 95% !important
    margin: auto
    box-shadow: 0 0 8px 8px #0000004d
    .el-dialog__header
      display: flex
      justify-content: space-between
    .el-dialog__body
      height: 90%
      padding: .5rem 1rem
  .right
    margin-right: 2%
    display: flex
    align-items: center
    :deep(.el-form)
      display: flex
      margin-right: 1rem
      .el-form-item
        margin-bottom: 0px
        display: flex
        align-items: center
        margin-right: 3px
        &__label
          background: #f5f7fa
          border: 1px solid #dcdfe6
          border-right: none
          padding: 0 1em
          +flex-center
          color: #909399
          line-height: normal
          height: 100%
          border-top-left-radius: 3px
          border-bottom-left-radius: 3px
        &__content
          line-height: normal
          .el-cascader .el-input__inner
            border-top-left-radius: 0
            border-bottom-left-radius: 0
    .popouts
      display: flex
      margin-right: 1em
  #warn
    font-size: .5rem
    color: red
    width: 10%
    display: flex
    align-items: center
  .notok
    border-bottom: 1px solid red
</style>
