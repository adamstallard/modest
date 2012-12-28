var async = require('async');
var _ = require('underscore');

var ModestCompiler = require('./ModestCompiler');

// Default options

compile.options = {
  previewScript : 'modest-preview.js'
};

function compile(params){
  //  params: { -- instance parameters (extend function options)
  //    dirs : [string[]] -- Array of directories to enter (relative to process cwd)
  //    quiet: [boolean] -- supress output
  //    previewScript : [string] -- What to name the preview script placed in each directory
  //    See ModestCompiler for more... (params are forwarded to ModestCompiler)
  //  }
  //
  _.defaults(params, compile.options);
  var compiler = new ModestCompiler(params);

  var series = [];
  var origPath = process.cwd();

  // Compile each directory in series, so we can reuse the same compiler
  
  // TODO: add an option to compile in parallel, creating a new ModestCompiler for each dir

  _.each(params.dirs, function(path){
    series.push(function(callback){
      process.chdir(origPath);
      if(!params.quiet)
        console.log('entering ' + path);
      process.chdir(path);
      if(fs.existsSync(params.previewScript))
        fs.unlinkSync(params.previewScript);
      fs.linkSync(__dirname + '/modest-preview.js', params.previewScript);
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