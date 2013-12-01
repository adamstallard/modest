'use strict';

var fs = require('fs');

var async = require('async');
var _ = require('lodash');

var ModestCompiler = require('./ModestCompiler');

// Default options

compile.options = {};

function compile(params){
  //  params: { -- instance parameters (extend function options)
  //    dirs : [string[]] -- Array of directories to enter (relative to process cwd)
  //    quiet: [boolean] -- suppress output
  //    jqueryPath: [string] -- file or url location of jquery (if unspecified, jquery from npm will be used)
  //    callback(optional) : [function]
  //  }
  //
  _.defaults(params, compile.options);
  var parallel = [];

  _.each(params.dirs, function(dir){
    dir = fs.realpathSync(dir) + '/';
    parallel.push(function(callback){
      if (!params.quiet) {
        console.log("modest: processing " + dir);
      }
      var compilerParams = {
        dir : dir,
        quiet : params.quiet,
        jqueryPath : params.jqueryPath
      };
      var compiler = new ModestCompiler(compilerParams);
      compiler.compileFiles(callback);
    });
  });

  async.parallel(parallel, function(err){
    if (params.callback) {
      params.callback(err);
    } else if (err) {
      throw(err);
    }
  });

}

module.exports = {
  compile : compile,
  compiler : ModestCompiler
};