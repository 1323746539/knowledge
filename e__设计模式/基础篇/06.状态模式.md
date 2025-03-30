
### 一、什么是状态管理

- 允许一个对象在其内部状态改变时改变它的行为，从而使对象看起来好像修改了其行为
- 主要解决的是当控制一个对象状态转换的条件表达式过于复杂时的情况，把状态的判断逻辑转移到表示不同状态的一系列类中，可以把复杂的判断逻辑简化
  - 对象有多个状态，并且这些状态之间可以相互转换
  - 各个状态和对象的行为逻辑有比较强的对应关系，即在不同状态时，对象的处理逻辑也会不同

### 二、状态模式的实现

- 先看一个使用 if else 的例子

```js
let trafficLight = (function() {
    let state = '绿灯'        // 闭包缓存状态
    
    return {
        // 设置交通灯状态 
        setState: function(target) {
            if (target === '红灯') {
                state = '红灯'
                console.log('交通灯颜色变为 红色，行人通行 & 车辆等待')
            } else if (target === '黄灯') {
                state = '黄灯'
                console.log('交通灯颜色变为 黄色，行人等待 & 车辆等待')
            } else if (target === '绿灯') {
                state = '绿灯'
                console.log('交通灯颜色变为 绿色，行人等待 & 车辆通行')
            } else {
                console.error('交通灯还有这颜色？')
            }
        },
        
        // 获取交通灯状态 
        getState: function() {
            return state
        }
    }
})()

trafficLight.setState('红灯') // 输出： 交通灯颜色变为 红色，行人通行 & 车辆等待
trafficLight.setState('黄灯') // 输出： 交通灯颜色变为 黄色，行人等待 & 车辆等待
trafficLight.setState('绿灯') // 输出： 交通灯颜色变为 绿色，行人等待 & 车辆通行

trafficLight.setState('紫灯') // 输出： 交通灯还有这颜色？
```

- 仍然是那个情况，颜色多后，逻辑处理复杂后，if else 解决问题就会变得复杂，尤其是接收别人项目时，if else 会让接手的人很容易崩溃
  - 正是因为这样非常不方便维护状态及其对应的行为，所以引入了状态模式的概念
  - 状态模式把每种状态和对应的处理逻辑封装在一起，使得状态的切换和行为的执行与状态对象本身解耦

- 状态模式的实现

```js
// 状态接口
class State {
    constructor(trafficLight) {
        this.trafficLight = trafficLight;
    }

    // 子类必须实现的方法
    setState() {
        throw new Error('子类必须实现 setState 方法');
    }
}

// 红灯状态
class RedLight extends State {
    setState() {
        this.trafficLight.currentState = this.trafficLight.yellowLight;
        console.log('交通灯颜色变为 红色，行人通行 & 车辆等待');
    }
}

// 黄灯状态
class YellowLight extends State {
    setState() {
        this.trafficLight.currentState = this.trafficLight.greenLight;
        console.log('交通灯颜色变为 黄色，行人等待 & 车辆等待');
    }
}

// 绿灯状态
class GreenLight extends State {
    setState() {
        this.trafficLight.currentState = this.trafficLight.redLight;
        console.log('交通灯颜色变为 绿色，行人等待 & 车辆通行');
    }
}

// 交通灯类
class TrafficLight {
    constructor() {
        // 创建各种状态实例
        this.redLight = new RedLight(this);
        this.yellowLight = new YellowLight(this);
        this.greenLight = new GreenLight(this);
        
        // 设置初始状态
        this.currentState = this.greenLight;
    }

    // 切换状态
    change() {
        this.currentState.setState();
    }

    // 获取当前状态
    getState() {
        if (this.currentState === this.redLight) return '红灯';
        if (this.currentState === this.yellowLight) return '黄灯';
        if (this.currentState === this.greenLight) return '绿灯';
    }
}

// 使用示例
const trafficLight = new TrafficLight();
console.log('当前状态：', trafficLight.getState()); // 输出：当前状态：绿灯

trafficLight.change(); // 输出：交通灯颜色变为 绿色，行人等待 & 车辆通行
console.log('当前状态：', trafficLight.getState()); // 输出：当前状态：红灯

trafficLight.change(); // 输出：交通灯颜色变为 红色，行人通行 & 车辆等待
console.log('当前状态：', trafficLight.getState()); // 输出：当前状态：黄灯

trafficLight.change(); // 输出：交通灯颜色变为 黄色，行人等待 & 车辆等待
console.log('当前状态：', trafficLight.getState()); // 输出：当前状态：绿灯
```

### 三、状态模式的优缺点

- 优点
  - 封装了状态的变化逻辑，使得状态的切换和行为的执行与状态对象本身解耦
  - 符合开闭原则，每个状态都是一个子类，增加状态只需增加新的状态类即可，修改状态也只需修改对应状态类就可以了
  - 封装性良好，状态的切换在类的内部实现，外部的调用无需知道类内部如何实现状态和行为的变换
- 缺点
  - 引入了额外的类和对象，增加了系统的复杂性

### 四、状态模式的应用场景

- 当一个对象的行为取决于它的状态，并且它必须在运行时根据状态改变它的行为时
- 当一个对象的行为可以根据状态进行不同的处理，并且状态的变化可能会导致行为的变化时

### 五、状态模式与其他模式的区别

#### 5.1 状态模式与策略模式

- 状态模式：重在强调对象内部状态的变化改变对象的行为，状态类之间是平行的，无法相互替换
- 策略模式：策略的选择由外部条件决定，策略可以动态的切换，策略之间是平等的，可以相互替换

#### 5.2 状态模式与发布订阅模式

- 状态模式：根据状态来分离行为，当状态发生改变的时候，动态地改变行为
- 发布订阅模式：发布者在消息发生变化时通知订阅者，具体如何处理则不在乎，或者直接丢给用户自己处理