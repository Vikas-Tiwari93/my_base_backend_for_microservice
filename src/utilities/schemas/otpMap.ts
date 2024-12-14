import mongoose from 'mongoose';

export const OTPMapschema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    isAdmin: { type: Boolean, required: true },
    otp: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
export const OTPMap = mongoose.model('OTPMap', OTPMapschema);
