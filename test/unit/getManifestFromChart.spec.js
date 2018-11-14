const helmUtils = require('./../../src/helm-utils');
const os = require('os');
const path = require('path');

describe('[unit] => getManifestFromChart()', () => {
  const FIXTURE_PATH = path.resolve(__dirname, './../fixtures/sample-1');

  it('returns an error if `opts.loadFromDir` is not defined', () => {
    const opts = {};
    return expect(helmUtils.getManifestFromChart(opts)).to.be.rejectedWith(Error, '`opts.loadFromDir` is not defined.');
  });

  it('returns an error if the chart directory does not exist', () => {
    const opts = {
      loadFromDir: path.resolve(os.tmpdir(), 'does-not-exist')
    };
    return expect(helmUtils.getManifestFromChart(opts)).to.be.rejectedWith(Error, 'Directory defined in `opts.loadFromDir` does not exist.');
  });

  it('returns an object', async () => {
    const opts = {
      loadFromDir: FIXTURE_PATH
    };
    let result = await helmUtils.getManifestFromChart(opts);
    expect(result).to.be.an('object');
    // Console.log(util.inspect(result, false, null, true));
    expect(result).to.have.property('name').to.be.equal('sample-1');
  });

  it('contains required properties');

  it('provides deep values');
});
