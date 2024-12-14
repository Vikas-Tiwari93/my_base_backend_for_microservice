import express from 'express';
import { PushNotificationController } from './notification.controller';

export const AuthRouter = express.Router();
AuthRouter.post('/signin', PushNotificationController);
