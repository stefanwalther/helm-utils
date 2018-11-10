const fs = require('fs');
const os = require('os');
const path = require('path');
const _ = require('lodash');

const helmUtils = require('./../../src/index');

describe('[integration-test]', () => {
  // Todo: re-organize the test a bit, to also be able to test other repos
  describe('qlik.bintray.com/stable', () => {
    const chartName = 'qsefe-0.1.36.tgz';
    const opts = {
      srcUrl: `https://qlik.bintray.com/stable/${chartName}`,
      savePath: os.tmpdir()
    };

    it('downloads a chart tgz and returns an object', async () => {
      let result = await helmUtils.downloadChartRepo(opts);
      expect(result).to.have.property('srcUrl').to.equal(opts.srcUrl);
      expect(result).to.have.property('savePath').to.equal(opts.savePath);
      expect(result).to.have.property('saveToFile').to.equal(chartName);
      expect(result).to.have.property('fullPath').to.equal(path.resolve(opts.savePath, chartName));
    });

    it('downloads the chart and saves it to the expected folder', async () => {
      let result = await helmUtils.downloadChartRepo(opts);
      expect(fs.existsSync(result.fullPath)).to.be.true;
    });

    it('unzips properly', async () => {
      let result = await helmUtils.downloadChartRepo(opts);
      const unzipDir = path.join(result.savePath, result.name);
      await helmUtils.unzip({src: result.fullPath, target: unzipDir});
      expect(fs.existsSync(unzipDir));
    });

    it('can return a proper manifest', async () => {
      let result = await helmUtils.downloadChartRepo(opts);
      const unzipDir = path.join(result.savePath, 'qsefe-0.1.36');
      await helmUtils.unzip({src: result.fullPath, target: unzipDir});
      let manifest = await helmUtils.getManifestFromChart({loadFromDir: unzipDir});
      expect(manifest).to.be.an('object');
      expect(manifest).to.have.a.property('name').to.be.equal(result.name);
      expect(manifest).to.have.a.property('children').to.be.an('array');
    });

    it('returns the images being used', async () => {
      let result = await helmUtils.downloadChartRepo(opts);
      const unzipDir = path.join(result.savePath, result.name);
      await helmUtils.unzip({src: result.fullPath, target: unzipDir});
      let manifest = await helmUtils.getManifestFromChart({loadFromDir: unzipDir});
      let images = await helmUtils.getImagesFromManifest(manifest);
      expect(images).to.exist.and.to.be.an('array');
    });
  });

  it('handles properly a 404 of a resource');
  it('cleans up downloaded resources at the end of the script');
});
