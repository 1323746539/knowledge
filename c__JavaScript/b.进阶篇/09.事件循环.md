
### 一、异步执行原理

- 浏览器是多线程的，当 JS 需要执行异步任务时，浏览器会另外启动一个线程去执行该任务
- JavaScript是单线程的指的是执行JavaScript代码的线程只有一个

### 二、浏览器的事件循环

#### 2.1 执行栈和任务队列

- JavaScript在执行代码时，会将同步的代码按照顺序排在执行栈中，然后依次执行里面的函数
- 当遇到异步任务时，就将其放入任务队列中，等待当前执行栈所有同步代码执行完成之后，就会从异步任务队列中取出已完成的异步任务的回调并将其放入执行栈中继续执行


#### 2.2 宏任务和微任务

> 任务队列其实不止一种，根据任务种类的不同，可以分为微任务（micro task）队列和宏任务（macro task）队列

- 宏任务：script( 整体代码)、setTimeout、setInterval、setImmediate（nodejs 环境）、requestAnimationFrame、I/O、UI渲染
- 微任务：Promise、MutationObserver、process.nextTick（nodejs 环境）
- 执行逻辑：
  - 执行一个宏任务（栈中没有就从事件队列中获取）
  - 执行过程中如果遇到微任务，就将它添加到微任务的任务队列中
  - 宏任务执行完毕后，立即执行当前微任务队列中的所有微任务（也就是说在执行微任务过程中产生的新的微任务并不会推迟到下一个循环中执行，而是在当前的循环中继续执行，宏任务是放到下一个循环中）

```js
console.log('同步代码1');

setTimeout(() => {
    console.log('setTimeout 111')
}, 0)

new Promise((resolve) => {
  console.log('同步代码2')
  resolve()
}).then(() => {
    console.log('promise.then')
    setTimeout(() => {
        console.log('setTimeout 222')
    }, 0)
})

console.log('同步代码3');
```
- 结果

```js
同步代码1
同步代码2
同步代码3
promise.then
setTimeout 111
setTimeout 222
```
