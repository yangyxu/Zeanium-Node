zn.define([
    './DBMSTable',
    './DBMSField',
    './DBMSFunction'
],function (DBMSTable, DBMSField, DBMSFunction){
    //Table, Record, Field, Index, Query, Filter, View, Function
    return {
        DBMSTable: DBMSTable,
        DBMSField: DBMSField,
        DBMSFunction: DBMSFunction
    }

});
