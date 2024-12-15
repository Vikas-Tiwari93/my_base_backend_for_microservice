import { NextFunction, Request, Response } from "express";
import { AvailableUserRoles } from "../constants/enums";
import { PERMISSION_DENIED, UNAUTHORIZED } from "../constants/http-constants";
import { asyncHandler } from "../other_utils/others";


export const verifyPermission = (roles = AvailableUserRoles) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id, role } = req.body.user;
    if (!id) {
      res.status(UNAUTHORIZED).send("Unauthorized request")
      throw new Error
    }
    if (roles[role]) {
      next();
    } else {
      res.status(PERMISSION_DENIED).send("You are not allowed to perform this action")
      throw new Error("You are not allowed to perform this action");
    }
  });

export const avoidInProduction = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === "development") {
    next();
  } else {
    res.status(PERMISSION_DENIED).send("This service is only available in the local environment")
    throw new Error(
      "This service is only available in the local environment."
    );
  }
});