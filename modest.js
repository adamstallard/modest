#!/usr/bin/env node

//modest.js
//
//a utility for creating, previewing, and compiling modular xhtml
//

var fs = require('fs');

var _ = require('underscore');

var ModestCompiler = require('./ModestCompiler');

var optimist = require('optimist')
.options({
  "j" : {
    alias : "jquery",
    describe : "Path to (or URL of) jquery.  If omitted, modest will use the npm jquery module."
  }
})
.alias('?','help')
.alias('h','help')
.describe('h','Show this help message.')
.usage(
  'Usage: modest [options] <directories>\n\
  \n\
  Modest is a utilty for creating, previewing, and compiling modular xhtml.\n\
  \n\
  The "modest" command does the following in each target directory:\n\
  \n\
  1. Place a copy of "modest-preview.js" for generating previews.\n\
  2. Compile all files ending with -pre (plus an optional extension). The output files have the\n\
      same names as the input files, but with the "-pre" removed.\n\
  3. If one or more modules need to be available in javascript, create a "modest.js" containing\n\
      the compiled modules and code needed to support them.  Supported modules are shared by the\n\
      files in the same directory, i.e. there is one "modest.js" file per directory.\n\
  \n\
  If no directories are supplied, the current directory is used.\n'
);

var argv = optimist.argv;
var dirs = argv._;
var compiler, params;

if(_.isBoolean(argv.j)){
  optimist.showHelp(console.log);
  console.error('Error: Option had no value, or no space between option and value');
  process.exit(1);
}
if(_.isArray(argv.j)){
  optimist.showHelp(console.log);
  console.error('Error: Multiple options of the same type');
  process.exit(2);
}
if(argv.h || argv['?']){
  optimist.showHelp() || optimist.showHelp();
  process.exit();
}

params = {
  jqueryPath : argv.j,
  previewScript : 'modest-preview.js'
};

if(_.isEmpty(dirs))
  dirs.push('.');

compiler = new ModestCompiler(params);

_.each(dirs, function(path){
  path = path.replace(/^\s+/, '').replace(/[\/\\\s]+$/,'') + '/';
  fs.link(__dirname + '/' + params.previewScript, path + params.previewScript);
  compiler.setPath(path);
  compiler.compileFiles();
});
