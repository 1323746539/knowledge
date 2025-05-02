<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DirectoryTree from '../components/DirectoryTree.vue';
import MarkdownView from './MarkdownView.vue';

const route = useRoute();
const router = useRouter();
const directoryStructure = ref(null);
const isLoading = ref(true);
const error = ref(null);
const API_BASE_URL = 'http://localhost:3000';

// 从路径中提取文件夹名称
const folderName = computed(() => {
  const path = route.params.path || '';
  return path.split('/')[0];
});

// 获取目录结构
const fetchDirectoryStructure = async (folder) => {
  isLoading.value = true;
  error.value = null;
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/structure/${folder}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // 为每个目录添加isOpen属性，控制展开/收起状态
    const addOpenState = (dir) => {
      dir.isOpen = true; // 默认展开
      if (dir.children && dir.children.length > 0) {
        dir.children.forEach(child => addOpenState(child));
      }
      return dir;
    };
    
    directoryStructure.value = addOpenState(data);
  } catch (err) {
    console.error('获取目录结构失败:', err);
    error.value = '获取目录结构失败';
  } finally {
    isLoading.value = false;
  }
};

const goBack = () => {
  router.push('/');
}

onMounted(() => {
  if (folderName.value) {
    fetchDirectoryStructure(folderName.value);
  }
});

watch(folderName, (newFolder) => {
  if (newFolder) {
    fetchDirectoryStructure(newFolder);
  }
});
</script>

<template>
  <div class="document-view">
    <div v-if="isLoading" class="loading">
      加载文件夹结构中...
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-else-if="directoryStructure" class="content-container">
      <div class="sidebar">
        <div class="folder-header">
          <h3 class="folder-name">{{ folderName }}</h3>
          <div class="back-button" @click="goBack">返回首页</div>
        </div>
        <DirectoryTree 
          :structure="directoryStructure" 
          :base-folder="folderName"
        />
      </div>
      
      <div class="content">
        <MarkdownView />
      </div>
    </div>
  </div>
</template>

<style scoped>
.document-view {
  display: flex;
  min-height: 100vh;
}

.loading, .error {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  color: #666;
}

.error {
  color: #e53935;
}

.content-container {
  display: flex;
  width: 100%;
}

.sidebar {
  width: 300px;
  background-color: #f5f5f5;
  padding: 1rem;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
  height: calc(100vh - 60px);
}

.sidebar .folder-header {
  margin-top: 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  .back-button {
    cursor: pointer;
    color: #666;
    padding: 5px 10px;
    &:hover {
      color: #333;
    }
  }
}

.content {
  flex: 1;
  overflow-y: auto;
  height: calc(100vh - 60px);
}
</style> 