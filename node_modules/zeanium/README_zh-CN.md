# Zeanium

[英文中文文档](https://github.com/yangyxu/Zeanium/blob/master/README.md)


## 介绍

Zeanium是完全面向对象的JavaScript底层框架, 它基于JavaScript语言本身封装, 没有任何前端、后端、第三方库限制, 只要能运行JavaScript的地方就可以运行zeanium核心底层库。你可以自由的使用面向对象的继承、封装、多态等等特性随意定义自己的类和模块。一次编写可以在前端、后端都可以运行。


## 顶级内置API接口

- `zn.idle()`: 空函数
- `zn.idleArray()`: 返回空数组
- `zn.idleObject()`: 返回空对象
- `zn.format(string, argv...)`: 格式化字符串, 可以是多个参数, 也可以是一个数组参数, 字符串里面用{xx}类似作为占位符, 根据参数索引序列一次替换, 并返回替换好之后的最新字符串。

比如以下代码:

    ```javascript
    1. zn.format('hello {0}, you are {1} year.', 'yangyxu', '2017');
    2. zn.format('hello {0}, you are {1} year.', ['yangyxu', '2017']);
    ```
    第一行代码和第二行代码效果是一样的. 输出都是 "hello yangyxu, you are 2017 year."
- `zn.uuid()`: 返回一个uuid字符串值
- `zn.serializeJSON(jsonObject)`: 序列化json数据
- `zn.fix(target, argv...)`: 根据argv补齐target的属性集
- `zn.extend(target, argv...)`: 根据argv只扩展target的属性集
- `zn.overwrite(target, argv...)`: 根据argv值重写target的属性集
- `zn.path(target, path, value)`: 设置或获取对象target属性路径path下的值
- `zn.invoke(target, path, args)`: 执行对象target路径path下的方法, argv作为输入参数
- `zn.deepEachObject(data, handler, context)`: 深度遍历data对象, handler是遍历函数, context是每次遍历的作用域, 并返回一个新的对象;
- `zn.arrayValueToObject(data, handler, context)`: 遍历数组并返回一个对象
- `zn.toString(value)`: 获取value toString的值
- `zn.each(target, callback, context)`: 遍历对象target, callback是遍历函数, context是callback的作用域
- `zn.clone(target)`: 克隆target对象
- `zn.type(target)`: 获取target类型
- `zn.is(target, type)`: 判断对象target的类型是否是type类型
- `zn.may(target, name)`: 判断对象target是否能执行"name"时间
- `zn.can(target, name)`: 判断对象target是否可以执行"name"事件
- `zn.has(target, name)`: 判断对象target是否有"name"属性
- `zn.get(target, name)`: 获取target对象属性为"name"的值
- `zn.set(target, name, value)`: 给target对象设置值
- `zn.gets(target)`: 获取target对象所有属性值
- `zn.sets(target, values)`: 给对象target 批量设置值


## 类

### 定义类
每个类都有 `static`、`statics`、`mixins` 、`properties`、`events`、`methods` 6个关键之;

- `static`: `true` 或 `false`, 默认值是`false`, 值为`true`时, 整个类是静态类, 不允许被实例化, 如果强制实例化, 系统会抛出`TypeError`错误。
- `statics`: 定义类的静态属性和方法
- `mixins`: 继承多类, 常规是继承是单向继承, 只有一个父类, 但是有些需求是需要继承多类的就可以使用mixins关键字, 如：mixins: [User, Person]
- `properties`: 定义类的属性集, 是一个json对象
- `events`: 定义类的事件集, 是一个数组对象 配合对象的on/off使用
- `methods`: 定义类的方法集, 是对象类型。`init` 是每个类唯一指定的构造函数, 每次实例化对象是，如果有init函数则一定会调用。

定义 人 类
```javascript
var Person = zn.Class({
    static: false,              //默认值是false, 如果是true, 定义类的时候就会执行 init 构造函数
    statics: {
        count: 1                //定义静态属性,
        getCount: function (){  //定义静态方法,
            return this._count;
        }
    },
    properties: {
        name: '',                   //定义属性名“name”的属性
        age: {
            value: 10,              //value: 属性默认值
            get: function (value){  //get: 定义属性get方法
                this._age = value; (1)
                //zeanium定义类属性时会自动定义“_”+属性名 的内部变量，后续所有操作都是基于内部变量
            },
            set: function (){       //定义属性set方法
                return this._age;
            }
        }
    },
    methods: {
        init: function (name, age){ (2)
            //If you new Person Class instance, init method will be call
            console.log("I'm constructor function.");
            this.name = name;
            this.age = age;
            //!important: This code will call 'age' set function
        },
        say: function (){ (3)
            console.log('person hello ', this.name);
            return 'person hello ' + this.name;
        }
    }
});

var _count = Person.getCount();
console.log(_count); //print: 1

var person1 = new Person('yangyxu', 20);
person1.name = "xu";    //<1>
person1.set(name, "xu");//<2>
//<1> is the same with <2>
```

1. define any property, the system will generate the `_` + property_name property.
2. `init` is default constructor function, the name is fixed. Call `new Person()`, init constructor function will be called;
3. define `say` customize method.


定义学生类 学生是继承人类
```javascript
var Student = zn.Class(Person, { //inherit Person, the Student Super is Person
    properties: {
        grade: {
            value: 10,          //define `age` default value
            get: function (value){ //define `age` get method
                this._grade = value; (1)
            },
            set: function (){   //define `age` set method
                return this._grade;
            }
        }
    },
    methods: {
        init: function (name, age, grade){ (2)
            this.super(name, age); //It will call super Class Person init method
            this.sets({
                name: name,
                age: age,
                grade: grade
            });
            //
        },
        say: function (){ (3)
            this.super(name, age); //It will call super Class Person say method
            console.log('student hello ', this.name);
            return 'student hello ' + this.name;
        }
    }
});

var _yangyxu = new Student('yangyxu', 20, 'g1');
_yangyxu.say();
//print:
//person hello yangyxu
//student hello yangyxu

```

Define Teacher
```javascript
var Teacher = zn.Class(Person, { //inherit Person, the Student Super is Person
    properties: {
        id: ''
    },
    methods: {
        init: {
            auto: true,  // the attr is the same with this.super();
            value: function (argv){ (2)
                this.sets(argv);
            }
        },
        teach: function (){
            return 'teacher name: ' + this.name;
        }
    }
});

var _yangyxu = new Teacher('t1', 20);
_yangyxu.teach();
```

## Define Module
Define module is using AMD.


Define zeanium module
```javascript
zn.define([
    'node:http'  //If module is node module, you have to add "node:" prefix
], function (node_http){ //If load finished, you can use the module.

    return zn.Class({
        properties: {

        },
        methods: {

        }
    });

});
```

## Documentation

[http://www.zeanium.com](http://www.zeanium.com)

## License

[MIT](https://github.com/yangyxu/Zeanium/blob/master/LICENSE)
