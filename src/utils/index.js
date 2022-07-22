import authApi from '@api/auth'

export const reSortMenuList = (
  menuList,
  defaultShowChild = true,
  getTree = false
) => {
  let node,
    parentMap = {},
    map = {},
    treeList = []

  // 建立map
  menuList = menuList.map((item, index) => {
    map[item.id] = index
    return { ...item, children: [], showChild: defaultShowChild }
  })

  // 轉成樹狀數列取得階層關係
  for (let i = 0; i < menuList.length; i++) {
    node = menuList[i]
    if (menuList[map[menuList[i].parentId]]) {
      menuList[map[menuList[i].parentId]].children.push(node)
    } else {
      treeList.push(node)
    }
  }

  // 回傳樹狀數列
  if (getTree) {
    return treeList
  }

  // 樹狀數列轉平面數列同時取得level
  const temp = treeToflat(treeList).map((item) => {
    const { id, parentId } = item
    if (parentMap[parentId] !== undefined) {
      parentMap[id] = parentMap[parentId] + 1
    } else {
      parentMap[id] = 0
    }
    return item
  })

  // 加上level
  return temp.map((item) => {
    item.level = parentMap[item.id]
    return item
  })
}

// 樹狀數列轉平面數列
const treeToflat = (list) => {
  const testList = []
  list.forEach((item) => {
    testList.push(item)
    const { children } = item
    testList.push(...treeToflat(children))
  })
  return testList
}

export const updateLocalStorgeToken = (response) => {
  const { access_token } = response
  localStorage.setItem('access_token', access_token)
  const csrftoken = getCookie('csrftoken')
  localStorage.setItem('csrftoken', csrftoken)
}

export const getCookie = (cname) => {
  var name = cname + '='
  var ca = document.cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) == ' ') c = c.substring(1)
    if (c.indexOf(name) != -1) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}

export const refreshToken = async () => {
  const response = await authApi.refreshToken()
  if (response.access_token) {
    await updateLocalStorgeToken(response)
    return true
  } else {
    return false
  }
}

export const removeEmpty = (params) => {
  const tem = params
  Object.keys(params).forEach((key) => {
    if (params[key] === null || params[key] === undefined) {
      delete tem[key]
    }
  })
  return tem
}

export function assemblyParams(params) {
  // api url 組字串
  let str = ''
  Object.keys(params).forEach((key) => {
    if (params[key] || params[key] === false || params[key] === 0) {
      str += `${key}=${params[key]}&`
    }
  })
  return str.substring(0, str.length - 1) // 去結尾&
}

export const ValidateIPaddress = (value, callback = null) => {
  var ipformat =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  if (value === '' || (typeof value === 'string' && value.match(ipformat))) {
    if (callback) {
      callback()
    } else {
      return true
    }
  } else {
    if (callback) {
      callback(new Error('請輸入正確 IP 位址'))
    } else {
      return new Error('請輸入正確 IP 位址')
    }
  }
}

export const ValidateDNS = (value, callback = null) => {
  const ipformat =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  const hostformat =
    /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9]*[A-Za-z0-9])$/

  if (
    value === '' ||
    (typeof value === 'string' &&
      (value.match(ipformat) || value.match(hostformat)))
  ) {
    if (callback) {
      callback()
    } else {
      return true
    }
  } else {
    if (callback) {
      callback(new Error('請輸入正確 DNS 位址'))
    } else {
      return new Error('請輸入正確 DNS 位址')
    }
  }
}

export const ValidateCron = (value, callback) => {
  const valueArray = value.split(' ')
  // 數量
  const length = valueArray.length === 7
  // 秒
  const secondRegex = new RegExp(
    /(\*|[0-9]|[1-5][0-9]|([0-9]|[1-5][0-9]\/[0-9]|[1-5][0-9]))/
  )
  const second = secondRegex.test(valueArray[0])
  // 分
  const minuteRegex = new RegExp(
    /((\d+(s|m|h|L-|L|W))+)|((((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7})/
  )
  const minute = minuteRegex.test(valueArray[1])
  // 時
  const hourRegex = new RegExp(
    /((\d+(s|m|h|L-|L|W))+)|((((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7})/
  )
  const hour = hourRegex.test(valueArray[2])
  // 日
  const dayRegex = new RegExp(
    /((\d+(s|m|h|L-|L|W))+)|((((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7})/
  )
  const day = dayRegex.test(valueArray[3])
  // 月
  const monthRegex = new RegExp(
    /((\d+(s|m|h|L-|L|W))+)|((((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7})/
  )
  const month = monthRegex.test(valueArray[4])
  // 周
  const weekRegex = new RegExp(
    /((\d+(s|m|h|L-|L|W))+)|((((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7})/
  )
  const week = weekRegex.test(valueArray[5])
  // 年
  const yearRegex = new RegExp(
    /((\d+(s|m|h|L-|L|W))+)|((((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7})/
  )
  const year = yearRegex.test(valueArray[6])

  if (length && second && minute && hour && day && month && week && year) {
    if (callback) {
      callback()
    } else {
      return true
    }
  } else {
    if (callback) {
      callback(new Error('CRON 格式錯誤'))
    } else {
      return new Error('CRON 格式錯誤')
    }
  }
}

export const getBodyVar = (val) => {
  return document.documentElement.style.getPropertyValue(val)
}

export const getImageBase64 = (src) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = document.createElement('img')

    img.onload = function () {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0, img.width, img.height)
      const base64Img = canvas.toDataURL('image/png')
      base64Img.replace('data:image/png;base64,', '')
      const imageData = base64Img
      canvas.remove()
      img.remove()
      resolve(imageData)
    }

    img.src = src
  })
}
