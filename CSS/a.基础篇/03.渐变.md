
### 1、渐变

- 可以实现颜色的平滑过渡
- CSS 定义了两种渐变类型
  - 线性渐变（linear-gradient）：沿着一条直线
  - 径向渐变（radial-gradient）：从圆心向外
- 渐变的颜色可以是多个，每个颜色都有一个位置，可以是百分比或者长度

### 2、线性渐变

- `linear-gradient` 函数
  - 第一个参数是方向，`to top`、`to right`、`to bottom`、`to left`、`to top right`、`to bottom right`、`to bottom left`、`to top left`，或者角度
  - 后面的参数就是颜色，可以是多个，每个颜色都有一个位置，可以是百分比或者长度

```css
// 默认从上到下
background-image: linear-gradient(red, yellow);
background-image: linear-gradient(to bottom，red, yellow, green, blue,...);
// 可以是角度
background-image: linear-gradient(-90deg, red, yellow);
// 颜色可以使用 rgba
background-image: linear-gradient(to right, rgba(255,0,0,0), rgba(255,0,0,1));
```

- `repeating-linear-gradient()` 函数：重复线性渐变

```css
background-image: repeating-linear-gradient(red, yellow 10%, green 20%);
```

### 3、径向渐变
- `radial-gradient` 函数
  - 第一个参数是形状，`circle`、`ellipse`，默认是 `ellipse`
  - 后面的参数就是颜色，可以是多个，每个颜色都有一个位置

```css
background-image: radial-gradient(red, yellow, green);
background-image: radial-gradient(circle, red 5%, yellow 15%, green 60%);
```
