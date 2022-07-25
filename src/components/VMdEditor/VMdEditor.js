import VMdEditor from '@kangc/v-md-editor/lib/codemirror-editor'
import '@kangc/v-md-editor/lib/style/codemirror-editor.css'

import '@kangc/v-md-editor/lib/style/base-editor.css'
// import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'

//tip
import createTipPlugin from '@kangc/v-md-editor/lib/plugins/tip/index'
import '@kangc/v-md-editor/lib/plugins/tip/tip.css'

import '@kangc/v-md-editor/lib/theme/style/github.css'
// highlightjs
import hljs from 'highlight.js'
//
import '@kangc/v-md-editor/lib/style/base-editor.css'
import '@kangc/v-md-editor/lib/theme/style/vuepress.css'
//emoji
import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index'
import '@kangc/v-md-editor/lib/plugins/emoji/emoji.css'
//language
import zhTW from '@kangc/v-md-editor/lib/lang/zh-TW'
//align
import createAlignPlugin from '@kangc/v-md-editor/lib/plugins/align'
// codemirror 编辑器的相关资源
import Codemirror from 'codemirror'
// mode
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/css/css'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/mode/vue/vue'
// edit
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/matchbrackets'
// placeholder
import 'codemirror/addon/display/placeholder'
// active-line
import 'codemirror/addon/selection/active-line'
// scrollbar
import 'codemirror/addon/scroll/simplescrollbars'
import 'codemirror/addon/scroll/simplescrollbars.css'
// style
import 'codemirror/lib/codemirror.css'
import Prism from 'prismjs'

// 按需引入语言包
import json from 'highlight.js/lib/languages/json'
import bash from 'highlight.js/lib/languages/bash'
import powershell from 'highlight.js/lib/languages/powershell'
import typescript from 'highlight.js/lib/languages/typescript'

hljs.registerLanguage('json', json)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('powershell', powershell)

VMdEditor.Codemirror = Codemirror
VMdEditor.use(githubTheme, {
  Hljs: hljs,
  Prism,
})
VMdEditor.use(createAlignPlugin())
VMdEditor.use(createTipPlugin())
VMdEditor.lang.use('en-US', zhTW)
VMdEditor.use(createEmojiPlugin())
export default VMdEditor
