import { Model } from "mongoose";
import { Users } from "utilities/schemas/users";

export const SHORT_LIVED =  10 * 60;
export const LONG_LIVED = 24 * 60 * 60;
export const DEFAULT =  10 * 60;

export const modelMapping: Record<string, Model<any>> = {
    'user_data': Users,
  };
  export const iPListing={
    whiteList:"whitelist",
    blacklist:"blacklist"
  }