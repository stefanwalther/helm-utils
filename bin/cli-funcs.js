const log = console.log;
const chalk = require('chalk');
const helmUtils = require('./../src/helm-utils');
const os = require('os');
const path = require('path');
const Table = require('cli-table');
const moment = require('moment');

const formatGetImages = (opts) => {
  switch (opts.argv.format) {
    case 'json':
      console.log(opts.images);
      break;
    case 'verbose':
    default:
      log(chalk.green(`Images being used in ${opts.argv.chartUrl}:`));
      log(chalk.gray(`(${opts.images.length} images)`));
      log('');
      opts.images.forEach((image) => {
        log(`- ${image}`)
      });
      log('');
      log('');
      break;
  }
  return opts.images;
};

const formatRepoCharts = (opts) => {

  let result = opts.result;

  switch (opts.argv.format) {
    case 'json':
      console.log(result);
      break;
    case 'verbose':
    default:
      for (let c in result.entries) {
        log(`Charts for ${c}:`);
        let table = new Table({
          head: ['Name', 'Description', 'Version', 'Created', 'Url']
        });
        for (let e in result.entries[c]) {
          let entry = result.entries[c][e];
          let row = [];
          row.push(entry.name);
          row.push(entry.description);
          row.push(entry.version);
          row.push(moment(entry.created).format('YYYY-MM-DD hh:mm'));
          row.push(entry.urls.join(','));
          table.push(row);
        }
        log(table.toString());
      }
      break;
  }

};

module.exports = {

  getImages: async (argv) => {

    let result = await helmUtils.downloadChartRepo({srcUrl: argv.chartUrl, savePath: os.tmpdir()});
    const unzipDir = path.join(result.savePath, result.name);
    await helmUtils.unzip({src: result.fullPath, target: unzipDir});
    let manifest = await helmUtils.getManifestFromChart({loadFromDir: unzipDir});
    let images = await helmUtils.getImagesFromManifest(manifest);

    formatGetImages({argv, images})
  },

  getRepoCharts: async (argv) => {

    let result = await helmUtils.getRepoCharts({src: argv.repoUri});

    formatRepoCharts({argv, result});

  }

};
