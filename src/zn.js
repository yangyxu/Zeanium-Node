/*Add current path to NODE_PATH*/
var path = require('path');
var _curr = process.cwd() + path.sep + 'node_modules';
var _parents = module.constructor._nodeModulePaths(_curr);
process.env.NODE_PATH = process.env.NODE_PATH + path.delimiter + _parents.join(path.delimiter);
module.constructor._initPaths();
module.exports = require('zeanium'), zn.ZN_PATH = __dirname;
