<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import MarkdownIt from 'markdown-it'

const route = useRoute()
const markdownContent = ref('')
const htmlContent = ref('')
const files = ref([])
const md = new MarkdownIt()
const isLoading = ref(true)
const error = ref(null)
const API_BASE_URL = 'http://localhost:3000'

// 获取文件夹中的文件列表
const fetchFiles = async (folder) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/files/${folder}`)
    files.value = await response.json()
  } catch (err) {
    console.error('获取文件列表失败:', err)
    error.value = '获取文件列表失败'
  }
}

// 获取并渲染Markdown文件
const fetchMarkdown = async (folder, file) => {
  isLoading.value = true
  error.value = null
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/content/${folder}/${file}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    markdownContent.value = await response.text()
    htmlContent.value = md.render(markdownContent.value)
  } catch (err) {
    console.error('获取Markdown内容失败:', err)
    error.value = '获取文档内容失败'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  const { folder, file } = route.params
  fetchFiles(folder)
  fetchMarkdown(folder, file)
})

watch(() => route.params, (newParams) => {
  const { folder, file } = newParams
  fetchMarkdown(folder, file)
}, { deep: true })
</script>

<template>
  <div class="markdown-viewer">
    <div class="sidebar">
      <h3>{{ route.params.folder }}</h3>
      <ul class="file-list">
        <li 
          v-for="file in files" 
          :key="file"
          :class="{ active: file === route.params.file }"
        >
          <router-link :to="`/${route.params.folder}/${file}`">
            {{ file }}
          </router-link>
        </li>
      </ul>
    </div>
    
    <div class="content">
      <div v-if="isLoading" class="loading">
        加载文档中...
      </div>
      
      <div v-else-if="error" class="error">
        {{ error }}
      </div>
      
      <div v-else class="markdown-content" v-html="htmlContent"></div>
    </div>
  </div>
</template>

<style scoped>
.markdown-viewer {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 250px;
  background-color: #f5f5f5;
  padding: 1rem;
  border-right: 1px solid #e0e0e0;
}

.sidebar h3 {
  margin-top: 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.file-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.file-list li {
  padding: 0.5rem 0;
}

.file-list li a {
  color: #2c3e50;
  text-decoration: none;
  display: block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.file-list li a:hover {
  background-color: #e0e0e0;
}

.file-list li.active a {
  background-color: #42b883;
  color: white;
}

.content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.loading, .error {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #666;
}

.error {
  color: #e53935;
}

.markdown-content {
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
}

.markdown-content :deep(h1) {
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3rem;
}

.markdown-content :deep(pre) {
  background-color: #f6f8fa;
  border-radius: 6px;
  padding: 16px;
  overflow: auto;
}

.markdown-content :deep(code) {
  background-color: #f6f8fa;
  padding: 0.2em 0.4em;
  border-radius: 3px;
}

.markdown-content :deep(blockquote) {
  border-left: 4px solid #dfe2e5;
  padding: 0 1em;
  color: #6a737d;
  margin: 0;
}

.markdown-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 1rem 0;
}

.markdown-content :deep(th), .markdown-content :deep(td) {
  border: 1px solid #dfe2e5;
  padding: 8px 12px;
}

.markdown-content :deep(th) {
  background-color: #f6f8fa;
  font-weight: 600;
}
</style> 