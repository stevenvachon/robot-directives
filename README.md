# robot-directives [![NPM Version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]

> Parse robot directives within HTML meta and/or HTTP headers.

* `<meta name="robots" value="noindex,nofollow">`
* `X-Robots-Tag: noindex,nofollow`
* etc


## Installation

[Node.js](http://nodejs.org/) `>= 0.10` is required. To install, type this at the command line:
```shell
npm install robot-directives
```

## Usage
`parseDirectives([target], directiveString, options)`
```js
var parseDirectives = require("robot-directives");
 
parseDirectives("noindex,nofollow");
//=> { all:false, nofollow:true, noindex:true, none:true, … }

var cascaded = parseDirectives("noarchive");
//=> { noarchive:true, none:false, … }

cascaded = parseDirectives(cascaded, "nofollow");
//=> { noarchive:true, nofollow:true, none:false, … }

cascaded = parseDirectives(cascaded, "follow", {restrictive:false});
//=> { noarchive:true, none:false, … }
```


## Options

### options.allIsReadonly
Type: `Boolean`  
Default value: `true`  
Declaring the `"all"` directive will not affect other directives when `true`. This is how most search crawlers perform.

### options.restrictive
Type: `Boolean`  
Default value: `true`  
Directive conflicts will be resolved by selecting the most restrictive value. Example: `"noindex,index"` will resolve to `"noindex"` because it is more restrictive. This is how Google's crawler performs, but others may differ.


[npm-image]: https://img.shields.io/npm/v/robot-directives.svg
[npm-url]: https://npmjs.org/package/robot-directives
[travis-image]: https://img.shields.io/travis/stevenvachon/robot-directives.svg
[travis-url]: https://travis-ci.org/stevenvachon/robot-directives
