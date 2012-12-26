##Modest 
( __mo__dular __des__ign __t__emplates )

[![Build Status](https://travis-ci.org/goalzen/modest.png)](https://travis-ci.org/goalzen/modest)

Web templating engine for stand-alone use or with the framework of your choice ([backbone](https://github.com/documentcloud/backbone), [meteor](https://github.com/meteor/meteor), etc.)

###Motivation

Two things set modest apart from other templating languages:

1.  The templates look like HTML
2.  It is easy to build larger templates out of smaller ones

It is specifically adapted for the web (javascript and HTML).

It strives for a clean separation between languages:  it looks like javascript when you're working in javascript, and HTML when you're working in HTML.  This keeps design and coding roles separate.

I created it because I got tired of maintaining chunks of HTML in my javascript code.

###Documentation & Examples
* [Full Documentation](https://github.com/goalzen/modest/wiki/Documentation)
* [Examples](https://github.com/goalzen/modest/wiki/Examples)

###Installation[_*_](#prerequisites)

1. [Install node.js](http://nodejs.org/#download)
2. ``npm install -g modest``

If you only want to play with modest in the browser, just download [modest-preview.js](https://raw.github.com/goalzen/modest/master/lib/modest-preview.js).

###Report Bugs
https://github.com/goalzen/modest/issues

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
* Pass parameters to inner modules using [passthrough parameters](https://github.com/goalzen/modest/wiki/Documentation#wiki-passthrough-parameters).
This is an easier syntax than nested templates or partials in other languages.
  * [See Documentation and Example](https://github.com/goalzen/modest/wiki/Documentation#wiki-passthrough-parameters)

###Prerequisites<a id="prerequisites"/>

[modest-preview.js](https://raw.github.com/goalzen/modest/master/lib/modest-preview.js) runs in the browser, and depends on [jquery](http://jquery.com/download/).

The modest compiler has the following prerequisites:

* [node.js](http://nodejs.org/download/)
 * For windows users, only the 32-bit version of node is currently supported
* Python
* A C++ compiler

See [the installation instructions for node-gyp](https://github.com/TooTallNate/node-gyp#installation) for more information.

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

Permission is granted under the [MIT license](https://github.com/goalzen/modest/blob/master/LICENSE-MIT).
