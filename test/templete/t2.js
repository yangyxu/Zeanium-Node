/**
 * Created by yangyxu on 7/14/15.
 */
//var add = new Function('a','b', 'return a+b;');

//console.log(add(1,2));

var addObject = new Function('user1','user2', 'return user1.age+user2.age;');

var _user1 = {
    name: 'yangyxu',
    age: 26
}
var _user2 = {
    name: 'wy',
    age: 25
}

console.log(addObject(_user1,_user2));