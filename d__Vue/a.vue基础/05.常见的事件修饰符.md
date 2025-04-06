
### 常见的事件修饰符

- `.stop`：阻止事件冒泡，等同于 `event.stopPropagation()`。
- `.prevent`：阻止默认事件，等同于 `event.preventDefault()`。
- `.self`：只在当前元素上触发事件，不包括子元素。
- `.once`：事件只会触发一次，然后自动移除。
- `.capture`：使用事件捕获模式，从外到内触发事件。