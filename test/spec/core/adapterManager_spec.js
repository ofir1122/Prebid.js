import { expect } from 'chai';
import AdapterManager from 'src/adaptermanager';
import { getAdUnits } from 'test/fixtures/fixtures';
import CONSTANTS from 'src/constants.json';

const CONFIG = {
  enabled: true,
  endpoint: CONSTANTS.S2S.DEFAULT_ENDPOINT,
  timeout: 1000,
  maxBids: 1,
  adapter: 'prebidServer',
  bidders: ['appnexus']
};
var prebidServerAdapterMock = {
  bidder: 'prebidServer',
  callBids: sinon.stub(),
  setConfig: sinon.stub()
};

describe('adapterManager tests', () => {
  describe('S2S tests', () => {
    beforeEach(() => {
      AdapterManager.setS2SConfig(CONFIG);
      AdapterManager.bidderRegistry['prebidServer'] = prebidServerAdapterMock;
      prebidServerAdapterMock.callBids.reset();
    });

    it('invokes callBids on the S2S adapter', () => {
      AdapterManager.callBids({adUnits: getAdUnits()});
      sinon.assert.calledOnce(prebidServerAdapterMock.callBids);
    });

    it('invokes callBids with only s2s bids', () => {
      const adUnits = getAdUnits();
    // adUnit without appnexus bidder
      adUnits.push({
        'code': '123',
        'sizes': [300, 250],
        'bids': [
          {
            'bidder': 'adequant',
            'params': {
              'publisher_id': '1234567',
              'bidfloor': 0.01
            }
          }
        ]
      });
      AdapterManager.callBids({adUnits: adUnits});
      const requestObj = prebidServerAdapterMock.callBids.firstCall.args[0];
      expect(requestObj.ad_units.length).to.equal(2);
      sinon.assert.calledOnce(prebidServerAdapterMock.callBids);
    });
  }); // end s2s tests
});
