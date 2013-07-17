'use strict';

//var assert = require('assert');
var fs = require('fs');

var vows = require('vows');
var _ = require('lodash');
var expect = require('chai').expect;

var compile = require('../lib/modest').compile;
var normalize = require('../lib/ModestCompiler').normalize;

var basePath = fs.realpathSync('test/parallel-tests') + '/';
var setupTopics = {};
var dirs = [];
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

_.each(fs.readdirSync(basePath), function(d){
  var outFile = d + '/attr-sub.xhtml';
  setupTopics['deleting output file ' + outFile] = {
    topic : function(){
      fs.unlink(basePath + outFile, this.callback);
    },
    "should result in the file being gone from the directory" : function(error, dummy){
      expect(fs.readdirSync(basePath)).to.not.contain(outFile);
    }
  };
  compilerTopics["should create the correct output in '" + basePath + d + "'"] = function(){
    var output = fs.readFileSync(basePath + outFile, 'utf8');
    expect(output).to.equal(key);
  };
  dirs.push(basePath + d);
});

vows.describe('Processing Directories in Parallel')
.addBatch({
  "Setup: " : setupTopics
})
.addBatch({
  "Compiling all the directories: " : compilerTopics
})
.export(module);
