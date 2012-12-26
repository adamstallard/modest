// options

var spec = require('../node_modules/vows/lib/vows/reporters/spec');

var opts = {
  reporter : spec
};

var failedCount = 0;

function addFailures(results){
  if(results){
    failedCount += results.broken;
    failedCount += results.errored;
  }
}

// all tests

var suite = require('./ModestCompilerTests').suite.run(opts,addFailures);

process.on('exit', function(){
  process.exit(failedCount);
});
