'use strict';

var exec = require('child_process').exec;
var fs = require('fs');
//var util = require('util');
var assert = require('assert');

var vows = require('vows');
var expect = require('chai').expect;

vows.describe('Command-Line')
.addBatch({
  "Setup: " : {
    "deleting 'modest-preview.js' in the output directory" : {
      topic : function(){
        fs.unlink('test/command-line-tests/modest-preview.js', this.callback);
      },
      "should result in the file being gone from the directory" : function(error, dummy){
        expect(fs.readdirSync('test/command-line-tests')).to.not.contain('modest-preview.js');
      }
    }
  }
})
.addBatch({
  "Running 'modest <dir>'" : {
    topic : function(){
      exec('node bin/modest-bin.js test/command-line-tests', this.callback);
    },
    "should create 'modest-preview.js' in that dir" : function(error, stdout){
      assert.ifError(error);
      expect(fs.readdirSync('test/command-line-tests')).to.contain('modest-preview.js');
    }
  },
  "Running 'modest -j' (no argument to the j option)" : {
    topic : function(){
      exec('node bin/modest-bin.js -j', this.callback);
    },
    "should give an error" : function(error, dummy){
      expect(error).to.exist;
    }
  },
  "Running 'modest -j hi'" : {
    topic : function(){
      exec('node bin/modest-bin.js -j hi --print-options', this.callback);
    },
    "should set the jquery parameter to 'hi'" : function(error, stdout){
      expect(stdout).to.contain("jquery: 'hi'");
    }
  },
  "Running 'modest -j 1 -j 2'" : {
    topic : function(){
      exec('node bin/modest-bin.js -j 1 -j 2 --print-options', this.callback);
    },
    "should set the jquery parameter to '2'" : function(error, stdout){
      expect(stdout).to.contain("jquery: '2'");
    }
  },
  "Running 'modest' with two directory arguments" : {
    topic : function(){
      exec('node bin/modest-bin.js 1 2 --print-args', this.callback);
    },
    "should put both directories in an array" : function(error, stdout){
      expect(stdout).to.contain("[ '1', '2' ]");
    }
  }
})
.export(module);
