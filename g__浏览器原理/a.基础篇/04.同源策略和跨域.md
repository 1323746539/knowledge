
### 一、同源策略

- 跨域问题其实就是浏览器的同源策略造成的
- 同源策略是浏览器的一种安全机制，用于限制一个域下的文档或脚本如何与另一个域的资源进行交互
- 同源指的是协议、域名和端口号都相同

- 同源策略只是对 js 脚本的一种限制，并不是对浏览器的限制。因此，对于一般的 img、script 等标签都不会有跨域限制

### 二、如何解决跨域问题


#### 2.1 CORS 跨域资源共享

- CORS 需要浏览器和服务器同时支持，前端整个过程由浏览器自动完成，因此实现的关键在于服务器，只要服务器支持 CORS，就可以跨域

- 浏览器将 CORS 请求分成两类：简单请求和非简单请求

- 简单请求不会触发预检请求，满足一下两个条件即为简单请求
  - 请求方法是以下三种方法之一：HEAD、GET、POST
  - HTTP 的头信息不超出以下几种字段：

    - Accept
    - Accept-Language
    - Content-Language

    - Last-Event-ID
    - Content-Type：只限于三个值 application/x-www-form-urlencoded、multipart/form-data、text/plain

- 简单请求过程
  - 浏览器直接发出 CORS 请求，请求的头信息中增加 origin 字段，说明本次请求来自哪个源，服务器根据这个值，决定是否同意这次请求

  - 在简单请求中，在服务器内，至少需要设置字段：`Access-Control-Allow-Origin`，表示哪些源可以访问资源，如果设置为 `*`，则表示所有源都可以访问资源
  - 如果是在许可范围内，服务器返回的响应，会多出几个头信息字段

```js
Access-Control-Allow-Origin: http://api.bob.com  // 和Orign一直
Access-Control-Allow-Credentials: true   // 表示是否允许发送Cookie
Access-Control-Expose-Headers: FooBar   // 指定返回其他字段的值
Content-Type: text/html; charset=utf-8   // 表示文档类型
```

- 非简单请求过程
  - 非简单请求的 CORS 请求，会在正式通信之前，增加一次 HTTP 查询请求，称为**预检请求**，该请求是一个 `OPTIONS` 方法的请求，通过该请求来知道服务器是否允许该实际请求

  - 预检请求的头信息中，包含了以下字段：
    - Origin：表示请求来自哪个源

    - Access-Control-Request-Method：表示实际请求使用的方法
    - Access-Control-Request-Headers：表示实际请求使用的头信息字段
  - 服务器收到预检请求后，检查是否允许该请求，如果允许，服务器返回以下字段：

```js
Access-Control-Allow-Origin: http://api.bob.com  // 允许跨域的源地址
Access-Control-Allow-Methods: GET, POST, PUT // 服务器支持的所有跨域请求的方法
Access-Control-Allow-Headers: X-Custom-Header  // 服务器支持的所有头信息字段
Access-Control-Allow-Credentials: true   // 表示是否允许发送Cookie
Access-Control-Max-Age: 1728000  // 用来指定本次预检请求的有效期，单位为秒
```

- `Access-Control-Max-Age` 字段可以缓存预检请求的结果，减少 OPTIONS 请求的次数，从而提高性能

#### 2.2 JSONP 跨域

- 借助 script 标签的 src 属性，发送跨域请求


- 发送带有callback参数的GET请求，服务端将接口返回数据拼凑到callback函数中，返回给浏览器，浏览器解析执行，从而前端拿到callback函数返回的数据

```js
<script>
    var script = document.createElement('script');
    script.type = 'text/javascript';
    // 传参一个回调函数名给后端，方便后端返回时执行这个在前端定义的回调函数
    script.src = 'http://www.domain2.com:8080/login?user=admin&callback=handleCallback';
    document.head.appendChild(script);
    // 回调执行函数
    function handleCallback(res) {
        alert(JSON.stringify(res));
    }
</script>
```

- 缺点
  - 只能发送 GET 请求
  - 不安全，容易受到 XSS 攻击

#### 2.3 postMessage 跨域

- postMessage 是 HTML5 新增的 API，一般用于跨窗口通信，也可以跨域通信

- 可以解决以下问题：

  - 页面和其打开的新窗口的数据传递

  - 多窗口之间消息传递
  - 页面与嵌套的iframe消息传递
  - 上面三个场景的跨域数据传递

- 用法：
  - 发送消息：`window.parent.postMessage(message, targetOrigin)`
  - 接收消息：`window.addEventListener('message', function(event) {})`
  - 其中，message 是要发送的消息，targetOrigin 是目标窗口的源，* 表示所有窗口都可以接收消息

#### 2.4 nginx 代理跨域

- 反向代理接口跨域，，借助的是服务器端不需要同源策略，不存在跨域问题
- 实现思路：通过 Nginx 配置一个代理服务器域名（与当前域 domain1 相同，端口不同）做跳板机，反向代理访问 domain2 接口

- 具体配置

```js
server {
    listen       81;
    server_name  www.domain1.com;
    location / {
        proxy_pass   http://www.domain2.com:8080;  #反向代理
        proxy_cookie_domain www.domain2.com www.domain1.com; #修改cookie里域名
        index  index.html index.htm;
        # 当用webpack-dev-server等中间件代理接口访问nignx时，此时无浏览器参与，故没有同源限制，下面的跨域配置可不启用
        add_header Access-Control-Allow-Origin http://www.domain1.com;  #当前端只跨域不带cookie时，可为*
        add_header Access-Control-Allow-Credentials true;
    }
}
```

#### 2.5 nodejs 中间件代理跨域

- 非vue框架实现一个代理服务器

- vue框架中使用 webpack-dev-server


#### 2.6 websocket 跨域

- WebSocket 是一种在单个 TCP 连接上进行全双工通信的协议，允许跨域通讯

- WebSocket 是一种双向通信协议，它建立在 TCP 协议之上，客户端和服务器之间建立起一个持久的连接，并可以实时地进行数据交换

#### 2.7 document.domain + iframe跨域

- 此方案仅限主域相同，子域不同的跨域应用场景
- 实现原理：两个页面都通过 js 强制设置 document.domain 为基础主域，就实现了同域

- 父窗口

```js
<iframe id="iframe" src="http://child.domain.com/b.html"></iframe>
<script>
    document.domain = 'domain.com';
    var user = 'admin';
</script>
```

- 子窗口

```js
<script>
    document.domain = 'domain.com';
    // 获取父窗口中变量
    console.log('get js data from parent ---> ' + window.parent.user);
</script>
```


#### 2.8 window.name + iframe 跨域

#### 2.9 location.hash + iframe 跨域



