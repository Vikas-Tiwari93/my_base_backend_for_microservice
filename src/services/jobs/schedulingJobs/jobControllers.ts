import {
  anotherScheduledJobQueue,
  scheduledJobQueue,
} from './scheduledJobsController';

scheduledJobQueue.process(async (job) => {
  const { message } = job.data;
  console.log(`Scheduled Job: ${message}`);
  // Implement your job logic here
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`Scheduled Job completed`);
});

anotherScheduledJobQueue.process(async (job) => {
  const { message } = job.data;
  console.log(`Another Scheduled Job: ${message}`);
  // Implement your job logic here
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`Another Scheduled Job completed`);
});
