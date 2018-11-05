const helmUtils = require('./../../src');
const path = require('path');

describe('[unit] => getChartVersions()', () => {

  it('throws an error if argument `opts` is missing.', async () => {
    return expect(helmUtils.getRepoCharts()).to.be.rejectedWith(Error, 'Argument `opts` is undefined or empty.');
  });
  it('throws an error if argument `opts` is empty.', async () => {
    return expect(helmUtils.getRepoCharts({})).to.be.rejectedWith(Error, 'Argument `opts` is undefined or empty.');
  });
  it('throws an error if `opts.src` is undefined.', async () => {
    return expect(helmUtils.getRepoCharts({foo: 'bar'})).to.be.rejectedWith(Error, 'Argument `opts.src` is undefined or empty.');
  });
  it('throws an error if `opts.src` is empty.', async () => {
    it('throws an error if `opts.src` is undefined.', async () => {
      return expect(helmUtils.getRepoCharts({src: ''})).to.be.rejectedWith(Error, 'Argument `opts.src` is undefined or empty.');
    });
  });
  xit('throws an error if the given file does not exist.', async () => {
    const opts = {
      src: 'http://'
    };
    expect(true).to.be.false;
  });
  it('throws an error if we deal with an empty or invalid .yaml file.');
  it('throws an error if we are offline and trying to open an online .yaml file.');
  it('returns an object with expected properties.', async () => {
    const srcLocal = path.resolve(__dirname, './../fixtures/repo-index/index-variant-1.yaml');
    let result = await helmUtils.getRepoCharts({src: srcLocal});
    expect(result).to.exist;
    expect(result).to.be.an('object').to.have.property('apiVersion', 'v1');
    expect(result).to.be.an('object').to.have.property('entries').to.have.a.property('qsefe');
    expect(result).to.be.an('object').to.have.property('generated');
  });
  it('allows to filter by chart repo.');
  it('allows to return only the latest chart.');
  it('defaults to ./index.yaml for local resources.');
  it('defaults to ./index.yaml for online resources.')
});
