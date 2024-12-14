import mongoose from 'mongoose';
import { generalLogger } from 'services/logs/logs.config';
export let dbInstance= undefined;
export const dbInit = async (dbUrl: string, database: string) => {
  try {
    dbInstance=  await mongoose.connect(dbUrl, {
      dbName: database,
    });
    console.log(`Successfully connected to the database: ${database}`);
  } catch (err) {
    generalLogger.error('Database Connection Error:', { message: err.message, stack: err.stack });
    process.exit(1); // Exit process if the connection fails
  }
};
mongoose.connection.on('error', (err: string) => {
  generalLogger.error('Database Connection Error:', err);
});

mongoose.connection.on('disconnected', () => {
  generalLogger.error('Database Disconnected');
});
export default mongoose;
