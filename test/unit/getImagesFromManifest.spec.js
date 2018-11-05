/* global describe */
const helmUtils = require('./../../src/helm-utils');
const path = require('path');

describe('[unit] => getImages()', () => {
  const FIXTURE_PATH = path.resolve(__dirname, './../fixtures/sample-1');

  it('throws an error if argument `chartManifest` is not passed', () => {
    expect(() => helmUtils.getImagesFromManifest()).to.throw('Argument `chartManifest` is not defined.');
  });

  it('returns all images', async () => {
    const opts = {
      loadFromDir: FIXTURE_PATH
    };
    let chartManifest = await helmUtils.getManifestFromChart(opts);
    expect(chartManifest).to.be.an('object');

    let images = helmUtils.getImagesFromManifest(chartManifest);

    expect(images).to.exist;
    expect(images).to.be.of.length(5);
    expect(images).to.contain('foo/charts-1-1:1.0.1');
    expect(images).to.contain('foo/charts-1-2:1.0.0');
    expect(images).to.contain('foo/charts-2-1:1.0.0');
    expect(images).to.contain('foo/charts-3-1:1.0.0');
    expect(images).to.contain('foo/charts-3-2:1.0.0');
  });
});
