// globals required by preview.js

fs = require('fs');
$ = null;

// required modules

var jsdom = require('jsdom');
var async = require('async');
var _ = require('underscore');

require('./modest-preview.js');

// Default options

ModestCompiler.options = {
  previewScript : 'modest-preview.js'
};

// ModestCompiler(
//  params: -- input parameters {
//    quiet: [boolean] -- supress output
//    jqueryPath: [string] -- file or url location of jquery
//    previewScript: [string] -- name of modest preview script to include
//  }   
// )

function ModestCompiler(params){
  this.params = _.extend(ModestCompiler.options,params);
  this.scripts = [];
  if(this.params.jqueryPath)
    this.scripts.push(this.params.jqueryPath);
  else
    $ = require('jquery');
  _.bindAll(this);
}

ModestCompiler.prototype = {
  resetModest : function(){
    modest.reset();
  },
  compileFile : function(file,callback){
    if(!this.params.quiet)
      console.log('\tcompiling ' + file);
    jsdom.env(file,
    this.scripts,
    function(errors, window) {
      var script, output, $body, $document, $ssJs;

      if(errors)
        callback(errors);
      else {
        try{
          modest.setWindow(window);
          modest.loadModules(process.cwd());
          modest.compileModules();
          
          $document = $(document);
          $body = $(document.body);
          
          // remove dummy elements
          
          $document.find('[dummy="true"]').remove();
          
          // compile body
          
          modest.compileNode($body);
          
          // remove 'uses' attributes
          
          $body.find('[uses]').not('[uses=""]').removeAttr('uses');

          // remove any modest-preview script tags
          
          $document.find('head script[src="' + this.params.previewScript + '"]').remove();
          
          // remove any jquery script tags inserted by jsdom
          
          $document.find('script.jsdom').remove();
          
          // execute and then remove js marked for preprocessing
          
          $ssJs = $document.find('script[pre="true"]');
          
          $ssJs.each(function(){
            require(process.cwd() + '/' + this.getAttribute('src'));
          });

          $ssJs.remove();
          
          // add a script tag with a reference to 'modest.js', if needed
          
          if(!_.isEmpty(modest.saveAsJs)){
            script = window.document.createElement('script');       
            script.src = 'modest.js';
            insertAfter(window.document.body, script);
          }
                   
          // write the compiled xhtml out to a file (minus the '-pre')

          output = normalize(window.document.innerHTML);
          fs.writeFileSync(file.replace(/-pre(\..+)?$/,'$1'),output);
        }
        catch(e){
          callback(e);
        }
        callback();
      }  
    }.bind(this));
  },
  writeModestJs : function(){
  
    // Save the modules requested for client-side use in 'modest.js'          

    var module, modestJs, moduleDefinition;
    var savedModules = '';

    for (module in modest.saveAsJs){
      moduleDefinition = normalize(modest.modules[module]) + "';\n";
      savedModules += 'modest.modules.' + module + " = '" + moduleDefinition;
    }

    if(savedModules !== ''){

      modestJs = fs.readFileSync(this.params.previewScript,'utf8');
      
      // Take out everything that isn't needed from the modest object
      
      modestJs = modestJs.replace(/\/\/#REMOVE-POST-COMPILE[\s\S]*?\/\/#!REMOVE-POST-COMPILE/g,'');

      // Write the saved modules and the modest object to modest.js

      fs.writeFileSync('modest.js', modestJs + savedModules);
    } 
  },
  // Compile all the files in the current directory
  compileFiles : function(callback){
    var files = fs.readdirSync('.');
    var toCompile = [];
    
    // clear out any existing modules
    
    this.resetModest();
    
    // compile all the files that contain '-pre.' or end in '-pre'
    
    _.each(files, function(f){
      if(/-pre(?:\.|$)/.test(f))
        toCompile.push(async.apply(this.compileFile, f));
    }.bind(this));
    
    // compile the files in series so dependency detection works
    
    async.series(toCompile,function(err){
      if(err)
        throw(err);
      else
        this.writeModestJs();
      callback(err);
    }.bind(this));
  }
};

function insertAfter(referenceNode, newNode)
{
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function normalize(string){
  return string.replace(/[\r|\n]/g,'').replace(/ +/g,' ');
}

module.exports = ModestCompiler;
module.exports.normalize = normalize;
