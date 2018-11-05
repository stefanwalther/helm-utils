const log = console.log;
const chalk = require('chalk');
const helmUtils = require('./../src/helm-utils');
const os = require('os');
const path = require('path');

const formatGetImages = (opts) => {
  switch (opts.argv.format) {
    case 'json':
      console.log(opts.images);
      break;
    case 'verbose':
      log(chalk.green(`Images being used in ${opts.argv.chartUrl}:`));
      log(chalk.gray(`(${opts.images.length} images)`));
      log('');
      opts.images.forEach((image) => {
        log(`- ${image}`)
      });
      log('');
      log('');
      break;
    default:

  }
  return opts.images;
};

module.exports = {

  getImages: async (argv) => {

    let result = await helmUtils.downloadChartRepo({srcUrl: argv.chartUrl, savePath: os.tmpdir()});
    const unzipDir = path.join(result.savePath, result.name);
    await helmUtils.unzip({src: result.fullPath, target: unzipDir});
    let manifest = await helmUtils.getManifestFromChart({loadFromDir: unzipDir});
    let images = await helmUtils.getImagesFromManifest(manifest);

    formatGetImages({argv, images})

  }

};
