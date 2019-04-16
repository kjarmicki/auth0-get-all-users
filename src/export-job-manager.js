'use strict';

const DEFAULT_EXPORT_PARAMS = {
  format: 'json'
};
const DEFAULT_MANANGER_PARAMS = {
  checkInterval: 1000,
  checkRetries: 30
};
const JOB_STATUS_COMPLETED = 'completed';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = function createExportJobManager(auth0) {
  async function waitForJobCompleted(jobId, managerParams, retry = 0) {
    const jobDetails = await auth0.jobs.get({
      id: jobId
    });
    if (jobDetails.status === JOB_STATUS_COMPLETED) {
      return jobDetails;
    }
    if (retry >= managerParams.checkRetries) {
      throw new Error(
        `Giving up waiting for job ${jobId} after ${retry} retrires (${retry * managerParams.checkInterval}ms)`
      );
    }
    await wait(managerParams.checkInterval);
    return waitForJobCompleted(jobId, managerParams, retry + 1);
  }

  async function getFileToDownload(exportJobParams, managerParams) {
    const trigger = await auth0.exportUsers({...DEFAULT_EXPORT_PARAMS, ...exportJobParams});
    const {id: jobId} = trigger;
    const jobDetails = await waitForJobCompleted(jobId, {...DEFAULT_MANANGER_PARAMS, ...managerParams});
    return jobDetails.location;
  }

  return {
    getFileToDownload
  };
};
