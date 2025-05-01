import express from 'express';
import { readFileSync, readdirSync, existsSync, statSync } from 'fs';
import { join, normalize, dirname, relative } from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 启用CORS
app.use(cors());

// 递归读取目录的函数
const readDirRecursively = (dir) => {
  let results = [];
  const list = readdirSync(dir);
  
  list.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      // 递归读取子目录
      results = results.concat(readDirRecursively(filePath));
    } else if (file.endsWith('.md')) {
      // 添加markdown文件
      results.push(filePath);
    }
  });
  
  return results;
};

// 构建目录树的函数
const buildDirectoryTree = (dir, rootDir) => {
  const tree = { name: dirname(dir).split('/').pop(), path: relative(rootDir, dir), children: [] };
  
  const items = readdirSync(dir);
  
  // 先处理文件夹
  const directories = items.filter(item => {
    const itemPath = join(dir, item);
    return statSync(itemPath).isDirectory();
  });
  
  directories.forEach(directory => {
    const directoryPath = join(dir, directory);
    const subTree = buildDirectoryTree(directoryPath, rootDir);
    // 只添加有markdown文件的目录
    if (subTree.children.length > 0 || subTree.files.length > 0) {
      tree.children.push(subTree);
    }
  });
  
  // 再处理文件
  tree.files = items
    .filter(item => {
      const itemPath = join(dir, item);
      return statSync(itemPath).isFile() && item.endsWith('.md');
    })
    .map(file => ({
      name: file,
      path: relative(rootDir, join(dir, file))
    }));
  
  return tree;
};

// 获取所有文件夹
app.get('/api/folders', (req, res) => {
  try {
    const rootDir = join(__dirname, '..');
    const items = readdirSync(rootDir);
    
    // 过滤出目录，并排除node_modules和.git等文件夹
    const folders = items.filter(item => {
      const itemPath = join(rootDir, item);
      return statSync(itemPath).isDirectory() && 
             !item.startsWith('.') && 
             item !== 'node_modules' &&
             item !== 'md-viewer' &&
             item !== 'md-viewer-server';
    });
    
    res.json(folders);
  } catch (error) {
    console.error('Error reading folders:', error);
    res.status(500).json({ error: '无法读取文件夹' });
  }
});

// 获取指定文件夹的目录结构（包括子目录和文件）
app.get('/api/structure/:folder', (req, res) => {
  try {
    const rootDir = join(__dirname, '..');
    const folderPath = join(rootDir, req.params.folder);
    
    // 确保路径存在且是目录
    if (!existsSync(folderPath) || !statSync(folderPath).isDirectory()) {
      return res.status(404).json({ error: '文件夹不存在' });
    }
    
    const structure = buildDirectoryTree(folderPath, rootDir);
    res.json(structure);
  } catch (error) {
    console.error('Error reading directory structure:', error);
    res.status(500).json({ error: '无法读取目录结构' });
  }
});

// 获取指定文件夹中的所有markdown文件（包括子目录）
app.get('/api/files/:folder', (req, res) => {
  try {
    const rootDir = join(__dirname, '..');
    const folderPath = join(rootDir, req.params.folder);
    
    // 确保路径存在且是目录
    if (!existsSync(folderPath) || !statSync(folderPath).isDirectory()) {
      return res.status(404).json({ error: '文件夹不存在' });
    }
    
    // 递归读取所有markdown文件
    const allFiles = readDirRecursively(folderPath);
    
    // 构造文件信息
    const files = allFiles.map(file => ({
      name: file.split('/').pop(),
      path: relative(rootDir, file),
      relativePath: relative(folderPath, file)
    }));
    
    res.json(files);
  } catch (error) {
    console.error('Error reading files:', error);
    res.status(500).json({ error: '无法读取文件' });
  }
});

// 获取指定文件的内容
app.get('/api/content/:path(*)', (req, res) => {
  try {
    const filePath = join(__dirname, '..', req.params.path);
    
    // 安全检查：确保路径是预期的目录内的文件
    const normalizedPath = normalize(filePath);
    const rootDir = join(__dirname, '..');
    
    if (!normalizedPath.startsWith(rootDir) || !existsSync(normalizedPath)) {
      return res.status(404).json({ error: '文件不存在' });
    }
    
    // 读取文件内容
    const content = readFileSync(normalizedPath, 'utf-8');
    res.set('Content-Type', 'text/plain');
    res.send(content);
  } catch (error) {
    console.error('Error reading file content:', error);
    res.status(500).json({ error: '无法读取文件内容' });
  }
});

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
}); 