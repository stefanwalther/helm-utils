const HelmUtils = require('./../../src/helm-utils');

describe('[unit] => getImageFromValueFile()', () => {
  it('properly handles an object', () => {
    const valuesYaml = {
      image: {
        repository: 'foo',
        tag: '1.0.0'
      }
    };
    expect(HelmUtils._getImageFromValuesObject(valuesYaml)).to.be.equal(valuesYaml.image.repository + ':' + valuesYaml.image.tag);
  });
  it('properly handles a string', () => {
    const valuesYaml = {
      image: 'foo:1.0.0'
    };
    expect(HelmUtils._getImageFromValuesObject(valuesYaml)).to.be.equal(valuesYaml.image);
  });
});
