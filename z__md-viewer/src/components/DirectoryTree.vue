<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const props = defineProps({
  structure: {
    type: Object,
    required: true
  },
  baseFolder: {
    type: String,
    required: true
  }
});

const router = useRouter();
const route = useRoute();

const toggleDir = (dir) => {
  dir.isOpen = !dir.isOpen;
};

const openFile = (filePath) => {
  router.push(`/view/${filePath}`);
};

// 计算当前文件是否处于活动状态
const isActive = (filePath) => {
  return route.params.path === filePath;
};
</script>

<template>
  <div class="directory-tree">
    <!-- 文件列表 -->
    <div v-if="structure.files && structure.files.length > 0">
      <ul class="file-list">
        <li 
          v-for="file in structure.files" 
          :key="file.path"
          :class="{ active: isActive(file.path) }"
          @click="openFile(file.path)"
        >
          <span class="file-icon">📄</span>
          <span class="file-name">{{ file.name }}</span>
        </li>
      </ul>
    </div>
    
    <!-- 子目录 -->
    <div v-if="structure.children && structure.children.length > 0">
      <div 
        v-for="dir in structure.children" 
        :key="dir.path"
        class="directory"
      >
        <div 
          class="directory-header"
          @click="toggleDir(dir)"
        >
          <span class="directory-icon">{{ dir.isOpen ? '📂' : '📁' }}</span>
          <span class="directory-name">{{ dir.name }}</span>
        </div>
        
        <!-- 递归渲染子目录 -->
        <div v-if="dir.isOpen" class="subdirectory">
          <DirectoryTree 
            :structure="dir" 
            :base-folder="baseFolder" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.directory-tree {
  margin-left: 0.5rem;
  user-select: none;
}

.directory {
  &-header {
    display: flex;
    align-items: center;
    padding: 0.25rem 0;
    cursor: pointer;
    border-radius: 4px;

    &:hover {
      background-color: #e0e0e0;
    }
  }

  &-icon {
    margin-right: 0.5rem;
  }
}

.file {
  &-icon {
    margin-right: 0.5rem;
  }

  &-list {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      display: flex;
      align-items: center;
      padding: 0.25rem 0;
      cursor: pointer;
      border-radius: 4px;

      &:hover {
        background-color: #e0e0e0;
      }

      &.active {
        background-color: #42b883;
        color: white;
      }
    }
  }
}

.subdirectory {
  margin-left: 1rem;
  border-left: 1px solid #e0e0e0;
  padding-left: 0.5rem;
}
</style> 