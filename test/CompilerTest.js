'use strict';

var assert = require('assert');
var fs = require('fs');

var vows = require('vows');
var _ = require('lodash');
var expect = require('chai').expect;

var ModestCompiler = require('../lib/ModestCompiler');

var basePath = fs.realpathSync('test/compiler-test-files') + '/';
var compilerTopics = {
  topic : new ModestCompiler({
    quiet : true,
    dir : basePath
  })
};
var setupTopics = {};
var testFiles = [];

_.each(fs.readdirSync(basePath), function(f){
  var baseName = f.match(/(.+)-key\.xhtml$/);
  if(baseName && baseName[1])
    testFiles.push(baseName[1]);
});

_.each(testFiles, function(f){
  var testFile = f + '-pre.xhtml';
  var outFile = f + '.xhtml';
  var keyFile = f + '-key.xhtml';
  var descFile = f + '.txt';
  var topicName = 'compiling test file ' + testFile;
  var description;
  try{
    description = fs.readFileSync(basePath + descFile,'utf8');
    if(description)
      topicName = 'compiling ' + description;
  } catch(e){
  }
  setupTopics['deleting output file ' + outFile] = {
    topic : function(){
      fs.unlink(basePath + outFile, this.callback);
    },
    "should result in the file being gone from the directory" : function(error, dummy){
      expect(fs.readdirSync(basePath)).to.not.contain(outFile);
    }
  };
  compilerTopics[topicName] = {
    topic : function(compiler){
      compiler.compileFile(testFile, this.callback);
    },
    "should produce the expected output" : function(){
      var output = fs.readFileSync(basePath + outFile, 'utf8');
      var key = ModestCompiler.normalize(fs.readFileSync(basePath + keyFile, 'utf8'));
      assert(output == key, 'expected:\n\t' + key + '\n\tgot:\n\t' + output);
    }
  };
});

vows.describe('Compiler')
.addBatch({
  "Setup: " : setupTopics
})
.addBatch({
  "ModestCompiler" : compilerTopics
}).export(module);
