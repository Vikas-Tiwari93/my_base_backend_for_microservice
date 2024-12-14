import { LogsServices, LogsTypes } from '../../utilities/constants/logs';
import { createServiceLogger, generalLogger } from './logs.config';

export const authLogger = createServiceLogger(LogsServices.AUTH, LogsTypes.INFO);
export const userLogger = createServiceLogger(LogsServices.USER, LogsTypes.INFO);
export const cacheLogger = createServiceLogger(LogsServices.CACHE_REDIS, LogsTypes.INFO);
export const fallbackRateLogger = createServiceLogger(LogsServices.FALLBACK, LogsTypes.INFO);

const memoryUsage = process.memoryUsage();
//general loggers 
//>500MB usage;
if (memoryUsage.rss > 500 * 1024 * 1024) {
  generalLogger.warn(`System memory usage is high. RSS: ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`);
}
// application error
process.on('uncaughtException', (error) => {
    generalLogger.error('Uncaught Exception:', { stack: error.stack });
  });
  //unhandled Rejections
  process.on('unhandledRejection', (reason, promise) => {
    generalLogger.error('Unhandled Rejection:', { reason, promise });
  });
  // Example log: Application Shutdown (on SIGINT)
  process.on('SIGINT', () => {
    generalLogger.info('Application is shutting down due to SIGINT signal.');
    process.exit();
  });
  