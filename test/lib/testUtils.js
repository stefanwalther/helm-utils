const path = require('path');
const fs = require('fs-extra');

const utils = require('./../../src/utils');

const TMP_DIR = path.resolve(__dirname, './../fixtures/.tmp');

module.exports = {

  TMP_DIR,
  cleanTmp: () => {
    fs.removeSync(TMP_DIR);
  },
  ensureTmp: () => {
    utils.ensureDir(TMP_DIR)
  }

};
