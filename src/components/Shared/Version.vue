<template lang="pug">
#Version 
  .top {{title.Name}}
  .bottom
    span.name {{title.Tile}}
    el-select(
      v-model="ver" 
      popper-class='md-version-select'
      @change="handleChange" 
    )
      el-option(
        v-for="item in version"
        :key="item"
        :label="item"
        :value="item"
      )
        span {{item}}
        .btns
          i.edit.el-icon-edit(
            v-if="ShowBtns.update"
            @click.stop="renameVersion(item)"
          )
          i.dele.el-icon-delete(
            v-if="ShowBtns.delete"
            @click.stop="deleVersion(item)"
          )
      el-option(
        v-if="ShowBtns.create"
        value=""
      )
        el-button.md-select-word(
          type="primary" plain
          icon="el-icon-plus"
          @click="addVersion"
          size="mini"
        ) 新增
  NewAndRenameVersion(@reload="handleChange")
</template>

<script>
import { defineComponent, ref, watch, computed, onMounted } from 'vue'
import NewAndRenameVersion from './components/NewAndRenameVersion.vue'
// import router from '@router'
import { useStore } from 'vuex'
import { ElMessageBox, ElMessage } from 'element-plus'
import versionApi from '@api/version'

export default defineComponent({
  name: 'Version',
  components: {
    NewAndRenameVersion,
  },
  emits: ['reloadTree', 'reloadVersion'],
  setup(props, { emit }) {
    const store = useStore()
    const version = computed(() => store.state.initial.version)
    const title = computed(() => store.state.initial.title)
    const usedVersion = computed(() => store.state.status.usedVersion)
    const ver = ref(usedVersion.value)
    const ShowBtns = ref({})

    const handleChange = async (val) => {
      if (val) {
        await store.commit('status/setVersion', val)
        emit('reloadTree')
      }
    }

    const renameVersion = async (name) => {
      store.dispatch('panels/openDialog', { type: 'version', rename: name })
    }

    const deleVersion = async (name) => {
      let msg = '將會刪除此資料夾'
      ElMessageBox.confirm(msg, `確定刪除?`, {
        confirmButtonText: '確認',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          //確定
          runDel(name)
        })
        .catch(() => {
          //取消
        })
    }

    const runDel = async (name) => {
      await versionApi
        .DeleVersion({
          folder_path: 'data/markdown/' + name,
        })
        .then(() => {
          ElMessage({
            message: '刪除成功',
            type: 'success',
          })
        })
      if (store.state.status.usedVersion == name) emit('reloadVersion')
      else emit('reloadTree')
    }

    const addVersion = async () => {
      store.dispatch('panels/openDialog', { type: 'version', rename: '' })
    }

    watch(usedVersion, (val) => {
      ver.value = val
    })

    onMounted(() => {
      // ShowBtns.value = router.currentRoute.value.meta.actions
      ShowBtns.value = store.state.status.ShowBtns
    })

    return {
      ver,
      title,
      name,
      store,
      handleChange,
      addVersion,
      renameVersion,
      deleVersion,
      ShowBtns,
      version,
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
    :deep(.el-select)
      width: 130px
      .el-input__inner
        height: 30px
        background: transparent
        border-color: #777
      .el-input__suffix
        top: -5px
      .el-input__icon
        line-height: inherit
      .el-input__suffix-inner
        display: inline-block
</style>
