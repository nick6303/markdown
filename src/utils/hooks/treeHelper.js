function treeHelper() {
  const getCatlog = (data) => {
    let strData = JSON.parse(JSON.stringify(data))
    const ans = toTree(treeToflat(strData, -1))
    return ans
  }

  // 樹狀數列轉平面數列
  const treeToflat = (list, id) => {
    const testList = []
    list.forEach((item) => {
      if (item.type == 'directory') {
        testList.push(item)
        item.parent = id
      }
      const { children } = item
      if (item.children) {
        testList.push(...treeToflat(children, item.id))
      }
    })
    return testList
  }

  // 轉換為巢狀
  const toTree = (data) => {
    data.forEach((item) => delete item.children)
    let map = {}
    let val = []
    data.forEach((item) => (map[item.id] = item))
    data.forEach((item) => {
      let parent = map[item.parent]
      if (parent) (parent.children || (parent.children = [])).push(item)
      else val.push(item)
    })
    return val
  }

  return {
    getCatlog,
  }
}

export default treeHelper
