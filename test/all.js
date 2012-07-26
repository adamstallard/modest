// options

var spec = require('../node_modules/vows/lib/vows/reporters/spec');
var opts = {
  reporter : spec
};

// all tests

require('./ModestCompilerTest').ModestCompiler.run(opts);
