
import { dbInit } from './utilities/db';


import { initalServicesInit } from './utilities/initialservices/initialServices';
import './app.config/env.config';
import {  dbUrl, port } from './app.config/env.config';


import {  server } from './app.config/app.config';
import { generalLogger } from 'services/logs/logs.config';
import { DB_LIST } from 'utilities/constants/enums';


dbInit(dbUrl, DB_LIST.DB1);
// MongoDB connection started

initalServicesInit();
//intial services started

server.listen(port, () => {
  generalLogger.info(`Server is running on port ${port}`);
});
