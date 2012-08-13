##Modest 
(__mo__dular __des__ign __t__emplates)

Previewable, modular, semantic templates. Server-side javascript. And a clean separation of design and logic.

Features:

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

```xml
<contact>
  <name>Bob Jones</name>
  <cell>123-456-7890</cell>
</contact>
```
 <ul><ul><li>javascript objects</li></ul></ul>

```javascript
var bob = {
  name : "Bob Jones",
  cell : "123-456-7890"
};
var out = modest.render('contact',bob);
```
 <ul><ul><li>local data</li>
 <li>remote data</li></ul></ul>

```xml
<contact data="bob.json"/>
<contact remotedata="http://websitedata/contacts/mary"/>
```
* Decide which modules will be available to client-side js

```html
<include>cat</include>
<include client="true">contact</include>
```
* Run server-side javascript as a compile step

```html
<script server="true" src="add-top-scores.js"></script>
```
* Preview as you work; compile when ready

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
to get the node.js dependencies.  After you make your changes, make sure your tests are run by test/all.js.  The tests use [vows](http://vowsjs.org).  Make sure the tests still pass by running
```bash
npm test
```
