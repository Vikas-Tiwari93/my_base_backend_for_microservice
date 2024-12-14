import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { updateRecord } from '../db/dbwrapper';
import { UNAUTHORIZED } from '../constants/http-constants';
import { secretKey } from '../constants/keys';
import { Users } from '../schemas/users';

export type TokenPayload = {
  userName: string;
  role: string;
};
type updatingJwt = {
  userName: string;
  password?: string;
  role: string;
};
export const generateJwtTokens = (payloadObject: TokenPayload) => {
  const authToken = jwt.sign(payloadObject, secretKey, {
    expiresIn: '30m',
  });

  const refreshToken = jwt.sign(payloadObject, secretKey, {
    expiresIn: '7d',
  });

  return { authToken, refreshToken };
};
export const updatingJwtTokensInDb = async (
  authToken: string,
  query: updatingJwt
) => {
  const { role } = query;
  const payload = { authToken: authToken };
  if (role) {
    return await updateRecord(Users, query, payload);
  }
};
// Jwt middleware below
export interface RequestWithUser extends Request {
  user?: {
    userName: string;
    role: string;
  };
}

export const isAuth = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization
    ? req.headers.authorization.split(' ')[1]
    : '';

  if (!token) {
    res.status(UNAUTHORIZED).json({ error: 'Unauthorized' });
  }
  const decoded = jwt.decode(token, { complete: true }) as {
    payload: JwtPayload;
  };

  if (decoded?.payload?.exp) {
    const expirationTime = new Date(decoded.payload.exp * 1000);
    const isExpired = expirationTime < new Date() ? true : false;

    if (!isExpired) {
      const user: any = jwt.verify(token, secretKey);

      req.user = {
        userName: user.userName,
        role: user.role,
      };

      return next();
    } else {
      res.status(UNAUTHORIZED).json({ error: 'Unauthorized' });
    }

    res.status(UNAUTHORIZED).json({ error: 'Unauthorized' });
  }
  res.status(UNAUTHORIZED).json({ error: 'Unauthorized' });
};
