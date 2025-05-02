<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const folders = ref([])
const router = useRouter()
const API_BASE_URL = 'http://localhost:3000'

onMounted(async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/folders`)
    folders.value = await response.json()
  } catch (error) {
    console.error('获取文件夹失败:', error)
  }
})

const navigateToFolder = (folder) => {
  router.push(`/${folder}`)
}

const formatFolderName = (folder) => {
  return folder.split('__')[1]
}
</script>

<template>
  <div class="container">
    <h1>知识库浏览器</h1>
    
    <div v-if="folders.length === 0" class="loading">
      加载文件夹中...
    </div>
    
    <div v-else class="folder-grid">
      <div 
        v-for="folder in folders" 
        :key="folder" 
        class="folder-card"
        @click="navigateToFolder(folder)"
      >
        <div class="folder-icon">📁</div>
        <div class="folder-name">{{ formatFolderName(folder) }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
  user-select: none;
}

.loading {
  text-align: center;
  margin-top: 2rem;
  font-size: 1.2rem;
  color: #666;
}

.folder {
  &-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  &-card {
    background-color: #f5f5f5;
    border-radius: 8px;
    padding: 1.5rem;
    text-align: center;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }
  }

  &-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  &-name {
    font-size: 1rem;
    font-weight: 500;
    color: #2c3e50;
    user-select: none;
  }
}
</style> 