import { saveUserProcessor } from "./list-processing-job-processor.js";

/** Object to maintain metadata for each queue type. */
export default Object.freeze({
  list: {
    name: "list",
    desiredWorkerCount: 5,
    workerConcurrency: 10,
    jobProcessor: saveUserProcessor,
    jobName: "saveUser",
  },
});
