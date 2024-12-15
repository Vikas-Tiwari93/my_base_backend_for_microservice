import { Server as SocketIOServer, Socket } from 'socket.io';
import { ChangeStream } from 'mongodb';
import mongoose from 'mongoose';
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { getRecordById } from '../../utilities/db/dbwrapper';
import { Users } from '../../utilities/schemas/users';
import { ChatEventEnum } from '../../utilities/constants/enums';


interface CustomSocket extends Socket {
  user?: any;
}
interface DecodedToken {
  _id: string;
  name?: string;
  date?: string;
}

class WebSocketService {
  private io: SocketIOServer;

  constructor(io: SocketIOServer) {
    this.io = io;
    this.io.on('connection', async (socket: CustomSocket) => {

      try {
        const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
        let token = cookies?.accessToken;
        if (!token) {
          // If there is no access token in cookies. Check inside the handshake auth
          token = socket.handshake.auth?.token;
        }
        if (!token) {
          throw new Error("Un-authorized handshake. Token is missing");
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as DecodedToken;
        const decodedId = decodedToken._id || ""
        const user = (await getRecordById(Users, { _id: decodedId })).resultSet;
        // find the user by token
        if (!user) {
          throw new Error("Un-authorized handshake. Token is invalid");
        }
        socket.user = user;
        socket.join(user._id.toString());
        socket.emit(ChatEventEnum.CONNECTED_EVENT, "conected to the server");
        console.log("User connected 🗼. userId: ", user._id.toString());
        socket.on(ChatEventEnum.DISCONNECT_EVENT, () => {
          console.log("user has disconnected 🚫. userId: " + socket.user?._id);
          if (socket.user?._id) {
            socket.leave(socket.user._id);
          }

        });
        // see if other Events can fit in here.
      }
      catch (error) {
        socket.emit(
          ChatEventEnum.SOCKET_ERROR_EVENT,
          error?.message || "Something went wrong while connecting to the socket."
        );
      }
    });
  }

  public notifyClients(event: string, message: string) {
    this.io.emit(event, message);
  }

  public onClientNotify(event: string, callback: () => void) {
    this.io.on(event, (socket: Socket) => {
      socket.on(event, callback);
    });
  }
  public onTableChangeNotifyClient(event: string, message: string) {
    this.io.emit(event, message);
  }
}
// use to sense any change in given tablesjust as a notification for refresh
export class TableWatcher {
  private changeStream: ChangeStream;
  private webSocketService: WebSocketService;

  constructor(webSocketService: WebSocketService) {
    this.webSocketService = webSocketService;
  }
  public startWatching(delay = 0) {
    if (delay > 0) {
      setTimeout(() => this.watchChanges(), delay);
    } else {
      this.watchChanges();
    }
  }

  private watchChanges() {
    const watchTables = ['users'];

    watchTables.forEach((collection) => {
      const tableCollection = mongoose.connection.collection(collection);
      this.changeStream = tableCollection.watch();
      this.changeStream.on('change', (change) => {
        if (change.operationType === 'insert') {
          const document = change.fullDocument;
          const sysId = document.sysId;
          const eventName = `${collection}-inserted-${sysId}`;
          this.webSocketService.onTableChangeNotifyClient(
            eventName,
            JSON.stringify(document)
          );
        } else if (change.operationType === 'delete') {
          const document = change.fullDocumentBeforeChange;
          const sysId = document?.sysId;
          const eventName = `${collection}-deleted-${sysId}`;
          this.webSocketService.onTableChangeNotifyClient(
            eventName,
            JSON.stringify(document)
          );
        } else if (change.operationType === 'update') {
          const document = change.fullDocument;
          const sysId = document?.sysId;
          const eventName = `${collection}-updated-${sysId}`;
          this.webSocketService.onTableChangeNotifyClient(
            eventName,
            JSON.stringify(document)
          );
        }
      });

      this.changeStream.on('error', (err) => {
        console.error('Error watching changes:', err);
      });
    });
  }

  public close() {
    this.changeStream.close();
  }
}

export default WebSocketService;
