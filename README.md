##Modest 
(__mo__dular __des__ign __t__emplates)

Web templating engine for stand-alone use or with the framework of your choice ([backbone](https://github.com/documentcloud/backbone), [meteor](https://github.com/meteor/meteor), etc.)

###Motivation

Two things that set modest apart from other templating languages:

1.  The templates look like HTML
2.  It makes it easy to build larger templates out of smaller ones

It is specifically adapted for the web (javascript and HTML).

It strives for a clean separation between languages:  it looks like javascript when you're working in javascript, and it looks like HTML when you're working in HTML.  This keeps designing and coding roles separate.

I created it because I got tired of maintaining chunks of HTML in my javascript code, and because XSLT is a horrible language that no one should have to use.

###Documentation & Examples
* [Full Documentation](https://github.com/sweedl/modest/wiki/Documentation)
* [Examples](https://github.com/sweedl/modest/wiki/Examples)

###Installation[_*_](#installation-notes)

1. [Install node.js](http://nodejs.org/#download)
2. ``npm install -g modest``

###What Can I Do With It?
* Create HTML modules (building blocks) that can be used like regular HTML.

```xml
<div>
  <contact>
    <name>Casey Jones</name>
    <phone>123-456-7890</phone>
  </contact>
</div>
```
* Create templates that look like html and can be previewed in a browser or IDE.
* Supply data with semantic tags in html and javscript objects in javascript for a clean separation of languages.

```javascript
var contact = {
  name : "Casey Jones",
  cell : "123-456-7890"
};
var out = modest.render('contact',contact);
```
* Or supply data from local or remote files

```xml
<contact data="bob.json"/>
<contact remotedata="http://websitedata/contacts/mary"/>
```
* Compose new modules from existing modules and/or html.
* Pass parameters to inner modules using [passthrough parameters](https://github.com/sweedl/modest/wiki/Documentation#wiki-passthrough-parameters).
This is an easier syntax than nested templates or partials in other languages.
  * [See Documentation and Example](https://github.com/sweedl/modest/wiki/Documentation#wiki-passthrough-parameters)

###Installation Notes<a id="installation-notes"/>

Modest depends on [node.js](https://github.com/joyent/node), but you don't need to use node.js in any other part of your project. 

Just [install node.js](http://nodejs.org/#download) on your development machine and use npm (node package manager) to install modest.
Then you can run ``modest`` from the command line.
You don't need to download any of the files here.

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

###License

Permission is granted under the [MIT license](https://github.com/sweedl/modest/blob/master/LICENSE).
