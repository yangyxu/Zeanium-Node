/**
 * Created by yangyxu on 3/20/15.
 */
module("class");

var Person = zn.Class('test.Person', {
    events: ['say', 'eat', 'walk'],
    statics: {
        count: 0,
        talk: function (){
            console.log('talk--');
        }
    },
    properties: {
        name: {
            set: function (value){
                console.log('set name: '+value);
                this._name = value;
            }
        },
        age: {
            readonly: false,
            value: 12,
            get: function(){

            },
            set: function (){

            }
        }
    },
    methods: {
        __define__: function (){
            //console.log('Person define');
        },
        init: function (values) {
            //console.log(values);
            this.sets(values);


            this.get('name');
            console.log(this.name);

            this.set('name', 'xxx');
            this.name = 'xxx';
        },
        say: function () {
            this.fire('say', 'say hello');
        },
        eat: function () {
            this.fire('eat', 'eat food');
        },
        walk: function () {
            this.eat();
            this.fire('walk', 'walk to home.');
        }
    }
});

var p1 = new Person();

p1.on('say', function (){

});

p1.name = 'aa';
p1.set('name', 'aa');
p1.walk();


console.log(p1.name);

console.log(p1);

/*

var User = zn.class('test.User', Person, {
    events: ['login'],
    properties: {
        username: '',
        password: ''
    },
    methods: {
        __define__: function (){
            //console.log('User define');
        },
        init: function (values) {
            this.sets(values);
            this.super(values);
        },
        login: function () {
            console.log('login');
        }
    }
});



var Factory = zn.class('test.Factory', {
    static: true,
    events: ['create'],
    properties: {
        username: '',
        password: ''
    },
    methods: {
        __define__: function (){
            console.log('Factory define');
        },
        init: function (self) {
            this.create();
        },
        create: function () {
            console.log('create');
        }
    }
});

*/


/*

var _yangyxu = new Person({
    name:'yangyxu',
    age:25,
    sex: 1
});

_yangyxu.onsay = function (sender, value){
    console.log('onsay: '+value);
}

_yangyxu.on('say', function (sender, value){
    console.log('on(say1):'+value);
});
_yangyxu.on('say', function (sender, value){
    console.log('on(say2):'+value);
});

_yangyxu.onsay = function (sender, value){
    console.log('onsay1: '+value);
}

_yangyxu.upon('say', function (sender, value){
    console.log('uponsay: '+value);
});

_yangyxu.off('say');

_yangyxu.say();

var _wangyuan = new User({
    name:'wangyuan',
    age:26,
    sex: 0
});

User.each(function (name, index, meta, value){
    if(index==2){
        //return -1;
    }
    console.log(name, index, meta, value);
});

_yangyxu.name = 'test';
console.log(_yangyxu.get('name'));
console.log(_wangyuan.get('name'));
console.log(Person.get('name'));

console.log(_yangyxu, _wangyuan);

console.log(User.gets());
console.log(_wangyuan.gets());
*/

//var _user = new User();

/*
console.log(_person);
console.log(_person.member('name'));

console.log(Person.member('name'));
console.log(Person.get('age'));
console.log(_person.get('age'));*/

//console.log(Person);
//console.log(User);
