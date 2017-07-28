/**
 * Created by yangyxu on 3/11/15.
 */
module("zn");

console.log(zn);

test("zn-core", function () {
    ok(zn, 'window.zn global var is exist.');
    ok(zn.version, "zn's version is v"+zn.version);
});