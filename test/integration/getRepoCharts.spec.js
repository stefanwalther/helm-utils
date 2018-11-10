const os = require('os');
const path = require('path');

const helmUtils = require('./../../src/index');

describe('[integration] => getRepoCharts()', () => {
  const runs = [
    {name: 'local', options: {src: path.resolve(__dirname, './../fixtures/repo-index/index-variant-1.yaml')}},
    {name: 'qsefe-stable', options: {src: 'https://qlik.bintray.com/stable'}}
  ];

  runs.forEach(run => {
    it(`Get the chart versions from a given repo: ${run.name}`, async () => {
      let result;
      try {
        result = await helmUtils.getRepoCharts(run.options);
      } catch (e) {
        expect(e).to.not.exist;
      }
      expect(result).to.exist;
      expect(result).to.have.property('apiVersion');
      expect(result).to.have.property('entries');
      expect(result).to.have.property('generated');
    }).timeout(5000);
  });
});
