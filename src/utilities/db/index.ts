import mongoose from 'mongoose';
import { SeedCollections } from './DBseeding';
import { handleAdmindelete, handleAdminInsert, handleUserdelete, handleUserInsert } from './changeStreams';
import { generalLogger } from '../../services/logs';
import { ObjectWatchType } from '../constants/types';
import { tableWatchConstants } from '../constants/enums';
export let dbInstance = undefined;

export const watchHandlerControllers = (watchHandlersArray: ObjectWatchType[]) => {
  watchHandlersArray.forEach((changeStream) => {
    const key = Object.keys(changeStream)[0]
    const tableName = key.split("-")[0];
    switch (tableName) {
      case "user":
        changeStream[key].on("change", (change) => {
          switch (change.operationType) {
            case "insert": handleUserInsert(change, tableName)
            case "delete": handleUserdelete(change, tableName)
          }
        });

      case "admin": changeStream[key].on("change", (change) => {
        switch (change.operationType) {
          case "insert": handleAdminInsert(change, tableName)
          case "delete": handleAdmindelete(change, tableName)
        }
      });

    }

  })


}
export const dbInit = async (dbUrl: string, database: string) => {
  try {
    const watchHandlersAray: ObjectWatchType[] = [];
    const dbInstance = await mongoose.connect(dbUrl, {
      dbName: database,
      readPreference: "secondary"
    });
    const nativeDb = mongoose.connection.db
    console.log(`Successfully connected to the database: ${database}`);
    let collections = await nativeDb.listCollections().toArray();
    //if collections=0; must initialise all collections;
    if (!collections.length) {
      collections = await SeedCollections()
    }
    //mongoDB streams for monitering any changing data.
    tableWatchConstants.forEach((tableElm) => {
      const tableName = Object.keys(tableElm)[0];
      const collectionExists = collections.some(col => col.name === tableName);
      if (collectionExists) {
        const watchCondition = tableElm[tableName]
        const pipeline = [
          {
            $match: {
              operationType: { $in: watchCondition },
            },
          },
        ];
        let changeStream = nativeDb.collection("users").watch(pipeline);
        const handlerName = `${tableName}-change_stream`
        const handlerObj: ObjectWatchType = {}
        handlerObj[handlerName] = changeStream;
        watchHandlersAray.push(handlerObj);
      }
    })

    // tablewatcher initiating with help of MongoDB streams.
    // note MongoTable watcher is to implement heavy BRs only.
    // for client facing use use websockets to notice table changes.
    watchHandlerControllers(watchHandlersAray)
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
