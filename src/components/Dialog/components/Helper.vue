<template lang="pug">
#Helper
  el-popover(
    placement="bottom-end"
    title="MarkDown語法教學"
    trigger="hover"
    popper-class="md-helper-pop"
  )
    template(#reference)
      el-button(type="warning" circle  size="small")  ？
    template(#default)
      el-tabs(
        v-model="activeName"
        type="card"
      )
        el-tab-pane(label="MarkDown 基本語法" name="1") 
          Basic
        el-tab-pane(label="編輯器擴充語法" name="2") 
          Advance
</template>

<script>
import { defineComponent, ref } from 'vue'
import Basic from './Basic.vue'
import Advance from './Advance.vue'
export default defineComponent({
  name: 'Helper',
  components: {
    Basic,
    Advance,
  },
  setup() {
    const activeName = ref('1')

    return { activeName }
  },
})
</script>

<style lang="sass" scoped>
#Helper
  margin-left: .5rem
</style>

<style lang="sass">
.md-helper-pop
  width: 40% !important
  height: 75% !important
  padding: 0.5rem 1rem !important
  overflow-y: auto !important
  overflow-x: auto !important
  box-shadow: 0 0 7px 5px #8e8e8e !important
  .el-popover__title
    display: flex
    font-size: 1.5em
    font-weight: 100
    justify-content: center
  .wrapper
    .h1
      font-size: 2em
      font-weight: 600
    .h2
      font-size: 1.5em
      font-weight: 600
    .h6
      font-weight: 600
      font-size: 1.17em
    .topic
      margin: 0 0 1rem 0
      .title
        border-bottom: 1px solid #9f9f9f
        margin: 0 0 .5rem 0
        span, i
          font-size: 1.5em
          font-weight: bold
        i
          color: #d63384
      .highlight
        background: #fff5fa
        color: #d63384
      .exp
        font-weight: 700
        font-style: italic
        display: flex
        justify-content: center
        color: #42426d
      .code
        background: #282c34
        padding: 0.1em 0.8em
        p, span
          color: #e06c75
      .result
        background: #ededed
        padding: 0.1em 0.8em
        p, span
          color: #606266
        .alertbox
          height: 5em
          margin: 1em 0
          .alert-title
            font-weight: bold
            margin: 0.5em 0 1em 1em
            padding-top: 0.3em
          .alert-word
            margin: 0.1em 0 1em 1em
        .tip
          background: #f4f5f7
          border-left: 1rem solid #42b983
          .alert-title, .alert-word
            color: #2c3e50
        .warning
          background: #fff7d0
          border-left: 1rem solid #d7bc3f
          .alert-title, .alert-word
            color: #6b5900
        .danger
          background: #fee6e6
          border-left: 1rem solid #cc0001
          .alert-title, .alert-word
            color: #4d0000
        .details
          background: #d9d9d9
          .alert-title, .alert-word
            color: #000
        .img1
          width: 60%
          height: 100
        .img2
          width: 100
          height: auto
        .float
          display: flex
        .float-left
          justify-content: left
        .float-center
          justify-content: center
        .float-right
          justify-content: right
      .quote
        padding: 0 1em
        color: #6a737d
        border-left: 0.25em solid #878787
      .numlist
        list-style-type: decimal
      .list
        font-weight: bold
      .line
        height: 0.25em
        margin: 24px 0
        padding: 0
        background-color: #878787
        border: 0
      .table
        border: 1px solid #000
        font-size: 16px
        border: 1px solid #000
        text-align: center
        border-collapse: collapse
        td
          border: 1px solid #000
          padding: 5px
        th
          padding: 10px
          border: 1px solid #000
      .tr
        display: table-row
        vertical-align: inherit
        border-color: inherit
      .italic
        font-style: italic
      .bold
        font-weight: bold
      .dele
        text-decoration: line-through
      a
        color: #0366d6
        cursor: pointer
      a:hover
        text-decoration: underline
      .yellow
        color: #c6bf54
</style>
