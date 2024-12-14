
import { dbInit, watchHandlerControllers } from './utilities/db';


import { initalServicesInit } from './utilities/initialservices/initialServices';
import './app.config/env.config';
import { dbUrl, port } from './app.config/env.config';


import { server } from './app.config/app.config';
import { generalLogger } from 'services/logs/logs.config';
import { DB_LIST } from 'utilities/constants/enums';

//establishing connection
const watchHandlersAray = await dbInit(dbUrl, DB_LIST.DB1);
// MongoDB connection started


// tablewatcher initiating with help of MongoDB streams.
// note MongoTable watcher is to implement heavy BRs only.
// for client facing use use websockets to notice table changes.
watchHandlerControllers(watchHandlersAray)


initalServicesInit();
//intial services started

server.listen(port, () => {
  generalLogger.info(`Server is running on port ${port}`);
});
