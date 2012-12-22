var async = require('async');
var _ = require('underscore');

var ModestCompiler = require('./ModestCompiler');

compile.options = {
  previewScript : 'modest-preview.js'
};

function compile(params){
  params = _.extend(compile.options,params);
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

module.exports = {
  compile : compile,
  compiler : ModestCompiler
}