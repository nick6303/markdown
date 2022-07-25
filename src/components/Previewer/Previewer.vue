<template lang="pug">
#Previewer(
  v-loading="view_load"
  @click="outer(1, $event)" 
  @mouseover="mouseover(1, $event)"
)
  v-md-editor(
    v-model="content" 
    height="100%"
    :left-toolbar="EDITOR_TOOLBAR_OPTIONS" 
    :disabled-menus="[]"
    :mode="mode"
    :toolbar="toolbar"
    @upload-image="handleUploadImage"
  )
.imgWrapper(
  v-if="ImgPath !== ''" 
  @click="outer(2, $event)" 
  @mouseover="mouseover(2, $event)"
)
  i.el-icon-close(@click="closeImg") 
  img(:src="ImgPath")
</template>

<script>
import { defineComponent, ref, watch, reactive, computed } from 'vue'
import { EDITOR_TOOLBAR_OPTIONS } from '@mock/consts'
import basicapi from '@api/basic'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'
import { compare } from '@/utils/hooks'
import VMdEditor from '@c/VMdEditor/VMdEditor'

export default defineComponent({
  name: 'Previewer',
  components: {
    VMdEditor,
  },
  props: {
    mode: {
      type: String,
      default: 'preview',
    },
    cancleEdit: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['clearOver'],
  setup(props, { emit }) {
    const store = useStore()
    const content = ref('')
    const ImgPath = ref('')
    const view_load = computed(() => store.state.loading.view_load)
    const rewrite = computed(() => (store.state.advance.img_overwrite ? 1 : 0))
    const toolbar = ref({
      breakLine: {
        title: '編排工具',
        icon: 'el-icon-orange',
        menus: [
          {
            name: 'breakLine',
            text: '插入換行',
            action(editor) {
              editor.insert(function () {
                const content = '<br>'
                return {
                  text: `\n${content}\n`,
                }
              })
            },
          },
          {
            name: 'twoSpace',
            text: '首段空格',
            action(editor) {
              editor.insert(function () {
                const prefix = '&emsp;&emsp;'
                return {
                  text: `${prefix}`,
                }
              })
            },
          },
          {
            name: 'imgName',
            text: '插入圖片名',
            action(editor) {
              editor.insert(function (selected) {
                const prefix = '::: align-center \n'
                const suffix = '\n:::'
                const placeholder = '圖.\t\t說明'
                const content = selected ? '圖.\t\t' + selected : placeholder
                return {
                  text: `${prefix}  ${content}${suffix}`,
                }
              })
            },
          },
          {
            name: 'imgResize',
            text: '設定圖片大小',
            action(editor) {
              editor.insert(function () {
                const prefix = '{{{width="100" height="auto"}}}'
                return {
                  text: `${prefix}`,
                }
              })
            },
          },
        ],
      },
      align: {
        title: '對齊',
        icon: 'el-icon-minus',
        menus: [
          {
            name: 'align',
            text: '靠左對齊',
            action(editor) {
              editor.insert(function (selected) {
                const prefix = '::: align-left \n'
                const suffix = '\n:::'
                const placeholder = 'left'

                const content = selected || placeholder
                return {
                  text: `${prefix}  ${content}${suffix}`,
                }
              })
            },
          },
          {
            name: 'align',
            text: '置中對齊',
            action(editor) {
              editor.insert(function (selected) {
                const prefix = '::: align-center \n'
                const suffix = '\n:::'
                const placeholder = 'center'

                const content = selected || placeholder
                return {
                  text: `${prefix}  ${content}${suffix}`,
                }
              })
            },
          },
          {
            name: 'align',
            text: '靠右對齊',
            action(editor) {
              editor.insert(function (selected) {
                const prefix = '::: align-right \n'
                const suffix = '\n:::'
                const placeholder = 'right'
                const content = selected || placeholder
                return {
                  text: `${prefix}  ${content}${suffix}`,
                }
              })
            },
          },
        ],
      },
    })
    const formData = reactive({
      file: null,
      rewrite: rewrite.value,
    })

    const outer = (val, event) => {
      var type = event.target.nodeName
      var src = event.target.src
      if (type === 'IMG') {
        if (val === 1) ImgPath.value = src
        else if (val == 2) closeImg()
      }
    }

    const mouseover = (val, event) => {
      var type = event.target.nodeName
      if (type === 'IMG') {
        if (val == 1) document.body.style.cursor = 'zoom-in'
        else if (val == 2) document.body.style.cursor = 'zoom-out'
      } else document.body.style.cursor = 'default'
    }

    const closeImg = () => {
      ImgPath.value = ''
    }

    const checkType = (files) => {
      const pattern = /image/
      const isAcceptType = pattern.test(files[0].type)
      if (isAcceptType) return true
      else return false
    }

    const handleUploadImage = async (event, insertImage, files) => {
      //1. 檢查檔案格式
      var typeCheck = checkType(files)
      var file = files[0]
      //2. 賦值 + return URL
      if (typeCheck) {
        if (file) {
          formData.file = file
          formData.imgSrc = URL.createObjectURL(file)
          //3. form賦值 + 送出
          if (formData.imgSrc) {
            let form = new FormData()
            form.append('file', formData.file)
            // form.append('folder', '')
            form.append('rewrite', formData.rewrite)

            var res = await basicapi.UploadImg(form)
            var fullPath = store.state.status.ImgURl + res.filepath
            insertImage({
              url: fullPath,
              desc: '圖片',
            })
          }
        }
      } else {
        ElMessage({
          message: '僅能上傳圖片',
          type: 'error',
        })
        return
      }
    }

    watch(content, (nV) => {
      //編輯器修改中... ➜ 編輯狀態下去檢查有沒有更動(未儲存&已儲存)
      store.commit('file/setEditingFile', nV)
      if (store.state.panels.openEditor.editORadd == 'edit')
        ///編輯
        compare(store.state.file.recentFile.content, nV)
      ///新增
      else compare('', nV)
    })

    watch(
      () => store.state.file.recentFile.content,
      (nV) => {
        //點擊目錄檔案時切換
        if (store.state.panels.openEditor.editORadd == 'edit')
          content.value = nV
        else content.value = ''
      },
      {
        immediate: true,
      }
    )

    watch(
      () => store.state.panels.openEditor.editORadd,
      (nV) => {
        //按下編輯/新增時切換
        if (nV == 'add') content.value = ''
        else content.value = store.state.file.recentFile.content
      },
      {
        immediate: true,
      }
    )

    watch(
      () => props.cancleEdit,
      (nV) => {
        //編輯到一半取消
        if (nV) {
          content.value = store.state.file.recentFile.content
          emit('clearOver')
        }
      }
    )

    watch(rewrite, (val) => {
      formData.rewrite = val
    })

    return {
      content,
      outer,
      store,
      mouseover,
      handleUploadImage,
      ImgPath,
      closeImg,
      toolbar,
      EDITOR_TOOLBAR_OPTIONS,
      view_load,
    }
  },
})
</script>

<style lang="sass" scoped>
#Previewer
  z-index: 5
  height: 100%
  border: 1px solid rgb(237, 237, 237)
:deep(.vuepress-markdown-body)
  background-color: rgba(255, 255, 255, 0.7)//#ededed
:deep(.v-md-editor)
  background-color: rgba(255, 255, 255, 0.7)//#ededed
  border-radius: 0 4px 4px 4px
  :deep(.caption)
    color: red
:deep(.v-md-editor-preview)
  :deep(.caption)
    color: red

.imgWrapper
  width: 100vw
  height: 100vh
  background: rgb(0 0 0 / 35%)
  display: flex
  align-items: center
  justify-content: center
  -webkit-box-align: center
  position: fixed
  top: 0
  left: 0
  z-index: 10
  transition: 1s
  i
    position: relative
    left: 95%
    top: 3%
    font-size: 2rem
    font-weight: bold
    background: #ededed
    height: fit-content
    border-radius: 50%
  i:hover
    cursor: pointer
  img
    max-width: 60%
    max-height: 60%
    animation: zoomIn .3s
    transform: scale(1.5)
    // margin: auto
@keyframes zoomIn
  from
    transform: scale(0.5)
  to
    transform: scale(1.5)
</style>
