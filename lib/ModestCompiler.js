// Module-scoped variables required by modest-preview.js

fs = require('fs');
$ = null;

// Required modules

var jsdom = require('jsdom');
var contextify = require('contextify');
var async = require('async');
var _ = require('lodash');

// Default options

ModestCompiler.options = {};

function ModestCompiler(params){
  //  params: {  -- input parameters (extend function options)
  //    dir: <string> -- directory containing the files to be compiled
  //    quiet: <boolean> -- suppress output
  //    jqueryPath: <string> -- file or url location of jquery (if unspecified, jquery from npm will be used)
  //  }
  //
  this.params = _.defaults(params, ModestCompiler.options);
  this.scripts = [];
  var previewSource = __dirname + '/modest-preview.js';
  var previewDest = this.params.dir + 'modest-preview.js';

  if (this.params.jqueryPath) {
    this.scripts.push(this.params.jqueryPath);
  }
  else {
    $ = require('jquery');
  }

  if (fs.existsSync(previewDest)) {
    fs.unlinkSync(previewDest);
  }
  fs.linkSync(previewSource, previewDest);
  this.modest = require(previewDest).modest;

  _.bindAll(this);
}

ModestCompiler.prototype = {
  constructor : ModestCompiler,
  compileFile : function(file, callback){
    if (!this.params.quiet) {
      console.log('\tmodest: compiling ' + this.params.dir + file);
    }
    var html = fs.readFileSync(this.params.dir + file, 'utf8');
    jsdom.env({
      html : html,
      scripts : this.scripts,
      done : function(errors, window){
        if (errors) {
          callback(errors);
        }
        else {
          var basePath = this.params.dir;
          try {
            this.modest.setWindow(window);
            this.modest.setBasePath(basePath);
            this.modest.loadModules();
            this.modest.compileModules();
            var $document = $(window.document);
            var $body = $(window.document.body);
            if (window.$) {
              $ = window.$;
            }

            // Remove demo elements

            $body.find('[demo]').remove();

            // Compile body

            this.modest.compileNode($body);

            // Remove 'uses' attributes

            $body.find('[uses]').removeAttr('uses');

            // Remove any modest-preview script tags

            $document.find('head script[src="modest-preview.js"]').remove();

            // Remove any jquery script tags inserted by jsdom

            $document.find('script.jsdom').remove();

            // Execute and then remove js marked for preprocessing

            var $ssJs = $document.find('script[pre]');

            if ($ssJs.length) {
              var scriptContext = contextify({
                $ : $,
                modest : this.modest,
                window : window,
                document : window.document
              });

              $ssJs.each(function(){
                var script = fs.readFileSync(basePath + this.getAttribute('src'), 'utf8');
                scriptContext.run(script);
              });

              scriptContext.dispose();
              $ssJs.remove();
            }

            // Add a script tag with a reference to 'modest.js', if needed

            if (!_.isEmpty(this.modest.saveAsJs)) {
              var script = window.document.createElement('script');
              script.src = 'modest.js';
              insertAfter(window.document.body, script);
            }

            // Write the compiled html out to a file (minus the '-pre')

            var output = window.document.doctype || "";
            output += normalize(window.document.innerHTML);
            fs.writeFileSync(basePath + file.replace(/-pre(\..+)?$/, '$1'), output);

            callback();
          }
          catch (e) {
            callback(e);
          }
        }
      }.bind(this)
    });
  },
  writeModestJs : function(){
    // Save the modules requested for client-side use in 'modest.js'

    var module, modestJs, moduleDefinition;
    var savedModules = '';

    for (module in this.modest.saveAsJs) {
      moduleDefinition = normalize(this.modest.modules[module]) + "';\n";
      savedModules += 'modest.modules.' + module + " = '" + moduleDefinition;
    }

    if (savedModules !== '') {

      modestJs = fs.readFileSync(this.params.dir + 'modest-preview.js', 'utf8');

      // Take out everything that isn't needed from the modest object

      modestJs = modestJs.replace(/\/\/#REMOVE-POST-COMPILE[\s\S]*?\/\/#!REMOVE-POST-COMPILE/g, '');

      // Write the saved modules and the modest object to modest.js

      fs.writeFileSync(this.params.dir + 'modest.js', modestJs + savedModules);
    }
  },
  compileFiles : function(callback){
    var files = fs.readdirSync(this.params.dir);
    var toCompile = [];

    // Compile all the files that contain '-pre.' or end in '-pre'

    _.each(files, function(f){
      if (/-pre(?:\.|$)/.test(f)) {
        toCompile.push(async.apply(this.compileFile, f));
      }
    }.bind(this));

    // Compile the files in series so dependency detection works

    async.series(toCompile, function(err){
      if(!err){
        this.writeModestJs();
      }
      callback(err);
    }.bind(this));
  }
};

function insertAfter(referenceNode, newNode){
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function normalize(string){
  return string.replace(/\s*[\r\n\t]\s*/g, '');
}

module.exports = ModestCompiler;
module.exports.normalize = normalize;
