//Table, Record, Field, Index, Query, Filter, View, Function
zn.define([
    './DBMSTable',
    './DBMSField',
    './DBMSFunction'
], function (DBMSTable, DBMSField, DBMSFunction){
    return {
        DBMSTable: DBMSTable,
        DBMSField: DBMSField,
        DBMSFunction: DBMSFunction
    }
});
