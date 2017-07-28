/**
 * Created by yangyxu on 3/20/15.
 */
module("builtin");

//zn.fix: fix
test("builtin zn.fix", function () {
    var _target = {
        add: function (x, y){
            return x + y;
        }
    };
    ok(zn.fix(), 'zn.fix is exist.');
    var _fix1 = {
        plus: function(a, b){
            return a + b;
        },
        add: function (a) {
            return a + 5;
        }
    };
    var _fix2 = {
        create: function (a){
            return 'create: ' + a;
        }
    };
    zn.fix(_target, _fix1);
    ok(_target.plus, "The target of plus method is exist.");
    ok(_target.add, "The target of add method is exist.");
});

//zn.extend: extend target by argument which start with index 1.
test("builtin zn.extend", function () {
    var _target = {
        name: 'test'
    };
    ok(zn.extend, 'zn.extend is exist.');
    equal(_target.name, 'test', "The value of target's name is test.");
    zn.extend(_target, {
        name: 'yangyxu',
        email: 'yangyxu@cisco.com'
    });
    equal(_target.name, 'yangyxu', "The value of target's name is yangyxu after extend target object.");
    equal(_target.email, 'yangyxu@cisco.com', "The value of target's email is yangyxu@cisco.com after extend target object.");
});

//zn.overwrite
test("builtin zn.overwrite", function () {
    var _target = {
        name: 'yangyxu',
        email: 'yangyxu@cisco.com'
    };
    ok(zn.overwrite, 'zn.extend is exist.');
    //equal(_target.name, 'yangyxu', "The value of target's name is yangyxu.");
    //equal(_target.email, 'yangyxu@cisco.com', "The value of target's email is yangyxu@cisco.com.");
    zn.overwrite(_target, {
        name: 'xuyangyang',
        email: 'xuyangyang@cisco.com',
        age: 25
    });
    equal(_target.name, 'yangyxu', "The value of target's name is yangyxu.");
    equal(_target.email, 'yangyxu@cisco.com', "The value of target's email is yangyxu@cisco.com.");
    equal(_target.age, 25, "The value of target's age is 25.");
});

//zn.path
test("builtin zn.path", function () {
    var _target = {

    };
    zn.path(_target, "www.yangyxu.com", "yangyxu");

    console.log(zn.path(_target, "www"));
    console.log(zn.path(_target, "www.yangyxu"));
    console.log(zn.path(_target, "www.yangyxu.com"));

    ok(zn.path(_target, "www"), "www is exist.");
    ok(zn.path(_target, "www.yangyxu"), "www.yangyxu is exist.");
    equal(zn.path(_target, "www.yangyxu.com"), 'yangyxu', "value is same.")
});

//zn.invoke
test("builtin zn.invoke", function () {
    var _target = {
        www: {
            yangyxu: {
                com: function (name){
                    console.log('hello '+name+': this is www.yangyxu.com.');
                }
            }
        }
    };
    zn.invoke(_target, "www.yangyxu.com", ["yangyxu"]);

    ok(zn.invoke, "invoke method is exist.");
});

test("builtinZNObject zn.toString", function () {
    var a = "test", b = 1, c = true, d = function (){}, e = {};
    ok(zn.toString, "zn.toString is exist.");
    equal(zn.toString(a), "[object String]", "var a is string");
    equal(zn.toString(b), "[object Number]", "var b is number");
    equal(zn.toString(c), "[object Boolean]", "var c is boolean");
    equal(zn.toString(d), "[object Function]", "var d is function");
    equal(zn.toString(e), "[object Object]", "var e is object");
    console.log(zn.toString(a));
    console.log(zn.toString(b));
    console.log(zn.toString(c));
    console.log(zn.toString(d));
    console.log(zn.toString(e));
});

test("builtinZNObject zn.each", function () {
    var d1 = ['a', 1, true];
    var d2 = {'a_key':'a_value','b_key':'b_value'};
    ok(zn.each, "zn.each is exist.");
    zn.each(d1, function (value, index){
        ok(true, "key: " + index+", value: "+value);
    });

    zn.each(d2, function (value, index){
        ok(true, "key: " + index+", value: "+value);
    });
});

test("builtinZNObject zn.type", function () {
    var a = "test", b = 1, c = true, d = function (){}, e = {};
    ok(zn.type, "zn.type is exist.");
    equal(zn.type(a), "string", "var a type is string");
    equal(zn.type(b), "number", "var b type is number");
    equal(zn.type(c), "boolean", "var c type is boolean");
    equal(zn.type(d), "function", "var d type is function");
    equal(zn.type(e), "object", "var e type is object");
});

