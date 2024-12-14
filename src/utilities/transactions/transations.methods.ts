import mongoose from '../db/index';

export const executeOperationsInTransaction = async (
  operations: ((_session: mongoose.mongo.ClientSession) => Promise<{
    hasData: boolean;
    message: string;
    resultSet: any;
  }>)[]
) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const results = await Promise.all(operations.map((op) => op(session)));

      await session.commitTransaction();
      session.endSession();

      return results;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      return error;
    }
  } catch (error) {
    return error;
  }
};

// const operations = [
//   async (session) =>
//     await deleteManyRecordInTransaction(Classes, { adminId, classId }, session),
//   async (session) =>
//     await deleteManyRecordInTransaction(Student, { classId }, session),
//   async (session) =>
//     await deleteManyRecordInTransaction(Admin, { classId }, session),
// ];
