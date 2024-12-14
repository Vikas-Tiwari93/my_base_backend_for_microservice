import mongoose from 'mongoose';
import { prepareResponse } from '../db/dblayer';
export const deleteManyRecordWithTransactions = async <T>(
  model: mongoose.Model<T>,
  query: mongoose.FilterQuery<T>,
  session: mongoose.mongo.ClientSession
) => {
  try {
    const resultSet = await model.deleteMany(query).session(session);
    if (!resultSet) {
      return prepareResponse('No records deleted.');
    }

    return prepareResponse(
      `Records deleted successfully. Deleted records.`,
      true
    );
  } catch (error) {
    return prepareResponse(error);
  }
};

export const createSingleRecordWithTransactions = async <T>(
  model: mongoose.Model<T>,
  payload: Partial<T>,
  session: mongoose.mongo.ClientSession
) => {
  try {
    const resultSet = await model.create([payload], { session });
    if (!resultSet) {
      return prepareResponse('Failed to create record');
    }
    return prepareResponse('Records created successfully', true, resultSet);
  } catch (error) {
    return error;
  }
};

export const updateRecordWithTransactions = async <T>(
  model: mongoose.Model<T>,
  query: mongoose.FilterQuery<T>,
  payload: mongoose.UpdateQuery<T>,
  session: mongoose.ClientSession
) => {
  try {
    const resultSet = await model.findOneAndUpdate(query, payload, {
      new: true,
      session,
    });
    if (!resultSet) {
      return prepareResponse('No records updated');
    }
    return prepareResponse('Records updated successfully', true, resultSet);
  } catch (error) {
    return error;
  }
};
