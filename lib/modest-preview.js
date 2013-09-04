this.modest = this.modest || {
  modules : {}, // compiled modules as strings
  //#REMOVE-POST-COMPILE
  $uncompiled : {}, // uncompiled modules as jquery objects
  compiled : {}, // set {X:X} -- names of modules that have been compiled
  saveAsJs : {}, // set {X:X} -- names of modules needed for js
  dependencies : {},
  setWindow : function(w){
    this.window = w;
    this.document = w.document;
  }.bind(this),
  setBasePath : function(basePath){
    this.modest.basePath = basePath;
  }.bind(this),
  loadModules : function(){
    var modest = this.modest;
    var includes = this.document.getElementsByTagName('include');
    var path, pathAttr, moduleName, moduleContent, i, extension, lastDot;

    for (i = 0; i < includes.length; ++i) {

      // Assume the include tag has a single text node with the name of the module

      moduleName = includes[i].childNodes[0].nodeValue;

      // Remove leading and trailing whitespace from the module name

      moduleName = moduleName.replace(/^\s+/, '').replace(/\s+$/, '');

      // Find and separate the extension.  If no extension is given, assume '.xml'

      lastDot = moduleName.lastIndexOf('.');
      if(lastDot == -1){
        extension = '.xml';
      } else {
        extension = moduleName.substring(lastDot);
        moduleName = moduleName.substring(0, lastDot);
      }

      if (!modest.compiled[moduleName]) {
        path = '';
        pathAttr = includes[i].getAttribute('path');
        if (pathAttr) {

          // Remove trailing slashes and whitespace from the "path" attribute; Add one slash

          path = pathAttr.replace(/[\/\\\s]+$/, '') + '/';
        }
        path += moduleName + extension;
        moduleContent = modest.localFile(path);
        modest.$uncompiled[moduleName] = $(moduleContent);
      }

      if (includes[i].hasAttribute('client')) {
        modest.saveAsJs[moduleName] = moduleName;
      }

      includes[i].parentNode.removeChild(includes[i]);
    }

  }.bind(this),
  compileModule : function(module){
    var modest = this.modest;
    var $module = modest.$uncompiled[module];
    modest.compileNode($module, modest.dependencies[module]);
    if ($module[0].outerHTML) {
      modest.modules[module] = $module[0].outerHTML;
    }
    else {
      if (this.XMLSerializer) {
        modest.modules[module] = new XMLSerializer().serializeToString($module[0]);
      }
    }
    modest.$uncompiled[module] = false;
    modest.compiled[module] = module;
  }.bind(this),
  loopError : function(){
    var modest = this.modest;
    var badModules = '';
    var module;

    for (module in modest.$uncompiled) {
      if (!modest.compiled[module]) {
        badModules += module + ' ';
      }
    }

    throw ('Infinite loop detected in modules: ' + badModules);
  }.bind(this),
  compileModules : function(){
    var modest = this.modest;
    var compiledCount = 0;
    var numModules = 0;
    var waitToCompile, module, otherModule, lastCompiledCount, d;

    for (module in modest.$uncompiled) {
      ++numModules;
      if (!modest.compiled[module]) {
        modest.dependencies[module] = [];

        for (otherModule in modest.$uncompiled) {
          if (modest.$uncompiled[module].find(otherModule).length) {
            modest.dependencies[module].push(otherModule);
          }
        }

      }
    }

    while (compiledCount < numModules) {
      lastCompiledCount = compiledCount;

      for (module in modest.$uncompiled) {
        if (modest.compiled[module]) {
          ++compiledCount;
          continue;
        }
        waitToCompile = false;

        for (d in modest.dependencies[module]) {
          if (!modest.compiled[modest.dependencies[module][d]]) {
            waitToCompile = true;
            break;
          }
        }

        if (!waitToCompile) {
          modest.compileModule(module);
          ++compiledCount;
        }
      }

      if (lastCompiledCount === compiledCount) {
        modest.loopError();
      }
    }

  }.bind(this),
  compileNode : function($node, modules){
    var modest = this.modest;
    if (!modules) {
      modules = modest.compiled;
    }

    // find and compile module views within the node

    $.each(modules, function(i, module){
      $node.find(module).each(function(){
        modest.compileView($(this), module);
      });
    });

  }.bind(this),
  //#!REMOVE-POST-COMPILE
  getAttributes : function(el){
    var attrs = {};
    $.each(el.attributes, function(i, attr){
      attrs[attr.name] = attr.value;
    });
    return attrs;
  },
  localFile : function(path){
    var modest = this.modest;
    if (modest.basePath) {
      return fs.readFileSync(modest.basePath + path, 'utf8');
    }
    else {
      return modest.remoteFile(path);
    }
  }.bind(this),
  remoteFile : function(path){
    $.support.cors = true;
    return $.ajax({
      url : path,
      async : false
    }).responseText;
  },
  data : function(path){
    // Supported data formats: JSON
    return $.parseJSON(this.modest.localFile(path));
  }.bind(this),
  remoteData : function(path){
    // Supported data formats: JSON
    return $.parseJSON(this.modest.remoteFile(path));
  }.bind(this),
  compileView : function($view, module, parameters){
    var modest = this.modest;
    var params = {};
    var paramAttrs = {};
    var viewAttrs, $targets;

    // Get parameters in the following order:
    // (in case of duplicates, later overwrites earlier)
    // 1. remote data
    // 2. local data
    // 3. js parameters
    // 4. html parameters

    if ($view.attr('remotedata')) {
      $.each($view.attr('remotedata').toLowerCase().split(' '), function(){
        $.extend(params, modest.remoteData(this + ''));
      });
      $view.removeAttr('remotedata');
    }

    if ($view.attr('data')) {
      $.each($view.attr('data').toLowerCase().split(' '), function(){
        $.extend(params, modest.data(this + ''));
      });
      $view.removeAttr('data');
    }

    $.extend(params, parameters);

    // html parameters

    $view.children().each(function(){
      var param = this;
      var tag = param.tagName.toLowerCase();
      paramAttrs[tag] = modest.getAttributes(param);
      if (param.innerText && !param.children.length) {
        params[tag] = param.innerText;
      }
      else {
        params[tag] = param.innerHTML;
      }
    });

    // save the views attributes

    viewAttrs = modest.getAttributes($view[0]);

    // replace the view with the module

    $view.html(modest.modules[module]);
    $view = $view.children(':first').unwrap();
    $view.attr(viewAttrs);
    $view.addClass(module);

    // find targets for the parameters

    $targets = $view.find('[uses]').not('[uses=""]');

    // handle parameter targets in the root element

    if ($view.attr('uses')) {
      $targets = $view.add($targets);
    }

    // inject the parameters

    $targets.each(function(){
      var $target = $(this);
      var eq, param, u, attr, strTemplates;
      var usesString = $target.attr('uses');

      // string template substitution

      usesString = usesString.replace(/{{([^{}]+)}}/g, function(match, param){
          strTemplates = true;
          return params[param.toLowerCase()] || '';
        }
      );

      // temporarily replace spaces in string template parameters so they don't get split

      if(strTemplates){
        usesString = usesString.replace(/\s(?=(?:[^{]|{(?=[^{]))*}})/g, 'mSoPdAeCsEt');
      }

      var uses = usesString.split(' ');

      for (u = 0; u < uses.length; ++u) {
        switch (uses[u][0]) {
          case '+':
            if (params[uses[u].slice(1).toLowerCase()] === undefined) {
              $target.remove();
              break;
            }
            break;
          case '-':
            if (params[uses[u].slice(1).toLowerCase()] !== undefined) {
              $target.remove();
              break;
            }
            break;
          case '{':
            $target.html(modest.stripTemplate(uses[u]));
            break;
          default:
            eq = uses[u].indexOf('=');
            if (eq !== -1) {
              attr = uses[u].slice(0, eq);
              param = uses[u].slice(eq + 1);
              var pVal =  params[param.toLowerCase()];
              if (pVal) {
                $target.attr(attr, pVal);
              }
              else if(param[0] == '{'){
                $target.attr(attr, modest.stripTemplate(param));
              }
            }
            else {
              param = uses[u].toLowerCase();
              if (params[param] === undefined) {
                $target.remove();
                break;
              }
              else {
                $target.attr(paramAttrs[param] || {});
                $target.html(params[param]);
                $target.addClass(param);
              }
            }
        }
      }
    });

    return $view;
  }.bind(this),
  stripTemplate : function(s){

    // remove {{}}

    s = s.slice(2, s.length - 2);

    // put back the spaces we replaced earlier

    return s.replace('mSoPdAeCsEt', ' ');
  },
  render : function(module, params){
    var $view = $('<div>');
    $view = this.modest.compileView($view, module, params);
    $view.find('[uses]').not('[uses=""]').removeAttr('uses');
    return $view[0].outerHTML;
  }.bind(this)
};
//#REMOVE-POST-COMPILE
if (this.window) {
  $(function(){
    modest.loadModules();
    modest.compileModules();
    modest.compileNode($(document.body));
  });
}
//#!REMOVE-POST-COMPILE
