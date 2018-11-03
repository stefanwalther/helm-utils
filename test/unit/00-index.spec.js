const HelmUtils = require('./../../src/index');

describe('[unit-test] => helm-utils', () => {
  it('exposes some static functions', () => {
    expect(HelmUtils).to.have.property('downloadChartRepo').to.be.a('function');
    expect(HelmUtils).to.have.property('unzip').to.be.a('function');
  });

  it('exposes some functions as an instance', () => {
    let helmUtils = new HelmUtils();
  });

  describe('as an instance', () => {
    describe('downloadChartRepo()', () => {

    });

    describe('unzip()', () => {
      it('requires opts.src', () => {
        const opts = {
          target: 'foo'
        };
        return expect(HelmUtils.unzip(opts)).to.be.rejectedWith(Error, '`opts.src` is not defined.');
      });

      it('requires opts.target', () => {
        const opts = {
          src: 'foo'
        };
        return expect(HelmUtils.unzip(opts)).to.be.rejectedWith(Error, '`opts.target` is not defined.');
      });

      it('requires an opts argument', () => {
        return expect(HelmUtils.unzip()).to.be.rejectedWith(Error, 'No `opts` defined.');
      });

      it('requires an opts argument, which cannot be empty', () => {
        const opts = {};
        return expect(HelmUtils.unzip(opts)).to.be.rejectedWith(Error, 'No `opts` defined.');
      });
    });
  });
});
