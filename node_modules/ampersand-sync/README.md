# ampersand-sync

Standalone, modern-browser-only version of Backbone.Sync as Common JS module.

<!-- starthide -->
Part of the [Ampersand.js toolkit](http://ampersandjs.com) for building clientside applications.
<!-- endhide -->

You probably won't use this directly, but it is used by ampersand-model and ampersand-rest-collection to provide the REST functionality.

As of v4.0 works in browsers and Node.js 


## browser support

IE9+ and any other browser.

Might work in IE8, but it's not officially supported.

## install

```
npm install ampersand-sync
```

## usage

```js
var sync = require("ampersand-sync")

var rawRequest = sync(method, model, options)
```

**method** is a string used for choosing HTTP verb of the sync request. It has to be chosen from the keys of the following map:
```js
{
      'create': 'POST',
      'update': 'PUT',
      'patch':  'PATCH',
      'delete': 'DELETE',
      'read':   'GET'
}
```

**model** (optional) is an ampersand-model object or equivalent. `ajaxConfig` and `url` fields of the model are used (if present) to override default options for the request. (for details on ajaxConfig see below)

If model is provided, `model.toJSON` is called and the result is used as body for create, update and patch methods.

When the request is made, `request` event is triggered on the model with arguments: `(model, XMLHttpRequest, options, ajaxSettings)` where ajaxSettings is the final configuration passed to http request implementation. In Node.js, object returned from `request()` will be passed in instead of  `XMLHttpRequest`, so streaming is possible.

If model is null, some options are required to form a correct http request. Please apply common sense.
 
**options** (optional) are used to override any settings for the http request and provide callbacks for the results or errors.

**rawRequest** is returned. In the browser, it is an XMLHttpRequest object instance, in Node.js it's the object returned by `request()`. 

### ajaxConfig and options

both `ajaxConfig` and `options` can contain any and all of the options that [xhr](https://github.com/Raynos/xhr) or [request](https://github.com/request/request) accepts.

Additional fields in `ajaxConfig`:
 - `xhrFields` key that contains all fields which should be added to the raw XMLHttpObject before it's sent. `xhrFields` is only used in the browser and has no effect in node.

Additional fields in `options`:
 - emulateHTTP - defaults to `false`
 - emulateJSON - defaults to `false`
 - xhrImplementation - can be used to override http request implementation for just this one call
 - data - JSON serializable object to be sent as request body
 - `success(body, 'success', responseObject)` - optional callback to be called when request finishes successfully
 - `error(responseObject, 'error', error.message)` - optional callback to be called when an error occurs (http request/response error or parsing response error)
 - `always(error, responseObject, body)` - optional callback to be called when request finishes no matter what the result


## running the tests

```
npm test
```

Tests are written in [tape](https://github.com/substack/tape) and since they require a browser environment it gets run in a headless browser using phantomjs via [tape-run](https://github.com/juliangruber/tape-run). Make sure you have phantomjs installed for this to work. 

You can also run `npm start` then open a browser.

<!-- starthide -->

## Changes

### Notes on 4.0.0

Version 4 supports making requests in Node.js as well as browser.  [xhr](https://github.com/Raynos/xhr) is used in the browser and [request](https://github.com/request/request) in node, but you can substitute the request making code with your on implementation as well.

```js
var sync = require("ampersand-sync/core")(whateverXhrYouWant)
```

For details on 4.0 release see [v4.0 milestone](https://github.com/AmpersandJS/ampersand-sync/issues?utf8=%E2%9C%93&q=milestone%3Av4.0)

### Important note on the 1.0.x versions

In moving from 1.0.1 to 1.0.2 we switched the underlying ajax implementation from jQuery's ajax to [xhr](http://github.com/raynos/xhr). This changed slightly the options, as well as how `ajaxConfig` in models/collections operated when configured as a function.

Previously `ajaxConfig` would be passed the current ajax parameters object for modification, now it receives no arguments and should just return options to be merged in to the ajax parameters which will be passed to xhr.

This should have been a major release both for this module and its dependents (ampersand-model, ampersand-rest-collection, ampersand-collection-rest-mixin), but unfortunately we made a mistake and published as 1.0.2, and were too slow to rollback our mistake before workarounds were in place.

As such we are leaving the current 1.0.x versions in place, but deprecated, and suggest people upgrade to the latest versions of model/collection when they can which will contain the new implementation of xhr.

This should only affect your if you're using `ajaxConfig` as a function. If so you'll need to return the options you want to add, rather than expecting to be passed a params object to your ajaxConfig function. If you're having trouble ping us in freenode #&yet or on twitter: [@philip_roberts](http://twitter.com/philip_roberts) & [@henrikjoreteg](http://twitter.com/henrikjoreteg).


## credits

All credit goes to Jeremy Ashkenas and the other Backbone.js authors.

The `ampersand-sync` you are using today was made available to you by all the contributors listed here: https://github.com/AmpersandJS/ampersand-sync/graphs/contributors


## license

MIT

<!-- endhide -->
