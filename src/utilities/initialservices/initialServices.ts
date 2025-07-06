import fs from 'fs';
import path from 'path';
import { LogsServices, LogsTypes } from '../constants/logs';
 
export const uploadDirPath = `${process.cwd()}/uploads/`;
 
export const logsDrPath = `${process.cwd()}/logs/`;
const logFilesType = LogsTypes;
const logsServices = LogsServices;

export const makeDirectories = (path: string) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
};
export const ensureLogFilesExist = (
  logFilesType: typeof LogsTypes,
  logsDrPath: string
) => {
  if (!fs.existsSync(logsDrPath)) {
    fs.mkdirSync(logsDrPath, { recursive: true });
  }
  // const existingFiles = fs.readdirSync(logsDrPath);
  Object.keys(logsServices).forEach((service) => {
    Object.keys(logFilesType).forEach((type) => {
      const filePath = path.join(
        logsDrPath,
        `${service[service]}.${logFilesType[type]}.log`
      );
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '');
      }
    });
  });
};

export const initalServicesInit = () => {
  makeDirectories(uploadDirPath);
  ensureLogFilesExist(logFilesType, logsDrPath);
};
