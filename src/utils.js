const axios = require('axios');
const download = require('download');
const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');

const ensureDir = function (dir) {
  if (!fs.existsSync(dir)) {
    ensureDir(path.join(dir, '..'));
    fs.mkdirSync(dir);
  }
};

module.exports = {

  // Todo: as we already use axios, we should get rid of `download` and use axios again.
  /**
   *
   * @private
   */
  downloadFile: async (src, target) => {

    console.log('downloadFile:src', src);
    console.log('downloadFile:target', target);

    return download(src)
      .then(data => {
        console.log('Hurray, we have something downloaded');
        fs.writeFileSync(target, data);
      })
      .catch(err => {
        throw err;
      });

    // Let response;
    // try {
    //   response = await axios({
    //     method: 'GET',
    //     url: src,
    //     responseType: 'stream'
    //   });
    // } catch (e) {
    //   console.error('e', e);
    //   throw new Error('Hurray, we have an error');
    // }
    // response.data.pipe(fs.createWriteStream(target));
    //
    //
    // return new Promise((resolve, reject) => {
    //   response.data.on('end', () => {
    //     resolve({
    //       target,
    //       name: path.parse(target).name,
    //       ext: path.parse(target).ext
    //     });
    //   });
    //
    //   response.data.on('error', err => {
    //     reject(err);
    //   });
    // });
  },

  /**
   * Ensure that a local directory exists. If not, it will be created (recursively).
   *
   * @param {String} dir - The directory to be ensured.
   *
   * @private
   */
  ensureDir,

  /**
   *
   * @param src
   * @returns {Promise<*>}
   *
   * @private
   */
  loadFromYamlOnline: async src => {

    let response;
    try {
      response = await axios.get(src);
      return yaml.safeLoad(response.data);
    } catch (err) {
      if (err && err.response && err.response.status && err.response.status === 404) {
        throw new Error('The request failed with status code 404.');
      }
      throw new Error(err);
    }
  }

};
