<template lang="pug">
#Advance
  .wrapper          
    .topic
      .title
        i.el-icon-location 
        span 提示框
      span 共有4種主題，分別為
      span.highlight tip
      span (綠色)、
      span.highlight warning
      span (橘色)、
      span.highlight danger
      span (紅色)、
      span.highlight details
      span (灰色，可展開)

      p.exp 範例↓
      .code
        p ::: tip
        p &ensp;&ensp;&ensp;&ensp;內容
        p :::
        br
        p ::: warning 
        p &ensp;&ensp;&ensp;&ensp;內容
        p :::
        br
        p ::: danger 修改標題
        p &ensp;&ensp;&ensp;&ensp;內容
        p :::
        br
        p ::: details
        p &ensp;&ensp;&ensp;&ensp;內容
        p :::
        br

      p.exp 呈現結果↓
      .result
        .alertbox.tip
          .alert-title TIP
          .alert-word 內容
        .alertbox.warning
          .alert-title warning
          .alert-word 內容
        .alertbox.danger
          .alert-title 修改標題
          .alert-word 內容
        .alertbox.details
          .alert-title ▼ details
          .alert-word 內容
    .topic
      .title
        i.el-icon-location 
        span 設定圖片大小
      span 可在圖片[NAME](https://)後面加上：
      span(v-pre).highlight {{{ width="100" height="auto" }}}
      span 可自行填入數字/百分比的調控 (同html img標籤語法)

      p.exp 範例↓
      .code
        p(v-pre) ![Description](https:){{{width="60%" height="100"}}}
        p(v-pre) ![Description](https:){{{width="100" height="auto"}}}
    
      p.exp 呈現結果↓
      .result
        img.img1(:src="eximgurl")
        img.img2(:src="eximgurl")
    .topic
      .title
        i.el-icon-location 
        span 內容定位 (左、中、右)
      span 可以設定文字的置左、置中、置右


      p.exp 範例↓
      .code
        p ::: align-left
        p &ensp;&ensp;&ensp;&ensp;left文字
        p :::
        br

        p ::: align-center
        p &ensp;&ensp;&ensp;&ensp;center文字
        p :::
        br

        p ::: align-right
        p &ensp;&ensp;&ensp;&ensp;right文字
        p :::
        br
    
      p.exp 呈現結果↓
      .result
        .float.float-left left文字
        .float.float-center center文字
        .float.float-right right文字

</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Advance',
  setup() {
    const eximgurl =
      'https://images.unsplash.com/photo-1625215081436-85323ed5042c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
    return { eximgurl }
  },
})
</script>

<style lang="sass" scoped>
#Advance
  margin-left: .5rem
</style>
