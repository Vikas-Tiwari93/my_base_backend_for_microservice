import Queue from 'bull';
const redisConfig = {
  host: 'localhost',
  port: 6379,
};
// task queue
export const otpQueue = new Queue('otpQueue', { redis: redisConfig });
export const emailQueue = new Queue('emailQueue', { redis: redisConfig });
export const imageProcessingQueue = new Queue('imageProcessingQueue', {
  redis: redisConfig,
});
export const paymentQueue = new Queue('paymentQueue', { redis: redisConfig });
export const notificationQueue = new Queue('notificationQueue', {
  redis: redisConfig,
});

//email service

emailQueue.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

emailQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed: ${err.message}`);
});

//otp service

otpQueue.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

otpQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed: ${err.message}`);
});
//image processing

imageProcessingQueue.on('completed', (job) => {
  console.log(`Image Processing Job ${job.id} completed successfully`);
});

imageProcessingQueue.on('failed', (job, err) => {
  console.error(`Image Processing Job ${job.id} failed: ${err.message}`);
});

//  payment queue

paymentQueue.on('completed', (job) => {
  console.log(`Payment Job ${job.id} completed successfully`);
});

paymentQueue.on('failed', (job, err) => {
  console.error(`Payment Job ${job.id} failed: ${err.message}`);
});
