import winston from 'winston';
import path from 'path';
import DailyRotateFile from 'winston-daily-rotate-file';

// import { TransportType } from './logs.types';
import { uploadDirPath } from '../../utilities/initialservices/initialServices';

// Define log format
const logFormat = winston.format.printf(
  ({ timestamp, level, message, service }) => {
    return `${timestamp} - ${service}] - ${level}: ${message}`;
  }
);

//logs breaking and transport 
const handleTransportCreation=(filenamePath:string,level:string)=> new DailyRotateFile({
  filename: filenamePath, 
  level:level,
  datePattern: 'YYYY-MM-DD',  
  zippedArchive: true,      
  maxSize: '20m',             
  maxFiles: '14d'            
});



// Create logger function to create a new logger instance for a service
// testing handleTransportCreation
function createServiceLogger(service: string, level = 'info') {
  const transports: winston.transport[] = [
    handleTransportCreation(path.join(uploadDirPath, `${service}.info.log`),"info"),
    handleTransportCreation(path.join(uploadDirPath, `${service}.warn.log`),"warn"),
    handleTransportCreation(path.join(uploadDirPath, `${service}.error.log`),"error"),
  ];

  if (process.env.NODE_ENV !== 'production') {
    transports.push(new winston.transports.Console(
      {
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      }
    ));
  }

  return winston.createLogger({
    level: level,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      logFormat
    ),
    defaultMeta: { service },
    transports: transports,
  });
}

// Create general logger
const generalLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    logFormat
  ),
  defaultMeta: { service: 'general' },
  transports: [
    new winston.transports.File({
      filename: path.join(uploadDirPath, 'general.log'),
      level: 'info',
    }),
  ],
});




export { createServiceLogger, generalLogger };
