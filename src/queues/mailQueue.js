import { Queue } from 'bullmq';

import { redisOptions } from '../config/redisConfig.js';

export default new Queue('mailQueue', {
  // redis: redisOptions,
  // createClient: function (type) { // using bull
  //   switch (type) {
  //     case 'client':
  //       return new Redis(redisOptions);
  //     case 'subscriber':
  //       return new Redis(redisOptions);
  //     default:
  //       return new Redis(redisOptions);
  //   }
  // }
  connection: redisOptions // using bullmq and ioredis
});
