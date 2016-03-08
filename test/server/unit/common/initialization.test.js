/* global describe, beforeEach, it, before, afterEach */
/* eslint no-console: 0 */

const assert = require('assert');
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const uuid = require('uuid');

// temp integration test while core is still complex
describe('core initalization', () => {
  let commonSettings;

  beforeEach(() => {
    commonSettings = {
      subscribe_key: 'subKey',
      publish_key: 'publishKey',
      auth_key: 'authKey',
      origin: 'customOrigin.origin.com',
      ssl: true,
      instance_id: 'instanceIdConfig',
      use_request_id: 'requestIdConfig',
      hmac_SHA256() {
        return 'this-is-hmac';
      },
      xdr: function () {}
    };
  });

  it('passes the correct arguments to the config class', () => {
    let proxiedCore = proxyquire('../../../../core/src/pubnub-common.js', {
      './components/config': class {
        setInstanceIdConfig(config) {
          assert.equal(config, 'instanceIdConfig');
          return this;
        }

        setRequestIdConfig(config) {
          assert.equal(config, 'requestIdConfig');
          return this;
        }

        setCloakConfig(config) {
          assert.equal(config, true);
          return this;
        }

        isInstanceIdEnabled() { return false; }

      }
    });

    proxiedCore.PN_API(commonSettings);
  });

  it('generates a uuid if not provided in setup or in database', () => {
    commonSettings.xdr = function () {};
    commonSettings.secret_key = 'secretKey';

    sinon.stub(uuid, 'v4')
      .onFirstCall().returns('UUID1')
      .onSecondCall().returns('UUID2');

    let passedUUID;
    let passedSecret;
    let passedPublish;
    let passedAuth;
    let passedSub;
    let passedInstance;
    let passedCipher;

    let proxiedCore = proxyquire('../../../../core/src/pubnub-common.js', {
      './components/keychain': class {
        setAuthKey(config) {
          passedAuth = config;
          return this;
        }

        setSecretKey(config) {
          passedSecret = config;
          return this;
        }

        setSubscribeKey(config) {
          passedSub = config;
          return this;
        }

        setPublishKey(config) {
          passedPublish = config;
          return this;
        }

        setInstanceId(config) {
          passedInstance = config;
          return this;
        }

        setUUID(config) {
          passedUUID = config;
          return this;
        }

        setCipherKey(config) {
          passedCipher = config;
          return this;
        }

        getSubscribeKey() {return 'subKey';}
        getPublishKey() {return 'pubKey';}
        getAuthKey() {return 'authKe';}
        getSecretKey() {return 'secKey';}
        getInstanceId() {return 'instanceID';}
        getUUID() {return 'UUID';}
      }
    });

    proxiedCore.PN_API(commonSettings);

    assert.equal(passedUUID, 'UUID2');
    assert.equal(passedInstance, 'UUID1');
    assert.equal(passedSub, 'subKey');
    assert.equal(passedAuth, 'authKey');
    assert.equal(passedPublish, 'publishKey');
    assert.equal(passedSecret, 'secretKey');
    assert.equal(passedCipher, undefined);
    uuid.v4.restore();
  });

  it('uses uuid provided in settings', () => {
    commonSettings.xdr = function () {};
    commonSettings.secret_key = 'secretKey';
    commonSettings.uuid = 'setup-uuid';

    sinon.stub(uuid, 'v4')
      .onFirstCall().returns('UUID1')
      .onSecondCall().returns('UUID2');

    let passedUUID;
    let passedSecret;
    let passedPublish;
    let passedAuth;
    let passedSub;
    let passedCipher;
    let passedInstance;

    let proxiedCore = proxyquire('../../../../core/src/pubnub-common.js', {
      './components/keychain': class {
        setAuthKey(config) {
          passedAuth = config;
          return this;
        }

        setSecretKey(config) {
          passedSecret = config;
          return this;
        }

        setSubscribeKey(config) {
          passedSub = config;
          return this;
        }

        setPublishKey(config) {
          passedPublish = config;
          return this;
        }

        setInstanceId(config) {
          passedInstance = config;
          return this;
        }

        setUUID(config) {
          passedUUID = config;
          return this;
        }

        setCipherKey(config) {
          passedCipher = config;
          return this;
        }

        getSubscribeKey() {return 'subKey';}
        getPublishKey() {return 'pubKey';}
        getAuthKey() {return 'authKe';}
        getSecretKey() {return 'secKey';}
        getInstanceId() {return 'instanceID';}
        getUUID() {return 'UUID';}
      }
    });

    proxiedCore.PN_API(commonSettings);

    assert.equal(passedUUID, 'setup-uuid');
    assert.equal(passedInstance, 'UUID1');
    assert.equal(passedSub, 'subKey');
    assert.equal(passedAuth, 'authKey');
    assert.equal(passedPublish, 'publishKey');
    assert.equal(passedSecret, 'secretKey');
    assert.equal(passedCipher, undefined);
    uuid.v4.restore();
  });

  it('passes the correct arguments to the keychain class', () => {
    let setKey;
    let setValue;

    commonSettings.db = {
      get: function () {
        return 'UUID10-FROM-DB';
      },
      set: function (passedKey, passedValue) {
        setKey = passedKey;
        setValue = passedValue;
      },
    };

    commonSettings.xdr = function () {};
    commonSettings.secret_key = 'secretKey';
    commonSettings.cipher_key = 'cipherKey';

    sinon.stub(uuid, 'v4')
      .onFirstCall().returns('UUID1')
      .onSecondCall().returns('UUID2');

    let passedUUID;
    let passedSecret;
    let passedPublish;
    let passedAuth;
    let passedSub;
    let passedInstance;
    let passedCipher;

    let proxiedCore = proxyquire('../../../../core/src/pubnub-common.js', {
      './components/keychain': class {
        setAuthKey(config) {
          passedAuth = config;
          return this;
        }

        setSecretKey(config) {
          passedSecret = config;
          return this;
        }

        setSubscribeKey(config) {
          passedSub = config;
          return this;
        }

        setPublishKey(config) {
          passedPublish = config;
          return this;
        }

        setInstanceId(config) {
          passedInstance = config;
          return this;
        }

        setUUID(config) {
          passedUUID = config;
          return this;
        }

        setCipherKey(config) {
          passedCipher = config;
          return this;
        }

        getSubscribeKey() {return 'subKey';}
        getPublishKey() {return 'pubKey';}
        getAuthKey() {return 'authKe';}
        getSecretKey() {return 'secKey';}
        getInstanceId() {return 'instanceID';}
        getUUID() {return 'UUID';}
      }
    });

    proxiedCore.PN_API(commonSettings);

    assert.equal(passedUUID, 'UUID10-FROM-DB');
    assert.equal(passedInstance, 'UUID1');
    assert.equal(passedSub, 'subKey');
    assert.equal(passedAuth, 'authKey');
    assert.equal(passedPublish, 'publishKey');
    assert.equal(passedSecret, 'secretKey');
    assert.equal(setKey, 'subKeyuuid');
    assert.equal(setValue, 'UUID');
    assert.equal(passedCipher, 'cipherKey');
    uuid.v4.restore();
  });

  it('passes the correct arguments to the networking class', () => {
    commonSettings.params = { param1: 10 };
    let _passedParams;

    let proxiedCore = proxyquire('../../../../core/src/pubnub-common.js', {
      './components/networking': class {
        constructor(xhr, keychain, ssl, domain) {
          assert.equal(keychain.getAuthKey(), commonSettings.auth_key);
          assert.equal(keychain.getPublishKey(), commonSettings.publish_key);
          assert.equal(keychain.getSubscribeKey(), commonSettings.subscribe_key);
          assert.equal(ssl, commonSettings.ssl);
          assert.equal(domain, 'customOrigin.origin.com');
        }
        fetchTime() {}
        prepareParams() {}
        setCoreParams(params) {
          _passedParams = params;
          return this;
        }
      }
    });

    proxiedCore.PN_API(commonSettings);
    assert.deepEqual(_passedParams, { param1: 10 });
  });

  describe('endpoint -- time', () => {
    it('intializes the timeEndpoint class', () => {
      let _networking;
      let _keychain;
      let _config;
      let _jsonp_cb;
      let proxiedCore = proxyquire('../../../../core/src/pubnub-common.js', {
        './endpoints/time': class {
          constructor({ networking, config, keychain, jsonp_cb }) {
            _networking = networking;
            _config = config;
            _keychain = keychain;
            _jsonp_cb = jsonp_cb;
          }

          fetchTime() { }

        }
      });

      proxiedCore.PN_API(commonSettings);
      assert.equal(_networking.getOrigin(), 'https://customOrigin.origin.com');
      assert.equal(_keychain.getSubscribeKey(), commonSettings.subscribe_key);
      assert.equal(_config.isInstanceIdEnabled(), 'instanceIdConfig');
      assert(_jsonp_cb);
    });

    it('mounts the time endpoint', () => {
      let _mockedArgs;
      let proxiedCore = proxyquire('../../../../core/src/pubnub-common.js', {
        './endpoints/time': class {
          fetchTime(callback) { _mockedArgs = callback; }
        }
      });

      let pubnubInstance = proxiedCore.PN_API(commonSettings);

      pubnubInstance.time('callback');
      assert.equal(_mockedArgs, 'callback');
    });
  });

  describe('endpoints -- presence', () => {
    it('intializes the presenceEndpoints class', () => {
      let _networking;
      let _keychain;
      let _config;
      let _jsonp_cb;
      let _error;
      let proxiedCore = proxyquire('../../../../core/src/pubnub-common.js', {
        './endpoints/presence': class {
          constructor({ networking, config, keychain, jsonp_cb, error }) {
            _networking = networking;
            _config = config;
            _keychain = keychain;
            _jsonp_cb = jsonp_cb;
            _error = error;
          }

          whereNow() { }
          hereNow() { }

        }
      });

      proxiedCore.PN_API(commonSettings);
      assert.equal(_networking.getOrigin(), 'https://customOrigin.origin.com');
      assert.equal(_keychain.getSubscribeKey(), commonSettings.subscribe_key);
      assert.equal(_config.isInstanceIdEnabled(), 'instanceIdConfig');
      assert(_error);
      assert(_jsonp_cb);
    });

    it('mounts the whereNow endpoint', () => {
      let _mockedArgs;
      let _mockedCallback;
      let proxiedCore = proxyquire('../../../../core/src/pubnub-common.js', {
        './endpoints/presence': class {
          whereNow(args, callback) {
            _mockedArgs = args;
            _mockedCallback = callback;
          }
        }
      });

      let pubnubInstance = proxiedCore.PN_API(commonSettings);

      pubnubInstance.where_now({ fake: 'args' }, 'callback');
      assert.deepEqual(_mockedArgs, { fake: 'args' });
      assert.equal(_mockedCallback, 'callback');
    });

    it('mounts the hereNow endpoint', () => {
      let _mockedArgs;
      let _mockedCallback;
      let proxiedCore = proxyquire('../../../../core/src/pubnub-common.js', {
        './endpoints/presence': class {
          hereNow(args, callback) {
            _mockedArgs = args;
            _mockedCallback = callback;
          }
        }
      });

      let pubnubInstance = proxiedCore.PN_API(commonSettings);

      pubnubInstance.here_now({ fake: 'args' }, 'callback');
      assert.deepEqual(_mockedArgs, { fake: 'args' });
      assert.equal(_mockedCallback, 'callback');
    });
  });

  describe('endpoints -- history', () => {
    it('intializes the historyEndpoints class', () => {
      let _networking;
      let _keychain;
      let _jsonp_cb;
      let _error;
      let _decrypt;
      let proxiedCore = proxyquire('../../../../core/src/pubnub-common.js', {
        './endpoints/history': class {
          constructor({ networking, keychain, jsonp_cb, error, decrypt }) {
            _networking = networking;
            _keychain = keychain;
            _jsonp_cb = jsonp_cb;
            _error = error;
            _decrypt = decrypt;
          }

          fetchHistory() { }

        }
      });

      proxiedCore.PN_API(commonSettings);
      assert.equal(_networking.getOrigin(), 'https://customOrigin.origin.com');
      assert.equal(_keychain.getSubscribeKey(), commonSettings.subscribe_key);
      assert(_error);
      assert(_jsonp_cb);
      assert(_decrypt);
    });

    it('mounts the history endpoint', () => {
      let _mockedArgs;
      let _mockedCallback;
      let proxiedCore = proxyquire('../../../../core/src/pubnub-common.js', {
        './endpoints/history': class {
          fetchHistory(args, callback) {
            _mockedArgs = args;
            _mockedCallback = callback;
          }
        }
      });

      let pubnubInstance = proxiedCore.PN_API(commonSettings);

      pubnubInstance.history({ fake: 'args' }, 'callback');
      assert.deepEqual(_mockedArgs, { fake: 'args' });
      assert.equal(_mockedCallback, 'callback');
    });
  });

  describe('endpoints -- replay', () => {
    it('intializes the replayEndpoints class', () => {
      let _networking;
      let _keychain;
      let _jsonp_cb;
      let _error;
      let proxiedCore = proxyquire('../../../../core/src/pubnub-common.js', {
        './endpoints/replay': class {
          constructor({ networking, keychain, jsonp_cb, error }) {
            _networking = networking;
            _keychain = keychain;
            _jsonp_cb = jsonp_cb;
            _error = error;
          }

          performReplay() { }

        }
      });

      proxiedCore.PN_API(commonSettings);
      assert.equal(_networking.getOrigin(), 'https://customOrigin.origin.com');
      assert.equal(_keychain.getSubscribeKey(), commonSettings.subscribe_key);
      assert(_error);
      assert(_jsonp_cb);
    });

    it('mounts the replay endpoint', () => {
      let _mockedArgs;
      let _mockedCallback;
      let proxiedCore = proxyquire('../../../../core/src/pubnub-common.js', {
        './endpoints/replay': class {
          performReplay(args, callback) {
            _mockedArgs = args;
            _mockedCallback = callback;
          }
        }
      });

      let pubnubInstance = proxiedCore.PN_API(commonSettings);

      pubnubInstance.replay({ fake: 'args' }, 'callback');
      assert.deepEqual(_mockedArgs, { fake: 'args' });
      assert.equal(_mockedCallback, 'callback');
    });
  });

  describe('endpoints -- push', () => {
    it('intializes the pushEndpoints class', () => {
      let _networking;
      let _keychain;
      let _config;
      let _jsonp_cb;
      let _error;
      let proxiedCore = proxyquire('../../../../core/src/pubnub-common.js', {
        './endpoints/push': class {
          constructor({ networking, keychain, jsonp_cb, error, config }) {
            _networking = networking;
            _keychain = keychain;
            _jsonp_cb = jsonp_cb;
            _config = config;
            _error = error;
          }

          provisionDevice() { }

        }
      });

      proxiedCore.PN_API(commonSettings);
      assert.equal(_networking.getOrigin(), 'https://customOrigin.origin.com');
      assert.equal(_keychain.getSubscribeKey(), commonSettings.subscribe_key);
      assert.equal(_config.isInstanceIdEnabled(), 'instanceIdConfig');
      assert(_error);
      assert(_jsonp_cb);
    });

    it('mounts the provisionDevice endpoint', () => {
      let _mockedArgs;
      let proxiedCore = proxyquire('../../../../core/src/pubnub-common.js', {
        './endpoints/push': class {
          provisionDevice(args) {
            _mockedArgs = args;
          }
        }
      });

      let pubnubInstance = proxiedCore.PN_API(commonSettings);

      pubnubInstance.mobile_gw_provision({ fake: 'args' }, 'callback');
      assert.deepEqual(_mockedArgs, { fake: 'args' });
    });
  });

  describe('endpoints -- access manager', () => {
    it('intializes the accessEndpoints class', () => {
      let _networking;
      let _keychain;
      let _jsonp_cb;
      let _error;
      let _config;
      let _hmac_SHA256;
      let proxiedCore = proxyquire('../../../../core/src/pubnub-common.js', {
        './endpoints/access': class {
          constructor({ networking, keychain, jsonp_cb, error, config, hmac_SHA256 }) {
            _networking = networking;
            _keychain = keychain;
            _jsonp_cb = jsonp_cb;
            _error = error;
            _config = config;
            _hmac_SHA256 = hmac_SHA256;
          }

          performGrant() { }
          performAudit() { }

        }
      });

      proxiedCore.PN_API(commonSettings);
      assert.equal(_networking.getOrigin(), 'https://customOrigin.origin.com');
      assert.equal(_keychain.getSubscribeKey(), commonSettings.subscribe_key);
      assert.equal(_config.isInstanceIdEnabled(), 'instanceIdConfig');
      assert.equal(_hmac_SHA256(), 'this-is-hmac');
      assert(_error);
      assert(_jsonp_cb);
    });

    it('mounts the grant endpoint', () => {
      let _mockedArgs;
      let _mockedCallback;
      let proxiedCore = proxyquire('../../../../core/src/pubnub-common.js', {
        './endpoints/access': class {
          performGrant(args, callback) {
            _mockedArgs = args;
            _mockedCallback = callback;
          }
        }
      });

      let pubnubInstance = proxiedCore.PN_API(commonSettings);

      pubnubInstance.grant({ fake: 'args' }, 'callback');
      assert.deepEqual(_mockedArgs, { fake: 'args' });
      assert.equal(_mockedCallback, 'callback');
    });

    it('mounts the audit endpoint', () => {
      let _mockedArgs;
      let _mockedCallback;
      let proxiedCore = proxyquire('../../../../core/src/pubnub-common.js', {
        './endpoints/access': class {
          performAudit(args, callback) {
            _mockedArgs = args;
            _mockedCallback = callback;
          }
        }
      });

      let pubnubInstance = proxiedCore.PN_API(commonSettings);

      pubnubInstance.audit({ fake: 'args' }, 'callback');
      assert.deepEqual(_mockedArgs, { fake: 'args' });
      assert.equal(_mockedCallback, 'callback');
    });
  });
});
