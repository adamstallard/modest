# Reuse HTML
### with Modest

[![Build Status](https://travis-ci.org/goalzen/modest.png)](https://travis-ci.org/goalzen/modest)

```html
<html>
  <head>
    <include>news-article</include>
    <include>page-header</include>
    <include>page-footer</include>
    <include>news-page</include>
    <include>lorem</include>
  </head>
  <body>
    <page-header/>
      <news-page>
        <news-article demo>
          <author>Jane Doe</author>
          <title>Test</title>
          <body><lorem/></body>
        </news-article>
      </news-page>
    <page-footer/>
  </body>
</html>
```

### Features
1.  Templates look like HTML
2.  Easily build large templates out of small ones
3.  Clean separation of languages: javascript is javascript and HTML is HTML.  Get rid of HTML snippets inside javascript.
4.  Less logic than "logicless" templates.  It doesn't turn HTML into a programming language.
5.  Use stand-alone or with a framework, e.g. [backbone](https://github.com/documentcloud/backbone),
[meteor](https://github.com/meteor/meteor), etc.
6.  Use "demo" elements to preview a design--they go away when compiled for production.
7.  Pass-through parameters are easier than "partials." [Documentation and Example](https://github.com/goalzen/modest/wiki/Documentation#wiki-passthrough-parameters)

### Preview/Demo[_*_](#prerequisites)

1. Download [modest-preview.js](https://raw.github.com/goalzen/modest/master/lib/modest-preview.js).
2. Put ``<script src="modest-preview.js"></script>`` in the ``head`` of your html file (after jquery).

### Compile to Production[_*_](#prerequisites)

1. [Install node.js](http://nodejs.org/#download) (once)
2. ``npm install -g modest`` (once)
3. Go into your project directory
4. type ``modest`` OR use [grunt-modest](https://github.com/goalzen/grunt-modest)

### Documentation & Examples
* [Full Documentation](https://github.com/goalzen/modest/wiki/Documentation)
* [Examples](https://github.com/goalzen/modest/wiki/Examples)

### Report Bugs
https://github.com/goalzen/modest/issues

### Prerequisites<a id="prerequisites"/>

[modest-preview.js](https://raw.github.com/goalzen/modest/master/lib/modest-preview.js) runs in the browser, and depends on [jquery](http://jquery.com/download/).

To compile to production, you need:

* [node.js](http://nodejs.org/download/)
* Python
* A C++ compiler

See [the installation instructions for node-gyp](https://github.com/TooTallNate/node-gyp#installation) for more information.

### Development How-To

Change directories into your local clone and type
```bash
npm install
```
to get the node.js dependencies.  After you make your changes, make sure your tests are run by test/all.js.  The tests use [vows](http://vowsjs.org).  Make sure the tests still pass by running
```bash
npm test
```

### License

Permission is granted under the [MIT license](https://github.com/goalzen/modest/blob/master/LICENSE-MIT).
