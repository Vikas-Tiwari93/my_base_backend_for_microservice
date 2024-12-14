import {
  ConsoleTransportInstance,
  FileTransportInstance,
} from 'winston/lib/winston/transports';

export type TransportType = (
  | FileTransportInstance
  | ConsoleTransportInstance
)[];
