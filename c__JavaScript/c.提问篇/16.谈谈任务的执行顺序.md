### process.nextTick, Promise 以及 setTimeout, setImmediate 四者的执行顺序

> 这个只能说是 ***了解即可***，不同的环境执行顺序不一致，但是这里以 node 执行环境为准

---
---

- 宏任务：script (整体代码)，`setTimeout`, setInterval, `setImmediate`, I/O, UI rendering
- 微任务：`process.nextTick`, `Promise(原生)`，Object.observe，MutationObserver
- 其中 setImmediate 和 process.nextTick 是 node 环境下的 API
- 直接看代码例子

```js
setImmediate(function () {
    console.log(1);
}, 0);
setTimeout(function () {
    console.log(2);
}, 0);
new Promise(function (resolve) {
    console.log(3);
    resolve();
    console.log(4);
}).then(function () {
    console.log(5);
});
console.log(6);
process.nextTick(function () {
    console.log(7);
});
console.log(8);
//输出结果是3 4 6 8 7 5 2 1
```

- 可以看出，在 node 环境下，执行顺序是 `process.nextTick` > `Promise` > `setTimeout` > `setImmediate`