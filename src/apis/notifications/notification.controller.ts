import { notificationQueue } from '../../services/jobs/taskQueue/backroundJobs.config';
import { authLogger } from '../../services/logs/loggerInstances';
import { SERVER_ERROR } from '../../utilities/constants/http-constants';
import { Request, Response } from 'express';

export const PushNotificationController = async (
  req: Request,
  res: Response
) => {
  try {
    const { token, title, body } = req.body;
    if (!token || !title || !body) {
      res.status(400).send('Token, title, and body are required');
    }

    await notificationQueue.add({ token, title, body });
    res.send('Notification job added to queue');
  } catch (error) {
    authLogger.error('login failed');
    res.status(SERVER_ERROR).json({ msg: 'Error signing in user', error });
  }
};
