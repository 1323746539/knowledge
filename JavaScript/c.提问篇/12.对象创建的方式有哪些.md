
### 对象创建的方式有哪些

---
---

#### 1、工厂模式
  - 通过一个工厂函数来创建对象，隐藏了对象创建的具体细节，无法识别对象的类型
```js
function createPerson(name, age) {
    let person = {};
    person.name = name;
    person.age = age;
    person.sayHello = function () {
        console.log(`Hello, my name is ${this.name}`);
    };
    return person;
}

let person1 = createPerson("Alice", 25);
```
#### 2、构造函数模式
- 通过 new 关键字调用构造函数来创建对象，每个实例都有自己的方法和属性副本
```js
function Person(name, age) {
    this.name = name;
    this.age = age;
    this.sayHello = function () {
        console.log(`Hello, my name is ${this.name}`);
    };
}

let person1 = new Person("Alice", 25);
```

#### 3、原型模式
- 通过原型链来共享方法和属性，所有实例共享同一个原型对象，修改原型对象会影响所有实例
```js
function Person() {}
Person.prototype.name = "Alice";
Person.prototype.age = 25;
Person.prototype.sayHello = function () {
    console.log(`Hello, my name is ${this.name}`);
};

let person1 = new Person();
```
#### 4、组合使用构造函数模式和原型模式
- 结合两者优点，节省内存和区分实例属性
```js
function Person(name, age) {
    this.name = name;
    this.age = age;
}

Person.prototype.sayHello = function () {
    console.log(`Hello, my name is ${this.name}`);
};

let person1 = new Person("Alice", 25);
```

#### 5、动态原型模式
- 在构造函数中动态添加原型方法，确保只在第一次调用时初始化原型。它结合了构造函数和原型的优点，同时避免了多次初始化原型
```js
function Person(name, age) {
    this.name = name;
    this.age = age;

    if (typeof Person._initialized !== "boolean") {
        Person.prototype.sayHello = function () {
            console.log(`Hello, my name is ${this.name}`);
        };
        Person._initialized = true;
    }
}

let person1 = new Person("Alice", 25);
```

#### 6、寄生构造函数模式
- 本质上是一个工厂函数，但通过构造函数的形式调用
```js
function Person(name, age) {
    let person = new Object();
    person.name = name;
    person.age = age;
    person.sayHello = function () {
        console.log(`Hello, my name is ${this.name}`);
    };
    return person;
}
let person1 = new Person("Alice", 25);
```

#### 7、ES6 之后，类

```js
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    sayHello() {
        console.log(`Hello, my name is ${this.name}`);
    }
}
let person1 = new Person("Alice", 25);
```


