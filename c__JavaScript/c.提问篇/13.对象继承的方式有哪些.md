### 对象继承的方式有哪些

---
---

#### 1、原型链继承

- 原理：通过将一个对象的原型指向另一个对象，从而实现对象之间的继承
- 缺点：
  - 所有实例共享原型上的属性和方法，会导致属性和方法的修改会影响所有实例
  - 无法实现多继承
  - 无法传递参数
```js
function Parent() {
    this.name = "Alice";
}
Parent.prototype.sayHello = function() {
    console.log(`Hello, my name is ${this.name}`);
};

function Child() {}
Child.prototype = new Parent();
Child.prototype.constructor = Child;

let child = new Child();
child.sayHello(); // Hello, my name is Alice
```

#### 2、构造函数继承

- 原理：通过在子类的构造函数中调用父类的构造函数，从而实现对象之间的继承
- 缺点：
  - 无法访问父类型的原型方法

```js
function Parent(name) {
    this.name = name;
}
Parent.prototype.sayHello = function() {
    console.log(`Hello, my name is ${this.name}`);
};

function Child(name) {
    Parent.call(this, name);
}

let child = new Child("Bob");
child.sayHello(); // 报错，因为 Child 没有 sayHello 方法
```


#### 3、组合继承

- 结合了原型链继承和构造函数继承的优点，子类型的构造函数中调用父类型的构造函数，并将子类型的原型设置为父类型的实例

```js
function Parent(name) {
    this.name = name;
}
Parent.prototype.sayHello = function() {
    console.log(`Hello, my name is ${this.name}`);
};

function Child(name) {
    Parent.call(this, name);
}
Child.prototype = new Parent();
Child.prototype.constructor = Child;

let child = new Child("Bob");
child.sayHello(); // Hello, my name is Bob
```


#### 4、原型式继承

- 通过创建一个新对象，其原型是现有对象来实现

```js
let parent = {
    name: "Alice",
    sayHello: function() {
        console.log(`Hello, my name is ${this.name}`);
    }
};

let child = Object.create(parent);
child.name = "Bob";
child.sayHello(); // Hello, my name is Bob
```

- `Object.create` 是 JavaScript 中用于创建新对象的方法，它允许开发者指定新对象的原型以及可选的属性描述符

#### 5、寄生式继承

- 通过创建一个新对象，将现有对象的属性和方法复制到新对象中来实现

```js
let parent = {
    name: "Alice",
    sayHello: function() {
        console.log(`Hello, my name is ${this.name}`);
    }
};

function createChild(parent) {
    let child = Object.create(parent);
    child.name = "Bob";
    return child;
}

let child = createChild(parent);
child.sayHello(); // Hello, my name is Bob
```


#### 6、寄生组合式继承

- 结合了组合继承和寄生式继承的优点。它通过寄生式继承创建子类型的原型

```js
function Parent(name) {
    this.name = name;
}
Parent.prototype.sayHello = function() {
    console.log(`Hello, my name is ${this.name}`);
};

function Child(name) {
    Parent.call(this, name);
}

Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

let child = new Child("Bob");
child.sayHello(); // Hello, my name is Bob
```

