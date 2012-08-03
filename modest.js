#!/usr/bin/env node

//modest.js
//
//a utility for creating, previewing, and compiling modular xhtml
//

var fs = require('fs');

var _ = require('underscore');
var async = require('async');

var ModestCompiler = require('./ModestCompiler');

var optimist = require('optimist')
.options({
  "j" : {
    alias : "jquery",
    describe : "Path to (or URL of) jquery.  If omitted, modest will use the npm jquery module."
  },
  "q" : {
    alias : "quiet",
    describe : "Supress output."
  }
})
.alias('?','help')
.alias('h','help')
.describe('h','Show this help message.')
.usage(
  'Usage: modest [options] <directories>\n\
  \n\
  Modest is a utilty for previewing and compiling templates with semantic module tags.\n\
  \n\
  It can also be used in javascript to generate xhtml according to module definitions.\n\
  \n\
  The "modest" command does the following in each target directory:\n\
  \n\
  1. Places a copy of "modest-preview.js" for generating previews.\n\
  2. Compiles all files ending with -pre (plus an optional extension). The output files have the\n\
      same names as the input files, but with the "-pre" removed.\n\
  3. If one or more modules needs to be available in javascript, creates a "modest.js" containing\n\
      the compiled modules and code needed to support them.  Supported modules are shared by the\n\
      files in the same directory, i.e. there is one "modest.js" file per directory.\n\
  \n\
  If no directories are supplied, the current directory is used.\n'
);

var argv = optimist.argv;

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
  quiet : argv.q,
  previewScript : 'modest-preview.js'
};

var compiler = new ModestCompiler(params);
var dirs = argv._;
var series = [];
var origPath = process.cwd();

if(_.isEmpty(dirs))
  dirs.push('.');

// Compile each directory in series, so we can reuse the same compiler

_.each(dirs, function(path){
  series.push(function(callback){
    process.chdir(origPath);
    if(!params.quiet)
      console.log('entering ' + path);
    process.chdir(path);
    fs.unlink(params.previewScript);
    fs.link(__dirname + '/' + params.previewScript, params.previewScript);
    compiler.compileFiles(callback);
  });
});

async.series(series,function(err){
  if(err)
    throw(err);
  else
    process.chdir(origPath);
});


