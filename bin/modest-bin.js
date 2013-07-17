#!/usr/bin/env node

'use strict';

var _ = require('lodash');
var commander = require('commander');
var modest = require('../lib/modest');

commander
  .option('-j, --jquery <path>', 'Path to (or URL of) jquery.  If omitted, modest will use the npm jquery module.')
  .option('-q, --quiet', 'Suppress output.')
  .option('--print-options', 'Print supplied options and exit (for testing/debugging).')
  .option('--print-args', 'Print supplied arguments and exit (for testing/debugging).')
  .usage('modest [options] <directories>');

commander.on('--help', function(){
  console.log('\
  Modest is a utility for previewing and compiling modular templates in html and making them \n\
  available to javascript.\n\
  \n\
  The "modest" command does the following in each target directory:\n\
  \n\
  1. Places a copy of "modest-preview.js" for generating previews.\n\
  2. Compiles all files ending with -pre (plus an optional extension). The output files have the\n\
      same names as the input files, but with the "-pre" removed.\n\
  3. Runs (and then removes) javascript in the "-pre" files having the "pre=true" attribute in their script tags.\n\
  4. If one or more modules needs to be available in javascript, creates a "modest.js" containing\n\
      the compiled modules and code needed to support them.  Supported modules are shared by the\n\
      files in the same directory, i.e. there is one "modest.js" file per directory.\n\
  \n\
  If no directories are supplied, the current directory is used.\n\
  \n\
  See "https://github.com/goalzen/modest/wiki/Documentation" for documentation.\n'
  );
});

commander.parse(process.argv);

if(commander.printOptions){
  var options = _.clone(commander);
  delete options.options;
  delete options.commands;
  delete options._args;
  delete options._name;
  delete options.Command;
  delete options.Option;
  delete options._events;
  delete options._usage;
  delete options.rawArgs;
  delete options.args;
  console.log(options);
}
else if(commander.printArgs){
  console.log(commander.args);
}
else {
  var dirs = commander.args;

  if(_.isEmpty(dirs)){
    dirs.push('.');
  }

  var params = {
    jqueryPath : commander.jquery,
    quiet : commander.quiet,
    dirs : dirs
  };

  modest.compile(params);
}