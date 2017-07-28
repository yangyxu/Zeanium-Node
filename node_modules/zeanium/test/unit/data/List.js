(function (zn){

    var a = new zn.data.ObservableList([1,2,3]);

    a.on('change', function (sender, data){
        console.log(sender, data);
    });

    a.watch('count', function (a, b, c){
        console.log(a, b, c);
    });


    a.add(4);
    a.add(5);

    console.log(a);

})(zn);