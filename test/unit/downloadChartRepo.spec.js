const helmUtils = require('./../../src/index');

describe('[unit] => downloadChartRepo()', () => {
  it('should expose some methods', () => {
    expect(helmUtils).to.have.a.property('downloadChartRepo').to.be.a('function');
  });

  it('throws an error if `opts.srcUrl` is not defined.', () => {
    const opts = {
      savePath: 'foo'
    };
    return expect(helmUtils.downloadChartRepo(opts)).to.be.rejectedWith(Error, '`opts.srcUrl` is not defined.');
  });

  it('throws an error `opts.savePath` is not defined.', () => {
    const opts = {
      srcUrl: 'foo'
    };
    return expect(helmUtils.downloadChartRepo(opts)).to.be.rejectedWith(Error, '`opts.savePath` is not defined.');
  });

  xit('defaults to the `opts.srcUrl` file path when storing the file in case `opts.saveToFile` is not provided.', () => {
    // Todo: not even sure if that makes sense ... needs to be revisited.
  });

  it('throws an error if `opts` is not defined.', () => {
    return expect(helmUtils.downloadChartRepo()).to.be.rejectedWith(Error, 'No `opts` defined.');
  });

  it('throws an error if `opts` is defined, but an empty object.', () => {
    const opts = {};
    return expect(helmUtils.downloadChartRepo(opts)).to.be.rejectedWith(Error, 'No `opts` defined.');
  });
});
