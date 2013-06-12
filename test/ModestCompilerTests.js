'use strict';

var assert = require('assert');
var fs = require('fs');

var vows = require('vows');
var _ = require('underscore');
var expect = require('chai').expect;

var ModestCompiler = require('../lib/ModestCompiler');

var compilerTopics = {
  topic : new ModestCompiler({quiet : true})
};
var setupTopics = {};
var testFiles = [];

process.chdir(__dirname);
process.chdir('compiler-test-files');

_.each(fs.readdirSync('.'), function(f){
  var baseName = f.match(/(.+)-key\.xhtml/);
  if(baseName && baseName[1])
    testFiles.push(baseName[1]);
});

_.each(testFiles,function(f){
  var testFile = f + '-pre.xhtml';
  var outFile = f + '.xhtml';
  var keyFile = f + '-key.xhtml';
  var descFile = f + '.txt';
  var topicName = 'compiling test file ' + testFile;
  var description;
  try{
    description = fs.readFileSync(descFile,'utf8');
    if(description)
      topicName = 'compiling ' + description;
  } catch(e){
  }
  setupTopics['deleting output file ' + outFile] = {
    topic : function(){
      fs.unlink(outFile, this.callback);
    },
    "should result in the file being gone from the directory" : function(error, dummy){
      expect(fs.readdirSync('.')).to.not.contain(outFile);
    }
  };
  compilerTopics[topicName] = {
    topic : function(mc){
      mc.compileFile(testFile, this.callback);
    },
    "should produce the expected output" : function(){
      var output = fs.readFileSync(outFile,'utf8');
      var key = ModestCompiler.normalize(fs.readFileSync(keyFile,'utf8'));
      assert(output == key, 'expected:\n\t' + key + '\n\tgot:\n\t' + output);
    }
  };
});

vows.describe('ModestCompiler')
.addBatch({
  "Setup: " : setupTopics
})
.addBatch({
  "ModestCompiler" : compilerTopics
}).export(module);
