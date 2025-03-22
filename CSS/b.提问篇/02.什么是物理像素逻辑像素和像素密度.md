
### 什么是物理像素、逻辑像素和像素密度，为什么在移动端开发时需要用到 @3x、@2x 这种图片？

---
---

- 物理像素：屏幕上的实际像素点数量
- 逻辑像素：CSS 中使用的虚拟像素，用于描述元素的大小和布局
- 像素密度：物理像素与逻辑像素的比例，通常用 dpi 表示
  - 比如常说的3倍屏，就是物理像素是逻辑像素的三倍

- 移动端中，如果需要适配不同的屏幕尺寸和像素密度，为了保证图片不失真也不造成带宽浪费，可以使用 @3x、@2x 等图片

```xml
<img src="image.png" srcset="image@2x.png 2x, image@3x.png 3x" alt="Example Image">

.example {
    background-image: image-set(
        url('image.png') 1x,
        url('image@2x.png') 2x,
        url('image@3x.png') 3x
    );
}
```

- 也可以通过媒体查询来适配不同的屏幕尺寸和像素密度

```css
my-image { background: (low.png); }
@media only screen and (min-device-pixel-ratio: 1.5) {
  #my-image { background: (high.png); }
}
```
