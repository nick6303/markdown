<template lang="pug">
#MarkDown
  #left
    Version(
      @reloadTreeStruct="reloadTreeStruct(true)"
      @reloadVersion="storeVersion"
    )
    Tree(
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
import { defineComponent, onMounted, ref, computed, watch } from 'vue'
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
    const struct = ref([])
    const versions = ref([])
    const siblins = ref([])
    const { getCatlog } = treeHelper()

    const reloadTreeStruct = async (versionReload = false) => {
      //initial
      store.commit('loading/setTreeLoad', true)
      await basicapi.initFile()
      store.commit('loading/setTreeLoad', false)
      //get struct
      try {
        const res = await basicapi.GetStruct()
        struct.value = [res]
        await sortTree(struct.value)

        //轉換成只有目錄的Obj->給表單使用
        DirObj.value = getCatlog(struct.value)
        if (versionReload) {
          //切換版本
          versions.value = await basicapi.GetVersion()
          store.commit('initial/setVersionList', versions.value)
          findFirstMd(struct.value[0].children, struct.value[0].id)
        }
        // struct.value = struct.value[0].children //根目錄不顯示在tree
        store.commit('initial/setStruct', struct.value) //
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
      store.commit('initial/setVersionList', res) //
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
      findFirstMd(struct.value[0].children, struct.value[0].id)
    }

    const byOrder = async () => {
      try {
        const res = await basicapi.GetTitle(1)
        const title = res.title ?? ''
        store.commit('initial/setTitle', title) //
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
        let obj = JSON.parse(JSON.stringify(struct.value))
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
      struct,
      versions,
      reloadTreeStruct,
      storeVersion,
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
