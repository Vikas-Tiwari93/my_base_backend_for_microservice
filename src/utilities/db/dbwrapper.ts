import * as db_calls from './dblayer';
import * as Mongoose from 'mongoose';

export const createSingleRecord = async <T>(
  model: Mongoose.Model<T>,
  payload: Partial<T>
) => {
  return await db_calls.createSingleRecord(model, payload);
};

export const createMultipleRecord = async <T>(
  model: Mongoose.Model<T>,
  payload: T
) => {
  return await db_calls.createMultipleRecord(model, payload);
};

export const getRecordDetails = async <T>(
  model: Mongoose.Model<T>,
  query: Mongoose.FilterQuery<T>
) => {
  return await db_calls.getRecordDetails(model, query);
};

export const getRecordById = async <T>(
  model: Mongoose.Model<T>,
  query: Mongoose.FilterQuery<T>
) => {
  return await db_calls.getRecordById(model, query);
};

export const updateRecord = async <T>(
  model: Mongoose.Model<T>,
  query: Mongoose.FilterQuery<T>,
  payload: Mongoose.UpdateQuery<T>
) => {
  return await db_calls.updateRecord(model, query, payload);
};

export const getRecords = async <T>(
  model: Mongoose.Model<T>,
  query: Mongoose.FilterQuery<T>
) => {
  return await db_calls.getRecords(model, query);
};

export const getAggreateRecords = async <T>(
  model: Mongoose.Model<T>,
  query: Mongoose.PipelineStage[]
) => {
  return await db_calls.aggreateRecord(model, query);
};

export const deleteRecord = async <T>(
  model: Mongoose.Model<T>,
  query: Mongoose.FilterQuery<T>
) => {
  return await db_calls.deleteRecord(model, query);
};
// can read,write,update delete through this pipeline too.(explore this)

export const AggrigationPipeline=async <T>(AggrigationArray:[any],model:Mongoose.Model<T>)=>{
    try {
      const results = await model.aggregate(AggrigationArray);
      console.log(results); 
      return results;
    } catch (error) {
      console.error(error);
    }
  
};