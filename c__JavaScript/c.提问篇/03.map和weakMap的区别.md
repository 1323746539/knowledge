### map 和 weakMap 区别

---
---

#### 属性方法

- map 属性方法：`size、set()、get()、has()、delete()、clear()`
- weakMap 属性方法：`set()、get()、has()、delete()`

#### 关于键名

- map 键名可以是任意值，包括函数、对象、数组、基本类型
- weakMap 键名只能是对象，不能是其他类型

#### 内存回收

- map 键名是正常引用，垃圾回收机制不会回收键名对象
- weakMap 键名是弱引用，垃圾回收机制会自动回收键名对象。即当键名对象被垃圾回收机制回收后，weakMap 会自动删除对应的键值对。