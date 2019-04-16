'use strict';

const createExportJobManager = require('./export-job-manager');

describe('Export Job Manager', () => {
  it('should be able to return users file location when everything goes smoothly', async () => {
    const jobId = '1234';
    const location = 'https://www.auth0-server/file.gz';
    const auth0 = {
      exportUsers: jest.fn(() => ({
        id: jobId
      })),
      jobs: {
        get: jest.fn(() => ({
          status: 'completed',
          location
        }))
      }
    };

    const exportJobManager = createExportJobManager(auth0);
    const retrievedLocation = await exportJobManager.getFileToDownload({}, {
      checkInterval: 0,
      checkRetries: 0
    });

    expect(retrievedLocation).toBe(location);
  });

  it('should be able to return users file location after a couple of retries', async () => {
    const jobId = '1234';
    const location = 'https://www.auth0-server/file.gz';
    let jobGetCall = 1;
    const auth0 = {
      exportUsers: jest.fn(() => ({
        id: jobId
      })),
      jobs: {
        get: jest.fn(() => {
          if (jobGetCall === 5) {
            return {
              status: 'completed',
              location
            };
          }
          jobGetCall += 1;
          return {
            status: 'pending'
          };
        })
      }
    };

    const exportJobManager = createExportJobManager(auth0);
    const retrievedLocation = await exportJobManager.getFileToDownload({}, {
      checkInterval: 0,
      checkRetries: 5
    });

    expect(retrievedLocation).toBe(location);
    expect(auth0.jobs.get).toHaveBeenCalledTimes(6);
  });

  it('should fail after certian number of retries', async () => {
    const jobId = '1234';
    const auth0 = {
      exportUsers: jest.fn(() => ({
        id: jobId
      })),
      jobs: {
        get: jest.fn(() => ({
          status: 'pending'
        }))
      }
    };

    const exportJobManager = createExportJobManager(auth0);
    await expect(exportJobManager.getFileToDownload({}, {
      checkInterval: 0,
      checkRetries: 6
    })).rejects.toThrow(/Giving up waiting for job 1234 after 6 retrires/);

    expect(auth0.jobs.get).toHaveBeenCalledTimes(7);
  });
});
