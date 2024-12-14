import Queue from 'bull';

const redisConfig = {
  host: 'localhost',
  port: 6379,
};
export const scheduledJobQueue = new Queue('scheduledJobQueue', {
  redis: redisConfig,
});
export const anotherScheduledJobQueue = new Queue('anotherScheduledJobQueue', {
  redis: redisConfig,
});

scheduledJobQueue.add(
  'dailyTask',
  { message: 'This is a daily scheduled task' },
  {
    repeat: {
      cron: '0 7 * * *',
    },
  }
);
anotherScheduledJobQueue.add(
  'dailyTask', // job name
  { message: 'This is a daily scheduled task' },
  {
    repeat: {
      cron: '0 7 * * *',
    },
  }
);
