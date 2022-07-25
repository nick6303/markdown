<template lang="pug">
.left
  #filename(v-if="editORadd === 'edit'")
    i.el-icon-document
    span ：
    el-input(
      v-model="renameData.new_name" placeholder="請輸入名稱" size="small"  
    )
      template(#append) .md
  .tag
    el-tag#tag(
      round
      :type=" content_status === '已儲存' ? 'info' : 'danger'"
    ) 
      i.el-icon-loading(v-if="loading")
      span(v-else) ●
      span &ensp;{{content_status}}
  span#auto(v-if="auto_save.open") 定時儲存模式
</template>

<script>
import { defineComponent, ref, watch, computed } from 'vue'
import { useStore } from 'vuex'
import mdapi from '@api/file'

export default defineComponent({
  name: 'FilenameNTag',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    run: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['renameOver', 'reload'],
  setup(props, { emit }) {
    const store = useStore()
    const editORadd = computed(() => store.state.panels.openEditor.editORadd)
    const content_status = computed(() => store.state.status.content_status)
    const auto_save = computed(() => store.state.advance.auto_save)
    const orignalName = ref('')
    const renameData = ref({
      new_name: '',
      id: 0,
    })

    const nameChecker = async () => {
      if (orignalName.value === renameData.value.new_name) emit('renameOver')
      else {
        renameData.value.new_name += '.md'
        await mdapi
          .Rename(renameData.value, renameData.value.id)
          .then((res) => {
            res.name = renameData.value.filename
            res.type = 'file'
            emit('reload', { reloadtype: 'renameFile', res: res })
          })
        emit('renameOver')
      }
    }

    //name賦值
    watch(
      () => store.state.file.recentFile,
      (nV) => {
        var name = nV.name
        try {
          if (name.includes('.md')) name = name.substring(0, name.length - 3) //.md
          renameData.value.new_name = name
          orignalName.value = name
          renameData.value.id = nV.id
        } catch {
          //
        }
      },
      {
        immediate: true,
      }
    )

    watch(
      () => props.run,
      (nV) => {
        if (nV) {
          nameChecker()
        }
      }
    )

    return {
      store,
      renameData,
      content_status,
      auto_save,
      editORadd,
    }
  },
})
</script>

<style lang="sass" scoped>
@keyframes showHide
  0%, 70%
    color: rgba(140, 186, 233, 1)
  100%
    color: rgba(140, 186, 233, 0)
.left
  display: flex
  margin-left: 1rem
  align-items: center
  #filename
    display: flex
    align-items: center
    span, i
      color: #666
      font-style: italic
  .tag
    margin: 0 1rem
    display: flex
    flex-direction: column
    :deep(.el-tag)
      border-radius: 100px
  #auto
    font-size: 0.2em
    color: #868686
    margin-top: 1em
    animation: showHide 1s infinite
</style>
