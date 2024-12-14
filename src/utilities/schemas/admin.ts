import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    profileImg: { type: String },
    userId: { type: String, required: true },
    organisationId: { type: String, required: true },
    organisationName: { type: String, required: true },
    email: { type: String, required: true },
    classes: [
      {
        className: { type: String, required: true },
        classId: { type: String, required: true },
        currentAsignmentSubmit: { type: Number, required: true },
        totalStrength: { type: Number, required: true },
      },
    ],
    requests: [
      {
        userId: { type: String, required: true },
        name: { type: String, required: true },
        profileImg: { type: String, required: true },
        isAdded: { type: Boolean, required: true },
      },
    ],
    topics: [
      {
        className: { type: String, required: true },
        title: { type: String, required: true },
      },
    ],
    notifications: [
      {
        title: { type: String, required: true },
        details: { type: String, required: true },
        logo: { type: String, required: true },
        createdAt: { type: Boolean, required: true },
        seen: { type: Boolean, required: true },
      },
    ],
    isActive: { type: Boolean, required: true },
    isDeleted: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);
// defining types

export const Admin = mongoose.model('Admin', adminSchema);
