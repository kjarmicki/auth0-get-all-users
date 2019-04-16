'use strict';

const { BufferReadableMock, BufferWritableMock, DuplexMock } = require('stream-mock');
const createUnzip = require('./unzip');

describe.only('Unzip function', () => {
  it('should be able to unzip a file by path', async () => {
    const file = '/home/dude/some.file';
    const fileContents = 'file contents';
    let fsReadable, fsWritable, zlibDuplex;
    const fs = {
      createReadStream() {
        fsReadable = new BufferReadableMock(Buffer.from(fileContents));
        return fsReadable;
      },
      createWriteStream() {
        fsWritable = new BufferWritableMock();
        return fsWritable;
      }
    };
    const zlib = {
      createGunzip() {
        // zlib stream is a transform, not a duplex, but stream-mock doesn't support that yet
        zlibDuplex = new DuplexMock();
        return zlibDuplex;
      }
    };

    const unzip = createUnzip(zlib, fs);
    await unzip(file);

    const zlibDuplexData = zlibDuplex.flatData.toString('utf-8');
    const fsWritableData = fsWritable.flatData.toString('utf-8');
    expect(zlibDuplexData).toBe(fileContents);
    expect(fsWritableData).toBe(fileContents);
  });
});
