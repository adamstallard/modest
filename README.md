##Modest 
(__mo__dular __des__ign __t__emplates)

Web templating engine for stand-alone use or with the web framework of your choice ([backbone](https://github.com/documentcloud/backbone), [meteor](https://github.com/meteor/meteor), etc.)

###[Full Documentation](https://github.com/sweedl/modest/wiki/Documentation)

###[Examples](https://github.com/sweedl/modest/wiki/Examples)

* Create HTML modules (building blocks) that can be used like regular HTML.

```xml
<div>
  <contact>
    <name>Casey Jones</name>
    <phone>123-456-7890</phone>
  </contact>
</div>
```
* Templates look like html, and can be previewed in a browser or ide
* Data is supplied with semantic tags in html and javscript objects in javascript for a clean separation of languages

```javascript
var contact = {
  name : "Casey Jones",
  cell : "123-456-7890"
};
var out = modest.render('contact',contact);
```
* Data can also be supplied with local or remote files

```xml
<contact data="bob.json"/>
<contact remotedata="http://websitedata/contacts/mary"/>
```

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
