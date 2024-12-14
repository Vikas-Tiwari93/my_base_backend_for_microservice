import { SERVER_ERROR } from '../../../utilities/constants/http-constants';
import { getRecordDetails } from '../../../utilities/db/dbwrapper';
import { Response } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { SigninRequestSchema } from './signin.validation';
import {
  RequestWithUser,
  generateJwtTokens,
  updatingJwtTokensInDb,
} from '../../../utilities/tokenGenerators/jwt';
import { Users } from '../../../utilities/schemas/users';
import { authLogger } from '../../../services/logs/loggerInstances';
import { generalLogger } from 'services/logs/logs.config';
import { isPasswordVerified } from 'utilities/other_utils/others';

export const SigninController = async (
  req: ValidatedRequest<SigninRequestSchema>,
  res: Response
) => {
  const { userName, password, role } = req.body;

  try {
    const { authToken, refreshToken } = generateJwtTokens({
      userName,
      role,
    });

    const user = await updatingJwtTokensInDb(authToken, {
      userName,
      role,
    });

    if (
      user?.hasData &&
      (await isPasswordVerified(password, user?.resultSet?.password))
    ) {
      authLogger.info('i am in');
      return res.status(200).json({
        isAdmin: user?.resultSet.isAdmin,
        authToken,
        refreshToken,
        message: 'SignIn Complete',
      });
    }
    generalLogger.warn(`Unauthorized login attempt detected from IP: ${req.ip}`);
    return res.status(404).json({ message: 'Invalid Credentials' });
  } catch (error) {
    authLogger.error('login failed');
    res.status(SERVER_ERROR).json({ msg: 'Error signing in user', error });
  }
};

export const generateAuthTokenController = async (
  req: RequestWithUser,
  res: Response
) => {
  const user = req.user;
  try {
    if (user) {
      const querypayload = { userName: user.userName, role: user.userName };
      const identifyUser = await getRecordDetails(Users, querypayload);

      if (!identifyUser) {
        return res.status(404).send('User not found');
      }
      const { authToken, refreshToken } = generateJwtTokens(user);

      await updatingJwtTokensInDb(authToken, user);

      res
        .status(200)
        .send({ authToken, refreshToken, message: 'authToken sent' });

      return res.status(404).send('Refresh token expired');
    }
  } catch (error) {
    res.status(403).send(error);
  }
};
