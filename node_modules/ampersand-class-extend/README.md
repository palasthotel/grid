# ampersand-class-extend

Helper function for setting up prototype chains for subclasses.

Largely copied out of Backbone, but modified to enable extending a prototype with multiple mixins at once.

## install

```
npm install ampersand-class-extend
```

## usage


Your base object module might look something like this:

```javascript
var extend = require('ampersand-class-extend');


// your base object
function YourConstructor() {}

// simply attach it directly to the object constructor
YourConstructor.extend = extend;

// export it
module.exports = YourConstructor;

```

Then in a file using said constructor:

```javascript
var YourConstructor = require('./your-constructor');
var mixinMethods = require('some-other-methods');
var otherMixinMethods = require('even-more-methods');


// Nowe we add some more stuff and export a modified constructor 
// (we can pass in as many other objects containing methods as we want).
module.exports = YourConstructor.extend(mixinMethods, otherMixinMethods, {
    yetAnotherMethod: function () {
        // do something
    }
});
```

Now, when creating instances of the subclass, they'll have all the mixins while still passing `instanceof` checks for both the parent and the subclass.

## credit

Most of the credit goes to Jeremy Ashkenas and the other authors of Backbone.js.

Modified to be standalone Common JS and to allow you to pass multiple extend objects by [@HenrikJoreteg](http://twitter.com/henrikjoreteg).


## license

MIT
