##Modest 
(__mo__dular __des__ign __t__emplates)

Templating language for modular, reusable html, with a clean separation between html and javascript.

####Write a module like this:

__animal.xml__

    <p>
      Name: <span uses="name"/>
      Weight: <span uses="weight"/>
      <a uses="href=url">Wikipedia Article</a>
    </p>
    
####Write html like this:

__zoo-pre.xhtml__

    <html>
      <head>
        <script src="modest-preview.js"></script>
        <include>animal</include>
      </head>
      <body>
        <animal>
          <name>Lion</name>
          <weight>250 kg (550 lb)</weight>
          <url>http://en.wikipedia.org/wiki/Lion</url>
        </animal>
      </body>
    </html>

####Preview in a browser

``file:///C:/website/zoo-pre.xhtml``

####Compile when ready

    cd C:/website
    modest

####Result:

__zoo.xhtml__:

    <html>
      <head>
      </head>
      <body>
        <p class="animal">
          Name: <span class="name">Lion</span>
          Weight: <span class="weight">250 kg (550 lb)</span>
          <a href="http://en.wikipedia.org/wiki/Lion">Wikipedia Article</a>
        </p>
      </body>
    </html>

####Write javascript like this:
    $('body').append(modest.html
      ('animal', { 
        name : 'Tiger',
        weight: '306 kg (670 lb)',
        url: 'http://en.wikipedia.org/wiki/Tiger' 
      })
    );

###Installation

Just [install node.js](http://nodejs.org/#download) on your development machine and use npm (node package manager) to install modest.  Then you can run ``modest`` from the command line.

You don't need to download any of the files here; you don't need to use node.js in any other part of your project.  

1. [Install node.js](http://nodejs.org/#download)
2. ``npm install -g modest``

###Usage

From a command prompt, type

    modest --help

###Documentation

https://github.com/sweedl/modest/wiki

###Use in Javascript

If used with javascript, modest depends on [jquery](http://jquery.com).  Modest works well as the templating engine for [backbone.js](https://github.com/documentcloud/backbone).

###Development How-To

Change directories into your local clone and type

    npm install

to get the node.js dependencies.  After you make your changes, make sure your tests are included in test/all.js.  The tests use [vows](http://vowsjs.org).  Make sure the tests still pass by running

    npm test

