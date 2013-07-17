'use strict';

//var assert = require('assert');
var fs = require('fs');

var vows = require('vows');
var _ = require('lodash');
var expect = require('chai').expect;

var compile = require('../lib/modest').compile;
var normalize = require('../lib/ModestCompiler').normalize;

var basePath = fs.realpathSync('test/serial-tests') + '/';
var setupTopics = {};
var dirs = [basePath];
var compilerTopics = {
  topic : function(){
    compile({
      dirs : dirs,
      callback : this.callback,
      quiet : true
    });
  }
};
var key = normalize(fs.readFileSync('test/attr-sub-key.xhtml', 'utf8'));

var testFiles = [];

_.each(fs.readdirSync(basePath), function(f){
  var baseName = f.match(/(.+)-pre\.xhtml/);
  if(baseName && baseName[1])
    testFiles.push(baseName[1]);
});

_.each(testFiles, function(f){
  var outFile = f + '.xhtml';
  setupTopics['deleting output file ' + outFile] = {
    topic : function(){
      fs.unlink(basePath + outFile, this.callback);
    },
    "should result in the file being gone from the directory" : function(error, dummy){
      expect(fs.readdirSync(basePath)).to.not.contain(outFile);
    }
  };
  compilerTopics["should create the correct output in '" + basePath + outFile + "'"] = function(){
    var output = fs.readFileSync(basePath + outFile, 'utf8');
    expect(output).to.equal(key);
  };
});

vows.describe('Processing Files in Serial (same directory)')
  .addBatch({
    "Setup: " : setupTopics
  })
  .addBatch({
    "Compiling all the files in the directory: " : compilerTopics
  })
  .export(module);
