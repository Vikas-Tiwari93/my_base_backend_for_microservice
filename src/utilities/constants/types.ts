import mongoose from "mongoose";

export type TableWatchType = {
  [key: string]: (string | {})[];
}[];
export type ChangeType = mongoose.mongo.ChangeStreamDocument<mongoose.mongo.BSON.Document>
type StreamWatchType = mongoose.mongo.ChangeStream<mongoose.mongo.BSON.Document, mongoose.mongo.ChangeStreamDocument<mongoose.mongo.BSON.Document>>
export type ObjectWatchType = {
  [key: string]: StreamWatchType
};