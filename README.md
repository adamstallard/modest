##Modest 
(__mo__dular __des__ign __t__emplates)

* Templates are organized into modules that can be used as building blocks
in web pages or other modules
* Templates are represented by semantic tags

__cat.xml__
```xml
<div>
  <paws/>
  <whiskers/>
</div>
```
__main.xhtml__
```html
...
<cat/>
...
```
* Data for templates can be supplied by
 * semantic tags
 * javascript objects
 * local data
 * remote data
* Strong separation between html and javascript
* Decide which modules will be pre-compiled and which will be dynamic
* Pre-render html with "static" javascript
* Preview as you work; compile when ready to deploy

Refresh ``file:///C:/website/somefile.xhtml`` in a browser or IDE to see how it would look compiled.
Run ``modest`` to actually compile it.
* Use as a templating language in [backbone](https://github.com/documentcloud/backbone) or [meteor](https://github.com/meteor/meteor)

###Documentation

https://github.com/sweedl/modest/wiki/Documentation

###Installation

Modest depends on [node.js](https://github.com/joyent/node), but you don't need to use node.js in any other part of your project. 

Just [install node.js](http://nodejs.org/#download) on your development machine and use npm (node package manager) to install modest.
Then you can run ``modest`` from the command line.
You don't need to download any of the files here.

1. [Install node.js](http://nodejs.org/#download)
2. ``npm install -g modest``

###Usage

From a command prompt, type
```bash
modest --help
```

###Development How-To

Change directories into your local clone and type
```bash
npm install
```
to get the node.js dependencies.  After you make your changes, make sure your tests are included in test/all.js.  The tests use [vows](http://vowsjs.org).  Make sure the tests still pass by running
```bash
npm test
```
