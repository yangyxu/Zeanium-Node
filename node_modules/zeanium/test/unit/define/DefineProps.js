(function (zn){

    var MyClass = zn.class('MyClass', {
       methods: {
           init: function (){

           }
       }
    });

    MyClass.defineProperty('name', {
        set: function (){

        },
        get: function (){

        }
    });

    var _class1 = new MyClass();

    console.log(_class1);

})(zn);