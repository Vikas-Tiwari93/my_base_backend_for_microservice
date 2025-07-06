import { Request, Response, NextFunction } from 'express';

import rateLimit from 'express-rate-limit';
import { redisClientStore } from '../../services/redis/redis.config';
import { iPListing } from '../constants/redis';
import { cacheLogger, fallbackRateLogger } from '../../services/logs/loggerInstances';
import { generalLogger } from '../../services/logs';

// custom limit set for each endpoint
const endpointLimits: { [key: string]: number } = {
  '/auth/signin/': 100,
  '/api/signup/': 50,
};
const tempExpirationtime = 2 * 60 * 60;
async function tempBlacklistIp(ip: string): Promise<void> {
  await redisClientStore.sadd(iPListing.blacklist, ip);


  await redisClientStore.expire(iPListing.blacklist, tempExpirationtime);
}

async function isBlacklisted(ip: string): Promise<boolean> {
  const result = await redisClientStore.sismember(iPListing.blacklist, ip);
  return result === 1;
}
async function isWhitelisted(ip: string): Promise<boolean> {
  // must be primed from database to redis from initial connection
  const result = await redisClientStore.sismember(iPListing.whiteList, ip);
  return result === 1;
}
const fallbackRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 100, // limit each IP to 100 requests per windowMs
  handler: (req, res) => {
    fallbackRateLogger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).send('Rate limit exceeded');
  }
});
const isRedisOnline = async () => {
  const isRedisOnline = await redisClientStore.ping();
  if (!isRedisOnline) {
    return false;
  }
  return true;

};


export async function redisRateLimiter(req: Request, res: Response, next: NextFunction): Promise<void> {
  const ip = req.clientIp;
  const rateLimitKey = `${ip}`;
  const endpoint = req.path;

  if (await isBlacklisted(ip)) {
    res.status(403).json({ error: 'Your IP has been blacklisted.' });
    return;
  }
  if (await isWhitelisted(ip)) {
    next();
  }
  try {
    const current = await redisClientStore.incr(rateLimitKey);

    if (current === 1) {
      await redisClientStore.expire(rateLimitKey, 10); // Set expiration to 30 seconds
    }

    if (current > endpointLimits[endpoint]) {
      await tempBlacklistIp(ip);// can blacklist Ip also.
      cacheLogger.warn(`Rate limit exceeded by IP a potential attack by: ${ip} request count ${current}`);
      res.setHeader('Retry-After', 30); // 30 seconds
      res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
      return;
    }
    next();
  } catch (error) {
    cacheLogger.error(`Rate limitter not running, endpoint might crash ${error}`);
    generalLogger.error(`Rate limitter not running, endpoint might crash ${error}`);
    //  here either a fallback for ratelimiting required error will crash the apis.
    if (!isRedisOnline()) {
      fallbackRateLimiter(req, res, next);
    }
    else {
      throw error;
    }
  }
}


