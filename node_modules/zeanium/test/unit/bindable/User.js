(function (zn){

    var User = zn.class('zn.model.User', zn.data.Bindable, {
        properties: {
            firstName: {
                $count: 0
            },
            lastName: '',
            fullName: {
                binding: {
                    sourcePaths: '#firstName, #lastName, #sex',
                    convert: function (first, last, sex){
                        return first + '/' + last+':' + sex;
                    }
                },
                value: ''
            },
            age: 0,
            sex: '男'
        },
        methods: {
            init: function (inArgs) {
                this.sets(inArgs);
            }
        }
    });

    var yangyxu = new User({
        firstName: 'xu',
        lastName: 'yangyang',
        age: 25,
        sex: '男'
    });


    yangyxu.watch('firstName', function (a, b, c){
        //console.log(a, b, c);
    });

    console.log(yangyxu.fullName);

    yangyxu.firstName ='wang';

    yangyxu.lastName ='yuan';

    console.log(yangyxu.fullName);


})(zn);