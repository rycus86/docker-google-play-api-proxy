const webapp = require('../index.js')
const assert = require('assert');

describe('api', function () {
  describe('fetchDetails', function () {
    it('should fetch the details of an app', function (done) {
      this.timeout(5000);

      const request = {
        params: {
          packageId: 'hu.rycus.tweetwear'
        }
      };

      const response = {
        send: function (result) {
          if (result.error) {
            done(result);
          } else {
            assert.equal('hu.rycus.tweetwear', result.docid);
            assert.equal('Viktor Adam', result.creator);
            done();
          }
        }
      };

      webapp.fetchDetailsRepeatedly(request, response);
    });
  });
});
