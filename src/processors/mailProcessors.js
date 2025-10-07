import { Worker } from 'bullmq';
import mailer from '../config/mailConfig.js';
import { redisOptions } from '../config/redisConfig.js';

// using bull
// import mailQueue from '../queues/mailQueue.js';
// mailQueue.process(async (job) => {
//   const emailData = job.data;
//   console.log('Processing email', emailData);

//   try {
//     const response = await mailer.sendMail(emailData);
//     console.log(response);
//   } catch (error) {
//     console.log('Error processing email', error);
//   }
// });

// using bullmq and ioredis
const mailWorker = new Worker(
  'mailQueue',
  async (job) => {
    const emailData = job.data;
    console.log('Processing email', emailData);
    try {
      const response = await mailer.sendMail(emailData);
      console.log(response);
    } catch (error) {
      console.log('Error processing email', error);
    }
  },
  { connection: redisOptions }
);

mailWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

mailWorker.on('error', (error) => {
  console.log(`Error processing job ${job.id}`, error);
});

export default mailWorker;
