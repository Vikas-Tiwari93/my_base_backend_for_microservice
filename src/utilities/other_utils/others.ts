import { NextFunction, Request, Response } from "express";
import bcrypt from 'bcrypt';

const asyncHandler = (requestHandler:any) => {
    return (req:Request, res:Response, next:NextFunction) => {
      Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    };
  };
  
  export { asyncHandler };



export const encryptPassword = async (password: string) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};
export const isPasswordVerified = async (
  password: string,
  dbPassword: string
) => {
  try {
    const passwordMatch = await bcrypt.compare(password, dbPassword);

    return passwordMatch;
  } catch (err) {
    return err;
  }
};