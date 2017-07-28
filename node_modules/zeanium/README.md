# Zeanium

[简体中文文档](https://github.com/yangyxu/Zeanium/blob/master/README_zh-CN.md)


## Introduction

Zeanium is fully oop javascript framework, It support node.js、Browser、React Native.

You can define Class object、module and soon. It support front-end and back-end in the same api what we provide.


## Builtin api list

- `zn.idle()`: empty function
- `zn.idleArray()`: return empty array
- `zn.idleObject()`: return empty object;
- `zn.format(string, argv...)`: string is input value, argv is any string arguments. Such as:

    ```javascript
    1. zn.format('hello {0}, you are {1} year.', 'yangyxu', '2017');
    2. zn.format('hello {0}, you are {1} year.', ['yangyxu', '2017']);
    ```
    The code 1 is the same with code 2. The output is "hello yangyxu, you are 2017 year."
- `zn.uuid()`: return uuid string value
- `zn.serializeJSON(jsonObject)`: serialize json data
- `zn.fix(target, argv...)`: if target has no key in arguments key, the function will extend object arguments value to target
- `zn.extend(target, argv...)`: the function will extend object arguments value to target
- `zn.overwrite(target, argv...)`: get argv value to overwrite the target value
- `zn.path(target, path, value)`: set or get the value for the path in target
- `zn.invoke(target, path, args)`: args as arguments, invoke the target path function
- `zn.deepEachObject(data, handler, context)`: deep each object, data the input value, handler is each function, context is the scope for each function, the output is object value;
- `zn.arrayValueToObject(data, handler, context)`: the function is the same with zn.deepEachObject, but the data type of input is array;
- `zn.toString(value)`: get string value;
- `zn.each(target, callback, context)`: each target, callback is the each function, context is scope for each function
- `zn.clone(target)`: clone target to a copy
- `zn.type(target)`: get type for target
- `zn.is(target, type)`: judge target type is or not type
- `zn.may(target, name)`: judge target has "name" event
- `zn.can(target, name)`: judge target can exec "name" event
- `zn.has(target, name)`: judge target has "name" property
- `zn.get(target, name)`: get "name" value from target object
- `zn.set(target, name, value)`: set value to target name property
- `zn.gets(target)`: get all properties from target
- `zn.sets(target, values)`: set object to target


## Class

### Define Class
The class has `static`、`statics`、`mixins` 、`properties`、`events`、`methods` five key word;

- `static`: `true` or `false`, default value is `false`, if value is `true`, the class is static class, can't be instantiated. If you new the class, the system will throw `TypeError`.
- `statics`: define class static property or method.
- `mixins`: define Super Class collection.
- `properties`: define class property, value is object.
- `events`: define class event, value is array. `init` is the constructor function for class.
- `methods`: define class method, value is array.

Define Person Class
```javascript
var Person = zn.Class({
    static: false,              //defalut value is false
    statics: {
        count: 1                //class static property,
        getCount: function (){  //class static method,
            return this._count;
        }
    },
    properties: {
        name: '',       //define `name` property, value is ''
        age: {
            value: 10,          //define `age` default value
            get: function (value){ //define `age` get method
                this._age = value; (1)
            },
            set: function (){   //define `age` set method
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


Define Student
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
