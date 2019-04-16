'use strict';

const createCleanup = require('./cleanup');

describe('Cleanup', () => {
  it('should be able to clean up given directory', async () => {
    const dir = '/home/dude/projects/stuff';
    const rimraf = jest.fn((_dir, callback) => callback());
    const cleanup = createCleanup(rimraf);

    await cleanup(dir);

    expect(rimraf).toHaveBeenCalledWith(dir, expect.anything());
  });
});
