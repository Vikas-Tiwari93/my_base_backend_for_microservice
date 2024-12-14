import { redisClient } from './redis.config';

export const getAllFromRedis = async (_query: string, _schema: string) => {
  try {
    const pattern = `${_schema}:${_query}:*`;
    const keys = await redisClient.keys(pattern);
    if (!keys) {
      throw new Error('Key and data must be provided');
    }
    const dataPromises = keys.map((key) => redisClient.hgetall(key));
    const results = await Promise.all(dataPromises);
    return results;
  } catch (err) {
    return err;
  }
};

export const getFromRedis = async (_key: string, _schema: string) => {
  if (!_key || !_schema) {
    throw new Error('Key and data must be provided');
  }
  try {
    const userData = await redisClient.hgetall(`${_schema}:${_key}`);
    return userData;
  } catch (err) {
    return err;
  }
};

export const addingRecordRedis = async (
  _key: string,
  _schema: string,
  _data: any
) => {
  try {
    if (!_key || !_data) {
      throw new Error('Key and data must be provided');
    }

    await redisClient.hset(`${_schema}:${_key}`, _data);
  } catch (err) {
    return err;
  }
};
export const updateRecordRedis = async (
  _key: string,
  _schema: string,
  _data: any
) => {
  try {
    if (!_key || !_data || _schema) {
      throw new Error('Key and data must be provided');
    }

    await redisClient.hset(`${_schema}:${_key}`, _data);
  } catch (err) {
    return err;
  }
};

export const deleteRecordRedis = async (_key: string, _schema: string) => {
  try {
    if (!_key) {
      throw new Error('Key must be provided');
    }
    await redisClient.del(`${_schema}:${_key}`);
  } catch (err) {
    return err;
  }
};
