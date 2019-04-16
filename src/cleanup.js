'use strict';

module.exports = function createCleanup(rimraf) {
  return async function cleanup(directory) {
    return new Promise((resolve) => {
      rimraf(directory, resolve);
    });
  };
};
