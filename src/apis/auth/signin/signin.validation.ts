import * as Joi from 'joi';
import {
  ValidatedRequestSchema,
  createValidator,
} from 'express-joi-validation';
import { ContainerTypes } from 'express-joi-validation';
import { SigninBody } from './validation.types';
export const validator = createValidator();
export const signInSchema = Joi.object({
  userName: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string().required(),
});
export interface SigninRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: SigninBody;
}
