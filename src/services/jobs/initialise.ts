import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';

import {
  emailQueue,
  imageProcessingQueue,
  otpQueue,
  paymentQueue,
} from './taskQueue/backroundJobs.config';
import {
  anotherScheduledJobQueue,
  scheduledJobQueue,
} from './schedulingJobs/scheduledJobsController';

export const serverAdapterScheduledJobs = new ExpressAdapter();
export const serverAdapterQueue = new ExpressAdapter();
createBullBoard({
  queues: [
    new BullAdapter(scheduledJobQueue),
    new BullAdapter(anotherScheduledJobQueue),
  ],
  serverAdapter: serverAdapterScheduledJobs,
});
createBullBoard({
  queues: [
    new BullAdapter(otpQueue),
    new BullAdapter(emailQueue),
    new BullAdapter(imageProcessingQueue),
    new BullAdapter(paymentQueue),
  ],
  serverAdapter: serverAdapterQueue,
});
