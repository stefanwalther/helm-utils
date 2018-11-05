const axios = require('axios');
const path = require('path');
const fs = require('fs');
const zlib = require('zlib');
const tar = require('tar');
const yaml = require('js-yaml');
const _ = require('lodash');

/**
 *
 * @public
 */
class HelmUtils {

  /**
   * @type ChartManifest
   */

  /**
   * Download the helm chart repo to a local folder.
   *
   * @param {object} opts - Options to use.
   * @param {string} opts.srcUrl - The Uri of the chart package which should be downloaded to local disk.
   * @param {string} opts.savePath - The path to download the package to. Defaults to os.temp().
   * @param {string} opts.saveToFile - The name of the file the package should be saved as. Defaults to the `srcUrl` file-path.
   *
   * @return {Promise<*>}
   *
   * @async
   * @static
   */
  static async downloadChartRepo(opts) {

    if (!opts || _.isEmpty(opts)) {
      throw new Error('No `opts` defined.');
    }
    if (!opts.srcUrl) {
      throw new Error('`opts.srcUrl` is not defined.');
    }
    if (!opts.savePath) {
      throw new Error('`opts.savePath` is not defined.');
    }
    if (_.isEmpty(opts.saveToFile)) {
      opts.saveToFile = opts.srcUrl.substring(opts.srcUrl.lastIndexOf('/') + 1);
    }

    HelmUtils._ensureDir(opts.savePath);
    const saveTo = path.resolve(opts.savePath, opts.saveToFile);

    const response = await axios({
      method: 'GET',
      url: opts.srcUrl,
      responseType: 'stream'
    });

    response.data.pipe(fs.createWriteStream(saveTo));

    return new Promise((resolve, reject) => {
      response.data.on('end', () => {
        resolve({
          srcUrl: opts.srcUrl,
          savePath: opts.savePath,
          saveToFile: opts.saveToFile,
          fullPath: saveTo,
          name: path.parse(saveTo).name,
          ext: path.parse(saveTo).ext
        });
      });

      response.data.on('error', err => {
        console.log('err', err);
        reject(err);
      });
    });
  }

  /**
   * Unzip (tar) a given file to a specific folder.
   *
   * @param {Object} opts - Options for the `unzip()` function.
   * @param {String} opts.src
   * @param {String} opts.target
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
      throw new Error('No `opts` defined.');
    }
    if (!opts.src) {
      throw new Error('`opts.src` is not defined.');
    }
    if (!opts.target) {
      throw new Error('`opts.target` is not defined.');
    }

    this._ensureDir(opts.target);

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

  // Todo: Maybe nicer instead of having `children`: https://stackoverflow.com/questions/15690706/recursively-looping-through-an-object-to-build-a-property-list
  /**
   *
   * @param filePath
   * @returns {{path: *, name: string}}
   *
   * @private
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

  /**
   * Returns an array of all images from a given chart manifest.
   *
   * @param chartManifest
   *
   * @return {Array<String>} - Returns an array of images found in the given manifest.
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

  // https://stackoverflow.com/questions/48171842/how-to-write-a-recursive-flat-map-in-javascript
  /**
   *
   * @param obj
   * @returns {*}
   *
   * @private
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
   *
   * @param dir
   *
   * @private
   */
  static _ensureDir(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  }

}

module.exports = HelmUtils;
