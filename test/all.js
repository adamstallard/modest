var assert = require('assert');
var vows = require('vows');
var ModestCompiler = require('../ModestCompiler.js');

vows.describe('Modest Compiler')
.addBatch({ 
  "a test function with an error in it" : {
    topic : function(){
      x.x = 2;
    },
    "should throw an error" : function(e){
      assert(e,'no error');
    }
  }
})
.export(module);

//vows.describe('test2')
//.addBatch({ 
//  "anoter test function with an error in it" : {
//    topic : function(){
//      x.x = 2;
//    },
//    "should throw an error" : function(e){
//      assert(e,'no error');
//    }
//  }
//})
//.export(module);

