// all tests
var fs = require('fs');

var spec = require('../node_modules/vows/lib/vows/reporters/spec');
var opts = {
  reporter : spec
};

require('./ModestCompilerTest').ModestCompiler.run(opts);
