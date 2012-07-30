##Modest 
(__mo__dular __des__ign __t__emplates)

Templating language for modular, reusable html, with a clean separation between html and javascript.

###Installation

Just install node.js on your development machine and use npm (node package manager) to install modest.  Then you can run ``modest`` from the command line.

You don't need to download any of the files here; and you don't need to use node.js in any other part of your project.  

1. [Install node.js](http://nodejs.org/#download)
2. ``npm install -g modest``
3. ``modest --help``

###Usage

From a command prompt, type

    modest --help

###Examples

###Documentation

###Use in Javascript

If used with javascript, modest depends on [jquery](http://jquery.com).  Modest works well as the templating engine for [backbone.js](https://github.com/documentcloud/backbone).

###Development How-To

Change directories into your local clone and type

    npm install

to get the node.js dependencies.  After you make your changes, make sure your tests are included in test/all.js.  The tests use [vows](http://vowsjs.org).  Make sure the tests still pass by running

    npm test

