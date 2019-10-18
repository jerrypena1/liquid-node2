# Liquid with Node.js

[![NPM version](https://img.shields.io/npm/v/liquid-node2.svg?style=flat)](https://www.npmjs.org/package/liquid-node2)
[![Downloads](http://img.shields.io/npm/dm/liquid-node2.svg?style=flat)](https://www.npmjs.org/package/liquid-node2)
[![GitHub Issues](http://img.shields.io/github/issues/jerrypena1/liquid-node2.svg?style=flat)](https://github.com/jerrypena1/liquid-node2/issues)
<br>
[![Build Status](https://img.shields.io/travis/jerrypena1/liquid-node2.svg?style=flat)](https://travis-ci.org/jerrypena1/liquid-node2)
[![Coverage Status](https://img.shields.io/coveralls/jerrypena1/liquid-node2.svg?style=flat)](https://coveralls.io/r/jerrypena1/liquid-node2?branch=master)
[![Dependency Status](http://img.shields.io/david/jerrypena1/liquid-node2.svg?style=flat)](https://david-dm.org/jerrypena1/liquid-node2)
[![devDependency Status](http://img.shields.io/david/dev/jerrypena1/liquid-node2.svg?style=flat)](https://david-dm.org/jerrypena1/liquid-node2#info=devDependencies)

> LiquidNode2 is a fork of LiquidNode. LiquidNode is a port of the original Liquid template engine from *Ruby* to *Node.js*.
> It uses Promises to support non-blocking/asynchronous variables, filters, and blocks. This version has been tweaked to 
> provide a second template engine to support one for Server-Side and another for Client-Side template processing. 

## Features

- Supports generating two Liquid template engines (for server-side AND client side processing)
- Supports overriding of template parsing syntax (change delimiters, etc, etc) for EACH engine.
- Supports asynchronous variables, tags, functions and filters (helpers)
- Allows you to add custom tags and filters easily
- Supports full liquid syntax
- Based on original Ruby code
- High test coverage

## Limitations

- Currently because of the functional nature of the implementation, specifically clusures and the way the require function caches modules, we are duplicating the entire code base in order to spin up a second engine as its own singleton. Unfortunately tho, so far I've noticed I can't register a filesystem for each engine in order to make includes work. Luckily the way I'm using this all the code lives in one place, so includes are a serverside only thing for now which is totally ok for me.

## What does it look like?

```html
<ul id="products">
  {% for product in products %}
    <li>
      <h2>{{ product.name }}</h2>
      Only {{ product.price | price }}

      {{ product.description | prettyprint | paragraph }}
    </li>
  {% endfor %}
</ul>
```

## Installation

```sh
npm install liquid2
```

## Usage

Liquid2 supports a very simple API based around the Liquid2.Engine class.
For standard use you can just pass it the content of a file and call render with an object.

```js



Liquid2 = require('liquid2')
const engineS = new Liquid2.Engine()
const engineC = new Liquid2.L2.Engine()

const templateSource = 'hi {{name}}'
const serverData = { name: 'plumber' }

engineS
  .parse(templateSource)
  .then(template => template.render(serverData))
  .then(result => console.log(result))

// or

engineS
  .parseAndRender(templateSource, serverData)
  .then(result => console.log(result))
```

### Usage with Connect

```js
app.get((req, res, next) => {
  engine
    .parseAndRender('hi {{name}}', { name: 'tobi' })
    .nodeify((err, result) => {
      if (err) {
        res.end('ERROR: ' + err)
      } else {
        res.end(result)
      }
    })
})
```

### Registering new filters

```javascript
engine.registerFilters({
  myFilter: input => {
    return String(input).toUpperCase()
  }
})
```

### Registering new tags

Take a look at the [existing tags](https://github.com/jerrypena1/liquid-node2/tree/master/lib/liquid/tags)
to see how to implement them.

```js
class MyTag extends Liquid2.Tag {
  render () {
    return 'hello world'
  }
}

engine.registerTag('MyTag', MyTag)
```

## Tests

```sh
npm test
```

## Similar libraries

* [darthapo's Liquid.js](https://github.com/darthapo/liquid.js) is liquid ported to JavaScript to be run within the browser. It doesn't handle asynchrony.
* [tchype's Liquid.js](https://github.com/tchype/liquid.js) is `liquid-node` wrapped to run in a browser.

## License

[MIT](http://www.opensource.org/licenses/MIT)
