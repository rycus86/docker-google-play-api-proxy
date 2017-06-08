const express = require('express');
const app = express();
const async = require('async');
const debug = require('debug')('gpapi-proxy')

const api = require('gpapi').GooglePlayAPI({
  username: process.env.GOOGLE_USERNAME,
  password: process.env.GOOGLE_PASSWORD,
  androidId: process.env.ANDROID_ID
});

const fetchDetails = function (request, callback) {
  debug('> Fetching details for %s', request.params.packageId);

  api.details(request.params.packageId, function (apiError, apiResult) {
    if (apiError) {
      debug('< Failed to fetch package details');
      callback(apiError);
    } else {
      debug('< Package details successfully fetched');
      callback(null, apiResult);
    }
  });
};

const fetchDetailsRepeatedly = function (request, response) {
  async.retry({ times: 10, interval: 200 }, async.apply(fetchDetails, request), function (error, result) {
    if (error) {
      response.send({ error: error });
    } else {
      response.send(result);
    }
  });
};

app.get('/details/:packageId', function (request, response) {
  fetchDetailsRepeatedly(request, response);
});

module.exports = {
  fetchDetailsRepeatedly: fetchDetailsRepeatedly
};

if (require.main === module) {
  app.listen(3000, function () {
    debug('> Server listening on port 3000 ...')
  });
}
