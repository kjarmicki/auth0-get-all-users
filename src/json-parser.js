'use strict';

module.exports = function createJsonParser(fs) {
  async function readFile(filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, buffer) => {
        if (err) {
          return reject(err);
        }
        return resolve(buffer.toString('utf-8'));
      });
    });
  }

  async function parseAsArray(filePath) {
    const fileContents = await readFile(filePath);
    return fileContents
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => JSON.parse(line));
  }

  return {
    parseAsArray
  };
};
