<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const folders = ref([])
const router = useRouter()
const API_BASE_URL = 'http://localhost:3000'
const isRefreshing = ref(false)
const refreshMessage = ref(null)

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

// 刷新静态资源
const refreshStaticResources = async () => {
  if (isRefreshing.value) return;
  
  isRefreshing.value = true;
  refreshMessage.value = null;
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/refresh-static`);
    const data = await response.json();
    
    if (data.success) {
      refreshMessage.value = {
        type: 'success',
        text: '静态资源刷新成功！' + new Date().toLocaleTimeString()
      };
    } else {
      refreshMessage.value = {
        type: 'error',
        text: '刷新失败，请重试'
      };
    }
    
    // 5秒后自动隐藏消息
    setTimeout(() => {
      refreshMessage.value = null;
    }, 5000);
    
  } catch (error) {
    console.error('刷新静态资源失败:', error);
    refreshMessage.value = {
      type: 'error',
      text: '刷新失败，请检查服务器连接'
    };
  } finally {
    isRefreshing.value = false;
  }
}
</script>

<template>
  <div class="container">
    <h1>白宇前端</h1>
    
    <div class="actions">
      <button 
        @click="refreshStaticResources" 
        :disabled="isRefreshing"
        class="refresh-button"
      >
        {{ isRefreshing ? '刷新中...' : '刷新静态资源' }}
      </button>
    </div>
    
    <div v-if="refreshMessage" class="message" :class="refreshMessage.type">
      {{ refreshMessage.text }}
    </div>
    
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
  position: relative;
}

h1 {
  text-align: center;
  margin-bottom: 1rem;
  color: #2c3e50;
  user-select: none;
}

.actions {
  display: flex;
  justify-content: center;
  position: absolute;
  top: 20px;
  right: 20px;
}

.refresh-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #45a049;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
}

.message {
  text-align: center;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 2rem;
  
  &.success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }
  
  &.error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
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