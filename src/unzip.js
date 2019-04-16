'use strict';

const path = require('path');

module.exports = function createUnzip(zlib, fs) {
  return async function unzip(filePath) {
    const dirPath = path.dirname(filePath);
    const fileName = path.basename(filePath);
    const unzippedFileName = fileName.replace('.gz', '');
    const unzippedFilePath = path.join(dirPath, unzippedFileName);

    return new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(filePath);
      const writeStream = fs.createWriteStream(unzippedFilePath);
      const gunzip = zlib.createGunzip();
      readStream.pipe(gunzip);
      gunzip.pipe(writeStream);
      

      readStream.on('error', reject);
      gunzip.on('error', reject);
      writeStream.on('error', reject);
      writeStream.on('finish', () => resolve(unzippedFilePath));
    });
  };
};
