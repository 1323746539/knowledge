
### 一、Web Workers 概述

#### 1.1 概念

- Web Workers 是 HTML5 中引入的一种新的线程机制，它允许在后台运行 JavaScript 代码，而不会阻塞主线程的执行。Web Workers 可以在不影响主线程的情况下执行耗时的计算任务，例如图像处理、音频处理、视频处理等。
- 主线程（或工作线程本身）可以启动任意数量的工作线程。生成 worker 脚本

#### 1.2 区别

- Web Workers 没有访问 DOM 或 UI 的权限，设计初衷就是用于不需要直接访问 UI 的任务
- Web Workers 被设计在与主线程分离的沙箱环境中运行，这意味着它们对系统资源的访问受到限制，不能访问某些 API，如 `localStorage`、`sessionStorage` 等

#### 1.3 重要性

- 提供资源利用率
- 增加稳定性和可靠性：独立的工作线程可以避免主线程被阻塞
- 增加安全性：独立的工作线程可以避免恶意代码对主线程的影响

### 二、Web Workers 客户端使用

- 新创建一个 js 文件，包含要在工作线程中运行的代码
- 使用 `self` 对象的 `onmessage` 属性监听主线程发送的消息 `event.data`，使用 `postMessage` 方法向主线程发送消息

```js
    self.onmessage = function(event) {
        console.log('Main: ' + event.data);
        self.postMessage('Hello, Main!');
    };
```

- 在主线程中使用 `Worker` 构造函数创建一个新的 `worker` 对象，传参就是上面新建的 js 文件的路径
- `onmessage` 用于处理从工作线程发送来的消息，`postMessage 用于向工作线程发送消息

```js
const worker = new Worker('worker.js');
worker.onmessage = function(event) {
  console.log('Worker: ' + event.data);
};
worker.postMessage('Hello, worker!');
```

- 可以使用 `terminate()` 函数来终止一个工作线程，或者通过调用 `self` 上的 `close()` 函数使其自行终止

```js
// 从应用中终止一个工作线程
worker.terminate();
// 让一个工作线程自行终止
self.close();
```

- 可以使用 `importScripts()` 函数将库或文件导入到工作线程中，该函数可以接受多个文件

```js
importScripts('script1.js','script2');
```

- 可以使用 `onerror` 函数来处理工作线程抛出的错误

```js
worker.onerror = function(err) { 
    console.log("遇到错误") 
}
```

### 三、Web Workers 应用场景

#### 3.1 处理 CPU 密集型任务

- 在主线程

```js
// 创建一个新的 Web Worker
const worker = new Worker('worker.js');
// 定义一个函数来处理来自Web Worker的消息
worker.onmessage = function(event) {
  const result = event.data;
  console.log(result);
};
// 向Web Worker发送一个消息，以启动计算
worker.postMessage({ num: 1000000 });
```

- 在工作线程 worker.js

```js
// 定义一个函数来执行计算
function compute(num) {
  let sum = 0;
  for (let i = 0; i < num; i++) {
    sum += i;
  }
  return sum;
}
// 定义一个函数来处理来自主线程的消息
onmessage = function(event) {
  const num = event.data.num;
  const result = compute(num);
  postMessage(result);
};
```

#### 3.2 处理网络请求

- 在主线程

```js
// 创建一个新的 Web Worker
const worker = new Worker('worker.js');
// 定义一个函数来处理来自Web Worker的消息
worker.onmessage = function(event) {
  const response = event.data;
  console.log(response);
};
// 向Web Worker发送一个消息，以启动计算
worker.postMessage({ urls: ['https://api.example.com/foo', 'https://api.example.com/bar'] });
```

- 在工作线程 worker.js

```js
// 定义一个函数来执行网络请求
function request(url) {
  return fetch(url).then(response => response.json());
}
// 定义一个函数来处理来自主线程的消息
onmessage = async function(event) {
  const urls = event.data.urls;
  const results = await Promise.all(urls.map(request));
  postMessage(results);
};
```

#### 3.3 并行处理

- 其实就是建立多个 worker 线程，然后将任务分配给每个线程

```js
// 创建三个新的 Web Worker
const worker1 = new Worker('worker.js');
const worker2 = new Worker('worker.js');
const worker3 = new Worker('worker.js');
// 定义三个处理来自 worker 的消息的函数
worker1.onmessage = handleWorkerMessage;
worker2.onmessage = handleWorkerMessage;
worker3.onmessage = handleWorkerMessage;
function handleWorkerMessage(event) {
  const result = event.data;
  console.log(result);
}
// 将任务分配给不同的 worker 对象，并发送消息启动计算
worker1.postMessage({ num: 1000000 });
worker2.postMessage({ num: 2000000 });
worker3.postMessage({ num: 3000000 });
```

### 四、Web Workers 注意事项

- 不能访问 DOM 或 UI
- 对资源访问受限，不能使用 `localStorage`、`sessionStorage` 等 API
- 浏览器支持
- 通信开销大
  - 主线程与工作线程之间通信有通信开销，可能导致信息处理延迟

### 五、Web Workers 最佳实践

- 消息批处理
  - worker.js 文件可以将处理的数据用数组存起来，存到一定数量一次发送给主线程
- 避免同步方法

```js
// 在Web Worker中
self.addEventListener('message', (event) => {
  if (event.data.action === 'start') {
    // 使用setTimeout来异步执行计算
    setTimeout(() => {
      const result = doSomeComputation(event.data.data);
      // 将结果发送回主线程
      self.postMessage({ action: 'result', data: result });
    }, 0);
  }
});
```

- 浏览器兼容性
- 注意内存使用情况
  - Web Workers 有自己的内存空间，这个空间根据用户的设备和浏览器设置可能是有限的