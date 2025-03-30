
### 一、什么是适配器模式

- 将一个对象的接口的转换为用户需要的另一个接口，解决对象之间接口不兼容问题
- 主要功能是进行**转换匹配**，目的是复用已有的功能，而不是实现新的借口
- 特点
  - 旧有接口格式不满足当前的需要
  - 通过增加适配器来更好的使用旧接口

### 二、适配器模式的应用

- 其实这个模式很长见，比如做业务时，服务端返回的数据是一个树形结构，老业务确实用的树形结构进行渲染，但是新需求要求将数据平铺，当前树形结构数据无法直接使用，就需要使用适配器模式进行转换

```js
/* 原来的树形结构 */
const oldTreeData = [
    {
        name: '总部',
        place: '一楼',
        children: [
            { name: '财务部', place: '二楼' },
            { name: '生产部', place: '三楼' },
            {
                name: '开发部', place: '三楼', children: [
                    {
                        name: '软件部', place: '四楼', children: [
                            { name: '后端部', place: '五楼' },
                            { name: '前端部', place: '七楼' },
                            { name: '技术支持部', place: '六楼' }]
                    }, {
                        name: '硬件部', place: '四楼', children: [
                            { name: 'DSP部', place: '八楼' },
                            { name: 'ARM部', place: '二楼' },
                            { name: '调试部', place: '三楼' }]
                    }]
            }
        ]
    }
]
/* 树形结构平铺 */
function treeDataAdapter(treeData, lastArrayData = []) {
    treeData.forEach(item => {
        if (item.children) {
            treeDataAdapter(item.children, lastArrayData)
        }
        const { name, place } = item
        lastArrayData.push({ name, place })
    })
    return lastArrayData
}
treeDataAdapter(oldTreeData)
// 返回平铺的组织结构
```

- 包括 vue 项目中的计算属性，也是适配器模式的应用，因为单一的 data 数据无法满足所有的计算需求，所以需要通过计算属性进行转换

### 三、适配器模式的优缺点

- 优点
  - 原来逻辑得到更好复用，避免大规模改写
  - 可扩展性良好，在实现适配器功能时，可以调用自己开发的功能，从而自然地扩展系统的功能
- 缺点
  - 过多地使用适配器，会让系统非常零乱，不易整体进行把握

### 四、适配器模式与其他模式的区别

- 适配器模式： 功能不变，只转换了原有接口访问格式
- 装饰者模式： 扩展功能，原有功能不变且可直接使用
- 代理模式： 原有功能不变，但一般是经过限制访问的