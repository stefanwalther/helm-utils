// General dependencies
const path = require('path');
const fs = require('fs-extra');
const nock = require('nock');

// Module dependencies
const utils = require('./../../src/utils');

// Test dependencies
const testUtils = require('./../lib/testUtils.js');

describe('[unit] => utils', () => {

  beforeEach(() => {
    testUtils.ensureTmp();
  });
  afterEach(() => {
    testUtils.cleanTmp();
  });

  describe('ensureDir()', () => {
    it('creates a directory if it not exists', () => {
      const dir = path.resolve(testUtils.TMP_DIR, 'does-not-exist');
      utils.ensureDir(dir);
      expect(fs.existsSync(dir)).to.be.true;
    });

    it('is just silent if the directory already exists', () => {
      const dir = path.resolve(testUtils.TMP_DIR, 'does-not-exist', '1', '2', '3');
      utils.ensureDir(dir);
      expect(fs.existsSync(dir)).to.be.true;
      utils.ensureDir(dir);
    });
  });

  describe('loadFromYamlOnline()', () => {
    it('returns an object from an online src', async () => {
      const src = 'http://localhost:4000/index.yaml';

      nock('http://localhost:4000')
        .get('/index.yaml')
        .replyWithFile(
          200,
          path.resolve(__dirname, './../fixtures/repo-index/index-variant-1.yaml'),
          {'Content-Type': 'text/x-yaml'}
        );

      let result = await utils.loadFromYamlOnline(src);
      expect(result).to.exist;
      expect(result).to.be.an('object').to.have.property('apiVersion', 'v1');
      expect(result).to.be.an('object').to.have.property('entries').to.have.a.property('qsefe');
      expect(result).to.be.an('object').to.have.property('generated');
    });

    it('returns an error if the online src does not exist', async() => {
      const src = 'http://does-not-exist/index.yaml';

      nock('http://does-not-exist')
        .get('/index.yaml')
        .reply(404);

      return expect(utils.loadFromYamlOnline(src)).to.be.rejectedWith(Error, 'The request failed with status code 404.');
    });
  });

  describe('downloadFile()', () => {

  })
});
