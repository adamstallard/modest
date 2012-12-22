var async = require('async');
var _ = require('underscore');

var ModestCompiler = require('./ModestCompiler');

var defaults = {
  previewScript : 'modest-preview.js'
};

function compile(params){
  params = _.extend(defaults,params);
  var compiler = new ModestCompiler(params);

  var series = [];
  var origPath = process.cwd();

  // Compile each directory in series, so we can reuse the same compiler

  _.each(params.dirs, function(path){
    series.push(function(callback){
      process.chdir(origPath);
      if(!params.quiet)
        console.log('entering ' + path);
      process.chdir(path);
      if(fs.existsSync(params.previewScript))
        fs.unlinkSync(params.previewScript);
      fs.linkSync(__dirname + '/' + params.previewScript, params.previewScript);
      compiler.compileFiles(callback);
    });
  });

  async.series(series,function(err){
    if(err)
      throw(err);
    else
      process.chdir(origPath);
  });

}

compile.defaults 

module.exports = {
  compile : compile,
  compiler : ModestCompiler
}