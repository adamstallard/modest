var assert = require('assert');
var fs = require('fs');

var vows = require('vows');
var _ = require('underscore');

var ModestCompiler = require('../ModestCompiler');

var compilerTopics = {
  topic : new ModestCompiler({quiet : true})
};
var setupTopics = {};
var numCompilerTestFiles = 1;

process.chdir(__dirname);
process.chdir('compiler-test-files');

_.each(_.range(1,numCompilerTestFiles+1),function(i){
  var testFile = i + '-pre.xhtml';
  var outFile = i + '.xhtml';
  var keyFile = i + '-key.xhtml';
  setupTopics['deleting output file ' + outFile] = {
    topic : function(){
      fs.unlinkSync(outFile);
      return null;
    },
    "should result in the file being gone from the directory" : function(){
      assert(!_.contains(fs.readdirSync('.'),outFile),'file exists');
    }
  };
  compilerTopics['compiling test file ' + testFile] = {
    topic : function(mc){
      mc.compileFile(testFile,this.callback);
    },
    "should produce the expected output" : function(e){
      assert.ifError(e);
      var output = fs.readFileSync(outFile,'utf8');
      var key = fs.readFileSync(keyFile,'utf8').replace(/\s+/g,' ');
      assert(output == key, outFile + ' did not match ' + keyFile);
    }
  };
});

vows.describe('ModestCompiler')
.addBatch({
  "Setup: " : setupTopics
})
.addBatch({
  "ModestCompiler" : compilerTopics
})
.export(module);