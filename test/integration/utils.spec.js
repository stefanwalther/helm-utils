const path = require('path');
const fs = require('fs');

const utils = require('./../../src/utils');

describe('[integration] => utils', () => {
  const TMP_DIR = path.resolve(__dirname, './../fixtures/.tmp');

  describe('ensureDir()', () => {
    it('creates a directory if it not exists', () => {
      const dir = path.resolve(TMP_DIR, 'does-not-exist');
      utils.ensureDir(dir);
      expect(fs.existsSync(dir)).to.be.true;
    });

    it('is just silent if the directory already exists', () => {
      const dir = path.resolve(TMP_DIR, 'does-not-exist', '1', '2', '3');
      utils.ensureDir(dir);
      expect(fs.existsSync(dir)).to.be.true;
      utils.ensureDir(dir);
    });
  });

  describe('downloadFile()', () => {
    it('downloads a file', async () => {
      const src = 'https://qlik.bintray.com/stable/index.yaml';
      const targetFolder = path.resolve(TMP_DIR, 'downloadFile');
      const targetFile = path.resolve(targetFolder, 'index.yaml');
      utils.ensureDir(targetFolder);
      await utils.downloadFile(src, targetFile);
      expect(fs.existsSync(targetFile)).to.be.true;
    });
    it('throws an error if the src does not exist', async () => {
      const src = 'https://qlik.bintray.com/stable/index2.yaml';
      const targetFolder = path.resolve(TMP_DIR, 'downloadFile');
      const targetFile = path.resolve(targetFolder, 'index2.yaml');
      utils.ensureDir(targetFolder);
      return expect(utils.downloadFile(src, targetFile)).to.be.rejectedWith(Error, 'Response code 404');
    });
  });
});
