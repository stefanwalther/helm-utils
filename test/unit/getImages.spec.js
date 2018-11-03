const HelmUtils = require('./../../src/helm-utils');
const path = require('path');

describe.only('[unit] => getImages()', () => {
  const FIXTURE_PATH = path.resolve(__dirname, './../fixtures/sample-1');

  it('throws an error if argument `chartManifest` is not passed', () => {
    expect(() => HelmUtils.getImages()).to.throw('Argument `chartManifest` is not defined.');
  });

  it('returns all images', async () => {
    const opts = {
      loadFromDir: FIXTURE_PATH
    };
    let chartManifest = await HelmUtils.getManifestFromChart(opts);
    expect(chartManifest).to.be.an('object');

    let images = HelmUtils.getImages(chartManifest);

    expect(images).to.exist;
    expect(images).to.be.of.length(4)
  })

});
