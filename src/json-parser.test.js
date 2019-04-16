'use strict';

const createJsonParser = require('./json-parser');

describe('JSON Parser', () => {
  it('should be able to parse Auth0 JSON', async () => {
    const filePath = '/path/to/some.json';
    const jsonBuffer = Buffer.from(
      '' + '\n' +
      JSON.stringify({name: 'dude', email: 'some-dude@gmail.com'}) + '\n' +
      JSON.stringify({name: 'other dude', email: 'other-dude@gmail.com'})
    );
    const fs = {
      readFile: jest.fn((filePath, callback) => callback(null, jsonBuffer))
    };
    const parser = createJsonParser(fs);

    const result = await parser.parseAsArray(filePath);

    expect(fs.readFile).toHaveBeenCalledWith(filePath, expect.anything());
    expect(result).toEqual([
      {name: 'dude', email: 'some-dude@gmail.com'},
      {name: 'other dude', email: 'other-dude@gmail.com'}
    ]);
  });
});
