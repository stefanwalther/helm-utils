const HelmUtils = require('./../../src/helm-utils');
const os = require('os');
const path = require('path');
const util = require('util');

describe('[unit] => getManifestFromChart()', () => {
  const FIXTURE_PATH = path.resolve(__dirname, './../fixtures/sample-1');

  it('returns an error if `opts.loadFromDir` is not defined', () => {
    const opts = {};
    return expect(HelmUtils.getManifestFromChart(opts)).to.be.rejectedWith(Error, '`opts.loadFromDir` is not defined.');
  });

  it('returns an error if the chart directory does not exist', () => {
    const opts = {
      loadFromDir: path.resolve(os.tmpdir(), 'does-not-exist')
    };
    return expect(HelmUtils.getManifestFromChart(opts)).to.be.rejectedWith(Error, 'Directory defined in `opts.loadFromDir` does not exist.');
  });

  it('returns an object', async () => {
    const opts = {
      loadFromDir: FIXTURE_PATH
    };
    let result = await HelmUtils.getManifestFromChart(opts);
    expect(result).to.be.an('object');
    // console.log(util.inspect(result, false, null, true));
    expect(result).to.have.property('name').to.be.equal('sample-1');
  });
  it('contains required properties');
  it('provides deep values');
});
