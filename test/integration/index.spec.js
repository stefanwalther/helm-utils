const HelmUtils = require('./../../src/index');
const os = require('os');
const path = require('path');

describe('[integration-test]', () => {
  describe('downloadChartRepo()', () => {
    it('downloads a chart tgz', async () => {
      let utils = new HelmUtils();
      const chartName = 'qsefe-0.1.36.tgz';
      const opts = {
        srcUrl: `https://qlik.bintray.com/stable/${chartName}`,
        savePath: os.tmpdir()
      };
      let result = await HelmUtils.downloadChartRepo(opts);
      expect(result).to.have.property('srcUrl').to.equal(opts.srcUrl);
      expect(result).to.have.property('savePath').to.equal(opts.savePath);
      expect(result).to.have.property('saveToFile').to.equal(chartName);
      expect(result).to.have.property('fullPath').to.equal(path.resolve(opts.savePath, chartName));
    });
  });

  describe('unzip()', () => {

  });

  xit('returns the images', async () => {
    let utils = new HelmUtils();
    let images = await utils.getImages();
    expect(images).to.be.an('array');
    expect(images).to.contain('qlik-docker-qsefe.bintray.io/collections:0.1.4');
    // console.log(images);
    // console.log('--');
    // console.log(images.join('\n'));
  });
});
