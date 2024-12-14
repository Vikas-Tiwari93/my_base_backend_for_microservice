import { Request, Response } from 'express';
import { sendEmail } from '../../../services/nodemailer/sendEmail';
import {
  createSingleRecord,
  getRecordDetails,
  updateRecord,
} from '../../../utilities/db/dbwrapper';
import { Admin } from '../../../utilities/schemas/admin';

import { OTPMap } from '../../../utilities/schemas/otpMap';
import { SERVER_ERROR } from '../../../utilities/constants/http-constants';
import { deleteManyRecord } from '../../../utilities/db/dblayer';
import { authLogger } from '../../../services/logs/loggerInstances';
import OTPGenerator from 'otp-generator';
import { encryptPassword } from 'utilities/other_utils/others';
type EmailRequest = {
  email: string;
};
type Changepassword = {
  userName: string;
  password: string;
  isAdmin: boolean;
};
type OTPValidate = {
  userName: string;
  otp: string;
};
export const emailOtp = async (req: Request, res: Response) => {
  const { email } = <EmailRequest>(<unknown>req.body);

  try {
    const user = await getRecordDetails(Admin, { email });

    if (
      user?.hasData &&
      user?.resultSet?.isAdmin &&
      user?.resultSet?.userName
    ) {
      const otp = OTPGenerator.generate(6, {
        upperCaseAlphabets: true,
        digits: true,
      });
      const emailBody = `Your OTP is: ${otp} use it to change password`;
      const pyload = {
        userName: (user?.resultSet?.userName as string) || '',
        isAdmin: (user?.resultSet?.isAdmin as boolean) || false,
        otp: otp as string,
      };

      await sendEmail(email, 'OTP Confirmation', emailBody);
      const result = await createSingleRecord(OTPMap, pyload);
      res
        .status(200)
        .json({ result, message: 'Email sent please check ur email' });
    } else {
      res.status(404).json({ message: 'No user found for the email provided' });
    }
  } catch (error) {
    res.status(SERVER_ERROR).json({ msg: 'Error generating Email', error });
  }
};
export const otpValidate = async (req: Request, res: Response) => {
  const { userName, otp } = <OTPValidate>(<unknown>req.body);
  try {
    const user = await getRecordDetails(OTPMap, { userName, otp });
    if (user.hasData) {
      const result = user.resultSet;
      res.status(200).json({ result, message: 'successful OTP validation' });
      await deleteManyRecord(OTPMap, { userName });
    } else {
      res.status(404).json({ message: 'No user found for this OTP' });
    }
  } catch (error) {
    res.status(SERVER_ERROR).json({ msg: 'Error in OTP validation', error });
  }
};
export const changePassword = async (req: Request, res: Response) => {
  const { userName, password, isAdmin } = <Changepassword>(<unknown>req.body);
  let hashedPassword = await encryptPassword(password);
  authLogger.info('what to do now?');
  try {
    if (isAdmin) {
      const result = await updateRecord(
        Admin,
        { userName },
        { hashedPassword }
      );
      result.hasData
        ? res.status(200).json({ result, message: 'Password changed' })
        : res.status(404).json({ message: "Coundn't find User" });
    }
  } catch (error) {
    res.status(SERVER_ERROR).json({ msg: 'Error in password change', error });
  }
};
