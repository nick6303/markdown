<template lang="pug">
#MarkDown
  #left
    Version(
      :versionList="versionList"
      :webTitle="webTitle"
      @reloadTreeStruct="reloadTreeStruct(true)"
      @reloadVersion="storeVersion"
    )
    Tree(
      :TreeData="TreeData"
      :tree_load="tree_load"
      @reload="reload"
    )
  #right
    .op
      BreadCrumb
      Operator(
        :run="run"
        @reload="reload" 
        @download="run = true" 
      )
    Previewer(mode="preview")
  PdfFormat(
    :run="run"
    @downloadOver="run = false"
  )
</template>

<script>
import { useStore } from 'vuex'
import basicapi from '@api/basic'
import { defineComponent, onMounted, ref, computed, watch, reactive } from 'vue'
import {
  findFirstMd,
  readMd,
  DirObj,
  treeHelper,
  sortTree,
  storeRencntInfo,
} from '@/utils/hooks'
//comp

import Tree from '@c/Tree'
import { Version, BreadCrumb } from '@c/Shared'
import PdfFormat from '@c/PDF'
import Operator from '@c/Operator'
import Previewer from '@c/Previewer'

import router from '@/router'

export default defineComponent({
  name: 'MarkDown',
  components: {
    Tree,
    Operator,
    Previewer,
    PdfFormat,
    Version,
    BreadCrumb,
  },
  setup() {
    const store = useStore()
    const routerPath = computed(() => router.currentRoute.value.path)
    const run = ref(false)
    const TreeData = ref([])
    const versionList = ref([])
    const siblins = ref([])
    const tree_load = ref(false)
    const webTitle = reactive({
      Name: '',
      Tile: '',
    })
    const { getCatlog } = treeHelper()

    const reloadTreeStruct = async (versionReload = false) => {
      //initial
      tree_load.value = true
      await basicapi.initFile()
      tree_load.value = false
      //get struct
      try {
        const res = await basicapi.GetStruct()
        TreeData.value = [res]
        await sortTree(TreeData.value)

        //轉換成只有目錄的Obj->給表單使用
        DirObj.value = getCatlog(TreeData.value)
        if (versionReload) {
          //切換版本
          versionList.value = await basicapi.GetVersion()
          findFirstMd(TreeData.value[0].children, TreeData.value[0].id)
        }
        return true
      } catch {
        return false
      }
    }

    const findSiblin = (list, targetId) => {
      for (let i = 0; i < list.length; i++) {
        var item = list[i]
        if (item.id == targetId) {
          siblins.value = item
          return item
        } else {
          if (item.children) findSiblin(item.children, targetId)
        }
      }
    }

    const storeVersion = async () => {
      const res = await basicapi.GetVersion()
      versionList.value = res
      const URLs = routerPath.value.split('/')
      const VersionURL = URLs[URLs.length - 1]
      const index = res.findIndex(
        (item) => item === decodeURIComponent(VersionURL)
      )
      if (index !== -1) {
        const ver = res[index]
        store.commit('status/setVersion', ver)
      } else {
        store.commit('status/setVersion', res[0])
      }
      await reloadTreeStruct()
      findFirstMd(TreeData.value[0].children, TreeData.value[0].id)
    }

    const byOrder = async () => {
      try {
        const res = await basicapi.GetTitle(1)
        const title = res.title ?? ''
        webTitle.Name = title.Name
        webTitle.Tile = title.Tile
        storeVersion()
      } catch {
        //
      }
    }

    const reload = async ({
      reloadtype,
      res,
      deleParent,
      findFirst = false,
    }) => {
      await reloadTreeStruct(findFirst)

      //檔案 新增/編輯、rename、刪除
      if (reloadtype == 'addFile') {
        await storeRencntInfo(res) //存入資訊
        readMd(res.id)
      } else if (reloadtype == 'editFile') {
        //編輯頁面有自動儲存時，不用readMD(編輯頁面會一直重load)
        await storeRencntInfo(res) //存入資訊編輯
      } else if (reloadtype == 'renameFile') {
        await storeRencntInfo(res) //存入資訊
        readMd(res.id)
      } else if (reloadtype == 'deleFile') {
        let obj = JSON.parse(JSON.stringify(TreeData.value))
        await findSiblin(obj, deleParent)
        await findFirstMd(siblins.value.children)
      }
      //資料夾 新增、rename、刪除
      else if (reloadtype == 'addFolder') {
        await storeRencntInfo(res) //存入資訊
      } else if (reloadtype == 'renameFolder') {
        var nowMD = store.state.file.recentFile
        var selected = {
          id: nowMD.id,
          type: nowMD.type,
          name: nowMD.name,
        }
        await storeRencntInfo(selected) //存入資訊 for breadcrumb
      }
    }

    watch(routerPath, () => {
      storeVersion()
    })

    onMounted(() => {
      byOrder() //文件相關載入
    })

    return {
      store,
      reload,
      run,
      TreeData,
      reloadTreeStruct,
      storeVersion,
      tree_load,
      webTitle,
      versionList,
    }
  },
})
</script>

<style lang="sass" scoped>
#MarkDown
  width: 100%
  height: 100%
  display: flex
  position: relative
  padding: 5px 10px
  #left
    +size(360px,100%)
    box-shadow: inset -2px -5px 3px 3px rgb(0 0 0 / 26%), inset 2px 1px 3px 3px #ffffff
    border-radius: 5px
    background: var(--tree_BG)
    position: relative
    :deep(#Version)
      height: 140px
    :deep(#Tree)
      +size(100%,calc(100% - 140px))
  #right
    +size(calc(100% - 360px),100%)
    margin-left: 1%
    position: relative
    .op
      display: flex
      height: 55px
      width: 100%
      align-items: center
      position: relative
    :deep(#Previewer)
      height: calc(100% - 55px)
  /*捲軸*/
  ::-webkit-scrollbar //背景顏色
    height: .5rem
    width: .7rem
  ::-webkit-scrollbar-track //把手顏色
    background: #cccccc
  ::-webkit-scrollbar-thumb //滑過時把手的顏色
    background: #787877
  ::-webkit-scrollbar-thumb:hover
    background: #fff
  :deep(#PdfFormat)
    position: absolute
    top: 100%
    left: 100%
    z-index: -999
</style>
