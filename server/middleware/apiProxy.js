var _ = require('underscore');

/**
 * The separator used in the path. Incoming paths can look like:
 *   /-/path/to/resource
 *   /api-name/-/path/to/resource
 */
var separator = '/';

/**
 * Middleware handler for intercepting API routes.
 */
module.exports = apiProxy;

function apiProxy(dataAdapter) {
  return function(req, res, next) {
    var api;

    api = _.pick(req, 'query', 'method', 'body');

    api.path = apiProxy.getApiPath(req.path);
    api.api = apiProxy.getApiName(req.path);
    api.headers = {
      'x-forwarded-for': apiProxy.getXForwardedForHeader(req.headers, req.ip)
    };
  console.log(api);

    dataAdapter.request(req, api, {
      convertErrorCode: false
    }, function(err, response, body) {



       if (_.isFunction(res)){
           res(err,response,body)
       }else {
           if (err) return next(err);
            // Pass through statusCode.
           res.status(response.statusCode);
           res.json(body);
       }

    });
  };
};

apiProxy.getApiPath = function getApiPath(path) {

    if (path.charAt(0) == '/'){
        path = path.substr(1,path.length-1);
    }
    path = path.split('/');
    path.shift();

    return '/' + path.join('/');
};

apiProxy.getApiName = function getApiName(path) {
    if (path.charAt(0) == '/'){
        path = path.substr(1,path.length-1);
    }
  var attrs  = path.split('/');

  var apiName;
  apiName =attrs && attrs[0];

  return apiName;
};

apiProxy.getXForwardedForHeader = function (headers, clientIp) {
  var existingHeader = headers['x-forwarded-for'],
      newHeaderValue = clientIp;

  if (existingHeader) {
    newHeaderValue = existingHeader + ', ' + clientIp;
  }

  return newHeaderValue;
};
