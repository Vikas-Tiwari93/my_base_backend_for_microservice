import { createClient, createCluster } from 'redis';
import {
  DEFAULT,
  LONG_LIVED,
  modelMapping,
  SHORT_LIVED,
} from '../../utilities/constants/redis';
import { gzip, gunzip } from 'zlib';
import { promisify } from 'util';
import { cacheLogger } from '../logs/loggerInstances';
import { getRecords } from '../../utilities/db/dbwrapper';
import { generalLogger } from '../logs';

// security config required and error
export let redisClientStore: any;
export async function createRedisClient() {

  let redisClient: any;

  if (process.env.USE_REDIS_CLUSTER === 'true') {
    // Create Redis Cluster
    redisClient = createCluster({
      rootNodes: [
        { url: process.env.REDIS_CLUSTER_NODE_1 },
        { url: process.env.REDIS_CLUSTER_NODE_2 },
      ],
      useReplicas: true,
    });

    await redisClient.on('error', (_err: string) => {
      generalLogger.error(`redis error ${_err}`);
    });
    await redisClient.on('connect', () => {
      generalLogger.info('Connected to Redis Cloud');
    });
  } else {
    // Create Single Redis Client
    redisClient = createClient({
      socket: {
        host: 'redis-11214.c264.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 11214,
        tls: false,
        // rejectUnauthorized: false,
      },
      username: 'default',
      password: '7PIYiPkMhNiGgyAAymXl3S4hw1hILOpm',
    });

    redisClient.on('error', (_err: string) => {
      console.log(_err);
      generalLogger.error(`redis error ${_err}`);
    });
    redisClient.on('connect', () => {
      generalLogger.info('Connected to Redis Cloud');
    });
  }

  await redisClient.connect();
  redisClientStore = redisClient;
}


//compress Data for Storage and retrival

const gzipAsync = promisify(gzip);
const gunzipAsync = promisify(gunzip);

async function compressedData(data: any) {
  try {
    const compressedData = await gzipAsync(JSON.stringify(data));
    return compressedData;
  }
  catch (err) {
    logCacheError(err);
    throw err;
  }
}
async function deCompressedCache(key: string) {
  try {
    const compressedData = await redisClientStore.getBuffer(key);
    if (compressedData) {
      const data = await gunzipAsync(compressedData);
      const decompressedData = data.toString();
      return JSON.parse(decompressedData);
    }
    return '';
  }
  catch (err) {
    logCacheError(err);
    throw err;
  }
}

// function logCacheSuccess(_key: string) {
//   cacheLogger.info(`cache success for ${_key}`)
// }

function logCacheMiss(_key: string) {
  cacheLogger.info(`cache miss for ${_key}`);
}
function logCacheError(_error: string) {
  cacheLogger.error(`cache error for ${_error}`);
}
export const expirationTimeCache = (type?: string) => {
  let expirationTime: number;

  switch (type) {
    case 'shortLived':
      expirationTime = SHORT_LIVED;
      break;
    case 'longLived':
      expirationTime = LONG_LIVED;
      break;
    default:
      expirationTime = DEFAULT;
  }
  return expirationTime;
};

export async function getCachedDataWithPolicy(key: any) {
  try {
    const cachedData = await deCompressedCache(key);

    if (cachedData) {
      return cachedData;
    }
    logCacheMiss(key);
    return null;
  } catch (err) {
    logCacheError(err);
  }
}


export async function updateCacheData(key: string, newData: any, expirationType: string) {
  const expirationTime = expirationTimeCache(expirationType);
  const stringifiesData = await compressedData(newData);
  await redisClientStore.set(key, JSON.stringify(stringifiesData), { EX: expirationTime });

}
// Invalidate the cache by updating
export async function invalidateCache(key: string) {
  await redisClientStore.del(key);
}


// Cache Warming / Priming if needed after initial start
// this is just for example it can be anything.
export async function cacheWarmup() {
  const frequentlyAccessedKeys = [{ keyRedis: "user_data", modelSchema: modelMapping.user_data }];
  for (const key of frequentlyAccessedKeys) {
    const data = await getRecords(key.modelSchema, {});
    await redisClientStore.set(key.keyRedis, data, {
      EX: 3 * 24 * 60 * 60, // data which doesnt change rapidly
    });
  }
}


