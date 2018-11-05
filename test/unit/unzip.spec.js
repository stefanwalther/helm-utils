/* global describe */
const helmUtils = require('./../../src/helm-utils');

describe('[unit] unzip()', () => {

  it('throws an error if argument `opts` is not defined', () => {
    return expect(helmUtils.unzip()).to.be.rejectedWith(Error, 'Argument `opts` is not defined or empty.');
  });

  it('throws an error if argument `opts` is empty.', () => {
    const opts = {};
    return expect(helmUtils.unzip(opts)).to.be.rejectedWith(Error, 'Argument `opts` is not defined or empty.');
  });
  it('throws an error if argument `opts.src` is not defined or empty.', () => {
    const opts = {
      target: 'foo'
    };
    return expect(helmUtils.unzip(opts)).to.be.rejectedWith(Error, 'Argument `opts.src` is not defined or empty.');
  });
  it('throws an error if argument `opts.src` is not either a value URI or a local path');
  it('throws an error if the argument `opts.src` points to a non existing file');
  it('throws an error if the argument `opts.src` points to a URI which is not accessible');
  it('throws an error if argument `opts.target` is not defined', async () => {
    const opts = {
      src: 'foo'
    };
    return expect(helmUtils.unzip(opts)).to.be.rejectedWith(Error, 'Argument `opts.target` is not defined or empty.');
  });
  it('throws an error if argument `opts.target` is empty', () => {
    const opts = {
      src: 'foo',
      target: ''
    };
    return expect(helmUtils.unzip(opts)).to.be.rejectedWith(Error, 'Argument `opts.target` is not defined or empty.');
  });
  it('properly unzips a local file to a dir');
  it('properly downloads and then unzips a URI to a dir');

});
