/**
 * Created by yangyxu on 3/20/15.
 */
module("fix");

//zn.fix: fix
test("array", function () {
    var dataList = [
        { name: 'a', age: 10 },
        { name: 'b', age: 15 },
        { name: 'c', age: 18 },
    ];
    var dataList1 = [ 'test', 10, true, {} ];
    var a = 'test', b = 10, c = true, d = function (){}, e = {};
    dataList.forEach(function (value, index){
        ok(true, 'index: '+index+ ", value: "+JSON.stringify(value));
    });

    equal(Array.isArray(dataList), true, "dataList is array");
    equal(Array.isArray(a), false, "a is not array");
    equal(Array.isArray(b), false, "b is not array");
    equal(Array.isArray(c), false, "c is not array");
    equal(Array.isArray(d), false, "d is not array");
    equal(Array.isArray(e), false, "e is not array");

    equal(dataList1.indexOf('test'), 0, 'test index is 0');
    equal(dataList1.indexOf(10), 1, '10 index is 1');
    equal(dataList1.indexOf(true), 2, 'true index is 2');
    //console.log(dataList1.lastIndexOf('test'));
    equal(dataList1.lastIndexOf('test'), 0, 'test last index is 0');
    equal(dataList1.lastIndexOf(10), 1, '10 last index is 1');
    equal(dataList1.lastIndexOf(true), 2, 'true last index is 2');
});

test("function", function () {
    function say(name){
        console.log('say hello to: '+name);
        ok(true, 'exec base say');
    }
    function test(){
        this.say = function (name){
            console.log('a say hello to: '+name);
            ok('true', 'exec a say');
        }
    }
    console.log(test.propotype);

    say('yangyxu');
    say.bind(test, 'wangyuan');

});

test("object", function () {
    var _obj = {
        a:'test',
        b:10,
        c:true,
        d:function (){},
        e:{}
    };
    equal(Object.keys(_obj).length, 5, "_obj length is 5");
    equal(Object.values(_obj).length, 5, "_obj length is 5");
    console.log(Object.keys(_obj));
    console.log(Object.values(_obj));

    var person = function (name, age){
        this.name = name;
        this.age = age;
    }


    var student = Object.create(person, {
        school:{
            value: 'us'
        },
        classRoom: {
            value:'001'
        },
        say: {
            value: function (name){
                console.log('say hello: '+name);
            }
        }
    });

    student.say('yangyxu');


});