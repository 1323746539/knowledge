<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import MarkdownIt from 'markdown-it'

const route = useRoute()
const markdownContent = ref('')
const htmlContent = ref('')
const isLoading = ref(true)
const error = ref(null)
// 配置 MarkdownIt 允许 HTML
const md = new MarkdownIt({
  html: true,        // 启用 HTML 标签
  breaks: true,      // 转换段落里的 '\n' 到 <br>
  linkify: true      // 自动转换 URL 为链接
})
const API_BASE_URL = 'http://localhost:3000'

// 获取并渲染Markdown文件
const fetchMarkdown = async (path) => {
  isLoading.value = true
  error.value = null
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/content/${path}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    markdownContent.value = await response.text()
    
    // 渲染 Markdown 内容为 HTML
    let renderedContent = md.render(markdownContent.value)
    
    // 对于文档中直接写的 HTML 标签，已经在服务端处理过图片路径
    // 但需要确保它们被正确渲染，而不是被转义
    htmlContent.value = renderedContent
    
    console.log('渲染后的HTML内容', htmlContent.value)
  } catch (err) {
    console.error('获取Markdown内容失败:', err)
    error.value = '获取文档内容失败'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  const { path } = route.params
  if (path) {
    fetchMarkdown(path)
  }
})

watch(() => route.params.path, (newPath) => {
  if (newPath) {
    fetchMarkdown(newPath)
  }
})
</script>

<template>
  <div class="markdown-view">
    <div v-if="isLoading" class="loading">
      加载文档中...
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-else class="markdown-content" v-html="htmlContent"></div>
  </div>
</template>

<style lang="less" scoped>
.markdown-view {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
}

.loading, .error {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #666;
}

.error {
  color: #e53935;
}

.markdown-content {
  line-height: 1.6;
  
  :deep(h1) {
    border-bottom: 1px solid #eaecef;
    padding-bottom: 0.3rem;
  }
  
  :deep(pre) {
    background-color: #f6f8fa;
    border-radius: 6px;
    padding: 16px;
    overflow: auto;
  }
  
  :deep(code) {
    background-color: #f6f8fa;
    padding: 0.2em 0.4em;
    border-radius: 3px;
  }
  
  :deep(blockquote) {
    border-left: 4px solid #dfe2e5;
    padding: 0 1em;
    color: #6a737d;
    margin: 0;
  }
  
  :deep(table) {
    border-collapse: collapse;
    width: 100%;
    margin: 1rem 0;
  }
  
  :deep(th), :deep(td) {
    border: 1px solid #dfe2e5;
    padding: 8px 12px;
  }
  
  :deep(th) {
    background-color: #f6f8fa;
    font-weight: 600;
  }
  
  :deep(img) {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 1rem auto;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}
</style> 