/**
 * Created by yangyxu on 3/20/15.
 */
module("class");

var Person = zn.class('test.Person', zn.data.Observable, {
    events: ['say', 'eat', 'walk'],
    properties: {
        name: {
            set: function (value){
                this._name = value;
            },
            get: function (value){
                return this._name;
            }
        }
    },
    methods: {
        init: function (values) {
            this.sets(values);
        },
        say: function () {
            this.fire('say', 'say hello');
        },
        eat: function () {
            this.fire('eat', 'eat food');
        },
        walk: function () {
            this.fire('walk', 'walk to home.');
        }
    }
});

var yangyxu = new Person();

yangyxu.watch('name', function (value, name){
    console.log(value, name);
});

yangyxu.name = 'yangyxu';
yangyxu.name = 'test';
//yangyxu.set('name', 'yangyxu', {force: true});

//var name = yangyxu.name;

//console.log(yangyxu.name);

//yangyxu.notify('name');


