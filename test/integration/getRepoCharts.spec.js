const os = require('os');
const path = require('path');

const helmUtils = require('./../../src/index');

describe('[integration] => getRepoCharts()', () => {
  const runs = [
    {name: 'local', options: {src: path.resolve(__dirname, './../fixtures/repo-index/index-variant-1.yaml')}},
    {name: 'qsefe-stable-wo-index', options: {src: 'https://qlik.bintray.com/stable'}},
    {name: 'qsefe-stable-with-index', options: {src: 'https://qlik.bintray.com/stable/index.yaml'}}
  ];

  runs.forEach(run => {
    it(`Get the chart versions from a given repo: ${run.name}`, async () => {
      let r;
      try {
        r = await helmUtils.getRepoCharts(run.options);
      } catch (e) {
        console.error(e);
        expect(e).to.not.exist;
      }
      expect(r).to.exist;
      expect(r).to.have.property('meta');
      expect(r).to.have.property('result');
      expect(r.result).to.have.property('apiVersion');
      expect(r.result).to.have.property('entries');
      expect(r.result).to.have.property('generated');
    }).timeout(10000);
  });
});
