zn.define([
    './dbms/index',
    './rights/index',
    './workflow/index'
],function (dbms, rights, workflow){

    return {
       dbms: dbms,
       rights: rights,
       workflow: workflow
    }
    
});
