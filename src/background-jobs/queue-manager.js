import { Queue, Worker } from "bullmq";
import queueMetadata from "./queue-metadata.js";
import IORedis from "ioredis";
import listModel from "../database/list-model.js";

const redisHost = process.env.REDIS_HOST ?? "localhost";
const redisPort = process.env.REDIS_PORT ?? 6379;

const ioRedisConnection = new IORedis(redisHost, {
  maxRetriesPerRequest: null,
});

const listProcessingStatusMap = {};

export const listProcessingQueue = new Queue(queueMetadata.list.name, {
  connection: ioRedisConnection,
});

for (let i = 0; i < queueMetadata.list.desiredWorkerCount; i++) {
  const listProcessingWorker = new Worker(
    queueMetadata.list.name,
    queueMetadata.list.jobProcessor,
    {
      connection: ioRedisConnection,
      concurrency: queueMetadata.list.workerConcurrency,
    }
  );

  logWorkerEvents(listProcessingWorker);
}

function logWorkerEvents(worker) {
  worker.on("active", async (job) => {
    console.log(
      `active: job with id ${job.id} and data ${JSON.stringify(job.data)}`
    );

    await listModel.findByIdAndUpdate(job.data.listId, {
      $inc: { active: 1 },
    });
  });

  worker.on("completed", async (job) => {
    console.log(
      `completed: job with id ${job.id} and data ${JSON.stringify(
        job.data
      )} is completed`
    );

    await listModel.findByIdAndUpdate(job.data.listId, {
      $inc: { completed: 1 },
    });
  });

  worker.on("failed", async (job, error) => {
    console.log(
      `job failed: id ${job.id} due to ${error} and data ${JSON.stringify(
        job.data
      )}`
    );

    await listModel.findByIdAndUpdate(job.data.listId, {
      $inc: { failed: 1 },
      $push: { reasons: error.message },
    });
  });

  worker.on("error", (error) => {
    console.error(`error occurred when executing jobs: ${error}`);
  });
}

export const addListProcessingJob = async (jobData) => {
  const { jobName } = queueMetadata.list;

  const job = await listProcessingQueue.add(jobName, jobData);
};
