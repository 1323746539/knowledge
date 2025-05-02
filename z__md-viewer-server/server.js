import express from 'express';
import { readFileSync, readdirSync, existsSync, statSync, mkdirSync, copyFileSync, createWriteStream } from 'fs';
import { join, normalize, dirname, relative, basename, extname } from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 创建临时静态资源目录
const STATIC_DIR = join(__dirname, 'static_assets');
if (!existsSync(STATIC_DIR)) {
  mkdirSync(STATIC_DIR, { recursive: true });
}

// 启用CORS
app.use(cors());

// 提供静态文件服务
app.use('/static', express.static(STATIC_DIR));

// 提供所有static文件夹的静态文件服务
const rootDir = join(__dirname, '..');
app.use('/original-static', (req, res, next) => {
  const requestPath = req.path;
  console.log(`收到原始静态资源请求: ${requestPath}`);
  
  // 获取文档文件夹
  const docFolders = readdirSync(rootDir).filter(item => {
    const itemPath = join(rootDir, item);
    return statSync(itemPath).isDirectory() && 
           !item.startsWith('.') && 
           item !== 'node_modules' &&
           item !== 'z__md-viewer' &&
           item !== 'z__md-viewer-server';
  });
  
  // 尝试在每个文档文件夹下查找静态资源
  for (const folder of docFolders) {
    const staticPath = join(rootDir, folder, 'static');
    const filePath = join(staticPath, requestPath);
    
    if (existsSync(filePath) && statSync(filePath).isFile()) {
      console.log(`找到静态资源: ${filePath}`);
      return res.sendFile(filePath);
    }
  }
  
  next();
});

// 针对./static/开头的路径提供服务
app.use('/doc-static', (req, res) => {
  const parts = req.path.split('/');
  const folderPrefix = parts[1]; // 文件夹前缀，如 'a'
  const remainingPath = parts.slice(2).join('/'); // 剩余路径
  console.log('-------', folderPrefix, remainingPath);
  
  if (!folderPrefix) {
    return res.status(404).send('找不到资源');
  }
  
  // 获取根目录
  const rootDir = join(__dirname, '..');
  
  // 获取所有文档类文件夹
  const docFolders = readdirSync(rootDir).filter(item => {
    const itemPath = join(rootDir, item);
    return statSync(itemPath).isDirectory() && 
           !item.startsWith('.') && 
           item !== 'node_modules' &&
           item !== 'z__md-viewer' &&
           item !== 'z__md-viewer-server' &&
           item.startsWith(folderPrefix + '_');
  });
  
  // 寻找匹配的文件夹
  let found = false;
  for (const folder of docFolders) {
    const staticPath = join(rootDir, folder, 'static', remainingPath);
    console.log(`尝试访问静态资源: ${staticPath}`);
    
    if (existsSync(staticPath) && statSync(staticPath).isFile()) {
      return res.sendFile(staticPath);
    }
  }
  
  // 如果在文档文件夹中找不到，尝试在static_assets中查找
  const staticAssetPath = join(STATIC_DIR, `${folderPrefix}_static_${remainingPath}`);
  console.log(`尝试访问静态资源资产: ${staticAssetPath}`);
  
  if (existsSync(staticAssetPath) && statSync(staticAssetPath).isFile()) {
    return res.sendFile(staticAssetPath);
  }
  
  res.status(404).send('找不到资源');
});

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

// 递归查找static文件夹的函数
const findStaticFolders = (dir) => {
  let results = [];
  try {
    const list = readdirSync(dir);
    
    list.forEach(file => {
      const filePath = join(dir, file);
      
      try {
        const stat = statSync(filePath);
        
        if (stat.isDirectory()) {
          if (file === 'static') {
            results.push(filePath);
          } else {
            // 递归查找子目录中的static文件夹
            results = results.concat(findStaticFolders(filePath));
          }
        }
      } catch (err) {
        console.warn(`Warning: Could not access ${filePath}`, err.message);
      }
    });
  } catch (err) {
    console.warn(`Warning: Could not read directory ${dir}`, err.message);
  }
  
  return results;
};

// 收集静态资源的函数
const collectStaticResources = () => {
  console.log('------------------------------');
  console.log('开始收集静态资源...');
  
  // 获取根目录
  const rootDir = join(__dirname, '..');
  
  // 获取所有文档类文件夹
  const docFolders = readdirSync(rootDir).filter(item => {
    const itemPath = join(rootDir, item);
    return statSync(itemPath).isDirectory() && 
           !item.startsWith('.') && 
           item !== 'node_modules' &&
           item !== 'z__md-viewer' &&
           item !== 'z__md-viewer-server';
  });
  
  console.log(`发现 ${docFolders.length} 个文档文件夹：`, docFolders.join(', '));
  
  // 统计信息
  let totalStaticFolders = 0;
  let totalImageFiles = 0;
  
  // 查找所有static文件夹并复制图片
  docFolders.forEach(folder => {
    const folderPath = join(rootDir, folder);
    const folderPrefix = folder.charAt(0); // 获取文件夹前缀，如'a'或'n'
    
    const staticFolders = findStaticFolders(folderPath);
    totalStaticFolders += staticFolders.length;
    
    if (staticFolders.length > 0) {
      console.log(`- 在 ${folder} 中找到 ${staticFolders.length} 个静态资源文件夹`);
    }
    
    let folderImageCount = 0;
    
    staticFolders.forEach(staticFolder => {
      try {
        const files = readdirSync(staticFolder);
        const imageFiles = files.filter(file => isImageFile(file));
        
        folderImageCount += imageFiles.length;
        totalImageFiles += imageFiles.length;
        
        if (imageFiles.length > 0) {
          console.log(`  - 在 ${relative(rootDir, staticFolder)} 中找到 ${imageFiles.length} 个图片文件`);
        }
        
        imageFiles.forEach(file => {
          const filePath = join(staticFolder, file);
          
          try {
            // 构建新的文件名: 前缀_static_原始文件名
            const newFileName = `${folderPrefix}_static_${file}`;
            const targetPath = join(STATIC_DIR, newFileName);
            
            // 复制文件
            copyFileSync(filePath, targetPath);
            
            // 记录映射关系以供替换使用
            const relativePath = relative(rootDir, filePath);
            staticFileMap[relativePath] = `/static/${newFileName}`;
            
            // 添加额外的简化映射
            staticFileMap[`${folderPrefix}/${file}`] = `/static/${newFileName}`;
          } catch (err) {
            console.warn(`    警告: 无法处理文件 ${filePath}`, err.message);
          }
        });
      } catch (err) {
        console.warn(`  警告: 无法读取静态文件夹 ${staticFolder}`, err.message);
      }
    });
  });
  
  console.log('------------------------------');
  console.log(`静态资源收集完成:`);
  console.log(`- 共扫描了 ${docFolders.length} 个文档文件夹`);
  console.log(`- 发现了 ${totalStaticFolders} 个静态资源文件夹`);
  console.log(`- 收集了 ${totalImageFiles} 个图片文件`);
  console.log(`- 静态资源服务地址: http://localhost:${PORT}/static/`);
  console.log('------------------------------');
};

// 检查文件是否为图片
const isImageFile = (file) => {
  const ext = extname(file).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(ext);
};

// 静态文件映射表
const staticFileMap = {};

// 替换Markdown内容中的图片路径
const replaceImagePaths = (content, basePath) => {
  // 正则表达式匹配HTML中的img标签
  const htmlImgRegex = /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/g;
  // 正则表达式匹配Markdown中的图片语法 ![alt](url)
  const mdImgRegex = /!\[(.*?)\]\(([^)]+)\)/g;
  
  console.log(`处理文件 ${basePath} 中的图片路径`);
  
  // 获取当前文件所在的文档文件夹
  const pathParts = basePath.split('/');
  const docFolder = pathParts[0]; // 文档文件夹名称，如 a__HTML
  const folderPrefix = docFolder.charAt(0); // 获取文件夹前缀，如 'a'
  
  // 处理HTML中的img标签
  let processedContent = content.replace(htmlImgRegex, (match, src) => {
    console.log(`发现图片: ${src}`);
    
    // 处理 ./static/ 格式的路径
    if (src.startsWith('./static/')) {
      const imgPath = src.substring('./static/'.length);
      const newSrc = `http://localhost:${PORT}/doc-static/${folderPrefix}/${imgPath}`;
      console.log(`替换./static/路径为: ${newSrc}`);
      return match.replace(src, newSrc);
    }
    
    // 处理 ../static/ 格式的路径
    if (src.startsWith('../static/')) {
      const imgPath = src.substring('../static/'.length);
      const newSrc = `http://localhost:${PORT}/doc-static/${folderPrefix}/${imgPath}`;
      console.log(`替换../static/路径为: ${newSrc}`);
      return match.replace(src, newSrc);
    }
    
    // 处理其他相对路径
    if (src.startsWith('../') || src.startsWith('./') || src.includes('/static/')) {
      // 提取图片文件名
      const imgName = basename(src);
      console.log(`图片文件名: ${imgName}`);
      
      // 计算绝对路径
      const absolutePath = normalize(join(dirname(join(__dirname, '..', basePath)), src));
      const relPath = relative(join(__dirname, '..'), absolutePath);
      console.log(`相对路径: ${relPath}`);
      
      // 先尝试直接匹配
      if (staticFileMap[relPath]) {
        const newSrc = `http://localhost:${PORT}${staticFileMap[relPath]}`;
        console.log(`替换为: ${newSrc}`);
        return match.replace(src, newSrc);
      }
      
      // 尝试通过文件名查找
      const possibleKeys = Object.keys(staticFileMap).filter(key => key.endsWith(imgName));
      if (possibleKeys.length > 0) {
        const newSrc = `http://localhost:${PORT}${staticFileMap[possibleKeys[0]]}`;
        console.log(`通过文件名找到匹配: ${newSrc}`);
        return match.replace(src, newSrc);
      }
      
      // 最后尝试查找类似的路径
      const similarKeys = Object.keys(staticFileMap).filter(key => {
        const keyParts = key.split('/');
        const srcParts = src.split('/');
        return keyParts[keyParts.length - 1] === srcParts[srcParts.length - 1] && 
               keyParts[keyParts.length - 2] === 'static';
      });
      
      if (similarKeys.length > 0) {
        const newSrc = `http://localhost:${PORT}${staticFileMap[similarKeys[0]]}`;
        console.log(`通过路径模式找到匹配: ${newSrc}`);
        return match.replace(src, newSrc);
      }
      
      // 如果找不到映射，使用简化的静态资源服务路径
      const newSrc = `http://localhost:${PORT}/doc-static/${folderPrefix}/${imgName}`;
      console.log(`使用简化路径: ${newSrc}`);
      return match.replace(src, newSrc);
    }
    
    return match;
  });
  
  // 处理Markdown中的图片语法
  processedContent = processedContent.replace(mdImgRegex, (match, alt, src) => {
    console.log(`发现Markdown图片: ${src}`);
    
    // 处理 ./static/ 格式的路径
    if (src.startsWith('./static/')) {
      const imgPath = src.substring('./static/'.length);
      const newSrc = `http://localhost:${PORT}/doc-static/${folderPrefix}/${imgPath}`;
      return `![${alt}](${newSrc})`;
    }
    
    // 处理 ../static/ 格式的路径
    if (src.startsWith('../static/')) {
      const imgPath = src.substring('../static/'.length);
      const newSrc = `http://localhost:${PORT}/doc-static/${folderPrefix}/${imgPath}`;
      return `![${alt}](${newSrc})`;
    }
    
    // 处理其他相对路径
    if (src.startsWith('../') || src.startsWith('./') || src.includes('/static/')) {
      // 提取图片文件名
      const imgName = basename(src);
      
      // 计算绝对路径
      const absolutePath = normalize(join(dirname(join(__dirname, '..', basePath)), src));
      const relPath = relative(join(__dirname, '..'), absolutePath);
      
      // 先尝试直接匹配
      if (staticFileMap[relPath]) {
        return `![${alt}](http://localhost:${PORT}${staticFileMap[relPath]})`;
      }
      
      // 尝试通过文件名查找
      const possibleKeys = Object.keys(staticFileMap).filter(key => key.endsWith(imgName));
      if (possibleKeys.length > 0) {
        return `![${alt}](http://localhost:${PORT}${staticFileMap[possibleKeys[0]]})`;
      }
      
      // 最后尝试查找类似的路径
      const similarKeys = Object.keys(staticFileMap).filter(key => {
        const keyParts = key.split('/');
        const srcParts = src.split('/');
        return keyParts[keyParts.length - 1] === srcParts[srcParts.length - 1] && 
               keyParts[keyParts.length - 2] === 'static';
      });
      
      if (similarKeys.length > 0) {
        return `![${alt}](http://localhost:${PORT}${staticFileMap[similarKeys[0]]})`;
      }
      
      // 如果找不到映射，使用简化的静态资源服务路径
      const newSrc = `http://localhost:${PORT}/doc-static/${folderPrefix}/${imgName}`;
      return `![${alt}](${newSrc})`;
    }
    
    return match;
  });
  
  return processedContent;
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
             item !== 'z__md-viewer' &&
             item !== 'z__md-viewer-server';
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
    let content = readFileSync(normalizedPath, 'utf-8');
    
    // 替换图片路径
    content = replaceImagePaths(content, req.params.path);
    
    res.set('Content-Type', 'text/plain');
    res.send(content);
  } catch (error) {
    console.error('Error reading file content:', error);
    res.status(500).json({ error: '无法读取文件内容' });
  }
});

// 获取静态资源映射表
app.get('/api/static-map', (req, res) => {
  res.json({
    count: Object.keys(staticFileMap).length,
    map: staticFileMap
  });
});

// 启动服务器前先收集静态资源
collectStaticResources();

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
}); 