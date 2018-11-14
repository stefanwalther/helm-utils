const log = console.log;
const chalk = require('chalk');
const HelmUtils = require('./../src/helm-utils');
const os = require('os');
const path = require('path');
const Table = require('cli-table');
const moment = require('moment');
const packageInfo = require('package-info');
const semver = require('semver');
const readPkgUp = require('read-pkg-up');

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

  if (opts.argv.verbose) {
    log('--');
    log('Here is the meta result \n', opts.repoInfo.meta);
    log('-');
    log('Here is the result \n', opts.repoInfo.result);
    log('-');
    log('opts.argv', opts.argv);
    log('---');
  }

  switch (opts.argv.format) {
    case 'json':
      log(opts.repoInfo.result);
      break;
    case 'table':
    default:
      for (let c in opts.repoInfo.result.entries) {
        // console.log(opts.repoInfo.result.entries[c]);
        log(chalk.bold.green(`Charts for "${c}":`));
        //log(chalk.gray(``));
        let table = new Table({
          style: {head: ['cyan']},
          head: ['Name', 'Description', 'Version', 'Created', 'When', 'Url'],
          colWidths: [15, 40, 10, 12, 15, 70]
        });
        for (let e in opts.repoInfo.result.entries[c]) {
          let entry = opts.repoInfo.result.entries[c][e];
          let row = [];
          row.push(entry.name);
          row.push(entry.description);
          row.push(entry.version);
          row.push(moment(entry.created).format('YYYY-MM-DD'));
          row.push(moment(entry.created).fromNow());
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

    let downloadResult;
    try {
      downloadResult = await HelmUtils.downloadChartRepo({srcUrl: argv.chartUrl, savePath: os.tmpdir()});
    }
    catch (e) {
      return log(chalk.red(e));
    }
    const unzipDir = path.join(downloadResult.savePath, downloadResult.name);
    await HelmUtils._unzip({src: downloadResult.fullPath, target: unzipDir});
    let manifest = await HelmUtils.getManifestFromChart({loadFromDir: unzipDir});
    let images = await HelmUtils.getImagesFromManifest(manifest);

    formatGetImages({argv, images})
  },

  getRepoCharts: async (argv) => {

    let result = await HelmUtils.getRepoCharts({src: argv.repoUri});
    // console.dir(result, {depth: null});

    formatRepoCharts({argv, repoInfo: result});

  },

  upgradeCheck: async (argv) => {

    let info;
    try {
      info = await packageInfo('helm-utils');
    }
    catch (e) {
      // OK, we suppress this here ...
    }

    // always suppress errors
    try {
      if (info) {
        let pkgUp = await readPkgUp();
        let localVersion = pkgUp.pkg.version;
        let onlineVersion = info.version;
        if (semver.compare(localVersion, onlineVersion) === -1) {
          log(chalk.green(`A newer version of '${chalk.bold('helm-utils')}' is available:`));
          log(chalk.gray(`\tCurrent version: ${localVersion}`));
          log(chalk.gray(`\tAvailable version: ${onlineVersion}`));
          log('');
          log('Use `npm install -g helm-utils` to upgrade.');
          log('--');
          log('');
        }
      }
    } catch (e) {
      console.log(e);
      // eat it ...
    }

  }

};
