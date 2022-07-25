<template lang="pug">
#Operator
  el-tooltip(
    effect="dark" content="進階設定" :hide-after="50" 
  )  
    el-button.btn( 
      icon="el-icon-setting" type="info"  circle
      @click="openAdvance"
    )      
  el-tooltip(
    v-if="ShowBtns.delete && ifMdExist.length != 0"
    effect="dark" 
    content="刪除"  
    :hide-after="50" 
  )
    el-button.btn( 
      icon="el-icon-delete" 
      type="danger"  circle
      @click="dele"
    )
  el-tooltip(
    v-if="ifMdExist.length !== 0"
    effect="dark" 
    content="下載PDF" 
    :hide-after="50" 
  )  
    el-button.btn( 
      icon="el-icon-download" 
      type="primary"  circle
      :loading="run" 
      @click="download"
    )
  el-tooltip(
    v-if="ShowBtns.create"
    effect="dark" 
    content="新增文件" 
    :hide-after="50"
  )  
    el-button.btn( 
      icon="el-icon-document" 
      type="success" circle
      @click="add"
    )
  el-tooltip(
    v-if="ShowBtns.update && ifMdExist.length != 0"
    effect="dark" 
    content="編輯"  
    :hide-after="50" 
  )
    el-button.btn( 
      icon="el-icon-edit" type="warning"  circle
      @click="editor"  
    )
  el-button.dropbtn( 
    icon="el-icon-plus" type="info" circle
  ) 
AdvancedSettings(
  ref="advance"
)
Editor(
  @reload="emitTree"
)

</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import mdapi from '@api/file'
import { useStore } from 'vuex'
// import router from '@router'
//comp
import Editor from '@c/Dialog/Editor.vue'
import AdvancedSettings from './components/AdvancedSettings.vue'

export default defineComponent({
  name: 'Operator',
  props: {
    run: Boolean,
  },
  components: { Editor, AdvancedSettings },
  emits: ['download', 'reload'],
  setup(props, { emit }) {
    const store = useStore()
    const ShowBtns = ref({})
    const advance = ref(null)
    const ifMdExist = computed(() => store.state.file.BreadCurmb)

    const editor = async () => {
      store.dispatch('panels/openDialog', { type: 'file', editORadd: 'edit' })
    }

    const add = async () => {
      store.dispatch('panels/openDialog', { type: 'file', editORadd: 'add' })
    }

    const dele = async () => {
      var id = store.state.file.recentFile.id
      var parent = store.state.file.recentFile.parent_id
      var filename = store.state.file.recentFile.name
        ? store.state.file.recentFile.name
        : ''
      ElMessageBox.confirm(`將會刪除「 ${filename} 」的所有資料`, `確定刪除?`, {
        confirmButtonText: '確認',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          //確定
          runDel(id, parent)
        })
        .catch(() => {
          //取消
        })
    }

    const download = async () => {
      emit('download')
    }

    const runDel = async (id, parent) => {
      await mdapi.DeleFile(id)
      emit('reload', { reloadtype: 'deleFile', deleParent: parent })
      ElMessage({
        message: '刪除成功',
        type: 'success',
      })
    }

    const emitTree = (obj) => {
      emit('reload', obj)
    }

    const openAdvance = () => {
      advance.value.openDialog()
    }

    onMounted(() => {
      // ShowBtns.value = router.currentRoute.value.meta.actions
      ShowBtns.value = store.state.status.ShowBtns
    })

    return {
      editor,
      add,
      dele,
      download,
      store,
      emitTree,
      ShowBtns,
      ifMdExist,
      advance,
      openAdvance,
    }
  },
})
</script>

<style lang="sass" scoped>
#Operator
  position: absolute
  right: 0
  top: 50%
  transform: translateY(-50%)
  z-index: 10
  display: flex
  align-items: center
  .dropbtn
    border: none
    transition: .5s
    background: #a477cb
  .bottom
    position: absolute
    bottom: -0.5rem
    width: 100%
    display: flex
    justify-content: center
    left: 0
    .addChose
      display: none
  .btn
    display: none
    animation: fadeinout .2s both
    margin-left: 0.5rem
    box-shadow: inset -1px -1px 3px 0 rgb(0 0 0 / 55%), inset 1px 1px 3px 0 #fff
    border: none
    &:nth-child(4)
      animation-delay: .1s
    &:nth-child(3)
      animation-delay: .18s
    &:nth-child(2)
      animation-delay: .26s
    &:nth-child(1)
      animation-delay: .34s
    &:active
      box-shadow: inset -1px -1px 3px 0 rgb(255 255 255), inset 1px 1px 3px 0 rgb(0 0 0 / 55%)
  &:hover
    .dropbtn
      transform: rotate(45deg)
      background: #7a5895
    .btn
      display: block

@keyframes fadeinout
  0%
    opacity: 0
  100%
    opacity: 1
</style>
