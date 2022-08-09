<template lang="pug">
#Version 
  .top {{webTitle.Name}}
  .bottom
    span.name {{webTitle.Tile}}
    el-dropdown(
      trigger="click"
    )
      el-button(size="mini")
        | {{usedVersion}}
        i.el-icon-arrow-down.el-icon--right
      template(#dropdown)
        el-dropdown-menu
          el-dropdown-item(
            v-for="item in versionList"
            :disabled="item === usedVersion"
          )
            router-link(:to="`/${item}`") {{item}}
            .btns
              i.el-icon-edit(
                v-if="ShowBtns.update"
                @click.stop="renameVersion(item)"
              )
              i.el-icon-delete(
                v-if="ShowBtns.delete"
                @click.stop="deleVersion(item)"
              )
          el-dropdown-item(v-if="ShowBtns.create")
            el-button.md-select-word(
              type="primary" plain
              icon="el-icon-plus"
              @click="addVersion"
              size="mini"
            ) 新增
  NewAndRenameVersion(@reload="handleChange")
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import NewAndRenameVersion from './components/NewAndRenameVersion.vue'
import { useStore } from 'vuex'
import { ElMessageBox, ElMessage } from 'element-plus'
import versionApi from '@api/version'
import router from '@/router'

export default defineComponent({
  name: 'Version',
  components: {
    NewAndRenameVersion,
  },
  props: {
    webTitle: Object,
    versionList: Array,
  },
  emits: ['reloadTreeStruct', 'reloadVersion'],
  setup(props, { emit }) {
    const store = useStore()
    const usedVersion = computed(() => store.state.status.usedVersion)
    const ver = ref(usedVersion.value)
    const ShowBtns = computed(() => router.currentRoute.value.meta.actions)
    const handleChange = async (val) => {
      if (val) {
        router.push({ path: `/${val}` })
        // emit('reloadTreeStruct')
      }
    }

    const renameVersion = async (name) => {
      store.dispatch('panels/openDialog', { type: 'version', rename: name })
    }

    const deleVersion = async (name) => {
      try {
        await ElMessageBox.confirm('將會刪除此資料夾', `確定刪除?`, {
          confirmButtonText: '確認',
          cancelButtonText: '取消',
          type: 'warning',
        })
        //確定
        runDel(name)
      } catch {
        // pass
      }
    }

    const runDel = async (name) => {
      try {
        await versionApi.DeleVersion({
          folder_path: 'data/markdown/' + name,
        })
        ElMessage({
          message: '刪除成功',
          type: 'success',
        })
        if (usedVersion.value === name) {
          emit('reloadVersion')
        } else {
          emit('reloadTreeStruct')
        }
      } catch {
        //pass
      }
    }

    const addVersion = async () => {
      store.dispatch('panels/openDialog', { type: 'version', rename: '' })
    }

    return {
      ver,
      handleChange,
      addVersion,
      renameVersion,
      deleVersion,
      ShowBtns,
      usedVersion,
    }
  },
})
</script>

<style lang="sass" scoped>
#Version
  border-bottom: 1px solid #c7c7c7
  padding: 16px
  .top
    font-size: 1.5em
    font-weight: 500
  .bottom
    display: flex
    align-items: center
    margin-top: 0.5rem
    .name
      width: 70%
      font-size: .8em
      color: #777
      font-weight: 600
    :deep(.el-dropdown)
      +size(150px,30px)
      .el-button
        font-size: 14px
        +size(100%,30px)
        background: transparent
        border-color: #777
        padding: 0 20px 0 5px
        position: relative
        i
          position: absolute
          top: 50%
          right: 5px
          transform: translateY(-50%)
</style>
<style lang="sass">
.el-dropdown-menu__item
  display: flex
  justify-content: space-between
  padding: 0 0 0 20px
  .el-button
    width: calc(100% - 20px)
    margin-right: 20px
    margin-top: 5px
  &:hover
    background-color: #f5f7fa !important
  &.is-disabled
    a
      cursor: not-allowed
  a
    flex: 1
  .btns
    margin-left: .8rem
    display: flex
    align-items: center
    i
      padding: 2px
      border-radius: 5px
      cursor: pointer
      &:hover
        color: #fff !important
      &.el-icon-edit
        color: #909399
        margin-right: .5em
        &:hover
          background-color: #686868
      &.el-icon-delete
        color: #F56C6C
        &:hover
          background-color: #F56C6C
</style>
