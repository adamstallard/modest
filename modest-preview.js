modest = this.modest || {
  modules : {}, // compiled modules as strings
  //#REMOVE-POST-COMPILE
  $uncompiled : {}, // uncompiled modules as jquery objects
  compiled : {}, // set {X:X} -- names of modules that have been compiled
  saveAsJs : {}, // set {X:X} -- names of modules needed for js
  setWindow : function(w){
    window = w;
    document = w.document;
    if(w.$) $ = w.$;
    modest.nodejs = true;
  },
  reset : function(){
    modest.modules = {};
    modest.$uncompiled = {};
    modest.compiled = {};
    modest.saveAsJs = {};
  },
  loadModules : function(){
    var includes = document.getElementsByTagName('head')[0].getElementsByTagName('include');
    var path, pathAttr, moduleName, moduleContent, i;

    for(i = 0; i < includes.length; ++i){
      
      // Assume the include tag has a single text node with the name of the module
      
      moduleName = includes[i].childNodes[0].nodeValue;
      
      // Remove leading and trailing whitespace from the module name
      
      moduleName = moduleName.replace(/^\s+/, '').replace(/\s+$/, '');
      
      if(!modest.compiled[moduleName]){
        path = '';
        pathAttr = includes[i].getAttribute('path');      
        if(pathAttr){

          // Remove trailing slashes and whitespace from the "path" attribute; Add one slash

          path = pathAttr.replace(/[\/\\\s]+$/,'') + '/';
        }
        
        path += moduleName;

        // Append ".xml" if the path doesn't already end with it

        path = path.replace(/\.xml$/,'') + '.xml'; 
        
        if(modest.nodejs){
          moduleContent = fs.readFileSync(path,'utf8');
        } 
        else{
          moduleContent = $.ajax({
            url: path,
            async : false
          }).responseText;
        }
        modest.$uncompiled[moduleName] = $(moduleContent);
      }
      
      if(includes[i].hasAttribute('js')){
        modest.saveAsJs[moduleName] = moduleName;
      }      
    }
    
  },
  compileNode : function($node,modules){  
    if(!modules)
      modules = modest.compiled;  
    modest.compileTemplate($node,modules);
    
    // Clean up: remove 'uses' attributes
    
    $node.find('[uses]').removeAttr('uses');
  },
  compileModules : function(){
    var dependencies = {};
    var compiledCount = 0;
    var numModules = 0;
    var waitToCompile, module, otherModule, lastCompiledCount, d;

    function loopError(){
      var badModules = '';
      var module;
      
      for (module in modest.$uncompiled){       
        if(!modest.compiled[module])
          badModules += module + ' ';       
      }
      
      throw ('Infinite loop detected in modules: ' + badModules);
    }

    function compileModule(module){
      var $module = modest.$uncompiled[module];
      modest.compileTemplate($module, dependencies[module]);
      if($module[0].outerHTML)
        modest.modules[module] = $module[0].outerHTML;
      else
        modest.modules[module] = new XMLSerializer().serializeToString($module[0]);
      modest.$uncompiled[module] = false;
      modest.compiled[module] = module;
    }

    for (module in modest.$uncompiled){
      ++numModules;
      if(!modest.compiled[module]){ 
        dependencies[module] = [];

        for (otherModule in modest.$uncompiled){        
          if(modest.$uncompiled[module].find(otherModule).length)
            dependencies[module].push(otherModule);         
        }

      }
    }
    
    while(compiledCount < numModules){   
      lastCompiledCount = compiledCount;
      
      for (module in modest.$uncompiled){         
        if(modest.compiled[module]){
          ++compiledCount;
          continue;
        }    
        waitToCompile = false;

        for (d in dependencies[module]){       
          if(!modest.compiled[dependencies[module][d]]){
            waitToCompile = true;
            break;
          }           
        }
        
        if(!waitToCompile){
          compileModule(module);
          ++compiledCount;
        }      
      }
      
      if(lastCompiledCount == compiledCount)
        loopError();  
    }
    
  },
  compileTemplate : function($template, modules){  
    
    $.each(modules, function(i,module){ 
      
      // find and compile module instances in the template
      
      $template.find(module).each(function(){
        modest.compile($(this),module);
      });   
    });  
    
  },
  //#!REMOVE-POST-COMPILE
  compile : function($instance,module){   
    var parameters = {};
    var usesParameters = {}; 
    
    // read the parameters from the instance

    $instance.children().each(function(){
      var param = this;   
      parameters[param.tagName.toLowerCase()] = param.innerHTML;
      if(param.hasAttribute('uses'))
        usesParameters[param.tagName.toLowerCase()] = param.innerHTML;
    });
    
    $instance.html(modest.modules[module]);
    $instance = $instance.children(':first').unwrap();
    $instance.addClass(module);

    $instance.find('[uses]').each(function(){
      var $target = $(this);
      var uses = $target.attr('uses').toLowerCase().split(' ');
      var eq, param, u, attr;

      for(u = 0; u < uses.length; ++u){
        eq = uses[u].indexOf('=');
        if(eq === -1){
          if(usesParameters[uses[u]])
            $target.attr('uses',usesParameter[uses[u]]);
          else if(parameters[uses[u]]){
            $target.html(parameters[uses[u]]).addClass(uses[u]);
          }         
        }
        else {
          attr = uses[u].slice(0,eq);
          param = uses[u].slice(eq+1);
          if(parameters[param])
            $target.attr(attr,parameters[param]);
        }
      }
      
    });

  },
  html : function(module,parameters){
    var $instance = $('<' + module + '>');
    var paramEl, param;
    
    for (param in parameters){
      paramEl = document.createElement(param);
      paramEl.innerHTML = parameters[param];
      $instance.append(paramEl);
    }
    
    modest.compile($instance,module);
    return $instance[0].outerHTML;
  }
};
//#REMOVE-POST-COMPILE
if(this.window){
  $(function(){
    modest.loadModules(window);
    modest.compileModules();
    modest.compileNode($(document.body));
  });
}
//#!REMOVE-POST-COMPILE
