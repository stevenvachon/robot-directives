# robot-directives [![NPM Version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependency Status][david-image]][david-url]

> Parse robot directives within HTML meta and/or HTTP headers.

* `<meta name="robots" content="noindex,nofollow">`
* `X-Robots-Tag: noindex,nofollow`
* etc

Note: this library is not responsible for parsing any HTML.


## Installation

[Node.js](https://nodejs.org) `>= 14` is required. To install, type this at the command line:
```shell
npm install robot-directives
```

## Usage
```js
const RobotDirectives = require('robot-directives');

const robots = new RobotDirectives(options)
  .header('googlebot: noindex')
  .meta('bingbot', 'unavailable_after: 1-Jan-3000 00:00:00 EST')
  .meta('robots', 'noarchive,nocache,nofollow');

robots.is(RobotDirectives.NOFOLLOW);
//-> true

robots.is([ RobotDirectives.NOFOLLOW, RobotDirectives.FOLLOW ]);
//-> false

robots.isNot([ RobotDirectives.ARCHIVE, RobotDirectives.FOLLOW ]);
//-> true

robots.is(RobotDirectives.NOINDEX, {
  currentTime: () => new Date('jan 1 3001').getTime(),
  userAgent: 'Bingbot/2.0'
});
//-> true

RobotDirectives.isBot('googlebot');
//-> true
```


## Constants
For use in comparison, the following directives are available as static properties on the constructor:
* `ALL`
* `ARCHIVE`
* `CACHE`
* `FOLLOW`
* `IMAGEINDEX`
* `INDEX`
* `NOARCHIVE`
* `NOCACHE`
* `NOFOLLOW`
* `NOIMAGEINDEX`
* `NOINDEX`
* `NONE`
* `NOODP`
* `NOSNIPPET`
* `NOTRANSLATE`
* `ODP`
* `SNIPPET`
* `TRANSLATE`


## Methods

### `header(value)`
Parses, stores and cascades the value of an `X-Robots-Tag` HTTP header.

### `is(directive[, options])`
Validates a directive or a list of directives against parsed instructions. `directive` can be a `String` or an `Array`. `options`, if defined, will override any such defined in the constructor during instantiation. A value of `true` is returned if all directives are valid.

### `isNot(directive[, options])`
Inversion of `is()`. A value of `true` is returned if all directives are *not* valid.

### `meta(name, content)`
Parses, stores and cascades the data within a `<meta>` HTML element.

### `oneIs(directives[, options])`
A variation of `.is()`. A value of `true` is returned if at least one directive is valid.

### `oneIsNot(directives[, options])`
Inversion of `oneIs()`. A value of `true` is returned if at least one directive is *not* valid.


## Functions

### `isBot(botname)`
Returns `true` if `botname` is a valid bot/crawler/spider name or user-agent.


## Options

### `allIsReadonly`
Type: `Boolean`  
Default value: `true`  
Declaring the `'all'` directive will not affect other directives when `true`. This is how most search crawlers perform.

### `currentTime`
Type: `Function`  
Default value: `function(){ return Date.now() }`  
The date to use when checking if `unavailable_after` has expired.

### `restrictive`
Type: `Boolean`  
Default value: `true`  
Directive conflicts will be resolved by selecting the most restrictive value. Example: `'noindex,index'` will resolve to `'noindex'` because it is more restrictive. This is how Googlebot behaves, but others may differ.

### `userAgent`
Type: `String`  
Default value: `''`  
The HTTP user-agent to use when retrieving instructions via `is()` and `isNot()`.


[npm-image]: https://img.shields.io/npm/v/robot-directives.svg
[npm-url]: https://npmjs.com/package/robot-directives
[travis-image]: https://img.shields.io/travis/stevenvachon/robot-directives.svg
[travis-url]: https://travis-ci.org/stevenvachon/robot-directives
[coveralls-image]: https://img.shields.io/coveralls/stevenvachon/robot-directives.svg
[coveralls-url]: https://coveralls.io/github/stevenvachon/robot-directives
[david-image]: https://img.shields.io/david/stevenvachon/robot-directives.svg
[david-url]: https://david-dm.org/stevenvachon/robot-directives
