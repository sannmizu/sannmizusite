import Vue from 'vue'
import VueMarkdownEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js'
import '@kangc/v-md-editor/lib/theme/style/vuepress.css'

import createKatexPlugin from '@kangc/v-md-editor/lib/plugins/katex/cdn'
import createLineNumberPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index'
import createHighlightLinesPlugin from '@kangc/v-md-editor/lib/plugins/highlight-lines/index'
import '@kangc/v-md-editor/lib/plugins/highlight-lines/highlight-lines.css'
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index'
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css'

import Prism from 'prismjs'

VueMarkdownEditor.use(vuepressTheme, {
  Prism,
}).use(createKatexPlugin()).use(createLineNumberPlugin()).use(createHighlightLinesPlugin()).use(createCopyCodePlugin())

Vue.use(VueMarkdownEditor)