
# backbone-collection

  Backbone collections as a standalone component. Sync stripped out so no jQuery dependency. Can be readded with separate component.

## Installation

  Install with [npm(1)](http://npmjs.org):

    $ npm install backbone-collection


  Install with [component(1)](http://component.io):

    $ component install green-mesa/backbone-collection

## API


```javascript

  var Collection = require('backbone-collection').Collection;

  // from here it's Backbone's usual API... except without sync.

```

### Adding Backbone Sync functionality.

You need to `$ component install green-mesa/backbone-sync` (which, by the way, will also install jQuery. Fun times. A non-jQuery replacement would be good at this point)

```javascript

	var Collection = require('backbone-collection').Collection;
	var sync = require('backbone-sync').sync;
	
	Collection.prototype.sync = function(){

		return sync.apply(this, arguments);

	};
```

Some commonJS related quirks mean that overridding the ajax handler is a bit pointless as you've already got jQuery installed by default. Write a replacement `backbone-sync` module and use that instead. That's the component way. 
## License

  MIT
