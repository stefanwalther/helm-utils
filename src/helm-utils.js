const axios = require('axios');
const path = require('path');
const fs = require('fs-extra');
const zlib = require('zlib');
const tar = require('tar');
const yaml = require('js-yaml');
const _ = require('lodash');
const isUrl = require('is-url');
const os = require('os');
const uuid = require('uuid/v1');
const urlJoin = require('url-join');

const utils = require('./utils');

/**
 *
 * @public
 */
class HelmUtils {

  /**
   * @typedef {Object} DownloadRepoResult
   * @property {String} srcUrl - The passed in `srcUrl` property.
   * @property {String} savePath - The passed in `savePath` property.
   * @property {String} saveToFile - The passed in `saveToFile` property.
   * @property {String} fullPath - The full path of the downloaded file.
   * @property {String} name - The filename.
   * @property {String} ext - The filename's extension.
   */

  /**
   * Download the helm chart repo to a local folder.
   *
   * @param {Object} opts - Options to use.
   * @param {String} opts.srcUrl - The Uri of the chart package which should be downloaded to local disk.
   * @param {String} opts.savePath - The path to download the package to. Defaults to os.temp().
   * @param {String} opts.saveToFile - The name of the file the package should be saved as. Defaults to `index.yaml`.
   *
   * @return {Promise<DownloadRepoResult, Error>}
   *
   * @async
   * @static
   */
  static async downloadChartRepo(opts) {

    if (!opts || _.isEmpty(opts)) {
      throw new Error('No `opts` defined.');
    }
    const config = Object.assign({
      savePath: os.tmpdir()
    }, opts);
    if (!config.srcUrl) {
      throw new Error('`opts.srcUrl` is not defined.');
    }

    if (!config.savePath) {
      config.savePath = path.resolve(os.tmpdir(), uuid());
    }

    if (_.isEmpty(config.saveToFile)) {
      config.saveToFile = config.srcUrl.substr(config.srcUrl.lastIndexOf('/')+1);
    }

    console.log('downloadChartRepo:opts', config);

    utils.ensureDir(config.savePath);
    const saveTo = path.resolve(config.savePath, config.saveToFile);

    console.log('saveTo', saveTo);
    let response;
    try {
      response = await axios({
        method: 'GET',
        url: config.srcUrl,
        responseType: 'stream'
      });
    } catch (e) {
      throw new Error('Hurray, we have an error');
    }
    response.data.pipe(fs.createWriteStream(saveTo));

    return new Promise((resolve, reject) => {
      response.data.on('end', () => {
        resolve({
          ...config,
          fullPath: saveTo,
          name: path.parse(saveTo).name,
          ext: path.parse(saveTo).ext
        });
      });

      response.data.on('error', err => {
        reject(err);
      });
    });
  }

  /**
   * @typedef {Object} ChartRepoResult - The result of a chart's repos index.yaml
   * @property {Object} meta - Some meta information
   * @property {Object} result - The result (content of the index.yaml file).
   * @property {string} result.apiVersion - The helm's chart `apiVersion` property.
   */

  /**
   * Get the chart information of a chart-repo's index.yaml file.
   *
   * @param {Object} opts - The options for `getChartVersions()` function.
   * @param {String} opts.src - The source to load from. This can be a local file or a Url.
   *
   * @return ChartRepoResult
   *
   * @static
   * @async
   */
  static async getRepoCharts(opts) {

    let r = {
      meta: {},
      result: {}
    };
    HelmUtils._getRepoChartValidation(opts);

    r.meta = HelmUtils._resolveSrc(opts.src);
    if (r.meta.is === 'unknown') {
      throw new Error('Argument `opts.src` is neither a URL nor a local file.');
    }

    if (r.meta.is === 'online' && ( !_.endsWith(opts.src, 'yaml' || !_.endsWith(opts.src, 'yml')))) {
      opts.src = urlJoin(opts.src, 'index.yaml');
    }

    console.log('opts.src', opts.src);

    switch (r.meta.is) {

      case 'local':
        r.result = HelmUtils._loadFromYaml(opts.src);
        break;

      case 'online': {
        try {
          r.result = await utils.loadFromYamlOnline(opts.src);
        } catch (e) {
          console.error(e);
          throw new Error(e);
        }
        break;
      }
      case 'unknown':
        throw new Error('Could not determine the type of the `src`.');
      default:
        break;
    }

    if (_.isEmpty(r.result)) {
      throw new Error('The .yaml file is empty.');
    }

    return r;
  }

  static _getRepoChartValidation(opts) {
    if (!opts || _.isEmpty(opts)) {
      throw new Error('Argument `opts` is undefined or empty.');
    }
    if (!opts.src || _.isEmpty(opts.src)) {
      throw new Error('Argument `opts.src` is undefined or empty.');
    }
  }

  /**
   * Unzip (tar) a given file to a specific folder.
   *
   * @param {Object} opts - The options for the `unzip()` function.
   * @param {String} opts.src - The source file (a .tgz file).
   * @param {String} opts.target - The local target directory to unpack the .tgz file to.
   *
   * @example
   *
   * // Unzip the file `./my-file.tgz` to folder `./my-file'`.
   *
   * const opts = {
   *     src: './my-file.tgz'
   *     target: './my-file'
   * }
   * await unzip(opts);
   *
   *
   * @async
   * @static
   */
  static async unzip(opts) {

    if (!opts || _.isEmpty(opts)) {
      throw new Error('Argument `opts` is not defined or empty.');
    }
    if (!opts.src) {
      throw new Error('Argument `opts.src` is not defined or empty.');
    }
    if (!opts.target) {
      throw new Error('Argument `opts.target` is not defined or empty.');
    }

    utils.ensureDir(opts.target);

    fs.createReadStream(opts.src)
      .on('error', console.error)
      .pipe(zlib.Unzip()) // eslint-disable-line new-cap
      .on('error', e => console.error(e))
      .pipe(tar.x({
        cwd: opts.target,
        strip: 1
      }))
      .on('error', e => console.error(e));
  }

  /**
   * @typedef {Object} ChartManifest
   * @property
   *
   */

  /**
   * Returns the manifest for a given chart.
   *
   * @function getManifestFromChart

   * @param {Object} opts - Options for `getManifestFromChart()`.
   * @param {String} opts.loadFromDir - The (local) directory from which the chart should be loaded from.

   * @returns {ChartManifest}, to be resolved on success and rejected on failure.
   *
   * @example
   *
   * const opts = {
   *     loadFromDir: './.temp/charts/chart_v1'
   * }
   * let manifest = await getManifestFromChart();
   *
   * @async
   * @static
   *
   */
  static async getManifestFromChart(opts) {

    if (opts && !opts.loadFromDir) {
      throw new Error('`opts.loadFromDir` is not defined.');
    }
    if (!fs.existsSync(opts.loadFromDir)) {
      throw new Error('Directory defined in `opts.loadFromDir` does not exist.');
    }

    return HelmUtils._walkChart(opts.loadFromDir);

  }

  /**
   * Returns an array of all images from a given chart manifest.
   *
   * @param {ChartManifest} chartManifest
   *
   * @return {Array<String>} - Returns an array of images found in the given manifest.
   *
   * @static
   */
  static getImagesFromManifest(chartManifest) {

    if (!chartManifest || _.isEmpty(chartManifest)) {
      throw new Error('Argument `chartManifest` is not defined.');
    }

    let images = HelmUtils._getImagesFromObj(chartManifest);

    // Remove duplicates
    let uniqueImages = _.uniqBy(images, item => {
      return item;
    });

    // Sort results
    let sortedImages = _.sortBy(uniqueImages, item => {
      return item;
    });

    // Return
    return sortedImages;
  }

  /* ----------------------------------------------------------------------- */
  /*                             PRIVATE METHODS                             */

  /* ----------------------------------------------------------------------- */

  static _loadFromYaml(src) {

    // Todo: catch errors and throw a custom error here.
    return yaml.safeLoad(fs.readFileSync(src, 'utf8'));

  }

  // Todo: Maybe nicer instead of having `children`: https://stackoverflow.com/questions/15690706/recursively-looping-through-an-object-to-build-a-property-list
  /**
   *
   * @param {String} filePath - The path to the file.
   * @returns {WalkInfo} //Todo: WalkInfo needs to be created
   *
   * @private
   * @static
   */
  static _walkChart(filePath) {

    let stats = fs.lstatSync(filePath);

    let info = {
      path: filePath,
      name: path.basename(filePath)
    };

    if (stats.isDirectory()) {
      info.type = 'folder';
      info.isDir = true;
      info.children = fs.readdirSync(filePath).map(function (child) {
        return HelmUtils._walkChart(filePath + '/' + child);
      });
    } else {
      info.type = 'file';
      info.isDir = false;
      info.extname = path.extname(filePath);
      if (path.basename(filePath) === 'values.yaml') {
        info.object = yaml.safeLoad(fs.readFileSync(filePath, 'utf8'));
      }
    }

    return info;
  }

  // https://stackoverflow.com/questions/48171842/how-to-write-a-recursive-flat-map-in-javascript
  /**
   *
   *
   * @param {Object} obj
   * @returns {*}
   *
   * @private
   * @static
   */
  static _getImagesFromObj(obj) {

    if (!Array.isArray(obj)) {
      obj = [obj];
    }

    return obj.reduce((acc, o) => {
      if (o.children && o.children.length) {
        acc = acc.concat(HelmUtils._getImagesFromObj(o.children));
      } else if (o.name === 'values.yaml') {
        let img = HelmUtils._getImageFromValuesObject(o.object);
        if (img) {
          acc.push(img);
        }
      }
      return acc;
    }, []);

  }

  /**
   * Returns the image from the values.yaml file
   *
   * @param {object} obj - The object representing the values.yaml file.
   * @returns {string} - Returns the image in the format <image>:<version>
   *
   * @static
   * @private
   */
  static _getImageFromValuesObject(obj) {

    if (obj && obj.image) {
      if (_.isObject(obj.image)) {
        let rep = obj.image.repository;
        let ver = obj.image.tag;
        return `${rep}:${ver}`;
      }
      if (_.isString(obj.image)) {
        return obj.image;
      }
    }
    return undefined;
  }

  /**
   * @typedef {Object} ResolveResult - The result.
   * @property {boolean} isUrl - Whether the given `src` is an online Url or not.
   * @property {boolean} isFile - Whether the given `src` is a local file or not.
   * @property {string} is - The kind of `src`. Can be `online`, `local` or `unknown`.
   */

  /**
   * Resolves a path an returns an object with some additional handline.
   *
   * @param {string} src - The source string.
   * @returns {ResolveResult} - The result. // Todo: type resolution does not seem to work, yet.
   *
   * @private
   * @static
   */
  static _resolveSrc(src) {

    const defaults = {
      isUrl: false,
      isFile: false,
      is: 'unknown'
    };

    if (isUrl(src)) {
      return Object.assign(defaults, {
        is: 'online',
        isUrl: true
      });
    }

    try {
      if (fs.statSync(src).isFile()) {
        return Object.assign(defaults, {
          is: 'local',
          isFile: true
        });
      }
    } catch (e) {
      return Object.assign(defaults, {
        error: e
      });
    }
  }

}

module.exports = HelmUtils;
