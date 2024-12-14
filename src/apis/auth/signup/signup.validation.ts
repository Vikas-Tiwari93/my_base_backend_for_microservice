import * as Joi from 'joi';
import {
  ValidatedRequestSchema,
  createValidator,
} from 'express-joi-validation';
import { ContainerTypes } from 'express-joi-validation';

export const validator = createValidator();
export const signUpAdminSchema = Joi.object({
  userName: Joi.string().required(),
  password: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required(),
  organisationName: Joi.string().required(),
  organisationId: Joi.string().required(),
  attachment: Joi.string(),
  isAgreement: Joi.boolean(),
});
export interface SignupAdminRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    firstName: string;
    lastName: string;
    password: string;
    organisationName: string;
    email: string;
    organisationId: string;
    attachment?: string;
    userName: string;
  };
}
