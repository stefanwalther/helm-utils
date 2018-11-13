const fs = require('fs');
const os = require('os');
const uuid = require('uuid/v1');
const path = require('path');

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
    savePath: path.resolve(os.tmpdir(), uuid())
  };

  runs.forEach(item => {
    it(`downloads the chart properly for "${item.name}"`, async () => {
      let result = await helmUtils.downloadChartRepo({
        ...item.options,
        ...opts
      });
      return expect(fs.existsSync(result.fullPath)).to.be.true;
    }).timeout(4000);
  });

  it('works with both, an Url ending with .yaml and also just the folder src');
});
