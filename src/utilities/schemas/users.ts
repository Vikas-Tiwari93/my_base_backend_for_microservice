import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
    role: { type: String, required: true },
    dob: { type: String },
    isAgreement: { type: Boolean },
    isActive: { type: Boolean, required: true },
    isDeleted: { type: Boolean, required: true },
    authToken: { type: String, required: true },
    securityQn: { type: String },
    securityAns: { type: String },
    devices: [
      {
        ipAddress: { type: String },
        deviceModel: { type: String },
        os: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);
userSchema.index({ userName: 1 }, { unique: true });
export const Users = mongoose.model('Users', userSchema);
