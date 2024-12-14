import { fireBaseSDK } from '../../../app.config/env.config';
import {
  emailQueue,
  notificationQueue,
  otpQueue,
} from './backroundJobs.config';

import admin from 'firebase-admin';
// email job
emailQueue.process(async (job) => {
  const { email, subject } = job.data;
  console.log(`Sending email to ${email} with subject: ${subject}`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`Email sent to ${email}`);
});

// send otp job

otpQueue.process(async (job) => {
  const { phoneNumber, otp } = job.data;
  console.log(`Sending OTP to ${phoneNumber} with OTP: ${otp}`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
});

//push notification job
admin.initializeApp({
  credential: admin.credential.cert(fireBaseSDK),
});
notificationQueue.process(async (job) => {
  const { token, title, body } = job.data;

  const message = {
    notification: {
      title,
      body,
    },
    token,
  };

  try {
    await admin.messaging().send(message);
    console.log(`Notification sent to ${token}`);
  } catch (error) {
    console.error(`Error sending notification to ${token}:`, error);
  }
});
