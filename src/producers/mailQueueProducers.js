import '../processors/mailProcessors.js';

import mailQueue from '../queues/mailQueue.js';

export const addEmailtoMailQueue = async (emailData) => {
  console.log('initiatting email sending process', emailData);
  try {
    await mailQueue.add('sendEmail', emailData);
    console.log('Email added to mail queue');
  } catch (error) {
    console.log('Add email to mail queue error', error);
  }
};
