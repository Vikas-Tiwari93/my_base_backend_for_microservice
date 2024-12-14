import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import express, { Request, Response } from 'express';
import cookieParser from "cookie-parser";
import requestIp from "request-ip";

import WebSocketService, { TableWatcher } from '../services/webSockets/socketIO';
import cors from 'cors';
import bodyParser from 'body-parser';
import { redisRateLimiter } from 'utilities/otherMiddlewares/rateLimiter';
import { imageUploadConfig } from 'services/uploadsDownloads/imageUpload/image';
import { serverAdapterQueue, serverAdapterScheduledJobs } from 'services/jobs/initialise';
import { AuthRouter } from 'apis/auth/auth.router';
import swaggerUi from "swagger-ui-express";
import path from 'path';
import fs from "fs";
import { fileURLToPath } from "url";
import YAML from "yaml";
import { avoidInProduction } from 'utilities/otherMiddlewares/authMiddleware';
import { dbInstance } from 'utilities/db';
import { DB_LIST } from 'utilities/constants/enums';
import { generalLogger } from 'services/logs/logs.config';
import { SERVER_ERROR } from 'utilities/constants/http-constants';


 const app = express();
 const server = http.createServer(app);

//swagger documentation
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const file = fs.readFileSync(path.resolve(__dirname, "./swagger.yaml"), "utf8");
const swaggerDocument = YAML.parse(
  file?.replace(
    "- url: ${{server}}",
    `- url: ${process.env.FREEAPI_HOST_URL || "http://localhost:8080"}/api/v1`
  )
);
app.use(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      docExpansion: "none", // keep all the sections collapsed by default
    },
    customSiteTitle: "API docs",
  })
);


//sockets
export const io = new SocketIOServer(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }});
export const webSocketService = new WebSocketService(io);
webSocketService.notifyClients(
  'notification',
  'Socket server started successfully!'
);
webSocketService.onClientNotify('notify', () => {
  webSocketService.notifyClients('notification', 'give a msg');
});

const tableWatcher = new TableWatcher(webSocketService);
tableWatcher.startWatching(0);
//socket created

app.use(bodyParser.json());
app.use(requestIp.mw());
app.use(cors());
app.use(cookieParser());
app.use(redisRateLimiter);
app.use(imageUploadConfig);

//bull moniters for background jobs.
serverAdapterQueue.setBasePath('/admin/queues');
app.use('/admin/queues', serverAdapterQueue.getRouter());
serverAdapterScheduledJobs.setBasePath('/admin/scheduled');
app.use('/admin/scheduled', serverAdapterQueue.getRouter());

// routes
app.get('/', (req, res) => {
  res.render('index', { message: 'I am live' });
});
app.use('/auth', AuthRouter);
app.use('/notifications', AuthRouter);

// ! 🚫 Danger Zone to empty the DB for development
// It needs more development dont touch.
app.delete(`/api/reset-db/${DB_LIST.DB1}`, avoidInProduction, async (req:Request, res:Response) => {
  if (dbInstance) {
    await dbInstance.connection.db.dropDatabase({
      dbName: DB_LIST.DB1,
    });
    const directory = "./public/images";
    fs.readdir(directory, (err, files) => {
      if (err) {
        generalLogger.error("Error while removing the images: ", err);
        //dont stop server
      } else {
        for (const file of files) {
          if (file === ".gitkeep") continue;
          fs.unlink(path.join(directory, file), (err) => {
            if (err) throw err;
          });
        }
      }
    });
    // remove the seeded users if exist
    fs.unlink("./public/temp/seed-credentials.json", (err) => {
      if (err) generalLogger.error("Seed credentials are missing.");
    });
    return res
      .status(200)
      .send(( "Database dropped successfully"));
  }
 res.status(SERVER_ERROR)
  .send(( "Something went wrong while dropping the database"));
  throw new Error;
});
export { server };