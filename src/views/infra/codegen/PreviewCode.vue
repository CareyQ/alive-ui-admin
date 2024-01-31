<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import * as CodegenApi from '@/api/infra/codegen'
import { handleTree } from '@/utils/tree'
// 导入代码高亮样式
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import java from 'highlight.js/lib/languages/java'
import xml from 'highlight.js/lib/languages/java'
import javascript from 'highlight.js/lib/languages/javascript'
import sql from 'highlight.js/lib/languages/sql'
import typescript from 'highlight.js/lib/languages/typescript'

const message = useMessage()

const dialogVisible = ref(false)
const loading = ref(false)

const previewCodegen = ref<CodegenApi.CodegenPreviewVO[]>()
const preview = reactive({
  fileTree: [], // 文件树
  activeName: '' // 激活的文件名
})

/** 生成 files 目录 **/
interface filesType {
  id: string
  label: string
  parentId: string
}

const open = async (tableId: number) => {
  dialogVisible.value = true
  try {
    loading.value = true
    const data = await CodegenApi.previewCodegen(tableId)
    previewCodegen.value = data

    let file = handleFiles(data)
    preview.fileTree = handleTree(file, 'id', 'parentId', 'children', '/')
    preview.activeName = data[0].filePath
  } finally {
    loading.value = false
  }
}
defineExpose({ open })

/** 处理文件 */
const handleFiles = (datas: CodegenApi.CodegenPreviewVO[]) => {
  let exists = {} // key：file 的 id；value：true
  let files: filesType[] = []
  // 遍历每个元素
  for (const data of datas) {
    let paths = data.filePath.split('/')
    let fullPath = '' // 从头开始的路径，用于生成 id
    // 特殊处理 java 文件
    if (paths[paths.length - 1].indexOf('.java') >= 0) {
      let newPaths: string[] = []
      for (let i = 0; i < paths.length; i++) {
        let path = paths[i]
        if (path !== 'java') {
          newPaths.push(path)
          continue
        }
        newPaths.push(path)
        // 特殊处理中间的 package，进行合并
        let tmp = ''
        while (i < paths.length) {
          path = paths[i + 1]
          if (
            path === 'controller' ||
            path === 'convert' ||
            path === 'dto' ||
            path === 'enums' ||
            path === 'service' ||
            path === 'vo' ||
            path === 'entity' ||
            path === 'mapper'
          ) {
            break
          }
          tmp = tmp ? tmp + '.' + path : path
          i++
        }
        if (tmp) {
          newPaths.push(tmp)
        }
      }
      paths = newPaths
    }
    // 遍历每个 path， 拼接成树
    for (let i = 0; i < paths.length; i++) {
      // 已经添加到 files 中，则跳过
      let oldFullPath = fullPath
      // 下面的 replaceAll 的原因，是因为上面包处理了，导致和 tabs 不匹配，所以 replaceAll 下
      fullPath = fullPath.length === 0 ? paths[i] : fullPath.replaceAll('.', '/') + '/' + paths[i]
      if (exists[fullPath]) {
        continue
      }
      // 添加到 files 中
      exists[fullPath] = true
      files.push({
        id: fullPath,
        label: paths[i],
        parentId: oldFullPath || '/' // "/" 为根节点
      })
    }
  }
  return files
}

/** 复制 **/
const copy = async (text: string) => {
  const { copy, copied, isSupported } = useClipboard({ source: text })
  if (!isSupported) {
    message.error('复制失败')
    return
  }
  await copy()
  if (unref(copied)) {
    message.success('复制成功')
  }
}

/**
 * 代码高亮
 */
const highlightedCode = (item) => {
  const language = item.filePath.substring(item.filePath.lastIndexOf('.') + 1)
  const result = hljs.highlight(item.code || '', { language, ignoreIllegals: true })
  return result.value || '&nbsp;'
}

/** 点击文件 */
const handleNodeClick = async (data, node) => {
  if (node && !node.isLeaf) {
    return false
  }
  preview.activeName = data.id
}

/** 初始化 **/
onMounted(async () => {
  // 注册代码高亮的各种语言
  hljs.registerLanguage('java', java)
  hljs.registerLanguage('xml', xml)
  hljs.registerLanguage('html', xml)
  hljs.registerLanguage('vue', xml)
  hljs.registerLanguage('javascript', javascript)
  hljs.registerLanguage('sql', sql)
  hljs.registerLanguage('typescript', typescript)
})
</script>

<template>
  <Dialog v-model="dialogVisible" title="代码预览" width="80%" align-center>
    <div class="flex preview-code justify-between">
      <el-scrollbar height="calc(100vh - 88px)">
        <el-tree
          ref="treeRef"
          :data="preview.fileTree"
          :expand-on-click-node="false"
          default-expand-all
          highlight-current
          node-key="id"
          @node-click="handleNodeClick"
        />
      </el-scrollbar>

      <el-tabs v-model="preview.activeName">
        <el-tab-pane
          v-for="item in previewCodegen"
          :key="item.filePath"
          :label="item.filePath.substring(item.filePath.lastIndexOf('/') + 1)"
          :name="item.filePath"
        >
          <el-button class="copy-btn" size="small" text type="primary" @click="copy(item.code)">复制</el-button>
          <el-scrollbar height="calc(100vh - 160px)">
            <pre><code v-dompurify-html="highlightedCode(item)" class="hljs"></code></pre>
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
    </div>
  </Dialog>
</template>

<style lang="scss" scoped>
.preview-code {
  > .el-scrollbar {
    width: 24%;
    min-width: 24%;
    padding-right: 10px;
    border-right: var(--dialog-header-border);
  }
}

.el-tabs {
  width: 75%;
}

.copy-btn {
  top: 0;
  right: 10px;
  position: absolute;
  z-index: 99;
}
</style>

<style lang="scss">
.preview-code {
  .el-scrollbar__wrap .el-scrollbar__view {
    white-space: nowrap;
    display: inline-block;
  }
}
</style>
