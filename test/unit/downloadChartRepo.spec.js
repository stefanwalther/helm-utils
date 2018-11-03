const HelmUtils = require('./../../src/index');

describe('[unit-test] => downloadChartRepo()', () => {
  it('should expose some methods', () => {
    expect(HelmUtils).to.have.a.property('downloadChartRepo').to.be.a('function');
  });

  it('requires opts.srcUrl', () => {
    const opts = {
      savePath: 'foo'
    };
    return expect(HelmUtils.downloadChartRepo(opts)).to.be.rejectedWith(Error, '`opts.srcUrl` is not defined.');
  });

  it('requires opts.savePath', () => {
    const opts = {
      srcUrl: 'foo'
    };
    return expect(HelmUtils.downloadChartRepo(opts)).to.be.rejectedWith(Error, '`opts.savePath` is not defined.');
  });

  it('requires opts', () => {
    return expect(HelmUtils.downloadChartRepo()).to.be.rejectedWith(Error, 'No `opts` defined.');
  });

  it('requires opts (and ignores and empty object)', () => {
    const opts = {};
    return expect(HelmUtils.downloadChartRepo(opts)).to.be.rejectedWith(Error, 'No `opts` defined.');
  });
});
