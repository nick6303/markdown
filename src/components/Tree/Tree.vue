<template lang="pug">
#Tree
  #tags
    el-tooltip(
      effect="dark" content="新增資料夾" :hide-after="50" 
    )  
      el-button(
        type="primary" plain
        size="small"
        icon="el-icon-files"
        @click="addDir"
      ) 
    el-tooltip(
      effect="dark"
      :hide-after="50"
    )  
      template(#content)
        span {{draggable? '儲存' : '移動目錄'}}
      el-button(
        type="primary" plain
        size="small"
        :icon="draggable ? 'el-icon-check': 'el-icon-sort'"
        :class="draggable ? 'checked' : ''"
        @click="onChange"
      ) 
  el-tree(
    v-loading="tree_load"
    node-key="id"
    :default-expanded-keys="expendKey"
    :data="TreeData" 
    :props="{ children: 'children', label: 'name' }" 
    @node-click="handleNodeClick"
    :draggable="draggable"
    @node-drag-end="handleDragEnd"
    :allow-drop="AllowDrop"
    @node-drag-enter="dragEnter"
  )
    template(#default="{ node, data }")
      .mytree-node(
        :class="getNodeClass(data)"
      )
        .basic(:style="{ background: node.data.id === dragNode ? 'beige' : '' }")
          i(:class="data.type==='directory' ? 'el-icon-folder' : 'el-icon-document'")
          span(:class="data.type === 'directory' ? 'dir': 'md' ") {{data.name}}
        .btns(v-if="!draggable && data.id !==1 && data.type === 'directory'")
          el-button.editbtn( 
            icon="el-icon-edit" 
            type="warning" plain
            @click="openRenameFolder"
          )   
          el-button.delebtn( 
            icon="el-icon-delete" 
            type="danger" plain
            @click="deleDir"
          )    
  RenameFolder(@reload="emitReload")
  NewFolder(@reload="emitReload" )
</template>

<script>
import { defineComponent, ref, watch, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import folderapi from '@api/folder'
import { readMd, storeRencntInfo } from '@/utils/hooks'
import { useStore } from 'vuex'
import { RenameFolder, NewFolder } from './components'

export default defineComponent({
  name: 'Tree',
  components: {
    RenameFolder,
    NewFolder,
  },
  emits: ['reload'],
  setup(props, { emit }) {
    const store = useStore()
    const tree_load = computed(() => store.state.loading.tree_load)
    const TreeData = computed(() => store.state.initial.struct)
    const expendKey = ref([1])
    const open = ref(false)
    const list = ref([])
    const defaultProps = {}
    const currentKey = ref()
    const dragNode = ref(0)
    const draggable = ref(false)
    const removeTable = ref({
      source_id: -1,
      destination_id: -1,
    })

    const onChange = () => {
      draggable.value = !draggable.value
      if (!draggable.value) emit('reload')
    }

    //node drop
    const AllowDrop = (node, dropnode) => {
      if (dropnode.data.type == 'file' || node.data.id == 1) return false
      else return true
    }
    //拖動
    const handleDragEnd = async (draggingNode, dropNode, position, event) => {
      dragNode.value = 0
      const source = draggingNode.data
      const dest = dropNode.data
      if (dest.type == 'file') {
        ElMessage({
          message: '路徑錯誤',
          type: 'warning',
          duration: 1000,
        })
      }
      removeTable.value.source_id = source.id
      removeTable.value.destination_id = dest.id
      await folderapi
        .Move(removeTable.value)
        .then((res) => {
          const selected = {
            id: res.id,
            type: source.type,
            name: source.name,
            path: res.path,
          }
          storeRencntInfo(selected)
          emit('reload', {})
        })
        .catch(() => {
          event.dcancelable = true
          event.defaultPrevented = true
          event.preventDefault()
        })
    }

    const dragEnter = (node, dest) => {
      dragNode.value = dest.data.id
    }

    const addDir = async () => {
      store.dispatch('panels/openDialog', {
        type: 'folder' /*, parent: parentId */,
      })
    }

    const getNodeClass = (data) => {
      const id = store.state.file.recentFile.id
      const chosen = data.id === id ? 'chosen' : 'normal'
      const shaky = draggable.value ? ' shaky' : ''
      return chosen + shaky
    }

    //Tree
    const handleNodeClick = async (data) => {
      if (!draggable.value) {
        let selected = {
          id: data.id,
          type: data.type,
          name: data.name,
        }
        await storeRencntInfo(selected)

        // expendKey.value = [1]//清空
        //2.讀取檔案
        if (data.type == 'file') readMd(selected.id)
      }
    }

    const runDel = async (id) => {
      try {
        await folderapi.DeleFolder(id).then(() => {
          ElMessage({
            message: '刪除成功',
            type: 'success',
          })
        })
      } catch {
        ElMessage({
          message: '請檢查是否有刪除非空資料夾的權限',
          type: 'warning',
        })
      }

      //step2.
      if (store.state.file.recentFile.parent_id == id)
        //在欲刪除資料夾下➜ 取得整個tree第一個
        emit('reload', {})
      //重整樹就好
      else emit('reload', { findFirst: true })
    }

    const deleDir = () => {
      let msg = '將會刪除此資料'
      if (store.state.advance.setDeleAllFile)
        msg = '將會刪除此資料(包含底下所有檔案)'
      ElMessageBox.confirm(msg, `確定刪除?`, {
        confirmButtonText: '確認',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          //確定
          runDel(store.state.file.recentFolder.id)
        })
        .catch(() => {
          //取消
        })
    }

    const emitReload = async (obj) => {
      emit('reload', obj)
    }

    //發現點擊其他目錄時(目錄有異動)
    watch(
      () => store.state.file.recentFile,
      (nV) => {
        if (nV.type == 'file' || nV.type == 'no-file') {
          expendKey.value = []
          expendKey.value.push(nV.id)
          currentKey.value = nV.id
        }
      },
      {
        immediate: true,
      }
    )

    const openRenameFolder = () => {
      store.dispatch('panels/openDialog', { type: 'renameFolder' })
    }

    return {
      addDir,
      handleDragEnd,
      AllowDrop,
      defaultProps,
      list,
      handleNodeClick,
      expendKey,
      store,
      currentKey,
      deleDir,
      open,
      emitReload,
      onChange,
      draggable,
      openRenameFolder,
      dragEnter,
      dragNode,
      TreeData,
      tree_load,
      getNodeClass,
    }
  },
})
</script>

<style lang="sass" scoped>
#Tree
  padding: 16px 16px 16px 8px
  overflow-y: auto
  overflow-x: hidden
  width: 100%
  height: 100%
  #tags
    display: flex
    justify-content: flex-end
    .checked
      background: #409EFF
      color: #ECF5FF
:deep(.el-tree)
  background: var(--tree_BG)
  .el-tree-node
    &:not(:last-child)
      padding-bottom: 8px
    &:first-child
      padding-top: 8px
  .el-tree-node:focus > .el-tree-node__content
    background-color: none  !important
  .el-tree-node:focus>.el-tree-node__content, .el-tree-node__content:hover
    background-color: transparent !important
  .el-tree-node__content>.el-tree-node__expand-icon
    padding: 1px
  .dir
    font-weight: bold
    font-size: 16px
    color: #5a5a5a
  .md
    color: #3a3a3a
    font-size: 12px
  .shaky
    animation: shake .5s alternate infinite
  .mytree-node
    +size(100%,100%)
    border-radius: 10px
    display: flex
    align-items: center
    justify-content: space-between
    padding-left: 3px
    &.normal:hover,&.chosen
      background: #f5f7fa
    .basic
      display: flex
      align-items: center
      margin: 3px 0
      i
        font-size: smaller
        border-radius: 50%
        padding: 0.35em
      .el-icon-folder
        background: #e4af51
        box-shadow: inset -1px -1px 3px 0px #885400, inset 1px 1px 3px 0px #fadaa6
        color: #fff
        margin-right: 0.3em
    .btns
      margin-right: 0.3rem
      .delebtn, .editbtn
        padding: 0
        border: none
        background: transparent
      .editbtn
        color: #686868
      .delebtn
        color: #F56C6C
      .delebtn:hover i
        background: #F56C6C
        color: #fff
        border-radius: 5px
        padding: 2px
      .editbtn:hover i
        background: #686868
        color: #fff
        border-radius: 5px
        padding: 2px
  .chosen span
    color: #161938 !important
    font-weight: 600

@keyframes shake
  0%
    transform: rotate(1deg)
  100%
    transform: rotate(-1deg)
:deep(.model)
  background-color: rgb(0 0 0 / 10%)
</style>
