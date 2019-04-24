'use strict';

const fs = require('fs');
const zlib = require('zlib');
const rimraf = require('rimraf');
const httpDownloader = require('download');
const tmp = require('tmp-promise');

const createExportJobManager = require('./export-job-manager');
const createDownloader = require('./downloader');
const createUnzip = require('./unzip');
const createJsonParser = require('./json-parser');
const createCleanup = require('./cleanup');

module.exports = function getAllUsers(auth0) {
  const exportJobManager = createExportJobManager(auth0);
  const downloader = createDownloader(httpDownloader, tmp);
  const unzip = createUnzip(zlib, fs);
  const jsonParser = createJsonParser(fs);
  const cleanup = createCleanup(rimraf);

  async function asArray(exportJobParams, managerParams) {
    const usersFileLocation = await exportJobManager.getFileToDownload(exportJobParams, managerParams);
    const downloadedFilePath = await downloader.download(usersFileLocation);
    const unzippedFilePath = await unzip(downloadedFilePath);
    const parsed = await jsonParser.parseAsArray(unzippedFilePath);
    try {
      await cleanup(unzippedFilePath);
    } catch { }
    return parsed;
  }

  return {
    asArray
  };
};
