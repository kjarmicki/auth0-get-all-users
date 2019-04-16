'use strict';

const createDownloader = require('./downloader');

describe('Downloader', () => {
  it('should be able to download a file', async () => {
    const tmpPath = '/some/mocked/path/';
    const url = 'https://www.some-domain/file.tar.gz';
    const httpDownloader = jest.fn();
    const tmp = {
      dir: jest.fn(() => ({
        path: tmpPath
      }))
    };
    const downloader = createDownloader(httpDownloader, tmp);
    const result = await downloader.download(url);

    expect(result).toBe(tmpPath + 'file.tar.gz');
    expect(tmp.dir).toHaveBeenCalled();
    expect(httpDownloader).toHaveBeenCalledWith(url, tmpPath);
  });
});
