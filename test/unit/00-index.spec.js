const helmUtils = require('./../../src/index');
const path = require('path');

describe('[unit] => helm-utils', () => {
  it('exposes some static functions', () => {
    expect(helmUtils).to.have.property('downloadChartRepo').to.be.a('function');
    expect(helmUtils).to.have.property('unzip').to.be.a('function');
  });

  describe('_resolveSrc', () => {
    it('recognizes URIs as `online` resources', () => {
      expect(helmUtils._resolveSrc('https://foo.bar')).to.be.an('object').to.have.a.property('is', 'online');
    });
    it('recognizes local paths as `local` resources', () => {
      const f = path.resolve(__dirname, './../fixtures/is-file/foo.bar');
      let result = helmUtils._resolveSrc(f);
      expect(result).to.be.an('object').to.have.a.property('is', 'local');
    });
    it('returns whether a URI exists or not');
    it('returns whether a local file exists or not')

  });
});
