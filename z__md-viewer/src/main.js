import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import Home from './views/Home.vue'
import FolderView from './views/FolderView.vue'
import DocumentView from './views/DocumentView.vue'
import VueViewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/:folder', component: FolderView },
    { path: '/view/:path(.*)', component: DocumentView }
  ]
})

const app = createApp(App)

// 注册 v-viewer 指令
app.use(VueViewer)

app.use(router)
app.mount('#app')
