Modest is a utilty for creating, previewing, and compiling modular xhtml.

It can also be used in javascript to generate xhtml according to module definitions.

###Installation

To install, you don't need to download any of the files here; just install node.js and then use npm (node package manager) to install modest.

1. [Install node.js](http://nodejs.org/#download)
2. ``npm install -g modest``

###Usage

From a command prompt, type

    modest --help

###Examples

###Documentation

###Javascript Projects

If used in javascript, modest depends on [jquery](http://jquery.com).  Modest works well with [underscore](https://github.com/documentcloud/underscore) and [backbone](https://github.com/documentcloud/backbone).

###Development How-To

Change directories into your local clone and type

    npm install

to get the node.js dependencies.  After you make your changes, make sure your tests are included in test/all.js.  The tests use [vows](http://vowsjs.org).  Make sure the tests still pass by running

    npm test

