/*$AMPERSAND_VERSION*/
var result = require('lodash/result');
var defaults = require('lodash/defaults');
var includes = require('lodash/includes');
var assign = require('lodash/assign');
var qs = require('qs');
var mediaType = require('media-type');


module.exports = function (xhr) {

  // Throw an error when a URL is needed, and none is supplied.
  var urlError = function () {
      throw new Error('A "url" property or function must be specified');
  };

  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
  var methodMap = {
      'create': 'POST',
      'update': 'PUT',
      'patch':  'PATCH',
      'delete': 'DELETE',
      'read':   'GET'
  };

  return function (method, model, optionsInput) {
      //Copy the options object. It's using assign instead of clonedeep as an optimization.
      //The only object we could expect in options is headers, which is safely transfered below.
      var options = assign({},optionsInput);
      var type = methodMap[method];
      var headers = {};

      // Default options, unless specified.
      defaults(options || (options = {}), {
          emulateHTTP: false,
          emulateJSON: false,
          // overrideable primarily to enable testing
          xhrImplementation: xhr
      });

      // Default request options.
      var params = {type: type};


      var ajaxConfig = (result(model, 'ajaxConfig') || {});
      var key;
      // Combine generated headers with user's headers.
      if (ajaxConfig.headers) {
          for (key in ajaxConfig.headers) {
              headers[key.toLowerCase()] = ajaxConfig.headers[key];
          }
      }
      if (options.headers) {
          for (key in options.headers) {
              headers[key.toLowerCase()] = options.headers[key];
          }
          delete options.headers;
      }
      //ajaxConfig has to be merged into params before other options take effect, so it is in fact a 2lvl default
      assign(params, ajaxConfig);
      params.headers = headers;

      // Ensure that we have a URL.
      if (!options.url) {
          options.url = result(model, 'url') || urlError();
      }

      // Ensure that we have the appropriate request data.
      if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
          params.json = options.attrs || model.toJSON(options);
      }

      // If passed a data param, we add it to the URL or body depending on request type
      if (options.data && type === 'GET') {
          // make sure we've got a '?'
          options.url += includes(options.url, '?') ? '&' : '?';
          options.url += qs.stringify(options.data);
          //delete `data` so `xhr` doesn't use it as a body
          delete options.data;
      }

      // For older servers, emulate JSON by encoding the request into an HTML-form.
      if (options.emulateJSON) {
          params.headers['content-type'] = 'application/x-www-form-urlencoded';
          params.body = params.json ? {model: params.json} : {};
          delete params.json;
      }

      // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
      // And an `X-HTTP-Method-Override` header.
      if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
          params.type = 'POST';
          if (options.emulateJSON) params.body._method = type;
          params.headers['x-http-method-override'] = type;
      }

      // When emulating JSON, we turn the body into a querystring.
      // We do this later to let the emulateHTTP run its course.
      if (options.emulateJSON) {
          params.body = qs.stringify(params.body);
      }

      // Set raw XMLHttpRequest options.
      if (ajaxConfig.xhrFields) {
          var beforeSend = ajaxConfig.beforeSend;
          params.beforeSend = function (req) {
              assign(req, ajaxConfig.xhrFields);
              if (beforeSend) return beforeSend.apply(this, arguments);
          };
          params.xhrFields = ajaxConfig.xhrFields;
      }

      // Turn a jQuery.ajax formatted request into xhr compatible
      params.method = params.type;

      var ajaxSettings = assign(params, options);

      // Make the request. The callback executes functions that are compatible
      // With jQuery.ajax's syntax.
      var request = options.xhrImplementation(ajaxSettings, function (err, resp, body) {
          if (err || resp.statusCode >= 400) {
              if (options.error) {
                  try {
                      body = JSON.parse(body);
                  } catch(e){}
                  var message = (err? err.message : (body || "HTTP"+resp.statusCode));
                  options.error(resp, 'error', message);
              }
          } else {
              // Parse body as JSON
              var accept = mediaType.fromString(params.headers.accept);
              var parseJson = accept.isValid() && accept.type === 'application' && (accept.subtype === 'json' || accept.suffix === 'json');
              if (typeof body === 'string' && (!params.headers.accept || parseJson)) {
                  try {
                      body = JSON.parse(body);
                  } catch (err) {
                      if (options.error) options.error(resp, 'error', err.message);
                      if (options.always) options.always(err, resp, body);
                      return;
                  }
              }
              if (options.success) options.success(body, 'success', resp);
          }
          if (options.always) options.always(err, resp, body);
      });
      if (model) model.trigger('request', model, request, optionsInput, ajaxSettings);
      request.ajaxSettings = ajaxSettings;
      return request;
  };
};
