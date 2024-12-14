import dotenv from 'dotenv';
dotenv.config({
    path: "./.env",
  });

export const port = process.env.PORT || 5000;
export const dbUrl = process.env.MongoDB_CONNECT || '';
export const apiKey = process.env.API_KEY || '';
export const fireBaseSDK = process.env.FIREBASE_ADMIN_SDK || '';
