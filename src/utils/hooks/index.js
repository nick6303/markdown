import { ref } from 'vue'
import store from '@/store'
import mdapi from '@api/file'
import usePDF from './usePDF'
import treeHelper from './treeHelper'
import { NO_FILE_CONTENT, IMG_PATH } from '@mock/consts'

export { usePDF }
export { treeHelper }

export const DirObj = ref({})

export const removeFristDir = (list) => {
  return list[0].children
}

//簡單版 按照數字排序
export const sortTree = (list) => {
  const testList = []
  list.forEach((item) => {
    if (item.children) {
      item.children.forEach((each) => {
        if (each.type == 'file' && each.name.indexOf('.md') != -1) {
          each.name = each.name.substring(0, each.name.length - 3) //.md
        }
      })

      const sort = item.children.sort(function (a, b) {
        var numA = a.name.replace(/\D+$/g, '')
        var numB = b.name.replace(/\D+$/g, '')
        return numA - numB
      })

      testList.push(...sortTree(sort))
    }
  })
  return testList
}

//編輯模式中 檢查有沒有動過(類似word未儲存/儲存概念)
export const compare = (ori, newstr) => {
  if (ori === newstr) {
    store.commit('status/setStatus', '已儲存')
    return false
  } else {
    store.commit('status/setStatus', '未儲存')
    return true
  }
}

//找此層第一個文件
export const findFirstMd = async (list, rootID) => {
  const target = list.find((item) => item.type === 'file')
  if (target) {
    const select = {
      id: target.id,
      type: target.type,
      name: target.name,
    }
    await storeRencntInfo(select) //存入資訊
  } else {
    NoFile(rootID)
  }
}

//傳入id 帶入api取得
export const readMd = async (id) => {
  try {
    store.commit('loading/setViewLoad', true)
    await mdapi.GetFile(id)
  } catch {
    NoFile()
  } finally {
    store.commit('loading/setViewLoad', false)
  }
}

//點擊tree時 傳入id➜ 帶入api➜ 將資訊傳存起來
export const storeRencntInfo = async (select) => {
  let obj = select
  //1.收集-點擊的file/folder資訊
  if (obj.id) {
    try {
      store.commit('loading/setViewLoad', true)

      const res = await mdapi.GetFile(obj.id)
      obj.parent_id = res.parent_id
      obj.path = res.path
      obj.encoding = res.encoding
      obj.content = ImgProcessor(res.content, 'addHttp')
    } catch {
      NoFile()
    } finally {
      store.commit('loading/setViewLoad', false)
    }

    var bread = obj.path.split('/') //收集  2.file的BreadCrumb
    if (bread[bread.length - 1].includes('.md'))
      bread[bread.length - 1] = bread[bread.length - 1].substring(
        0,
        bread[bread.length - 1].length - 3
      ) //.md
    obj.breadcrumb = bread
    store.dispatch('file/clickFile', obj)
    return obj
  }
}

//Img加/刪網址
export const ImgProcessor = (str, mode) => {
  const http = IMG_PATH
  // const regex = /^!\[(.*)\]\((.*)\)$/mg
  const regex = /^!\[(.*)\]\((.*)\)/gm
  let ans = str
  let m
  while ((m = regex.exec(str)) !== null) {
    if (m.index === regex.lastIndex) {
      regex.lastIndex++
    }
    m.forEach((match, groupIndex) => {
      if (mode == 'addHttp') {
        if (groupIndex == 2 && !match.includes(http)) {
          const fullpath = http + match
          if (match.indexOf('http') == -1) {
            ans = ans.replace(match, fullpath)
          }
        }
      } else if (mode == 'removeHttp') {
        if (groupIndex == 2) {
          ans = ans.replace(http, '')
        }
      }
    })
  }
  return ans
}

//沒有檔案時的操作
const NoFile = (rootID) => {
  const select = {
    type: 'no-file',
    name: 'no-file',
    content: NO_FILE_CONTENT,
    parent_id: rootID,
  }
  store.commit('file/setFile', select) //select
  store.commit('file/setBreadCurmb', []) //bread
}
