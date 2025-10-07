import Redis from 'ioredis';

import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from './serverConfig.js';

export const redisOptions = {
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
  maxRetriesPerRequest: null, // 👈 Important for Bull
  enableReadyCheck: false // 👈 Important for Bull
};

const redisInstance = new Redis(redisOptions);

redisInstance.on('connecting', () => console.log('Connecting redis...'));
redisInstance.on('connect', () => console.log('Redis Connected Successfully!'));
redisInstance.on('error', () => console.log('Error while connecting redis!'));

export default redisInstance;
