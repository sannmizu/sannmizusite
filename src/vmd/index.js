import Vue from 'vue'
import VMdEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-properties'
import createKatexPlugin from '@kangc/v-md-editor/lib/plugins/katex/cdn'
import createLineNumberPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index'
import createHighlightLinesPlugin from '@kangc/v-md-editor/lib/plugins/highlight-lines/index'
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index'

VMdEditor.use(vuepressTheme).use(createKatexPlugin()).use(createLineNumberPlugin()).use(createHighlightLinesPlugin()).use(createCopyCodePlugin())

Vue.use(VMdEditor)