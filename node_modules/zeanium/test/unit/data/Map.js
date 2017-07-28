(function (zn){

    /*

    var a = new zn.data.Map({
        name: 'yangyxu',
        age: 30,
        10:20
    });

    a.each(function (value, key){
        console.log(value, key);
    });

    a.set('test', 'test1');

    a.keys = [];

    a.values = [];

    console.log(a.keys);
    console.log(a.values);*/

    var b = new zn.data.ObservableMap({
        name: 'yangyxu',
        age: 30,
        10: 20
    });

    console.log(b);



})(zn);