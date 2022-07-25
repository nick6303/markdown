<template lang="pug">
#PdfFormat(ref="pdfArea")
  .contentInner(style="width: 1142px")
    v-md-editor(
      v-model="contentMD" 
      height="100%"
      :mode="'preview'"
    )

</template>

<script>
import { useStore } from 'vuex'
import { defineComponent, ref, watch } from 'vue'
import { usePDF } from '@/utils/hooks'
import VMdEditor from '@c/VMdEditor/VMdEditor'

export default defineComponent({
  name: 'PdfFormat',
  components: {
    VMdEditor,
  },
  props: {
    run: Boolean,
  },
  emits: ['downloadOver'],
  setup(props, { emit }) {
    const store = useStore()
    const pdfArea = ref(null)
    const { downloadPDF } = usePDF(pdfArea)
    const contentMD = ref('')

    const downLoad = async () => {
      await downloadPDF(store.state.file.recentFile.name, '')
      emit('downloadOver')
    }

    watch(
      () => store.state.file.recentFile.content,
      (nV) => {
        contentMD.value = nV
      },
      {
        immediate: true,
      }
    )

    watch(
      () => props.run,
      (nV) => {
        if (nV) downLoad()
      }
    )

    return {
      pdfArea,
      contentMD,
    }
  },
})
</script>
