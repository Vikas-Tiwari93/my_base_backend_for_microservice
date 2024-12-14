import { Request, Response } from 'express';
import mongoose from 'mongoose';
import {
  BAD_REQUEST,
  SERVER_ERROR,
} from '../../../utilities/constants/http-constants';

import { Admin } from '../../../utilities/schemas/admin';
import { ValidatedRequest } from 'express-joi-validation';
import { SignupAdminRequestSchema } from './signup.validation';
import { getRecordDetails } from '../../../utilities/db/dbwrapper';
import { generateJwtTokens } from '../../../utilities/tokenGenerators/jwt';
import { handleImageUpload } from '../../../services/uploadsDownloads/imageUpload/image';
import { uploadDirPath } from '../../../utilities/initialservices/initialServices';
import { encryptPassword } from '../../../utilities/otherMiddlewares/authMiddleware';
import { Users } from '../../../utilities/schemas/users';
import { createSingleRecordWithTransactions } from '../../../utilities/transactions/dblayer';
import { executeOperationsInTransaction } from '../../../utilities/transactions/transations.methods';
import { authLogger } from '../../../services/logs/loggerInstances';
export const SignupControllerAdmin = async (
  req: ValidatedRequest<SignupAdminRequestSchema>,
  res: Response
) => {
  const {
    firstName,
    lastName,
    password,
    organisationName,
    organisationId,
    email,
    attachment,
    userName,
  } = req.body;

  const { authToken } = generateJwtTokens({
    userName,
    role: 'admin',
  });

  const name = firstName + ' ' + lastName;
  const payload = {
    email,
    name,
    userName,
    password: await encryptPassword(password),
    role: 'admin',
    attachment,
    isActive: true,
    isDeleted: false,
    authToken,
  };
  const adminPayload = {
    email,
    name,
    userId: userName,
    organisationName,
    organisationId,
    isActive: true,
    isDeleted: false,
  };
  try {
    const isAdminRegistered = await getRecordDetails(Users, {
      userName,
    });
    if (!isAdminRegistered.hasData) {
      let createUserOperations = [
        async (session: mongoose.mongo.ClientSession) =>
          await createSingleRecordWithTransactions(Users, payload, session),
        async (session: mongoose.mongo.ClientSession) =>
          await createSingleRecordWithTransactions(
            Admin,
            adminPayload,
            session
          ),
      ];
      const admin = await executeOperationsInTransaction(createUserOperations);
      const adminId =
        admin && admin.length > 1 ? admin[1].resultSet.userId : null;
      if (adminId) {
        res.json({ adminId, message: 'User signed up successfully' });
      } else {
        res.status(BAD_REQUEST).json({ message: 'Bad delete request' });
      }
    } else {
      res.json({ message: 'Already have a user with these credentials' });
    }
  } catch (error) {
    res.status(SERVER_ERROR).json({ msg: 'Error signing up user', error });
  }
};

export const uploadsController = async (req: Request, res: Response) => {
  const { uploadFile, saveAs } = handleImageUpload(req);
  try {
    if (uploadFile && saveAs) {
      uploadFile?.mv(`${uploadDirPath}+${saveAs}`, function (err: unknown) {
        if (err) {
          authLogger.error('isgn up failed');
          return res.status(500).send(err);
        }
        authLogger.error('sign up success');
        return res.status(200).json({ status: 'uploaded', saveAs });
      });
    }
  } catch (error) {
    res.status(SERVER_ERROR).json({ msg: 'Error in uploading', error });
  }
};
