const fs = require('fs');
const os = require('os');

const helmUtils = require('./../../src/index');

describe('[integration] => downloadChartRepo', () => {
  const runs = [
    {
      name: 'qsefe_stable', options: {
        srcUrl: 'https://qlik.bintray.com/stable/qsefe-0.1.36.tgz'
      }
    }
  ];
  const opts = {
    savePath: os.tmpdir()
  };

  runs.forEach(item => {
    it(`downloads the chart properly for "${item.name}"`, async () => {
      let result = await helmUtils.downloadChartRepo({
        ...item.options,
        ...opts
      });
      return expect(fs.existsSync(result.fullPath)).to.be.true;
    });
  });

  it('works with both, an Url ending with .yaml and also just the folder src');
});
