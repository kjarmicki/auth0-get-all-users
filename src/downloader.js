'use strict';

const {URL} = require('url');
const path = require('path');

module.exports = function createDownloader(httpDownloader, tmp) {
  async function download(fileUrl) {
    const parsedUrl = new URL(fileUrl);
    const fileName = parsedUrl.pathname.split('/').pop();
    const {path: fileDir} = await tmp.dir();
    await httpDownloader(fileUrl, fileDir);
    return path.join(fileDir, fileName);
  }

  return {
    download
  };
};
